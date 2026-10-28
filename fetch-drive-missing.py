#!/usr/bin/env python3
"""Download only the files missing from a local copy of a Google Drive folder, using gdown's Python API.
Costs Drive one request to list the folder plus one per missing file - gdown's CLI must query Drive
for every file even when it then skips it, which trips Drive's rate limit on re-runs.

    python fetch-drive-missing.py <folder-url-or-id> <dest-dir>
Exit 0 if every file is present afterwards, 1 otherwise. All gdown output is left visible; each failure
is reported with the file name and gdown's reason, so the cause can be read from the output."""
import os, sys, traceback
import gdown

class DriveFolderSync:
    """Mirror one Drive folder into dest_dir, fetching only what is absent (or zero bytes)."""

    def __init__(self, folder, dest_dir):
        self.folder = folder if folder.startswith('http') else f'https://drive.google.com/drive/folders/{folder}'
        self.dest_dir = dest_dir

    def listing(self):
        # skip_download=True returns GoogleDriveFileToDownload(id, path, local_path) with a single listing request
        return gdown.download_folder(url=self.folder, output=self.dest_dir, skip_download=True, quiet=True)

    def run(self):
        os.makedirs(self.dest_dir, exist_ok=True)
        try:
            files = self.listing()
        except Exception as e:
            print(f'listing failed for {self.folder}: {type(e).__name__}: {e}'); traceback.print_exc(); return 1
        if not files:
            print(f'listing returned no files for {self.folder} (private, empty, or Drive refused the listing)'); return 1

        failed = []
        for f in files:
            if os.path.basename(f.local_path) == 'Thumbs.db':
                continue                                   # Windows thumbnail cache left in the Drive folder
            if os.path.exists(f.local_path) and os.path.getsize(f.local_path) > 0:
                continue
            print(f'fetching {f.local_path}')
            os.makedirs(os.path.dirname(f.local_path) or '.', exist_ok=True)
            try:
                gdown.download(id=f.id, output=f.local_path, quiet=False, resume=True)
            except Exception as e:
                failed.append(f.local_path)
                print(f'FAILED {f.local_path}: {type(e).__name__}: {e}')   # gdown's reason, verbatim

        present = sum(1 for f in files if os.path.exists(f.local_path) and os.path.getsize(f.local_path) > 0)
        print(f'{present}/{len(files)} files present in {self.dest_dir}; {len(failed)} failed this run')
        return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(DriveFolderSync(sys.argv[1], sys.argv[2]).run())
