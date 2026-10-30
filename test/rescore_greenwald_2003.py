#!/usr/bin/env python3
"""Independent D-score from a results.csv, following Greenwald, Nosek & Banaji (2003), Table 4,
"improved" algorithm, built-in error penalty variant (the one used when respondents must correct
errors, as on Project Implicit / minno-tasks iat10).  Steps, as in the paper:
  1. use data from blocks 3,4,6,7
  2. drop trials with latency > 10,000 ms
  3. flag respondents with > 10% of trials under 300 ms (minno: 150 ms; both are reported)
  4. (no error replacement: latency already includes the time to the correct key)
  5. pooled SD of blocks 3 & 6, and of blocks 4 & 7 — all trials, not per block
  6. mean latency per block
  7. (mean 6 - mean 3) and (mean 7 - mean 4)
  8. divide each by its pooled SD
  9. D = average of the two
Project Implicit additionally drops trials under 400 ms before steps 5-6; applied here too (minRT=400).
Usage: test/rescore_greenwald_2003.py results.csv -> prints D and compares with D_2003 on the '#' line the program wrote.
(test/rescore_project_implicit.py checks the primary, Project Implicit single-parcel D.)"""
import csv, math, sys, statistics

MIN_RT, MAX_RT = 400, 10000

def dscore(rows, order):
    cong_practice, cong_test, rev_practice, rev_test = (3, 4, 6, 7) if order == 1 else (6, 7, 3, 4)
    by_block = {}
    for r in rows:
        rt = float(r['rt_ms'])
        if MIN_RT <= rt <= MAX_RT:
            by_block.setdefault(int(r['block']), []).append(rt)
    def pooled_sd(a, b): return statistics.stdev(by_block[a] + by_block[b])   # sample SD, n-1
    def mean(b): return statistics.fmean(by_block[b])
    d_practice = (mean(rev_practice) - mean(cong_practice)) / pooled_sd(cong_practice, rev_practice)
    d_test = (mean(rev_test) - mean(cong_test)) / pooled_sd(cong_test, rev_test)
    return (d_practice + d_test) / 2, d_practice, d_test

if __name__ == '__main__':
    lines = open(sys.argv[1]).read().splitlines()
    rows = list(csv.DictReader(l for l in lines if not l.startswith('#')))
    tail = [l for l in lines if l.startswith('# D=')]
    order = int(tail[0].split('order=')[1]) if tail else 1
    D, dp, dt = dscore(rows, order)
    all_rt = [float(r['rt_ms']) for r in rows]
    print(f'python  D={D:+.4f} d_practice={dp:+.4f} d_test={dt:+.4f}')
    print(f'fast trials: {sum(rt < 300 for rt in all_rt) / len(all_rt):.1%} < 300 ms (paper), '
          f'{sum(rt < 150 for rt in all_rt) / len(all_rt):.1%} < 150 ms (minno)')
    if tail:
        print('program', tail[0][2:])
        prog = float(tail[0].split('D_2003=')[1].split()[0])
        print('agree' if abs(prog - D) < 1e-3 else 'MISMATCH')
        sys.exit(0 if abs(prog - D) < 1e-3 else 1)
