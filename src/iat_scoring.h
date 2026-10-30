/* iat_scoring.h — the D measure of Greenwald, Nosek & Banaji (2003), as Project Implicit computes it.
 *
 * D = (mean latency, reversed pairing - mean latency, first pairing) / pooled sample SD, over the four
 * combined blocks (3, 4, 6, 7), keeping trials with 400 ms <= latency <= 10 s and keeping error trials
 * at their measured latency (the "built-in penalty" variant).  Positive D: faster when target_a shares
 * a key with attr_a.  nogaScorer.js in minno-tasks is the reference; test/rescore_project_implicit.py
 * re-implements it independently and must agree.  The paper's two-parcel variant is computed too.
 */
#ifndef IAT_SCORING_H
#define IAT_SCORING_H

#include <math.h>

#include "iat_procedure.h"

typedef struct {
    double d;                  /* Project Implicit's single-parcel D: the primary result */
    double d_2003;             /* Greenwald et al. 2003: practice and test parcels scored separately, averaged */
    double d_practice;         /*   its two parcels */
    double d_test;
    double mean_first_ms;      /* mean latency in the blocks where target_a pairs with attr_a */
    double mean_reversed_ms;
    double fast_fraction;      /* share of all trials under SCORING_FAST_MS; > 0.1 makes the result unreliable */
} score_t;

/* Trial filters (nogaScorer.js minRT/maxRT/fastRT; the 2003 paper deletes only > 10 s and flags 300 ms). */
#define SCORING_MIN_LATENCY_MS 400
#define SCORING_MAX_LATENCY_MS 10000
#define SCORING_FAST_MS 150
#define SCORING_FAST_FRACTION_LIMIT 0.10

static score_t scoring_compute(const procedure_result_t *result);

/* Project Implicit's feedback bands for |D|: "little or no" / "slight" / "moderate" / "strong".
   Not part of the D measure and not in Greenwald et al. (2003): they are the cut-offs in
   minno-tasks IAT/qualtrics/quiat9.js, messageDef (cut 0.15 / 0.35 / 0.65), the same ones the
   implicit.harvard.edu results page describes in prose ("slightly / moderately / strongly faster"). */
static const char *scoring_strength_label(double d);

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

static score_t scoring_compute(const procedure_result_t *result)
{
    scoring_blocks_t blocks = scoring_blocks(result->pairing_order);
    score_t score;
    int fast = 0;
    int i;

    score.d = scoring_d_for(result, blocks.first_practice, blocks.first_test,
                            blocks.reversed_practice, blocks.reversed_test);
    score.d_practice = scoring_d_for(result, blocks.first_practice, blocks.first_practice,
                                     blocks.reversed_practice, blocks.reversed_practice);
    score.d_test = scoring_d_for(result, blocks.first_test, blocks.first_test,
                                 blocks.reversed_test, blocks.reversed_test);
    score.d_2003 = (score.d_practice + score.d_test) / 2;
    score.mean_first_ms = scoring_mean(result, blocks.first_practice, blocks.first_test);
    score.mean_reversed_ms = scoring_mean(result, blocks.reversed_practice, blocks.reversed_test);

    for (i = 0; i < result->trial_count; i++) {
        if (result->trials[i].latency_ms < SCORING_FAST_MS) {
            fast++;
        }
    }
    score.fast_fraction = result->trial_count ? (double)fast / result->trial_count : 0;
    return score;
}

static const char *scoring_strength_label(double d)
{
    double magnitude = fabs(d);          /* quiat9.js messageDef cuts: -0.65 -0.35 -0.15 0.15 0.35 0.65 */
    if (magnitude < 0.15) return "little or no";
    if (magnitude < 0.35) return "slight";
    if (magnitude < 0.65) return "moderate";
    return "strong";
}

#endif
