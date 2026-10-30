// iat_scoring.js — the D measure (parallel to src/iat_scoring.h; see PROTOCOL for provenance).
// As implicit.harvard.edu computes it: iat11.js settings, minno-tasks scorer/nogaScorer.js — two parcels
// (blocks 3+6, 4+7), trials 400 ms..10 s, error trials at measured latency, per-parcel
// (mean reversed - mean first) / sample SD, D = mean of the two parcels (Greenwald et al. 2003, Table 4).

export const SCORING_MIN_LATENCY_MS = 400;          // iat11 minRT
export const SCORING_MAX_LATENCY_MS = 10000;        // iat11 maxRT
export const SCORING_FAST_MS = 300;                 // iat11 fastRT
export const SCORING_FAST_FRACTION_LIMIT = 0.10;    // iat11 maxFastTrialsRateFB
export const SCORING_ERROR_FRACTION_LIMIT = 0.40;   // iat11 maxErrorRateFB
export const SCORING_MIN_SCORED_TRIALS = 4;         // iat11 minTotalScoredTrialsFB

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

/** iat11.js's message when feedback is withheld (scorer/feedbacker.js order), or null. */
function feedbackMessage(scoredTrialCount, fastFraction, errorFraction) {
    if (scoredTrialCount < SCORING_MIN_SCORED_TRIALS) return 'There were not enough trials to determine a result.';
    if (fastFraction > SCORING_FAST_FRACTION_LIMIT) return 'There were too many fast trials to determine a result.';
    if (errorFraction > SCORING_ERROR_FRACTION_LIMIT) return 'There were too many errors made to determine a result.';
    return null;
}

/** trials: [{blockIndex, latencyMs, errorCount, ...}]. Returns the same fields as the C score_t. */
export function scoringCompute(trials, pairingOrder) {
    const b = scoringBlocks(pairingOrder);
    const combined = [b.firstPractice, b.firstTest, b.reversedPractice, b.reversedTest];
    const dPractice = dFor(trials, [b.firstPractice], [b.reversedPractice]);
    const dTest = dFor(trials, [b.firstTest], [b.reversedTest]);

    // quality counts as nogaScorer.js: denominator is combined-block trials up to 10 s
    const inCombined = trials.filter(t => combined.includes(t.blockIndex));
    const upToMax = inCombined.filter(t => t.latencyMs <= SCORING_MAX_LATENCY_MS);
    const fastFraction = upToMax.length ? inCombined.filter(t => t.latencyMs < SCORING_FAST_MS).length / upToMax.length : 0;
    const errorFraction = upToMax.length ? upToMax.filter(t => t.errorCount > 0).length / upToMax.length : 0;
    const scoredTrialCount = upToMax.filter(t => t.latencyMs >= SCORING_MIN_LATENCY_MS).length;

    return {
        d: (dPractice + dTest) / 2,
        dPractice,
        dTest,
        dSingleParcel: dFor(trials, [b.firstPractice, b.firstTest], [b.reversedPractice, b.reversedTest]),
        meanFirstMs: mean(latenciesIn(trials, [b.firstPractice, b.firstTest])),
        meanReversedMs: mean(latenciesIn(trials, [b.reversedPractice, b.reversedTest])),
        scoredTrialCount,
        fastFraction,
        errorFraction,
        feedbackMessage: feedbackMessage(scoredTrialCount, fastFraction, errorFraction),
    };
}

/** Project Implicit's feedback bands for |D| (iat11.js messageDef cuts 0.15 / 0.35 / 0.65); not in the 2003 paper. */
export function scoringStrengthLabel(d) {
    const magnitude = Math.abs(d);
    if (magnitude < 0.15) return 'little or no';
    if (magnitude < 0.35) return 'slight';
    if (magnitude < 0.65) return 'moderate';
    return 'strong';
}
