// iat_frontend_dom.js — browser frontend (parallel to src/iat_sdl.c): keyboard E/I, or touch zones on
// phones (quiat9.js's touch mode: left/right green areas answer, the lower area continues).

import { KEY_LEFT, KEY_RIGHT, KEY_CONTINUE, KEY_QUIT } from './iat_procedure.js';

export class DomFrontend {
    constructor(root, touch) {
        this.root = root;
        this.touch = touch;
        this.pendingKeys = [];
        this.waiter = null;
        root.innerHTML = `
            <div class="header"><div class="side left"></div><div class="side right"></div></div>
            <div class="stage"><div class="stimulus"></div><div class="error">X</div></div>
            <div class="message"></div>
            <div class="touch-zones"><div class="zone zone-left"></div><div class="zone zone-right"></div><div class="zone zone-continue"></div></div>`;
        root.classList.toggle('touch', touch);
        this.elements = Object.fromEntries(['header', 'left', 'right', 'stage', 'stimulus', 'error', 'message',
            'zone-left', 'zone-right', 'zone-continue'].map(c => [c, root.querySelector('.' + c)]));
        document.addEventListener('keydown', e => {
            const key = { e: KEY_LEFT, i: KEY_RIGHT, ' ': KEY_CONTINUE, q: KEY_QUIT, Escape: KEY_QUIT }[e.key];
            if (key) { e.preventDefault(); this.deliver(key); }
        });
        const onTouch = key => e => { e.preventDefault(); this.deliver(key); };
        this.elements['zone-left'].addEventListener('pointerdown', onTouch(KEY_LEFT));
        this.elements['zone-right'].addEventListener('pointerdown', onTouch(KEY_RIGHT));
        this.elements['zone-continue'].addEventListener('pointerdown', onTouch(KEY_CONTINUE));
    }

    deliver(key) {
        if (this.waiter) { const resolve = this.waiter; this.waiter = null; resolve(key); }
        else this.pendingKeys.push(key);
    }

    open(set) {
        // decode pictures once so a trial never waits on the network
        set.categories.forEach(c => c.items.forEach(item => { if (item.isPicture) new Image().src = item.text; }));
    }
    close() {}

    showMessage(lines) {
        this.elements.header.style.visibility = 'hidden';
        this.elements.stage.style.visibility = 'hidden';
        this.elements.message.style.display = '';
        this.elements.message.replaceChildren(...lines.map(l => { const p = document.createElement('p'); p.textContent = l; return p; }));
        this.elements['zone-continue'].classList.add('active');
        this.elements['zone-left'].classList.remove('active');
        this.elements['zone-right'].classList.remove('active');
    }

    showHeader(set, keys) {
        const names = set.categories.map(c => c.name);
        this.elements.message.style.display = 'none';
        this.elements.header.style.visibility = '';
        this.elements.stage.style.visibility = '';
        this.elements.left.innerHTML = `<small>${this.touch ? 'Touch left for' : 'Press "E" for'}</small>` + keys.left.map(c => `<div>${names[c]}</div>`).join('<div class="or">or</div>');
        this.elements.right.innerHTML = `<small>${this.touch ? 'Touch right for' : 'Press "I" for'}</small>` + keys.right.map(c => `<div>${names[c]}</div>`).join('<div class="or">or</div>');
        this.elements['zone-continue'].classList.remove('active');
        this.elements['zone-left'].classList.add('active');
        this.elements['zone-right'].classList.add('active');
        this.clearStimulus();
    }

    showStimulus(set, category, itemIndex) {
        const item = set.categories[category].items[itemIndex];
        this.elements.stimulus.replaceChildren(item.isPicture ? Object.assign(new Image(), { src: item.text, alt: item.label }) : document.createTextNode(item.text));
        this.elements.error.style.visibility = 'hidden';
    }
    clearStimulus() { this.elements.stimulus.replaceChildren(); this.elements.error.style.visibility = 'hidden'; }
    showError() { this.elements.error.style.visibility = ''; }

    readKey() {
        if (this.pendingKeys.length) return Promise.resolve(this.pendingKeys.shift());
        return new Promise(resolve => { this.waiter = resolve; });
    }
    discardPendingKeys() { this.pendingKeys.length = 0; }
}
