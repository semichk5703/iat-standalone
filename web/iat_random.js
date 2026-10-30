// iat_random.js — where every random choice in a session comes from (parallel to src/iat_random.h).
// By default every draw asks the browser's cryptographic generator (crypto.getRandomValues), so no
// choice the participant sees comes from a formula they could become attuned to.  A seed (&seed=N)
// switches to a seeded generator so a session or an automated test can be replayed exactly; that is
// the only reason a formula exists here at all.

export class Random {
    /** @param seed  undefined: every draw from crypto.getRandomValues; a number: seeded replay */
    constructor(seed) {
        this.seeded = seed !== undefined && !Number.isNaN(seed);
        this.seededState = this.seeded ? seed >>> 0 : 0;
    }

    /** Mulberry32 (public domain): identical to random_seeded_u32 in C, so the same seed draws the
     *  same numbers in both.  Statistically adequate for shuffling, not cryptographic. */
    seededU32() {
        this.seededState = (this.seededState + 0x6D2B79F5) >>> 0;
        let t = this.seededState;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return (t ^ (t >>> 14)) >>> 0;
    }

    nextU32() {
        return this.seeded ? this.seededU32() : crypto.getRandomValues(new Uint32Array(1))[0];
    }

    /** Uniform integer in [0, count). Rejection sampling, as in C, so no outcome is favoured. */
    below(count) {
        const limit = 4294967295 - (4294967295 % count);
        let value;
        do { value = this.nextU32(); } while (value >= limit);
        return value % count;
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
