/* iat_scoring.h — the D measure, as implicit.harvard.edu computes it.
 *
 * Greenwald, Nosek & Banaji (2003) Table 4 (p. 213), the "improved algorithm", with the settings of
 * minno-tasks IAT/iat11.js (the task the live Race IAT loads) scored by minno-tasks scorer/nogaScorer.js:
 *   - two parcels: practice (blocks 3 and 6) and test (blocks 4 and 7);
 *   - keep trials with 400 ms <= latency <= 10,000 ms (iat11 minRT / maxRT; Table 4 steps 2 and 4);
 *   - error trials keep their measured latency, which includes the correction ("built-in penalty",
 *     2003 p. 206; iat11 errorScoring 'latency');
 *   - per parcel, D = (mean reversed - mean first pairing) / sample SD (n - 1) of both pairings' trials;
 *   - D = mean of the two parcels' D.
 * Positive D: faster when target_a shares a key with attr_a.
 * test/rescore_project_implicit.py (nogaScorer.js) and test/rescore_greenwald_2003.py (Table 4)
 * re-implement it independently and must agree.
 */
#ifndef IAT_SCORING_H
#define IAT_SCORING_H

#include <math.h>

#include "iat_procedure.h"

/* Whether a result may be shown, as iat11.js / scorer/feedbacker.js decide (checked in this order). */
typedef enum {
    FEEDBACK_SHOWN = 0,
    FEEDBACK_NOT_ENOUGH_TRIALS,   /* fewer than SCORING_MIN_SCORED_TRIALS scored trials */
    FEEDBACK_TOO_FAST,            /* more than SCORING_FAST_FRACTION_LIMIT of trials under SCORING_FAST_MS */
    FEEDBACK_TOO_MANY_ERRORS      /* more than SCORING_ERROR_FRACTION_LIMIT of trials had an error */
} feedback_t;

typedef struct {
    double d;                  /* the result: mean of the practice and test parcels' D */
    double d_practice;         /* blocks 3 and 6 */
    double d_test;             /* blocks 4 and 7 */
    double d_single_parcel;    /* all four blocks as one parcel: the older iat10.js scoring, kept for comparison */
    double mean_first_ms;      /* mean latency in the blocks where target_a pairs with attr_a */
    double mean_reversed_ms;
    int scored_trial_count;
    double fast_fraction;      /* of combined-block trials (<= 10 s), the share under SCORING_FAST_MS */
    double error_fraction;     /* of the same trials, the share answered wrongly at least once */
    feedback_t feedback;
} score_t;

/* Name of these scoring rules, written beside every displayed result so a results file says which rules
   produced the number it shows.  Change it whenever the scoring changes. */
#define SCORING_VERSION "iat11"

/* iat11.js settings. */
#define SCORING_MIN_LATENCY_MS 400            /* minRT */
#define SCORING_MAX_LATENCY_MS 10000          /* maxRT */
#define SCORING_FAST_MS 300                   /* fastRT; Table 4 step 2 uses the same 300 ms */
#define SCORING_FAST_FRACTION_LIMIT 0.10      /* maxFastTrialsRateFB */
#define SCORING_ERROR_FRACTION_LIMIT 0.40     /* maxErrorRateFB */
#define SCORING_MIN_SCORED_TRIALS 4           /* minTotalScoredTrialsFB */

static score_t scoring_compute(const procedure_result_t *result);

/* Which of Project Implicit's result sentences a D selects.  Not part of the D measure and not in
   Greenwald et al. (2003): iat11.js messageDef cuts -0.65 / -0.35 / -0.15 / 0.15 / 0.35 / 0.65, the first
   cut D is at or below choosing (scorer/feedbacker.js), and its fb_* sentences "You were much /
   moderately / slightly faster at sorting ..." or "about equally fast".  The archived
   implicit.harvard.edu/implicit/demo/background/raceinfo.html describes the same bands. */
typedef struct {
    const char *speed;         /* "much", "moderately", "slightly", or NULL for "about equally fast" */
    int reversed;              /* 1: the faster pairing was target_b with attr_a (D below zero) */
} feedback_band_t;

static feedback_band_t scoring_feedback_band(double d);

/* iat11.js's message when feedback is withheld, or NULL when it is shown. */
static const char *scoring_feedback_message(feedback_t feedback);

/* Short name of a feedback outcome for results files: shown / not_enough_trials / too_fast / too_many_errors. */
static const char *scoring_feedback_name(feedback_t feedback);

/* ---------------------------------------------------------------------------------------------- */

/* Which 0-based blocks hold each pairing, given the pairing order. */
typedef struct {
    int first_practice, first_test;        /* target_a + attr_a share a key */
    int reversed_practice, reversed_test;
} scoring_blocks_t;

static scoring_blocks_t scoring_blocks(int pairing_order)
{
    scoring_blocks_t blocks = { 2, 3, 5, 6 };
    if (pairing_order == 2) {
        scoring_blocks_t swapped = { 5, 6, 2, 3 };
        blocks = swapped;
    }
    return blocks;
}

static int scoring_trial_counts(const trial_t *trial, int block_a, int block_b)
{
    return (trial->block_index == block_a || trial->block_index == block_b)
        && trial->latency_ms >= SCORING_MIN_LATENCY_MS && trial->latency_ms <= SCORING_MAX_LATENCY_MS;
}

static double scoring_mean(const procedure_result_t *result, int block_a, int block_b)
{
    double sum = 0;
    int count = 0;
    int i;
    for (i = 0; i < result->trial_count; i++) {
        if (scoring_trial_counts(&result->trials[i], block_a, block_b)) {
            sum += result->trials[i].latency_ms;
            count++;
        }
    }
    return count ? sum / count : 0;
}

/* Sample SD (n - 1) over the trials of two pairings: first blocks (a, b) and reversed blocks (c, d). */
static double scoring_pooled_sd(const procedure_result_t *result, int block_a, int block_b, int block_c, int block_d)
{
    double sum = 0, sum_of_squares = 0, mean;
    int count = 0;
    int i;
    for (i = 0; i < result->trial_count; i++) {
        const trial_t *trial = &result->trials[i];
        if (scoring_trial_counts(trial, block_a, block_b) || scoring_trial_counts(trial, block_c, block_d)) {
            sum += trial->latency_ms;
            sum_of_squares += trial->latency_ms * trial->latency_ms;
            count++;
        }
    }
    if (count < 2) {
        return 0;
    }
    mean = sum / count;
    return sqrt((sum_of_squares - count * mean * mean) / (count - 1));
}

static double scoring_d_for(const procedure_result_t *result, int first_a, int first_b, int reversed_a, int reversed_b)
{
    double sd = scoring_pooled_sd(result, first_a, first_b, reversed_a, reversed_b);
    if (sd == 0) {
        return 0;
    }
    return (scoring_mean(result, reversed_a, reversed_b) - scoring_mean(result, first_a, first_b)) / sd;
}

/* Fast and error shares over the combined blocks, counted as nogaScorer.js does: the denominator is
   trials up to 10 s; a fast trial is under 300 ms; an error trial had at least one wrong key. */
static void scoring_count_quality(score_t *score, const procedure_result_t *result, scoring_blocks_t blocks)
{
    int total = 0, fast = 0, errors = 0, scored = 0;
    int i;
    for (i = 0; i < result->trial_count; i++) {
        const trial_t *trial = &result->trials[i];
        int combined = trial->block_index == blocks.first_practice || trial->block_index == blocks.first_test
                    || trial->block_index == blocks.reversed_practice || trial->block_index == blocks.reversed_test;
        if (!combined) {
            continue;
        }
        if (trial->latency_ms < SCORING_FAST_MS) {
            fast++;
        }
        if (trial->latency_ms > SCORING_MAX_LATENCY_MS) {
            continue;
        }
        total++;
        if (trial->error_count > 0) {
            errors++;
        }
        if (trial->latency_ms >= SCORING_MIN_LATENCY_MS) {
            scored++;
        }
    }
    score->scored_trial_count = scored;
    score->fast_fraction = total ? (double)fast / total : 0;
    score->error_fraction = total ? (double)errors / total : 0;
}

static score_t scoring_compute(const procedure_result_t *result)
{
    scoring_blocks_t blocks = scoring_blocks(result->pairing_order);
    score_t score;

    score.d_practice = scoring_d_for(result, blocks.first_practice, blocks.first_practice,
                                     blocks.reversed_practice, blocks.reversed_practice);
    score.d_test = scoring_d_for(result, blocks.first_test, blocks.first_test,
                                 blocks.reversed_test, blocks.reversed_test);
    score.d = (score.d_practice + score.d_test) / 2;
    score.d_single_parcel = scoring_d_for(result, blocks.first_practice, blocks.first_test,
                                          blocks.reversed_practice, blocks.reversed_test);
    score.mean_first_ms = scoring_mean(result, blocks.first_practice, blocks.first_test);
    score.mean_reversed_ms = scoring_mean(result, blocks.reversed_practice, blocks.reversed_test);

    scoring_count_quality(&score, result, blocks);
    if (score.scored_trial_count < SCORING_MIN_SCORED_TRIALS) {
        score.feedback = FEEDBACK_NOT_ENOUGH_TRIALS;
    } else if (score.fast_fraction > SCORING_FAST_FRACTION_LIMIT) {
        score.feedback = FEEDBACK_TOO_FAST;
    } else if (score.error_fraction > SCORING_ERROR_FRACTION_LIMIT) {
        score.feedback = FEEDBACK_TOO_MANY_ERRORS;
    } else {
        score.feedback = FEEDBACK_SHOWN;
    }
    return score;
}

static feedback_band_t scoring_feedback_band(double d)
{
    feedback_band_t band = { NULL, 0 };
    if (d <= -0.65)     { band.speed = "much";       band.reversed = 1; }
    else if (d <= -0.35) { band.speed = "moderately"; band.reversed = 1; }
    else if (d <= -0.15) { band.speed = "slightly";   band.reversed = 1; }
    else if (d <= 0.15)  { band.speed = NULL; }
    else if (d <= 0.35)  { band.speed = "slightly"; }
    else if (d <= 0.65)  { band.speed = "moderately"; }
    else                 { band.speed = "much"; }
    return band;
}

static const char *scoring_feedback_message(feedback_t feedback)
{
    switch (feedback) {
    case FEEDBACK_NOT_ENOUGH_TRIALS: return "There were not enough trials to determine a result.";
    case FEEDBACK_TOO_FAST:          return "There were too many fast trials to determine a result.";
    case FEEDBACK_TOO_MANY_ERRORS:   return "There were too many errors made to determine a result.";
    default:                         return NULL;
    }
}

static const char *scoring_feedback_name(feedback_t feedback)
{
    switch (feedback) {
    case FEEDBACK_NOT_ENOUGH_TRIALS: return "not_enough_trials";
    case FEEDBACK_TOO_FAST:          return "too_fast";
    case FEEDBACK_TOO_MANY_ERRORS:   return "too_many_errors";
    default:                         return "shown";
    }
}

#endif
