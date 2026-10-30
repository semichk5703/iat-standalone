// iat_random.js — seedable random source, so a session can be reproduced (parallel to srand/rand in C).
// Mulberry32: small and adequate for shuffling; not cryptographic (nothing here needs that).

export class Random {
    constructor(seed = Date.now() >>> 0) {
        this.state = seed >>> 0;
    }
    next() {
        this.state = (this.state + 0x6D2B79F5) >>> 0;
        let t = this.state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    below(count) {
        return Math.floor(this.next() * count);
    }
    shuffled(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = this.below(i + 1);
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
}
