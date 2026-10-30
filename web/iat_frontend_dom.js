// iat_frontend_dom.js — browser frontend (parallel to src/iat_sdl.c): keyboard E/I, or touch zones on
// phones (iat11.js's touch mode: left/right green areas answer, the lower area continues).

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

    /** The source page's table (raceiat_instructions.jst): group names, then words or 60 px thumbnails;
     *  a Start button continues, as do space and the touch area. */
    showOverview(set, overview) {
        this.showMessage([]);
        const message = this.elements.message;
        const add = (tag, props) => message.appendChild(Object.assign(document.createElement(tag), props));
        add('h2', { textContent: overview.heading });
        add('p', { textContent: overview.lead });
        const table = add('table', { className: 'overview' });
        table.innerHTML = '<tr><th>Category</th><th>Items</th></tr>';
        for (const c of overview.rowOrder) {
            const category = set.categories[c];
            const row = table.insertRow();
            row.appendChild(Object.assign(document.createElement('th'), { textContent: category.name }));
            const cell = row.insertCell();
            if (category.items[0].isPicture) {
                category.items.forEach(item => cell.appendChild(Object.assign(new Image(), { src: item.text, alt: item.label, height: 60 })));
            } else {
                cell.textContent = category.items.map(item => item.text).join(', ');
            }
        }
        add('p', { textContent: overview.closing });
        add('button', { textContent: overview.startButton, className: 'start', onclick: () => this.deliver(KEY_CONTINUE) });
    }

    showHeader(set, keys) {
        const names = set.categories.map(c => c.name);
        this.elements.message.style.display = 'none';
        this.elements.header.style.visibility = '';
        this.elements.stage.style.visibility = '';
        // iat11.js header: key text (hidden on touch screens), then in combined blocks the attribute,
        // "or", the target category (frontend_header_labels in C)
        const side = (keyText, categories) => `<small style="visibility:${this.touch ? 'hidden' : 'visible'}">${keyText}</small>` +
            categories.slice().reverse().map(c => `<div>${names[c]}</div>`).join('<div class="or">or</div>');
        this.elements.left.innerHTML = side('Press "E" for', keys.left);
        this.elements.right.innerHTML = side('Press "I" for', keys.right);
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

    /** A menu of buttons (used to pick a stimuli set in the single-file build). Resolves the chosen index. */
    showChoice(lines, options) {
        this.showMessage(lines);
        this.elements['zone-continue'].classList.remove('active');
        const list = document.createElement('div');
        list.className = 'choices';
        return new Promise(resolve => {
            options.forEach((text, index) => {
                const button = Object.assign(document.createElement('button'), { textContent: text });
                button.addEventListener('click', () => resolve(index));
                list.append(button);
            });
            this.elements.message.append(list);
        });
    }

    readKey() {
        if (this.pendingKeys.length) return Promise.resolve(this.pendingKeys.shift());
        return new Promise(resolve => { this.waiter = resolve; });
    }
    discardPendingKeys() { this.pendingKeys.length = 0; }
}
