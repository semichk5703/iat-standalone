#!/usr/bin/env python3
"""Download the live site's study configs, so what implicit.harvard.edu runs can be compared with what is
published (minno-tasks) and with what was seen before.

    python3 tools/sync_site_configs.py [MANAGER_URL ...]
        MANAGER_URL   a study's manager script; default: the Race IAT and Weight IAT studies (STUDIES)
        --cache DIR   where the downloaded files go (default site-cache/, ignored by git: the site's files
                      carry no licence, so they are not redistributed)
        --manifest F  the record of what was downloaded (default references/live-site/manifest.txt, committed)

Starting from each manager, every .js/.jst path the files name on the same host is downloaded in turn (the
studies' tasks, questionnaires, templates).  Addresses on other hosts (the minno-tasks CDN, minno-quest) are
listed, not downloaded: their contents are the pinned submodules under upstream/.  The manifest lists every
address with its sha256, size and the date seen; differences from the previous manifest are printed, so a
change on the site shows up as a diff of a committed file.  Every failure is logged with its cause."""
import argparse
import datetime
import hashlib
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

REPOSITORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIES = ['https://implicit.harvard.edu/implicit/user/demo.us/demo.race.0006/mgr.js',
           'https://implicit.harvard.edu/implicit/user/demo.us/demo.weight.0004/mgr.js']


class SiteFile:
    """One downloaded address: its text (None when the download failed) and why it failed."""

    def __init__(self, address, text=None, failure=None):
        self.address = address
        self.text = text
        self.failure = failure

    def digest(self):
        return hashlib.sha256(self.text.encode('utf-8')).hexdigest() if self.text is not None else '-'

    def manifest_line(self, date):
        size = len(self.text.encode('utf-8')) if self.text is not None else 0
        status = 'ok' if self.text is not None else f'FAILED ({self.failure})'
        return f'{self.address}  sha256 {self.digest()}  {size} bytes  {date}  {status}'


class SiteConfigSync:
    """Follows the paths a study's files name, downloading those on the study's own host."""

    # a quoted path ending in .js or .jst: scriptUrl: 'explicits.js', templateUrl: '/implicit/.../x.jst', define(['...'])
    PATH_IN_TEXT = re.compile(r"""['"]([^'"\s]+?\.jst?)['"]""")
    REQUEST_DELAY_SECONDS = 1.0       # one request a second: this is someone else's server
    USER_AGENT = 'iat-standalone tools/sync_site_configs.py (offline IAT provenance check)'

    def __init__(self, cache_folder):
        self.cache_folder = cache_folder
        self.files = {}               # address -> SiteFile, in the order found
        self.elsewhere = set()        # addresses on other hosts, listed only

    def fetch(self, address):
        request = urllib.request.Request(address, headers={'User-Agent': self.USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return SiteFile(address, response.read().decode('utf-8'))
        except urllib.error.HTTPError as error:
            return SiteFile(address, failure=f'HTTP {error.code} {error.reason}')
        except (urllib.error.URLError, OSError, UnicodeDecodeError) as error:
            return SiteFile(address, failure=f'{type(error).__name__}: {getattr(error, "reason", error)}')

    def resolve(self, path, referrer, study_folder):
        """minno resolves a script's or template's relative path against the study's folder, not the file's."""
        address = urllib.parse.urljoin(study_folder if not path.startswith('/') else referrer, path)
        parts = urllib.parse.urlsplit(address)
        return urllib.parse.urlunsplit(parts._replace(path=re.sub('/{2,}', '/', parts.path), query='', fragment=''))

    def sync(self, manager_address):
        study_folder = manager_address.rsplit('/', 1)[0] + '/'
        host = urllib.parse.urlsplit(manager_address).netloc
        pending = [manager_address]
        while pending:
            address = pending.pop(0)
            if address in self.files:
                continue
            if self.files:
                time.sleep(self.REQUEST_DELAY_SECONDS)
            site_file = self.fetch(address)
            self.files[address] = site_file
            print(f'{"ok    " if site_file.text is not None else "FAILED"} {address}'
                  + (f'  ({site_file.failure})' if site_file.failure else ''), flush=True)
            if site_file.text is None:
                continue
            self.save(site_file)
            for path in self.PATH_IN_TEXT.findall(site_file.text):
                found = self.resolve(path, address, study_folder)
                if urllib.parse.urlsplit(found).netloc == host:
                    pending.append(found)
                else:
                    self.elsewhere.add(found)

    def save(self, site_file):
        parts = urllib.parse.urlsplit(site_file.address)
        path = os.path.join(self.cache_folder, parts.netloc, *parts.path.strip('/').split('/'))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8', newline='') as out:
            out.write(site_file.text)


class Manifest:
    """The committed record: one line per address, plus the other-host addresses the files name."""

    def __init__(self, path):
        self.path = path

    def previous_digests(self):
        if not os.path.exists(self.path):
            return {}
        with open(self.path, encoding='utf-8') as source:
            return {line.split('  ')[0]: line.split('sha256 ')[1].split()[0]
                    for line in source if ' sha256 ' in line and not line.startswith('#')}

    def write(self, sync, date):
        os.makedirs(os.path.dirname(os.path.abspath(self.path)), exist_ok=True)
        with open(self.path, 'w', encoding='utf-8', newline='\n') as out:
            out.write('# implicit.harvard.edu study files, as downloaded by tools/sync_site_configs.py\n'
                      '# address  sha256  size  date seen  status\n')
            for site_file in sorted(sync.files.values(), key=lambda f: f.address):
                out.write(site_file.manifest_line(date) + '\n')
            out.write('# named by these files, on other hosts (contents: the pinned submodules under upstream/)\n')
            for address in sorted(sync.elsewhere):
                out.write(f'#   {address}\n')

    @staticmethod
    def report_changes(before, sync):
        for address, site_file in sync.files.items():
            if address not in before:
                print(f'new      {address}')
            elif before[address] != site_file.digest():
                print(f'changed  {address}  (sha256 was {before[address]})')
        for address in sorted(set(before) - set(sync.files)):
            print(f'gone     {address}  (no longer named by the studies)')


class SyncApp:
    def run(self, argv):
        parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
        parser.add_argument('managers', nargs='*', default=STUDIES)
        parser.add_argument('--cache', default=os.path.join(REPOSITORY, 'site-cache'))
        parser.add_argument('--manifest', default=os.path.join(REPOSITORY, 'references/live-site/manifest.txt'))
        args = parser.parse_args(argv)
        manifest = Manifest(args.manifest)
        before = manifest.previous_digests()
        sync = SiteConfigSync(args.cache)
        for manager in args.managers:
            sync.sync(manager)
        Manifest.report_changes(before, sync)
        manifest.write(sync, datetime.date.today().isoformat())
        failures = [f for f in sync.files.values() if f.text is None]
        print(f'{len(sync.files)} files, {len(failures)} failed; manifest: {args.manifest}; copies: {args.cache}')
        return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(SyncApp().run(sys.argv[1:]))
