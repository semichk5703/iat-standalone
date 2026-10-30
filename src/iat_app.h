/* iat_app.h — command line, session flow, and result output.  A frontend's main() calls iat_app_main.
 *
 *   iat STIMULI_FILE [--order 1|2] [--out results.csv] [--seed N] [--no-intro]
 *     --order   which pairing comes first (default: random, as Project Implicit)
 *     --out     raw trials as CSV, with the scores on a trailing '#' line (default results.csv)
 *     --seed    replay: draw every choice from a generator seeded with N, so the same N repeats the
 *               same session (default: every choice comes from the operating system, getrandom)
 *     --no-intro  skip the opening screen (it is transcribed from the live site, not from minno-tasks)
 */
#ifndef IAT_APP_H
#define IAT_APP_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "iat_frontend.h"
#include "iat_procedure.h"
#include "iat_random.h"
#include "iat_scoring.h"
#include "iat_stimuli.h"

static int iat_app_main(int argc, char **argv);

/* ---------------------------------------------------------------------------------------------- */

typedef struct {
    const char *stimuli_path;
    const char *output_path;
    int pairing_order;         /* 0 = choose at random */
    int show_introduction;
    int has_seed;              /* 0: every choice from getrandom(); 1: seeded replay */
    uint32_t seed;
} app_options_t;

static int app_parse_options(app_options_t *options, int argc, char **argv)
{
    int i;
    options->stimuli_path = NULL;
    options->output_path = "results.csv";
    options->pairing_order = 0;
    options->has_seed = 0;
    options->seed = 0;
    options->show_introduction = 1;
    for (i = 1; i < argc; i++) {
        if (!strcmp(argv[i], "--order") && i + 1 < argc) {
            options->pairing_order = atoi(argv[++i]);
        } else if (!strcmp(argv[i], "--out") && i + 1 < argc) {
            options->output_path = argv[++i];
        } else if (!strcmp(argv[i], "--no-intro")) {
            options->show_introduction = 0;
        } else if (!strcmp(argv[i], "--seed") && i + 1 < argc) {
            options->has_seed = 1;
            options->seed = (uint32_t)strtoul(argv[++i], NULL, 10);
        } else {
            options->stimuli_path = argv[i];
        }
    }
    if (!options->stimuli_path) {
        fprintf(stderr, "usage: %s STIMULI_FILE [--order 1|2] [--out results.csv] [--seed N] [--no-intro]\n", argv[0]);
        return 0;
    }
    return 1;
}

/* The opening screen implicit.harvard.edu shows first ("You have selected the Race Task. In this study
   you will complete an Implicit Association Test (IAT)..."), minus the questionnaire and duration it
   mentions there, since this program runs the IAT alone.  Not in minno-tasks: transcribed from the live
   site (2026-10).  The next screen opens with "Next," because on the site it follows the questionnaire;
   this screen gives it something to follow.  --no-intro omits it. */
static void app_show_introduction(const stimulus_set_t *set)
{
    const char *lines[] = {
        "Implicit Association Test",
        "",
        set->has_pictures
            ? "In this study you will complete an Implicit Association Test (IAT) in which you will be asked to sort pictures and words into groups as fast as you can."
            : "In this study you will complete an Implicit Association Test (IAT) in which you will be asked to sort words into groups as fast as you can.",
        "At the end, you will receive your IAT result.",
        "",
        "Press the space bar to continue.",
    };
    frontend_show_message(lines, 6);
}

/* The welcome screen implicit.harvard.edu shows before the IAT: minno-tasks
   docs/studies/raceiat/raceiat_instructions.jst ("Next, you will use the 'E' and 'I' computer keys to
   categorize items into groups..."), its table of groups and items flattened to one line per group. */
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
    fprintf(out, "# D=%.4f d_practice=%.4f d_test=%.4f D_single_parcel=%.4f fast=%.4f errors=%.4f order=%d\n",
            score->d, score->d_practice, score->d_test, score->d_single_parcel,
            score->fast_fraction, score->error_fraction, result->pairing_order);
}

static void app_print_score(const stimulus_set_t *set, const procedure_result_t *result, const score_t *score)
{
    const category_t *c = set->categories;
    const char *withheld = scoring_feedback_message(score->feedback);
    printf("\nD-score = %+.3f   (practice %+.3f, test %+.3f; single-parcel %+.3f)\n",
           score->d, score->d_practice, score->d_test, score->d_single_parcel);
    if (withheld) {
        /* implicit.harvard.edu shows only this message; the numbers above stay in the CSV for analysis */
        printf("%s\n", withheld);
        return;
    }
    printf("%s association of %s+%s / %s+%s %s\n", scoring_strength_label(score->d),
           c[CATEGORY_TARGET_A].name, c[CATEGORY_ATTRIBUTE_A].name,
           c[CATEGORY_TARGET_B].name, c[CATEGORY_ATTRIBUTE_B].name,
           score->d > 0 ? "(faster with this pairing)" : score->d < 0 ? "(faster with the reverse pairing)" : "");
    printf("Mean latency ms: %s+%s blocks %.0f | reversed blocks %.0f | pairing order %d\n",
           c[CATEGORY_TARGET_A].name, c[CATEGORY_ATTRIBUTE_A].name,
           score->mean_first_ms, score->mean_reversed_ms, result->pairing_order);
}

static int iat_app_main(int argc, char **argv)
{
    app_options_t options;
    static stimulus_set_t set;
    static procedure_result_t result;
    random_t random;
    score_t score;
    FILE *out;

    if (!app_parse_options(&options, argc, argv)) {
        return 1;
    }
    if (getenv("IAT_TIMESCALE")) {
        procedure_time_scale = atof(getenv("IAT_TIMESCALE"));
    }
    stimuli_load(&set, options.stimuli_path);
    if (options.has_seed) {
        random_init_seeded(&random, options.seed);
    } else {
        random_init_operating_system(&random);
    }
    stimuli_randomize_session(&set, &random);
    if (options.pairing_order != 1 && options.pairing_order != 2) {
        options.pairing_order = 1 + random_below(&random, 2);
    }

    frontend_open(&set);
    if (options.show_introduction) {
        app_show_introduction(&set);
        if (!procedure_wait_for_continue()) {
            frontend_close();
            puts("aborted");
            return 1;
        }
    }
    app_show_welcome(&set);
    if (!procedure_wait_for_continue() || !procedure_run(&result, &set, options.pairing_order, &random)) {
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
