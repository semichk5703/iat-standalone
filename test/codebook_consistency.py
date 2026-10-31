"""Check that the 2025 codebook (what the offline race study's scales are generated from) and the 2002-2025
codebook agree on which questionnaire scales were in use in 2025.
    python3 test/codebook_consistency.py
Both are Project Implicit's (references/race-iat-dataset/SOURCES.txt).  The multi-year workbook marks each
variable's Source ('exp' = explicit questions) and its Ending Date; every 'exp' scale still in use in 2025
must be one the 2025 CSV yields, apart from the explicit questions minno-tasks' explicits.js already asks
(EXPLICITS_JS_VARIABLES).  Skips, saying why, when openpyxl or the git-lfs object is not present."""
import os
import sys

REPOSITORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPOSITORY, 'tools'))
from codebook_to_questionnaires import CodebookScales, DEFAULT_CODEBOOK

WORKBOOK = os.path.join(REPOSITORY, 'references/race-iat-dataset/Race_IAT_public_2002-2025_codebook.xlsx')
# minno-tasks docs/studies/raceiat/explicits.js asks these (as attributes7, Tblack_0to10, Twhite_0to10)
EXPLICITS_JS_VARIABLES = {'att', 'att_7', 'tblack_0to10', 'twhite_0to10'}
HEADER_ROW = 13      # the workbook's column names are on row 13; rows above are its notes


class CodebookConsistencyCheck:
    def workbook_scales_in_2025(self):
        import openpyxl
        sheet = openpyxl.load_workbook(WORKBOOK, read_only=True)['All']
        scales = set()
        for source, name, _label, _start, end, *_ in sheet.iter_rows(min_row=HEADER_ROW + 1, values_only=True):
            if source == 'exp' and str(end).startswith('2025'):
                match = CodebookScales.ITEM_NUMBER.match(str(name))
                scales.add(match['prefix'] if match else str(name))
        return scales

    def run(self):
        try:
            import openpyxl   # noqa: F401  (only to report a clear skip)
        except ImportError:
            print('SKIP: openpyxl is not installed (pip install openpyxl)')
            return 0
        with open(WORKBOOK, 'rb') as workbook:
            if workbook.read(7) == b'version':
                print('SKIP: the 2002-2025 workbook is a git-lfs pointer; run "git lfs pull"')
                return 0
        from_workbook = self.workbook_scales_in_2025() - EXPLICITS_JS_VARIABLES
        from_csv = set(CodebookScales(DEFAULT_CODEBOOK).scales)
        print(f'2025 scales: workbook {len(from_workbook)}, 2025 CSV {len(from_csv)}')
        if from_workbook != from_csv:
            print(f'MISMATCH: only in workbook {sorted(from_workbook - from_csv)}, only in CSV {sorted(from_csv - from_workbook)}')
            return 1
        print('agree')
        return 0


if __name__ == '__main__':
    sys.exit(CodebookConsistencyCheck().run())
