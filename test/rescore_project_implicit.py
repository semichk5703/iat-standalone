"""Independent re-scoring of results.csv from Project Implicit's scorer, so the C implementation can be
checked against it: upstream/minno-tasks/scorer/nogaScorer.js with the settings of IAT/iat11.js (the code
the live Race IAT loads; byte-identical to the copies served, per PROTOCOL).
    python3 test/rescore_project_implicit.py results.csv     -> prints D and compares with the '#' line."""
import math, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from rescore_csv import ResultsFile      # file parsing only; the arithmetic below is independent


class NogaScorerCheck:
    """nogaScorer.js computeD with iat11 settings: parcels 'first' (blocks 3,6) and 'second' (4,7),
    minRT 400 / maxRT 10000 dropped, errorLatency 'latency', sample SD, D = mean of parcel D's."""

    MIN_RT, MAX_RT, FAST_RT = 400, 10000, 300

    def __init__(self, path):
        results = ResultsFile(path)
        self.trials = [{'block': str(r['block']), 'rt_ms': r['rt_ms']} for r in results.rows]
        self.meta = results.displayed
        order = results.pairing_order
        # (first-pairing block, reversed block) per parcel, 1-based as in the CSV
        self.parcels = [(3, 6), (4, 7)] if order == 1 else [(6, 3), (7, 4)]

    def parcel_d(self, first_block, reversed_block):
        kept = [t for t in self.trials if self.MIN_RT <= float(t['rt_ms']) <= self.MAX_RT]
        first = [float(t['rt_ms']) for t in kept if int(t['block']) == first_block]
        reversed_ = [float(t['rt_ms']) for t in kept if int(t['block']) == reversed_block]
        both = first + reversed_
        mean = lambda values: sum(values) / len(values)
        sd = math.sqrt(sum((v - mean(both)) ** 2 for v in both) / (len(both) - 1))   # calcSD / calcPooledSD
        return (mean(reversed_) - mean(first)) / sd                                     # cond2 - cond1

    def fast_fraction(self):
        combined = [t for t in self.trials if int(t['block']) in (3, 4, 6, 7)]
        up_to_max = [t for t in combined if float(t['rt_ms']) <= self.MAX_RT]
        return sum(float(t['rt_ms']) < self.FAST_RT for t in combined) / len(up_to_max)

    def run(self):
        d = sum(self.parcel_d(f, r) for f, r in self.parcels) / len(self.parcels)          # scoreAll mean
        written = float(self.meta['D'])
        fast, written_fast = self.fast_fraction(), float(self.meta['fast'])
        print(f"rescore: D = {d:+.4f}   iat wrote D = {written:+.4f}   diff = {abs(d - written):.2e}"
              f"   fast {fast:.4f} vs {written_fast:.4f}")
        return 0 if abs(d - written) < 1e-3 and abs(fast - written_fast) < 1e-3 else 1


if __name__ == '__main__':
    sys.exit(NogaScorerCheck(sys.argv[1]).run())
