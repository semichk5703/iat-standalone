#!/usr/bin/env python3
"""Score results files from their raw trials with the current rules (iat11.js + nogaScorer.js, see
PROTOCOL), and convert files from earlier builds to the current format.

    python3 tools/rescore_csv.py results.csv [more.csv ...]       print each session's current score
    python3 tools/rescore_csv.py --output new.csv old.csv         write old.csv in the current format

Results files hold data, not scores (format 2, written by src/iat_app.h app_write_csv):
    # iat results, format 2
    # stimuli: stimuli/race.txt
    # pairing_order: 1            which pairing came first; scoring needs it
    # random: os                  or "seed N"
    block,category,item,correct_key,errors,rt_ms
    ...
    # displayed: scoring=iat11 D=... feedback=shown     what the session showed, and under which rules
The score is always recomputed here, so it never goes stale when the rules change.

Earlier builds (format 1) put the pairing order and a score on one trailing '#' line.  --output keeps that
score as a '# displayed:' line labelled with the rules that produced it:
    first-builds           # D= d_practice= d_test= order=                       two parcels, no 400 ms floor
    iat10-single-parcel    # D= D_2003= d_practice= d_test= order=               D was one parcel
    iat11                  # D= d_practice= d_test= D_single_parcel= ... order=
The output is written as UTF-8 by this script (PowerShell 5's '>' would write UTF-16)."""
import argparse
import csv
import io
import math
import os
import sys

CSV_HEADER = ['block', 'category', 'item', 'correct_key', 'errors', 'rt_ms']


class ResultsFile:
    """One results file of either format: session facts, raw trials, and what it displayed."""

    def __init__(self, path):
        self.path = path
        self.facts = {}            # stimuli, pairing_order, random
        self.displayed = {}        # what the session showed, with 'scoring' naming the rules
        self.format = 1
        data_lines = []
        with open(path, encoding='utf-8') as lines:
            for line in lines:
                line = line.rstrip('\r\n')
                if line.startswith('# displayed:'):
                    self.displayed = dict(kv.split('=', 1) for kv in line[len('# displayed:'):].split())
                elif line.startswith('# iat results, format '):
                    self.format = int(line.rsplit(' ', 1)[1])
                elif line.startswith('# D='):
                    self.read_format_1_score_line(line)
                elif line.startswith('# ') and ':' in line:
                    key, value = line[2:].split(':', 1)
                    self.facts[key.strip()] = value.strip()
                elif line and not line.startswith('#'):
                    data_lines.append(line)
        rows = list(csv.reader(data_lines))
        self.header = ['item' if column == 'word' else column for column in rows[0]]   # first builds said 'word'
        self.rows = [dict(zip(self.header, row)) for row in rows[1:]]
        self.pairing_order = int(self.facts.get('pairing_order', 1))

    def read_format_1_score_line(self, line):
        """Format 1: '# D=... order=N'.  The order becomes a fact; the rest is what was displayed."""
        values = dict(kv.split('=', 1) for kv in line[1:].split())
        self.facts['pairing_order'] = values.pop('order', '1')
        if 'D_2003' in values:
            rules = 'iat10-single-parcel'
        elif 'D_single_parcel' in values:
            rules = 'iat11'
        else:
            rules = 'first-builds'
        self.displayed = {'scoring': rules, **values}

    def trials(self):
        return [{'block': int(r['block']), 'errors': int(r['errors']), 'rt': float(r['rt_ms'])} for r in self.rows]

    def write(self, path):
        """Write in format 2 (UTF-8), keeping every trial and the displayed line as history."""
        facts = {'stimuli': self.facts.get('stimuli', 'unknown (converted from format 1)'),
                 'pairing_order': str(self.pairing_order),
                 'random': self.facts.get('random', 'unknown (converted from format 1)')}
        text = io.StringIO()
        text.write('# iat results, format 2\n')
        for key, value in facts.items():
            text.write(f'# {key}: {value}\n')
        writer = csv.writer(text, lineterminator='\n')
        writer.writerow(CSV_HEADER)
        for row in self.rows:
            writer.writerow([row[column] for column in CSV_HEADER])
        if self.displayed:
            text.write('# displayed: ' + ' '.join(f'{k}={v}' for k, v in self.displayed.items()) + '\n')
        with open(path, 'w', encoding='utf-8', newline='') as out:
            out.write(text.getvalue())


class Scoring:
    """The current rules: iat11.js settings, nogaScorer.js arithmetic (Greenwald et al. 2003, Table 4)."""

    VERSION = 'iat11'
    MIN_RT, MAX_RT, FAST_RT = 400, 10000, 300            # minRT, maxRT, fastRT
    FAST_LIMIT, ERROR_LIMIT, MIN_SCORED = 0.10, 0.40, 4   # maxFastTrialsRateFB, maxErrorRateFB, minTotalScoredTrialsFB

    def __init__(self, trials, pairing_order):
        self.trials = trials
        self.practice, self.test = ((3, 6), (4, 7)) if pairing_order == 1 else ((6, 3), (7, 4))

    def parcel_d(self, first_block, reversed_block):
        """(mean reversed - mean first) / sample SD over both blocks' trials kept by the latency filter."""
        kept = [t for t in self.trials if self.MIN_RT <= t['rt'] <= self.MAX_RT]
        first = [t['rt'] for t in kept if t['block'] == first_block]
        reversed_ = [t['rt'] for t in kept if t['block'] == reversed_block]
        both = first + reversed_
        if not first or not reversed_ or len(both) < 2:
            return float('nan')
        mean = sum(both) / len(both)
        sd = math.sqrt(sum((v - mean) ** 2 for v in both) / (len(both) - 1))
        return (sum(reversed_) / len(reversed_) - sum(first) / len(first)) / sd if sd else float('nan')

    def compute(self):
        d_practice, d_test = self.parcel_d(*self.practice), self.parcel_d(*self.test)
        combined = [t for t in self.trials if t['block'] in (3, 4, 6, 7)]
        up_to_max = [t for t in combined if t['rt'] <= self.MAX_RT]
        fast = sum(t['rt'] < self.FAST_RT for t in combined) / len(up_to_max) if up_to_max else 0.0
        errors = sum(t['errors'] > 0 for t in up_to_max) / len(up_to_max) if up_to_max else 0.0
        scored = sum(t['rt'] >= self.MIN_RT for t in up_to_max)
        if scored < self.MIN_SCORED:
            feedback = 'not_enough_trials'
        elif fast > self.FAST_LIMIT:
            feedback = 'too_fast'
        elif errors > self.ERROR_LIMIT:
            feedback = 'too_many_errors'
        else:
            feedback = 'shown'
        return {'D': (d_practice + d_test) / 2, 'd_practice': d_practice, 'd_test': d_test,
                'fast': fast, 'errors': errors, 'feedback': feedback}


class RescoreApp:
    def run(self, argv):
        parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
        parser.add_argument('files', nargs='+', help='results CSVs, format 1 or 2')
        parser.add_argument('--output', help='write the (single) input file in the current format to this path')
        args = parser.parse_args(argv)

        if args.output:
            if len(args.files) != 1:
                parser.error('--output converts one file at a time')
            if os.path.abspath(args.output) == os.path.abspath(args.files[0]):
                parser.error('--output must be a new file; the original is kept as it is')
            ResultsFile(args.files[0]).write(args.output)
            print(f'wrote {args.output}')
            return 0

        for path in args.files:
            results = ResultsFile(path)
            score = Scoring(results.trials(), results.pairing_order).compute()
            shown = ' '.join(f'{k}={v}' for k, v in results.displayed.items()) or '(none recorded)'
            print(f"{path}\n  displayed then: {shown}\n  {Scoring.VERSION} now:      D={score['D']:+.4f} "
                  f"(practice {score['d_practice']:+.4f}, test {score['d_test']:+.4f}) feedback={score['feedback']}")
        return 0


if __name__ == '__main__':
    sys.exit(RescoreApp().run(sys.argv[1:]))
