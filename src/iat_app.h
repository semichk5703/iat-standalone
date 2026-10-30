/* iat_app.h — command line, session flow, and result output.  A frontend's main() calls iat_app_main.
 *
 *   iat STIMULI_FILE [--order 1|2] [--out results.csv] [--seed N]
 *     --order   which pairing comes first (default: random, as Project Implicit)
 *     --out     raw trials as CSV, with the scores on a trailing '#' line (default results.csv)
 *     --seed    fix the shuffle (default: time)
 */
#ifndef IAT_APP_H
#define IAT_APP_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "iat_frontend.h"
#include "iat_procedure.h"
#include "iat_scoring.h"
#include "iat_stimuli.h"

static int iat_app_main(int argc, char **argv);

/* ---------------------------------------------------------------------------------------------- */

typedef struct {
    const char *stimuli_path;
    const char *output_path;
    int pairing_order;         /* 0 = choose at random */
    unsigned seed;
} app_options_t;

static int app_parse_options(app_options_t *options, int argc, char **argv)
{
    int i;
    options->stimuli_path = NULL;
    options->output_path = "results.csv";
    options->pairing_order = 0;
    options->seed = (unsigned)time(NULL);
    for (i = 1; i < argc; i++) {
        if (!strcmp(argv[i], "--order") && i + 1 < argc) {
            options->pairing_order = atoi(argv[++i]);
        } else if (!strcmp(argv[i], "--out") && i + 1 < argc) {
            options->output_path = argv[++i];
        } else if (!strcmp(argv[i], "--seed") && i + 1 < argc) {
            options->seed = (unsigned)atoi(argv[++i]);
        } else {
            options->stimuli_path = argv[i];
        }
    }
    if (!options->stimuli_path) {
        fprintf(stderr, "usage: %s STIMULI_FILE [--order 1|2] [--out results.csv] [--seed N]\n", argv[0]);
        return 0;
    }
    return 1;
}

/* The opening screen implicit.harvard.edu shows first ("You have selected the Race Task. In this study
   you will complete an Implicit Association Test (IAT)..."), minus the questionnaire it introduces there,
   since this program runs the IAT alone.  Without it the next screen's "Next, you will..." has nothing
   to follow. */
static void app_show_introduction(const stimulus_set_t *set)
{
    const char *lines[] = {
        "Implicit Association Test",
        "",
        set->has_pictures
            ? "In this study you will complete an Implicit Association Test (IAT) in which you will be asked to sort pictures and words into groups as fast as you can."
            : "In this study you will complete an Implicit Association Test (IAT) in which you will be asked to sort words into groups as fast as you can.",
        "This should take about 5 minutes to complete. At the end, you will receive your IAT result.",
        "",
        "Press the space bar to continue.",
    };
    frontend_show_message(lines, 6);
}

/* The welcome screen implicit.harvard.edu shows before the IAT (transcribed from the live Race task,
   2026-10): the four groups and their items, then "There are seven parts...". */
static void app_show_welcome(const stimulus_set_t *set)
{
    static char group_lines[CATEGORY_COUNT][4 * STIMULI_MAX_TEXT];
    const char *lines[CATEGORY_COUNT + 6];
    int line_count = 0;
    int c, i;

    lines[line_count++] = "Next, you will use the 'E' and 'I' computer keys to categorize items into groups";
    lines[line_count++] = "as fast as you can. These are the four groups and the items that belong to each:";
    lines[line_count++] = "";
    for (c = 0; c < CATEGORY_COUNT; c++) {
        const category_t *category = &set->categories[c];
        char *line = group_lines[c];
        int used = snprintf(line, sizeof group_lines[c], "%s:  ", category->name);
        if (category->items[0].is_picture) {
            snprintf(line + used, sizeof group_lines[c] - used, "[pictures]");
        } else {
            for (i = 0; i < category->item_count && used < (int)sizeof group_lines[c] - 1; i++) {
                used += snprintf(line + used, sizeof group_lines[c] - used, "%s%s", i ? ", " : "", category->items[i].text);
            }
        }
        lines[line_count++] = line;
    }
    lines[line_count++] = "";
    lines[line_count++] = "There are seven parts. The instructions change for each part. Pay attention!";
    lines[line_count++] = "Press the space bar to continue.";
    frontend_show_message(lines, line_count);
}

static void app_write_csv(FILE *out, const stimulus_set_t *set, const procedure_result_t *result, const score_t *score)
{
    int i;
    fprintf(out, "block,category,item,correct_key,errors,rt_ms\n");
    for (i = 0; i < result->trial_count; i++) {
        const trial_t *trial = &result->trials[i];
        const category_t *category = &set->categories[trial->category];
        fprintf(out, "%d,%s,%s,%c,%d,%.1f\n", trial->block_index + 1, category->name,
                stimulus_item_label(&category->items[trial->item_index]), trial->correct_key,
                trial->error_count, trial->latency_ms);
    }
    fprintf(out, "# D=%.4f D_2003=%.4f d_practice=%.4f d_test=%.4f order=%d\n",
            score->d, score->d_2003, score->d_practice, score->d_test, result->pairing_order);
}

static void app_print_score(const stimulus_set_t *set, const procedure_result_t *result, const score_t *score)
{
    const category_t *c = set->categories;
    printf("\nD-score = %+.3f   (Greenwald-2003 two-parcel D = %+.3f: practice %+.3f, test %+.3f)\n",
           score->d, score->d_2003, score->d_practice, score->d_test);
    printf("%s association of %s+%s / %s+%s %s\n", scoring_strength_label(score->d),
           c[CATEGORY_TARGET_A].name, c[CATEGORY_ATTRIBUTE_A].name,
           c[CATEGORY_TARGET_B].name, c[CATEGORY_ATTRIBUTE_B].name,
           score->d > 0 ? "(faster with this pairing)" : score->d < 0 ? "(faster with the reverse pairing)" : "");
    printf("Mean latency ms: %s+%s blocks %.0f | reversed blocks %.0f | pairing order %d\n",
           c[CATEGORY_TARGET_A].name, c[CATEGORY_ATTRIBUTE_A].name,
           score->mean_first_ms, score->mean_reversed_ms, result->pairing_order);
    if (score->fast_fraction > SCORING_FAST_FRACTION_LIMIT) {
        printf("WARNING: %.0f%% of responses < %d ms - too fast, result unreliable.\n",
               100 * score->fast_fraction, SCORING_FAST_MS);
    }
}

static int iat_app_main(int argc, char **argv)
{
    app_options_t options;
    static stimulus_set_t set;
    static procedure_result_t result;
    score_t score;
    FILE *out;

    if (!app_parse_options(&options, argc, argv)) {
        return 1;
    }
    if (getenv("IAT_TIMESCALE")) {
        procedure_time_scale = atof(getenv("IAT_TIMESCALE"));
    }
    stimuli_load(&set, options.stimuli_path);
    srand(options.seed);
    stimuli_randomize_session(&set);
    if (options.pairing_order != 1 && options.pairing_order != 2) {
        options.pairing_order = 1 + procedure_random_below(2);
    }

    frontend_open(&set);
    app_show_introduction(&set);
    if (!procedure_wait_for_continue()) {
        frontend_close();
        puts("aborted");
        return 1;
    }
    app_show_welcome(&set);
    if (!procedure_wait_for_continue() || !procedure_run(&result, &set, options.pairing_order)) {
        frontend_close();
        puts("aborted");
        return 1;
    }
    frontend_close();

    score = scoring_compute(&result);
    app_print_score(&set, &result, &score);
    out = fopen(options.output_path, "w");
    if (out) {
        app_write_csv(out, &set, &result, &score);
        fclose(out);
        printf("raw trials written to %s\n", options.output_path);
    }
    return 0;
}

#endif
