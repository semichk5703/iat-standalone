"""Self-test: drive an IAT binary through a pty as a scripted participant.
Usage:  IAT_TIMESCALE=100 python3 test/simulate.py stimuli/race.txt [--order 2]
        IAT_BIN=./iat-sdl ...   (SDL build: runs with SDL_VIDEODRIVER=dummy, keys over stdin)
The participant is 150 ms slower on blocks 6-7 (reversed pairing) -> expect D > 0 for --order 1."""
import os, pty, re, sys, time, select, random, glob
random.seed(1)
stimfile = sys.argv[1]; extra = sys.argv[2:]
binary = os.environ.get('IAT_BIN', './iat')
scale = float(os.environ.get('IAT_TIMESCALE', '1'))

# parse the stimuli file exactly as core.h does (globs relative to the file; images -> basename label)
d = os.path.dirname(stimfile) or '.'
stim = {}
for line in open(stimfile, encoding='utf-8'):
    if ':' in line and not line.startswith('#'):
        k, v = line.split(':', 1); stim[k.strip()] = [x.strip() for x in v.split(',') if x.strip()]
cats = ['target_a', 'target_b', 'attr_a', 'attr_b']
label_cat = {}
for ci, c in enumerate(cats):
    for it in stim[c + '_items']:
        if re.search(r'\.(jpe?g|png|gif)$', it, re.I):
            for p in glob.glob(it if it.startswith('/') else os.path.join(d, it)):
                label_cat[os.path.basename(p)] = ci
        else:
            label_cat[it] = ci
names = {stim[c][0]: ci for ci, c in enumerate(cats)}

pid, fd = pty.fork()
if pid == 0:
    os.environ['LINES'] = '24'; os.environ['COLUMNS'] = '80'
    os.environ['IAT_ECHO'] = '1'
    if 'sdl' in binary:
        os.environ.update(SDL_VIDEODRIVER='dummy', IAT_STDIN_KEYS='1')
    os.execv(binary, [binary, stimfile, '--seed', '7', '--out', 'results.csv'] + extra)

buf = b''; part = 0; left = set()
def rd(timeout=0.5):
    global buf
    r, _, _ = select.select([fd], [], [], timeout)
    if r:
        try: buf += os.read(fd, 65536)
        except OSError: return False
    return True
strip = lambda b: re.sub(rb'\x1b\[[0-9;?]*[A-Za-z]', b'\n', b).decode('utf-8', errors='ignore')
deadline = time.time() + 600 / scale
while time.time() < deadline:
    if not rd(): break
    txt = strip(buf)
    if 'Press SPACE' in txt:
        m = re.search(r'LEFT \(E\): ([^\n]+)', txt)
        if m:
            left = {names[n.strip()] for n in m.group(1).split(' + ')}
            part = int(re.search(r'Part (\d)', txt).group(1))
            print('part', part, 'left', sorted(left), file=sys.stderr)
        buf = b''
        time.sleep(0.05); rd(0.05); buf = b''      # let the program finish drawing + flushing keys
        os.write(fd, b' '); continue
    labels = [l.strip() for l in re.findall(r'STIM ([^\n\r]+)', txt) if l.strip() in label_cat]
    if labels:
        w = labels[-1]; buf = b''
        base = 0.45 if part in (6, 7) else 0.30                 # seconds of simulated reaction time
        time.sleep((base + random.uniform(0, 0.15)) / scale)
        key = b'e' if label_cat[w] in left else b'i'
        if random.random() < 0.05:                              # 5% deliberate errors
            os.write(fd, b'i' if key == b'e' else b'e'); time.sleep(0.2 / scale)
        os.write(fd, key)
    if 'D-score' in txt or 'aborted' in txt:
        for _ in range(6):
            r, _, _ = select.select([fd], [], [], 0.3)
            if not r: break
            try: buf += os.read(fd, 65536)
            except OSError: break
        print(re.sub(rb'\x1b\[[0-9;?]*[A-Za-z]', b'', buf).decode('utf-8', errors='ignore')); break
_, st = os.waitpid(pid, 0); print('child status', st, file=sys.stderr)
sys.exit(0 if st == 0 else 1)
