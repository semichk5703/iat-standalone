#!/usr/bin/env python3
"""Re-score results CSVs written by any earlier build with the current scoring (iat11.js + nogaScorer.js,
see PROTOCOL), and show what each file recorded at the time beside it.

    python3 tools/rescore_csv.py results.csv [more.csv ...]

Every build kept the raw trials (block, errors, rt_ms) and the pairing order on the trailing '#' line, so
nothing needs migrating: the score is recomputed from the trials.  Earlier builds differ only in what the
'#' line called D:
    first builds         D = two parcels, no 400 ms floor          (# D= d_practice= d_test= order=)
    iat10-era builds     D = one parcel; D_2003 = two parcels       (# D= D_2003= d_practice= d_test= order=)
    current              D = two parcels, 400 ms floor              (# D= d_practice= d_test= D_single_parcel= ...)
Earlier builds also differed in what the participant saw (block 5 had 40 trials; all 8 attribute words
every time); that changes the session, not the arithmetic, and block 5 is not scored."""
import csv
import math
import sys


class ResultsFile:
    """One results CSV: its raw trials and whatever its '#' line recorded."""

    MIN_RT, MAX_RT, FAST_RT = 400, 10000, 300           # iat11.js minRT, maxRT, fastRT
    FAST_LIMIT, ERROR_LIMIT, MIN_SCORED = 0.10, 0.40, 4  # iat11.js ...FB feedback limits

    def __init__(self, path):
        rows, self.recorded = [], {}
        with open(path, encoding='utf-8') as lines:
            for line in lines:
                if line.startswith('#'):
                    self.recorded = dict(kv.split('=', 1) for kv in line[1:].split())
                else:
                    rows.append(line)
        self.path = path
        self.trials = [{'block': int(r['block']), 'errors': int(r['errors']), 'rt': float(r['rt_ms'])}
                       for r in csv.DictReader(rows)]
        self.order = int(self.recorded.get('order', 1))

    def parcel_d(self, first_block, reversed_block):
        """(mean reversed - mean first) / sample SD over both blocks' kept trials."""
        kept = [t for t in self.trials if self.MIN_RT <= t['rt'] <= self.MAX_RT]
        first = [t['rt'] for t in kept if t['block'] == first_block]
        reversed_ = [t['rt'] for t in kept if t['block'] == reversed_block]
        both = first + reversed_
        if len(both) < 2 or not first or not reversed_:
            return float('nan')
        mean = sum(both) / len(both)
        sd = math.sqrt(sum((v - mean) ** 2 for v in both) / (len(both) - 1))
        return (sum(reversed_) / len(reversed_) - sum(first) / len(first)) / sd if sd else float('nan')

    def score(self):
        """Current D, its two parcels, and the feedback message implicit.harvard.edu would show (or None)."""
        practice, test = ((3, 6), (4, 7)) if self.order == 1 else ((6, 3), (7, 4))
        d_practice, d_test = self.parcel_d(*practice), self.parcel_d(*test)
        combined = [t for t in self.trials if t['block'] in (3, 4, 6, 7)]
        up_to_max = [t for t in combined if t['rt'] <= self.MAX_RT]
        fast = sum(t['rt'] < self.FAST_RT for t in combined) / len(up_to_max) if up_to_max else 0
        errors = sum(t['errors'] > 0 for t in up_to_max) / len(up_to_max) if up_to_max else 0
        scored = sum(t['rt'] >= self.MIN_RT for t in up_to_max)
        if scored < self.MIN_SCORED:
            message = 'There were not enough trials to determine a result.'
        elif fast > self.FAST_LIMIT:
            message = 'There were too many fast trials to determine a result.'
        elif errors > self.ERROR_LIMIT:
            message = 'There were too many errors made to determine a result.'
        else:
            message = None
        return (d_practice + d_test) / 2, d_practice, d_test, message

    def report(self):
        d, d_practice, d_test, message = self.score()
        recorded = ' '.join(f'{k}={v}' for k, v in self.recorded.items()) or '(no # line)'
        print(f'{self.path}\n  recorded then: {recorded}\n  current:       D={d:+.4f} (practice {d_practice:+.4f}, '
              f'test {d_test:+.4f}){"   " + message if message else ""}')


class RescoreApp:
    def run(self, paths):
        if not paths:
            print(__doc__.split('\n\n')[1])
            return 1
        for path in paths:
            ResultsFile(path).report()
        return 0


if __name__ == '__main__':
    sys.exit(RescoreApp().run(sys.argv[1:]))
