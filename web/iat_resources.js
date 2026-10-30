// iat_resources.js — where the web app reads stimuli files and pictures from.
// FetchedResources: from the web server the page is served by (web/index.html).
// EmbeddedResources: from data embedded in the page itself (the single-file build, tools/build_single_html.py),
// so the page needs no server and opens straight from disk.
// Both resolve paths the same way: relative to the page, which sits in web/.

export class FetchedResources {
    constructor() {
        this.pageUrl = location.href;
    }

    /** Text of a file, by URL relative to the page. Throws with the HTTP status on failure. */
    async text(url) {
        const response = await fetch(new URL(url, this.pageUrl));
        if (!response.ok) throw new Error(`cannot load ${url}: HTTP ${response.status}`);
        return response.text();
    }

    /** What an <img> should load for a picture, given its absolute URL. */
    pictureSource(absoluteUrl) {
        return absoluteUrl;
    }

    /** Stimuli files this page can offer as a menu, or null if it cannot list them (a server cannot). */
    stimuliPaths() {
        return null;
    }

    resolve(url, baseUrl = this.pageUrl) {
        return new URL(url, baseUrl).href;
    }
}

export class EmbeddedResources {
    /** @param files  { '/stimuli/race.txt': 'text...', '/media/minno/bm1_nc.jpg': 'data:image/jpeg;base64,...' }
     *                 keyed by path from the repository root. */
    constructor(files) {
        this.files = files;
        // A fixed placeholder origin (".invalid" is reserved and never resolves), so relative paths
        // resolve exactly as they would on a server, wherever the file was opened from.
        this.pageUrl = 'https://iat.invalid/web/index.html';
    }

    key(absoluteUrl) {
        return decodeURIComponent(new URL(absoluteUrl).pathname);
    }

    async text(url) {
        const key = this.key(this.resolve(url));
        if (!(key in this.files)) throw new Error(`${key} is not in this single-file build`);
        return this.files[key];
    }

    pictureSource(absoluteUrl) {
        const key = this.key(absoluteUrl);
        if (!(key in this.files)) throw new Error(`picture ${key} is not in this single-file build`);
        return this.files[key];
    }

    stimuliPaths() {
        return Object.keys(this.files).filter(k => k.startsWith('/stimuli/') && k.endsWith('.txt')).sort()
            .map(k => '..' + k);
    }

    resolve(url, baseUrl = this.pageUrl) {
        return new URL(url, baseUrl).href;
    }
}
