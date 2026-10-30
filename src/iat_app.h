/* iat_app.h — command line, session flow, and result output.  A frontend's main() calls iat_app_main.
 *
 *   iat STIMULI_FILE [--order 1|2] [--out results.csv] [--seed N] [--no-intro]
 *     --order   which pairing comes first (default: random, as Project Implicit)
 *     --out     results file (default results.csv): raw trials and session facts; see app_write_csv
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
   this screen gives it something to follow.  --no-intro omits it.  The last line is this program's:
   the site continues with a button. */
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

/* The overview implicit.harvard.edu shows before the IAT: minno-tasks
   docs/studies/raceiat/raceiat_instructions.jst, word for word, with its rows in its order (Good, Bad,
   then the two target groups: attribute2, attribute1, category1, category2).  Its keyboard wording; the
   web page uses the touch wording on touch screens.  The continue prompt is this program's: the source
   has a Start button. */
static void app_show_welcome(const stimulus_set_t *set)
{
    overview_t overview = {
        "IAT Instructions",
        "Next, you will use the 'E' and 'I' computer keys to categorize items into groups as fast as you can. "
        "These are the four groups and the items that belong to each:",
        { CATEGORY_ATTRIBUTE_B, CATEGORY_ATTRIBUTE_A, CATEGORY_TARGET_A, CATEGORY_TARGET_B },
        "There are seven parts.  The instructions change for each part.  Pay attention!",
        "Press the space bar to start.",
    };
    frontend_show_overview(set, &overview);
}

/* Project Implicit's result sentence (iat11.js fb_* messages, filled as its getFB does). */
static void app_format_result_sentence(char *out, size_t size, const stimulus_set_t *set, double d)
{
    const char *target_a = set->categories[CATEGORY_TARGET_A].name;
    const char *target_b = set->categories[CATEGORY_TARGET_B].name;
    const char *attribute_a = set->categories[CATEGORY_ATTRIBUTE_A].name;
    const char *attribute_b = set->categories[CATEGORY_ATTRIBUTE_B].name;
    feedback_band_t band = scoring_feedback_band(d);
    const char *faster = band.reversed ? target_b : target_a;     /* iat11's categoryA */
    const char *slower = band.reversed ? target_a : target_b;     /* iat11's categoryB */
    if (!band.speed) {
        snprintf(out, size, "You were about equally fast at sorting '%s' with '%s' and '%s' with '%s' "
                 "and at sorting '%s' with '%s' and '%s' with '%s'.",
                 target_a, attribute_a, target_b, attribute_b, target_b, attribute_a, target_a, attribute_b);
        return;
    }
    snprintf(out, size, "You were %s faster at sorting '%s' with '%s' and '%s' with '%s' than '%s' with '%s' and '%s' with '%s'",
             band.speed, faster, attribute_a, slower, attribute_b, slower, attribute_a, faster, attribute_b);
}

/* Results file, format 2: the session's raw data plus the facts needed to score it.  The score itself is
   not data: tools/rescore_csv.py recomputes it from the trials under the current rules.  The last line
   records what this session displayed, labelled with the scoring version that produced it.
       # iat results, format 2
       # stimuli: stimuli/race.txt
       # pairing_order: 1                 which pairing came first; scoring needs it
       # random: os                       or "seed N" for a replayable session
       block,category,item,correct_key,errors,rt_ms
       ...
       # displayed: scoring=iat11 D=... d_practice=... d_test=... ... feedback=shown            */
static void app_write_csv(FILE *out, const app_options_t *options, const stimulus_set_t *set,
                          const procedure_result_t *result, const score_t *score)
{
    int i;
    fprintf(out, "# iat results, format 2\n");
    fprintf(out, "# stimuli: %s\n", options->stimuli_path);
    fprintf(out, "# pairing_order: %d\n", result->pairing_order);
    if (options->has_seed) {
        fprintf(out, "# random: seed %u\n", (unsigned)options->seed);
    } else {
        fprintf(out, "# random: os\n");
    }

    fprintf(out, "block,category,item,correct_key,errors,rt_ms\n");
    for (i = 0; i < result->trial_count; i++) {
        const trial_t *trial = &result->trials[i];
        const category_t *category = &set->categories[trial->category];
        fprintf(out, "%d,%s,%s,%c,%d,%.1f\n", trial->block_index + 1, category->name,
                stimulus_item_label(&category->items[trial->item_index]), trial->correct_key,
                trial->error_count, trial->latency_ms);
    }

    fprintf(out, "# displayed: scoring=%s D=%.4f d_practice=%.4f d_test=%.4f D_single_parcel=%.4f"
                 " fast=%.4f errors=%.4f feedback=%s\n",
            SCORING_VERSION, score->d, score->d_practice, score->d_test, score->d_single_parcel,
            score->fast_fraction, score->error_fraction, scoring_feedback_name(score->feedback));
}

/* The site shows only the result sentence (or the withheld message).  The D line after it is this
   program's, for the person running the session; the same numbers are in the results file. */
static void app_print_score(const stimulus_set_t *set, const procedure_result_t *result, const score_t *score)
{
    const char *withheld = scoring_feedback_message(score->feedback);
    char sentence[10 * STIMULI_MAX_TEXT];   /* eight labels of up to STIMULI_MAX_TEXT, plus the sentence */
    if (withheld) {
        printf("\n%s\n", withheld);
    } else {
        app_format_result_sentence(sentence, sizeof sentence, set, score->d);
        printf("\n%s\n", sentence);
    }
    printf("D-score = %+.3f   (practice %+.3f, test %+.3f; single-parcel %+.3f; pairing order %d)\n",
           score->d, score->d_practice, score->d_test, score->d_single_parcel, result->pairing_order);
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
        app_write_csv(out, &options, &set, &result, &score);
        fclose(out);
        printf("raw trials written to %s\n", options.output_path);
    }
    return 0;
}

#endif
