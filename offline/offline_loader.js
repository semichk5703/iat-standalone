// offline_loader.js — runs Project Implicit's own studies (minno-quest's player, minno-tasks' task scripts)
// unchanged, with no network: every address their files name is redirected to a local copy.
//
// Their player loads each script through RequireJS; RequireJS lets a page replace its `requirejs.load`
// function (its documented hook for custom loading), so this file wraps it: fetch the script, apply the
// address table to the script's address and to its text (task scripts also name picture folders by
// address), then hand the result to RequireJS as a blob: URL.  The player fetches page templates (.jst) with
// XMLHttpRequest instead, so that is hooked too, with the same table.  In a single-file build there is no file
// to fetch, so `files` supplies each file's text, and picture addresses map to embedded data: URIs;
// there the page is treated as if it sat at offline/index.html on a placeholder host (pageUrl), so
// every address resolves the same way it would in the repository, and files are keyed by that path.

/** One upstream address prefix and the local path that replaces it. */
class AddressRewrite {
    constructor(upstreamPrefix, localPrefix, reason) {
        this.upstreamPrefix = upstreamPrefix;
        this.localPrefix = localPrefix;
        this.reason = reason;          // shown in PROTOCOL; why this redirect exists
    }

    applyTo(text) {
        return text.split(this.upstreamPrefix).join(this.localPrefix);
    }
}

class OfflineLoader {
    /** @param rewrites  AddressRewrite list, applied in order
     *  @param files     null when served from a folder; in a single-file build,
     *                   { '/repository/path': text, or a data: URI for a picture }
     *  @param pageUrl   where the page is taken to be; a single-file build passes its placeholder address */
    constructor(rewrites, files = null, pageUrl = location.href) {
        this.files = files;
        this.pageUrl = pageUrl;
        // Local paths are written relative to the page; RequireJS would resolve a relative dependency
        // against the requesting script's folder instead, so each becomes an absolute address here.
        this.rewrites = rewrites.map(rule => rule.localPrefix.startsWith('/') ? rule
            : new AddressRewrite(rule.upstreamPrefix, this.resolve(rule.localPrefix), rule.reason));
    }

    resolve(address) {
        return new URL(address, this.pageUrl).href;
    }

    rewrite(text) {
        return this.rewrites.reduce((result, rule) => rule.applyTo(result), text);
    }

    /** The repository path an address stands for, as a single-file build keys its files. */
    fileKey(address) {
        return decodeURIComponent(new URL(address, this.pageUrl).pathname);
    }

    async readText(url) {
        if (this.files) {
            const key = this.fileKey(url);
            if (!(key in this.files)) throw new Error(`${key} is not in this single-file build`);
            return this.files[key];
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
        return response.text();
    }

    /** Install the RequireJS and XMLHttpRequest hooks (and, in a single-file build, the picture hook).
     *  Call before minnoJS(). */
    install(requirejs) {
        const loadWithRequireJs = requirejs.load;
        requirejs.load = (context, moduleName, url) => {
            this.readText(this.rewrite(url))
                .then(text => {
                    const blobUrl = URL.createObjectURL(new Blob([this.rewrite(text)], { type: 'text/javascript' }));
                    loadWithRequireJs(context, moduleName, blobUrl);
                })
                .catch(error => {
                    console.error(`offline: cannot load ${url}: ${error.message}`);
                    context.onError(error);
                });
        };
        this.installRequestHook();
        if (this.files) this.installPictureHook();
    }

    /** Templates: XMLHttpRequest.open gets the rewritten address; in a single-file build, a blob: URL of the
     *  embedded text (a file:// page cannot request files, and the placeholder host does not exist). */
    installRequestHook() {
        const loader = this;
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, address, ...rest) {
            let rewritten = loader.rewrite(String(address));
            if (loader.files && !/^(blob|data):/.test(rewritten)) {
                const key = loader.fileKey(rewritten);
                if (key in loader.files) {
                    rewritten = URL.createObjectURL(new Blob([loader.rewrite(loader.files[key])], { type: 'text/plain' }));
                } else {
                    console.error(`offline: ${key} is not in this single-file build`);
                }
            }
            return open.call(this, method, rewritten, ...rest);
        };
    }

    /** Single-file build: an <img> whose address is a local path gets the embedded data: URI instead.
     *  The player sets img.src itself, so the property's setter is the one place to intercept it. */
    installPictureHook() {
        const loader = this;
        const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            get() { return descriptor.get.call(this); },
            set(value) {
                const key = value.startsWith('data:') ? null : loader.fileKey(value);
                if (key && key in loader.files) {
                    this.dataset.offlineSource = value;      // the address the study asked for, kept visible
                    value = loader.files[key];
                }
                descriptor.set.call(this, value);
            },
        });
    }
}
