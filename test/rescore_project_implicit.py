"""Independent re-scoring of results.csv, written straight from minno-tasks/scorer/nogaScorer.js
(Project Implicit's scorer) so the C implementation can be checked against it.
    python3 test/rescore_project_implicit.py results.csv        -> prints D and compares with the '#' line iat wrote."""
import csv, math, re, sys
rows = []; meta = {}
for line in open(sys.argv[1]):
    if line.startswith('#'):
        meta = dict(kv.split('=') for kv in line[1:].split()); continue
    rows.append(line)
trials = list(csv.DictReader(rows))
order = int(meta['order'])
congruent = {3, 4} if order == 1 else {6, 7}        # blocks where target_a pairs with attr_a
reversed_ = {6, 7} if order == 1 else {3, 4}
# nogaScorer: minRT 400 (dropped), maxRT 10000 (dropped), errorLatency 'latency' (error trials kept as-is)
keep = [t for t in trials if 400 <= float(t['rt_ms']) <= 10000 and int(t['block']) in congruent | reversed_]
c = [float(t['rt_ms']) for t in keep if int(t['block']) in congruent]
r = [float(t['rt_ms']) for t in keep if int(t['block']) in reversed_]
mean = lambda x: sum(x) / len(x)
allv = c + r; m = mean(allv)
sd = math.sqrt(sum((v - m) ** 2 for v in allv) / (len(allv) - 1))     # calcSD: sample SD over both conditions
D = (mean(r) - mean(c)) / sd                                          # cond2 (incompatible) - cond1 (compatible)
print(f"rescore: D = {D:+.4f}   iat wrote D = {float(meta['D']):+.4f}   diff = {abs(D-float(meta['D'])):.2e}")
sys.exit(0 if abs(D - float(meta['D'])) < 1e-3 else 1)
