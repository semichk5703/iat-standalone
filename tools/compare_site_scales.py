#!/usr/bin/env python3
"""Compare the live site's scale files (downloaded by tools/sync_site_configs.py) with the 2025 codebook the
offline race study's scales are generated from: which items each site file asks, and where the wording the
site shows differs from the codebook's label.

    python3 tools/compare_site_scales.py [SITE_STUDY_FOLDER]
        default site-cache/implicit.harvard.edu/implicit/user/demo.us/demo.race.0006

Wording is compared after decoding HTML entities (&#8217; and the like), removing tags and backslash
escapes, folding curly quotes to straight ones, and ignoring case and runs of spaces; what still differs is
printed.  Exit status 0 always: this reports, it does not judge."""
import html
import os
import re
import sys

REPOSITORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPOSITORY, 'tools'))
from codebook_to_questionnaires import CodebookScales, DEFAULT_CODEBOOK

DEFAULT_SITE_STUDY = os.path.join(REPOSITORY, 'site-cache/implicit.harvard.edu/implicit/user/demo.us/demo.race.0006')


class SiteScaleFile:
    """One site scale file's questions, as (variable name, stem) pairs, read from its minno-quest source."""

    # a question object: name: 'sdof1', ... stem: '...'  (stems are single- or double-quoted JS strings)
    QUESTION = re.compile(r"""name\s*:\s*['"](\w+)['"][\s\S]{0,400}?stem\s*:\s*(['"])((?:\\.|(?!\2).)*)\2""")

    def __init__(self, path):
        self.name = os.path.basename(path)
        with open(path, encoding='utf-8') as source:
            self.questions = [(match[1], match[3]) for match in self.QUESTION.finditer(source.read())]


def comparable(text):
    text = html.unescape(re.sub(r'<[^>]+>', '', text)).replace("\\'", "'").replace('\\"', '"')
    text = text.translate(str.maketrans({'‘': "'", '’': "'", '“': '"', '”': '"'}))
    return ' '.join(text.split()).lower()


class CompareApp:
    def run(self, argv):
        folder = argv[0] if argv else DEFAULT_SITE_STUDY
        if not os.path.isdir(folder):
            print(f'{folder} not found: run tools/sync_site_configs.py first')
            return 0
        codebook = {item['name']: item['stem'] for items in CodebookScales(DEFAULT_CODEBOOK).as_data().values() for item in items}
        asked, differences = set(), 0
        for name in sorted(n for n in os.listdir(folder) if n.endswith('scale.js')):
            site_file = SiteScaleFile(os.path.join(folder, name))
            groups = sorted({re.sub(r'\d+[a-z]?$', '', variable) for variable, _ in site_file.questions})
            print(f'{name:18} {len(site_file.questions):3} questions  groups: {"+".join(groups)}')
            for variable, stem in site_file.questions:
                asked.add(variable)
                if variable in codebook and comparable(stem) != comparable(codebook[variable]):
                    differences += 1
                    print(f'    {variable:10} site:     {comparable(stem)}\n    {"":10} codebook: {comparable(codebook[variable])}')
        not_asked = sorted(set(codebook) - asked)
        print(f'{len(codebook)} codebook items; {len(not_asked)} not in any site file{": " + " ".join(not_asked) if not_asked else ""}; '
              f'{differences} worded differently')
        return 0


if __name__ == '__main__':
    sys.exit(CompareApp().run(sys.argv[1:]))
