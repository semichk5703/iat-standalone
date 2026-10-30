// iat_stimuli.js — the four stimulus categories and the stimuli text file format (parallel to src/iat_stimuli.h).
// Same file format; picture paths resolve relative to the stimuli file's URL. Globs are not supported in
// the browser, so list picture files explicitly (the shipped sets do).

export const CATEGORY_TARGET_A = 0;
export const CATEGORY_TARGET_B = 1;
export const CATEGORY_ATTRIBUTE_A = 2;
export const CATEGORY_ATTRIBUTE_B = 3;
export const CATEGORY_COUNT = 4;

const STIMULI_CATEGORY_KEYS = ['target_a', 'target_b', 'attr_a', 'attr_b'];

export class StimulusItem {
    constructor(text, isPicture) {
        this.text = text;              // the word, or the picture's URL
        this.isPicture = isPicture;
    }
    get label() {                      // the word, or the picture's file name
        return this.isPicture ? this.text.split('/').pop() : this.text;
    }
}

export class Category {
    constructor() {
        this.name = '';
        this.nameVariants = [];        // "Black people | African Americans": one is chosen per session
        this.items = [];
        this.sampleCount = 0;          // 0: show all items; n: a random n of them per session
    }
}

export class StimulusSet {
    constructor() {
        this.categories = Array.from({ length: CATEGORY_COUNT }, () => new Category());
        this.hasPictures = false;
    }

    /** Parse the stimuli text format. baseUrl resolves relative picture paths. Throws on a malformed file. */
    static parse(text, baseUrl) {
        const set = new StimulusSet();
        for (const rawLine of text.split('\n')) {
            const colon = rawLine.indexOf(':');
            if (colon < 0 || rawLine.startsWith('#')) continue;
            const key = rawLine.slice(0, colon).trim();
            const value = rawLine.slice(colon + 1).trim();
            STIMULI_CATEGORY_KEYS.forEach((categoryKey, c) => {
                const category = set.categories[c];
                if (key === categoryKey) {
                    category.nameVariants = value.split('|').map(v => v.trim()).filter(Boolean);
                    category.name = category.nameVariants[0] || '';
                } else if (key === categoryKey + '_sample') {
                    category.sampleCount = parseInt(value, 10) || 0;
                } else if (key === categoryKey + '_items') {
                    category.items = value.split(',').map(v => v.trim()).filter(Boolean).map(entry => {
                        const isPicture = /\.(jpe?g|png|gif)$/i.test(entry);
                        if (isPicture) set.hasPictures = true;
                        return new StimulusItem(isPicture ? new URL(entry, baseUrl).href : entry, isPicture);
                    });
                }
            });
        }
        set.categories.forEach((category, c) => {
            if (!category.name || !category.items.length) throw new Error(`stimuli: missing or empty ${STIMULI_CATEGORY_KEYS[c]}`);
        });
        set.checkDisjoint();
        return set;
    }

    static async load(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`cannot load ${url}: HTTP ${response.status}`);
        return StimulusSet.parse(await response.text(), new URL(url, location.href).href);
    }

    /** An item listed under two categories has no correct key: reject rather than score nonsense. */
    checkDisjoint() {
        const seen = new Map();
        this.categories.forEach(category => category.items.forEach(item => {
            if (seen.has(item.label)) throw new Error(`stimuli: '${item.label}' appears in both ${seen.get(item.label)} and ${category.name}`);
            seen.set(item.label, category.name);
        }));
    }

    /** Per-session randomisations as Project Implicit's demo tasks do them: one label variant index for
     *  all categories (paired labels agree), and a random sample of items where _sample is set. */
    randomizeSession(random) {
        const mostVariants = Math.max(...this.categories.map(c => c.nameVariants.length));
        const chosenVariant = random.below(mostVariants);
        for (const category of this.categories) {
            if (chosenVariant < category.nameVariants.length) category.name = category.nameVariants[chosenVariant];
            if (category.sampleCount > 0 && category.sampleCount < category.items.length) {
                category.items = random.shuffled(category.items).slice(0, category.sampleCount);
            }
        }
    }
}
