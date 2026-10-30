// iat_scoring.js — the D measure (parallel to src/iat_scoring.h; see PROTOCOL for provenance).
// D = (mean latency, reversed pairing - mean latency, first pairing) / pooled sample SD over the four
// combined blocks, trials with 400 ms <= latency <= 10 s, error trials kept at measured latency.

export const SCORING_MIN_LATENCY_MS = 400;
export const SCORING_MAX_LATENCY_MS = 10000;
export const SCORING_FAST_MS = 150;
export const SCORING_FAST_FRACTION_LIMIT = 0.10;

/** Which 0-based blocks hold each pairing, given the pairing order (1 or 2). */
export function scoringBlocks(pairingOrder) {
    return pairingOrder === 2
        ? { firstPractice: 5, firstTest: 6, reversedPractice: 2, reversedTest: 3 }
        : { firstPractice: 2, firstTest: 3, reversedPractice: 5, reversedTest: 6 };
}

function latenciesIn(trials, blocks) {
    return trials
        .filter(t => blocks.includes(t.blockIndex) && t.latencyMs >= SCORING_MIN_LATENCY_MS && t.latencyMs <= SCORING_MAX_LATENCY_MS)
        .map(t => t.latencyMs);
}

function mean(values) {
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function sampleSd(values) {           // n - 1, as nogaScorer.js calcSD
    if (values.length < 2) return 0;
    const m = mean(values);
    return Math.sqrt(values.reduce((a, v) => a + (v - m) ** 2, 0) / (values.length - 1));
}

function dFor(trials, firstBlocks, reversedBlocks) {
    const first = latenciesIn(trials, firstBlocks);
    const reversed = latenciesIn(trials, reversedBlocks);
    const sd = sampleSd(first.concat(reversed));
    return sd ? (mean(reversed) - mean(first)) / sd : 0;
}

/** trials: [{blockIndex, latencyMs, ...}]. Returns the same fields as the C score_t. */
export function scoringCompute(trials, pairingOrder) {
    const b = scoringBlocks(pairingOrder);
    const dPractice = dFor(trials, [b.firstPractice], [b.reversedPractice]);
    const dTest = dFor(trials, [b.firstTest], [b.reversedTest]);
    return {
        d: dFor(trials, [b.firstPractice, b.firstTest], [b.reversedPractice, b.reversedTest]),
        d2003: (dPractice + dTest) / 2,
        dPractice,
        dTest,
        meanFirstMs: mean(latenciesIn(trials, [b.firstPractice, b.firstTest])),
        meanReversedMs: mean(latenciesIn(trials, [b.reversedPractice, b.reversedTest])),
        fastFraction: trials.length ? trials.filter(t => t.latencyMs <= SCORING_FAST_MS).length / trials.length : 0,
    };
}

/** Project Implicit's feedback bands for |D| (iat10.js messageDef cuts 0.15 / 0.35 / 0.65); not in the 2003 paper. */
export function scoringStrengthLabel(d) {
    const magnitude = Math.abs(d);
    if (magnitude < 0.15) return 'little or no';
    if (magnitude < 0.35) return 'slight';
    if (magnitude < 0.65) return 'moderate';
    return 'strong';
}
