// iat_scoring.js — the D measure (parallel to src/iat_scoring.h; see PROTOCOL for provenance).
// As implicit.harvard.edu computes it: iat11.js settings, minno-tasks scorer/nogaScorer.js — two parcels
// (blocks 3+6, 4+7), trials 400 ms..10 s, error trials at measured latency, per-parcel
// (mean reversed - mean first) / sample SD, D = mean of the two parcels (Greenwald et al. 2003, Table 4).

// Name of these scoring rules, written beside every displayed result (as SCORING_VERSION in C).
export const SCORING_VERSION = 'iat11';

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

/** Feedback outcome in scorer/feedbacker.js order: [name for results files, iat11.js message or null]. */
function feedbackOutcome(scoredTrialCount, fastFraction, errorFraction) {
    if (scoredTrialCount < SCORING_MIN_SCORED_TRIALS) return ['not_enough_trials', 'There were not enough trials to determine a result.'];
    if (fastFraction > SCORING_FAST_FRACTION_LIMIT) return ['too_fast', 'There were too many fast trials to determine a result.'];
    if (errorFraction > SCORING_ERROR_FRACTION_LIMIT) return ['too_many_errors', 'There were too many errors made to determine a result.'];
    return ['shown', null];
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

    const [feedbackName, feedbackMessage] = feedbackOutcome(scoredTrialCount, fastFraction, errorFraction);
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
        feedbackName,
        feedbackMessage,
    };
}

/** Which of Project Implicit's result sentences a D selects (parallel to scoring_feedback_band in C):
 *  iat11.js messageDef cuts -0.65 / -0.35 / -0.15 / 0.15 / 0.35 / 0.65, the first cut D is at or below
 *  choosing (scorer/feedbacker.js).  speed: 'much' / 'moderately' / 'slightly', or null for about equal;
 *  reversed: the faster pairing was target_b with attr_a.  Not part of the D measure, not in the 2003 paper. */
export function scoringFeedbackBand(d) {
    if (d <= -0.65) return { speed: 'much', reversed: true };
    if (d <= -0.35) return { speed: 'moderately', reversed: true };
    if (d <= -0.15) return { speed: 'slightly', reversed: true };
    if (d <= 0.15) return { speed: null, reversed: false };
    if (d <= 0.35) return { speed: 'slightly', reversed: false };
    if (d <= 0.65) return { speed: 'moderately', reversed: false };
    return { speed: 'much', reversed: false };
}
