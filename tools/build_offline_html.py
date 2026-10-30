#!/usr/bin/env python3
"""Build offline/index.html as one self-contained HTML file that opens straight from disk (file://):
Project Implicit's player, the study, the task scripts, scorers and pictures it can load, all embedded.

    python3 tools/build_offline_html.py [--study FOLDER] [output.html]
        --study   the study folder to embed, relative to the repository
                  (default: minno-tasks' demo IATs, the task menu Project Implicit publishes)
        output    default dist/iat-offline.html

Nothing of Project Implicit's is changed: their files are embedded as they are, and offline/offline_loader.js
redirects their addresses at run time, exactly as when the page is served from the repository.  The page's
<script src> and <link rel=stylesheet> tags are replaced by the files' contents; every other file is put in
OFFLINE_FILES, keyed by its repository path (pictures as data: URIs)."""
import argparse
import base64
import json
import mimetypes
import os
import re
import sys

REPOSITORY = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_STUDY = 'upstream/minno-tasks/docs/studies/datapipe.iat.examples/demo.iats'
PICTURE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif')


class OfflineHtmlBuilder:
    """One study, the shared task scripts and scorers, and the page that runs them, as one HTML document."""

    # Besides the study folder, everything a study can load from Project Implicit: the IAT task scripts and
    # the scorers they depend on, and the placeholder the data-pipe address is redirected to.
    SHARED_FOLDERS = ['upstream/minno-tasks/IAT', 'upstream/minno-tasks/scorer']
    SHARED_FILES = ['offline/sink_already_loaded.js']
    # Where the page is taken to be inside the file; .invalid is a reserved name that never resolves.
    PAGE_URL = 'https://offline.invalid/offline/index.html'

    def __init__(self, study_folder, repository=REPOSITORY):
        self.repository = repository
        self.study_folder = study_folder

    def path(self, relative):
        return os.path.join(self.repository, relative)

    def read_text(self, relative):
        with open(self.path(relative), encoding='utf-8') as source:
            return source.read()

    def embedded_entry(self, relative):
        """A file's embedded form: its text, or a data: URI for a picture."""
        if relative.lower().endswith(PICTURE_EXTENSIONS):
            with open(self.path(relative), 'rb') as source:
                data = source.read()
            if data.startswith(b'version https://git-lfs'):
                sys.exit(f'{relative} is a git-lfs pointer; run "git lfs pull" first')
            mime = mimetypes.guess_type(relative)[0] or 'application/octet-stream'
            return f'data:{mime};base64,' + base64.b64encode(data).decode('ascii')
        return self.read_text(relative)

    def embedded_files(self):
        files = {}
        folders = [self.study_folder] + self.SHARED_FOLDERS
        for folder in folders:
            for directory, _, names in os.walk(self.path(folder)):
                for name in sorted(names):
                    if not name.lower().endswith(('.js', '.jst', '.json') + PICTURE_EXTENSIONS):
                        continue
                    relative = os.path.relpath(os.path.join(directory, name), self.repository).replace(os.sep, '/')
                    files['/' + relative] = self.embedded_entry(relative)
        for relative in self.SHARED_FILES:
            files['/' + relative] = self.embedded_entry(relative)
        return files

    def inline_page_resources(self, page):
        """Replace the page's <script src> and stylesheet <link> with their contents."""
        def script(match):
            source = os.path.normpath(os.path.join('offline', match.group(1))).replace(os.sep, '/')
            return '<script>\n' + self.read_text(source) + '\n</script>'

        def stylesheet(match):
            source = os.path.normpath(os.path.join('offline', match.group(1))).replace(os.sep, '/')
            return '<style>\n' + self.read_text(source) + '\n</style>'
        page = re.sub(r'<script src="([^"]+)"></script>', script, page)
        return re.sub(r'<link rel="stylesheet" href="([^"]+)">', stylesheet, page)

    def build(self):
        page = self.inline_page_resources(self.read_text('offline/index.html'))
        study_manager = '../' + self.study_folder + '/mgr.js'
        files_json = json.dumps(self.embedded_files(), ensure_ascii=False).replace('</', '<\\/')
        settings = ('<script>\n// Single-file build (tools/build_offline_html.py): the files offline/offline_loader.js serves\n'
                    f'window.OFFLINE_PAGE_URL = {json.dumps(self.PAGE_URL)};\n'
                    f'window.OFFLINE_DEFAULT_STUDY = {json.dumps(study_manager)};\n'
                    f'window.OFFLINE_FILES = {files_json};\n</script>\n')
        marker = '<script>\n/** Runs one Project Implicit study offline.'
        if marker not in page:
            sys.exit('offline/index.html changed shape: cannot find the app script to put the files before')
        return page.replace(marker, settings + marker, 1)


class BuildApp:
    def run(self, argv):
        parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
        parser.add_argument('output', nargs='?', default=os.path.join(REPOSITORY, 'dist', 'iat-offline.html'))
        parser.add_argument('--study', default=DEFAULT_STUDY, help='study folder, relative to the repository')
        args = parser.parse_args(argv)
        html = OfflineHtmlBuilder(args.study).build()
        os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
        with open(args.output, 'w', encoding='utf-8', newline='\n') as out:
            out.write(html)
        print(f'wrote {args.output} ({len(html.encode("utf-8")) / 1e6:.1f} MB)')
        return 0


if __name__ == '__main__':
    sys.exit(BuildApp().run(sys.argv[1:]))
