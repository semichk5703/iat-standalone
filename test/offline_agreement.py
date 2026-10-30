"""Check that Project Implicit's scorer, running in the offline page, and this repository's scorer agree on a
session of their Race IAT.
    python3 test/offline_agreement.py results.json        (results from test/offline_session.js)

Their logged d is rounded to two decimals and is positive when the study's first category with its first
attribute was faster; for the Race IAT (minno-tasks demo.iats/race.js) that is the Black / African Americans
label with Bad.  Ours (tools/rescore_csv.py) is relative to the pairing shown in block 3.  So the magnitudes
must match to the rounding, and the signs must match when block 3 paired that first category with that
first attribute, and be opposite otherwise."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from rescore_csv import ResultsFile, Scoring

RACE_FIRST_CATEGORY_LABELS = ('African Americans', 'Black people')   # demo.iats/race.js category1, either label set
RACE_FIRST_ATTRIBUTE_PREFIX = 'Bad'                                # attribute1 ('Bad' or 'Bad words')


class OfflineAgreementCheck:
    def __init__(self, path):
        self.results = ResultsFile(path)

    def run(self):
        ours = Scoring(self.results.trials(), self.results.pairing_order).compute()['D']
        theirs = float(self.results.displayed['D'])
        category, attribute = self.results.facts['first_pairing'].split('/')
        block3_is_first_pairing = category in RACE_FIRST_CATEGORY_LABELS and attribute.startswith(RACE_FIRST_ATTRIBUTE_PREFIX)
        expected_theirs = ours if block3_is_first_pairing else -ours
        agree = abs(round(expected_theirs, 2) - theirs) <= 0.01
        print(f'theirs d={theirs:+.2f}  ours D={ours:+.4f}  block 3 paired {category} with {attribute}'
              f' -> expect theirs {expected_theirs:+.2f}: {"agree" if agree else "MISMATCH"}')
        return 0 if agree else 1


if __name__ == '__main__':
    sys.exit(OfflineAgreementCheck(sys.argv[1]).run())
