#!/usr/bin/env python3
"""Build the web app as one self-contained HTML file: all code, every stimuli/*.txt set, and the pictures
those sets reference, embedded.  It needs no server and opens straight from disk (file://).

    python3 tools/build_single_html.py [output.html]          default: dist/iat.html

Each web/*.js module is wrapped in its own function scope (so private helper names cannot collide), its
'export' keywords dropped and its exports returned; each 'import { a, b } from "./x.js"' becomes a lookup
of module x's exports.  Modules are emitted in dependency order.  Pictures become data: URIs."""
import base64
import json
import mimetypes
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMPORT_PATTERN = re.compile(r"^[ \t]*import\s*\{([^}]*)\}\s*from\s*'\./([\w]+)\.js';\s*$", re.M)
EXPORT_PATTERN = re.compile(r"^export\s+(class|const|function|async function)\s+(\w+)", re.M)


class SingleHtmlBuilder:
    """Inline web/index.html's module graph and the stimuli it can load into one HTML document."""

    def __init__(self, repo=REPO):
        self.repo = repo
        self.web = os.path.join(repo, 'web')

    def read(self, *parts, mode='r'):
        with open(os.path.join(self.repo, *parts), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f:
            return f.read()

    def module_order(self, entry):
        """Depth-first dependency order of the modules reachable from entry (a module name, no .js)."""
        order, seen = [], set()

        def visit(name):
            if name in seen:
                return
            seen.add(name)
            for _, dependency in IMPORT_PATTERN.findall(self.read('web', name + '.js')):
                visit(dependency)
            order.append(name)
        visit(entry)
        return order

    def wrap_module(self, name):
        source = self.read('web', name + '.js')
        exports = [match[1] for match in EXPORT_PATTERN.findall(source)]
        source = IMPORT_PATTERN.sub(lambda m: f"const {{{m.group(1)}}} = __modules['{m.group(2)}'];", source)
        source = EXPORT_PATTERN.sub(lambda m: f"{m.group(1)} {m.group(2)}", source)
        return f"__modules['{name}'] = (() => {{\n{source}\nreturn {{ {', '.join(exports)} }};\n}})();\n"

    def embedded_files(self):
        """Every stimuli set as text, and every picture they reference as a data: URI, keyed by repo path."""
        files = {}
        stimuli_dir = os.path.join(self.repo, 'stimuli')
        for name in sorted(os.listdir(stimuli_dir)):
            if not name.endswith('.txt'):
                continue
            text = self.read('stimuli', name)
            files['/stimuli/' + name] = text
            for entry in re.findall(r'[^,:\s]+\.(?:jpe?g|png|gif)', text, re.I):
                path = os.path.normpath(os.path.join('stimuli', entry))
                key = '/' + path.replace(os.sep, '/')
                if key in files:
                    continue
                data = self.read(path, mode='rb')
                if data.startswith(b'version https://git-lfs'):
                    sys.exit(f'{path} is a git-lfs pointer; run "git lfs pull" first')
                mime = mimetypes.guess_type(path)[0] or 'application/octet-stream'
                files[key] = f'data:{mime};base64,' + base64.b64encode(data).decode('ascii')
        return files

    def build(self):
        page = self.read('web', 'index.html')
        entry_script = re.search(r'<script type="module">(.*?)</script>', page, re.S)
        entry_imports = IMPORT_PATTERN.findall(entry_script.group(1))
        modules = []
        for _, entry in entry_imports:
            for name in self.module_order(entry):
                if name not in modules:
                    modules.append(name)

        files_json = json.dumps(self.embedded_files(), ensure_ascii=False).replace('</', '<\\/')
        body = IMPORT_PATTERN.sub(lambda m: f"const {{{m.group(1)}}} = __modules['{m.group(2)}'];", entry_script.group(1))
        script = ('\n// Single-file build of iat (tools/build_single_html.py); source: web/*.js\n'
                  f'globalThis.IAT_EMBEDDED_FILES = {files_json};\n'
                  'const __modules = {};\n'
                  + ''.join(self.wrap_module(name) for name in modules)
                  + body)
        return page[:entry_script.start()] + '<script>' + script + '</script>' + page[entry_script.end():]


class BuildApp:
    def run(self, argv):
        output = argv[0] if argv else os.path.join(REPO, 'dist', 'iat.html')
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        html = SingleHtmlBuilder().build()
        with open(output, 'w', encoding='utf-8', newline='\n') as out:
            out.write(html)
        print(f'wrote {output} ({len(html.encode("utf-8")) / 1e6:.1f} MB)')
        return 0


if __name__ == '__main__':
    sys.exit(BuildApp().run(sys.argv[1:]))
