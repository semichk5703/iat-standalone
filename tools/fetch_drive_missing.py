#!/usr/bin/env python3
"""Download only the files missing from a local copy of a Google Drive folder, using gdown's Python API.
Costs Drive one request to list the folder plus one per missing file - gdown's CLI must query Drive
for every file even when it then skips it, which trips Drive's rate limit on re-runs.

    python tools/fetch_drive_missing.py <folder-url-or-id> <dest-dir>
Exit 0 if every file is present afterwards, 1 otherwise. All gdown output is left visible; each failure
is reported with the file name and gdown's reason, so the cause can be read from the output."""
import os, sys, traceback
import gdown, requests

class DriveFolderSync:
    """Mirror one Drive folder into dest_dir, fetching only what is absent (or zero bytes)."""

    def __init__(self, folder, dest_dir):
        self.folder = folder if folder.startswith('http') else f'https://drive.google.com/drive/folders/{folder}'
        self.dest_dir = dest_dir

    def listing(self):
        # skip_download=True returns GoogleDriveFileToDownload(id, path, local_path) with a single listing request
        return gdown.download_folder(url=self.folder, output=self.dest_dir, skip_download=True, quiet=True)

    # Direct download endpoint. gdown tries to parse Drive's HTML interstitial and breaks whenever Drive
    # changes it ("Failed to retrieve file url"), while this URL served the raw file fine; so it is tried
    # first and gdown is the fallback (gdown handles the large-file virus-scan confirmation page).
    DIRECT_URL = 'https://drive.usercontent.google.com/download?id={id}&export=download&authuser=0'

    def fetch_file(self, file_id, local_path):
        r = requests.get(self.DIRECT_URL.format(id=file_id), timeout=60, stream=True)
        head = r.raw.read(512, decode_content=True) if r.ok else b''
        if r.ok and not head.lstrip().lower().startswith((b'<!doctype', b'<html')) and b'text/html' not in r.headers.get('content-type', '').encode():
            with open(local_path, 'wb') as out:
                out.write(head)
                for chunk in r.iter_content(1 << 16): out.write(chunk)
            print(f'  ok  {os.path.getsize(local_path)} bytes (direct)')
            return
        print(f'  direct URL gave HTTP {r.status_code} {r.headers.get("content-type")} - falling back to gdown')
        gdown.download(id=file_id, output=local_path, quiet=False, resume=True)

    def run(self):
        os.makedirs(self.dest_dir, exist_ok=True)
        try:
            files = self.listing()
        except Exception as e:
            print(f'listing failed for {self.folder}: {type(e).__name__}: {e}'); traceback.print_exc(); return 1
        if not files:
            print(f'listing returned no files for {self.folder} (private, empty, or Drive refused the listing)'); return 1

        # Thumbs.db is a Windows thumbnail cache someone left in the Drive folder, not a stimulus: ignored entirely
        files = [f for f in files if os.path.basename(f.local_path) != 'Thumbs.db']
        failed = []
        for f in files:
            if os.path.exists(f.local_path) and os.path.getsize(f.local_path) > 0:
                continue
            print(f'fetching {f.local_path}')
            os.makedirs(os.path.dirname(f.local_path) or '.', exist_ok=True)
            try:
                self.fetch_file(f.id, f.local_path)
            except Exception as e:
                failed.append(f.local_path)
                print(f'FAILED {f.local_path}: {type(e).__name__}: {e}')

        present = sum(1 for f in files if os.path.exists(f.local_path) and os.path.getsize(f.local_path) > 0)
        print(f'{present}/{len(files)} files present in {self.dest_dir}; {len(failed)} failed this run')
        return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(DriveFolderSync(sys.argv[1], sys.argv[2]).run())
