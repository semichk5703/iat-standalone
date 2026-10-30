/* iat_procedure.h — the seven-block IAT procedure: block definitions, trial sequencing, timing.
 *
 * The seven-block layout of Greenwald, Nosek & Banaji (2003, Table 1), with the parameters of the code
 * implicit.harvard.edu runs: minno-tasks IAT/iat10.js, loaded by docs/studies/datapipe.iat.examples/
 * demo.iats/<task>.js (block lengths 20/20/20/40/28/20/40, balanced mini-blocks, 250 ms inter-trial interval,
 * must-correct errors).  PROTOCOL has the parameter-by-parameter provenance.
 */
#ifndef IAT_PROCEDURE_H
#define IAT_PROCEDURE_H

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "iat_frontend.h"
#include "iat_stimuli.h"

#define PROCEDURE_BLOCK_COUNT 7
#define PROCEDURE_MAX_TRIALS 400

/* Everything recorded about one response. Latency runs from stimulus onset to the correct key. */
typedef struct {
    int block_index;            /* 0-based */
    category_id_t category;
    int item_index;
    frontend_key_t correct_key;
    int error_count;            /* wrong keys pressed before the correct one */
    double latency_ms;
} trial_t;

typedef struct {
    trial_t trials[PROCEDURE_MAX_TRIALS];
    int trial_count;
    int pairing_order;          /* 1: target_a+attr_a share a key first; 2: the reverse */
} procedure_result_t;

/* Milliseconds of blank screen between trials (iat10.js ITIDuration). */
#define PROCEDURE_INTER_TRIAL_MS 250

/* Run all seven blocks through the frontend.  pairing_order is 1 or 2.
   Returns 0 if the participant quit; the result then holds the trials completed so far. */
static int procedure_run(procedure_result_t *result, const stimulus_set_t *set, int pairing_order);

/* Automated tests set IAT_TIMESCALE=100: waits shrink 100x and measured latencies are scaled back up,
   so a scripted participant finishes a session in seconds and the scoring is unchanged. */
static double procedure_time_scale = 1.0;

/* ---------------------------------------------------------------------------------------------- */

/* Which of Project Implicit's instruction templates (iat10.js inst*) a block shows. */
typedef enum {
    INSTRUCTIONS_CATEGORIES_PRACTICE,
    INSTRUCTIONS_ATTRIBUTES_PRACTICE,
    INSTRUCTIONS_FIRST_COMBINED,
    INSTRUCTIONS_SECOND_COMBINED,     /* "This is the same as the previous part." */
    INSTRUCTIONS_SWITCH_CATEGORIES
} instructions_kind_t;

typedef struct {
    int trial_count;
    key_assignment_t keys;
    instructions_kind_t instructions;
} block_t;

static double procedure_now_ms(void)
{
    struct timespec now;
    clock_gettime(CLOCK_MONOTONIC, &now);
    return (now.tv_sec * 1000.0 + now.tv_nsec / 1e6) * procedure_time_scale;
}

static void procedure_sleep_ms(double milliseconds)
{
    struct timespec duration;
    milliseconds /= procedure_time_scale;
    duration.tv_sec = (time_t)(milliseconds / 1000);
    duration.tv_nsec = (long)((milliseconds - duration.tv_sec * 1000) * 1e6);
    nanosleep(&duration, NULL);
}

static int procedure_random_below(int count)
{
    return (int)((double)rand() / ((double)RAND_MAX + 1) * count);
}

static key_assignment_t procedure_keys(category_id_t left_target, category_id_t right_target,
                                       int with_attributes)
{
    key_assignment_t keys;
    keys.left[0] = left_target;
    keys.right[0] = right_target;
    keys.left_count = keys.right_count = 1;
    if (with_attributes) {
        keys.left[1] = CATEGORY_ATTRIBUTE_A;
        keys.right[1] = CATEGORY_ATTRIBUTE_B;
        keys.left_count = keys.right_count = 2;
    }
    return keys;
}

/* The seven blocks.  first/second are the targets whose pairing with attr_a comes first/second. */
static void procedure_define_blocks(block_t blocks[PROCEDURE_BLOCK_COUNT], int pairing_order)
{
    category_id_t first = pairing_order == 2 ? CATEGORY_TARGET_B : CATEGORY_TARGET_A;
    category_id_t second = pairing_order == 2 ? CATEGORY_TARGET_A : CATEGORY_TARGET_B;
    key_assignment_t attributes_only = { { CATEGORY_ATTRIBUTE_A }, 1, { CATEGORY_ATTRIBUTE_B }, 1 };
    block_t defined[PROCEDURE_BLOCK_COUNT] = {
        { 20, procedure_keys(first, second, 0), INSTRUCTIONS_CATEGORIES_PRACTICE },
        { 20, attributes_only,                  INSTRUCTIONS_ATTRIBUTES_PRACTICE },
        { 20, procedure_keys(first, second, 1), INSTRUCTIONS_FIRST_COMBINED },
        { 40, procedure_keys(first, second, 1), INSTRUCTIONS_SECOND_COMBINED },
        { 28, procedure_keys(second, first, 0), INSTRUCTIONS_SWITCH_CATEGORIES },
        { 20, procedure_keys(second, first, 1), INSTRUCTIONS_FIRST_COMBINED },
        { 40, procedure_keys(second, first, 1), INSTRUCTIONS_SECOND_COMBINED },
    };
    memcpy(blocks, defined, sizeof defined);
}

static int procedure_key_is_left(const key_assignment_t *keys, category_id_t category)
{
    int i;
    for (i = 0; i < keys->left_count; i++) {
        if (keys->left[i] == category) {
            return 1;
        }
    }
    return 0;
}

/* Trial order as iat10.js builds it (getMiniMixer2/getMiniMixer4): mini-blocks of one trial per category, each mini-block shuffled,
   targets and attributes alternating in combined blocks, so left and right responses stay balanced. */
static void procedure_sequence_categories(category_id_t sequence[], const block_t *block)
{
    const key_assignment_t *keys = &block->keys;
    int filled = 0;
    while (filled < block->trial_count) {
        if (keys->left_count == 2) {
            int target_first = procedure_random_below(2);
            int attribute_first = procedure_random_below(2);
            category_id_t targets[2] = { keys->left[0], keys->right[0] };
            category_id_t attributes[2] = { keys->left[1], keys->right[1] };
            sequence[filled++] = targets[target_first];
            sequence[filled++] = attributes[attribute_first];
            sequence[filled++] = targets[1 - target_first];
            sequence[filled++] = attributes[1 - attribute_first];
        } else {
            int left_first = procedure_random_below(2);
            category_id_t pair[2] = { keys->left[0], keys->right[0] };
            sequence[filled++] = pair[left_first];
            sequence[filled++] = pair[1 - left_first];
        }
    }
}

/* Block instructions, worded as the templates in minno-tasks IAT/iat10.js (instCategoriesPractice,
   instAttributePractice, instFirstCombined, instSecondCombined, instSwitchCategories), which is what
   implicit.harvard.edu shows; HTML markup dropped. */
static void procedure_show_block_instructions(const stimulus_set_t *set, const block_t *block, int block_index)
{
    const category_t *categories = set->categories;
    const key_assignment_t *keys = &block->keys;
    const char *left = categories[keys->left[0]].name;
    const char *right = categories[keys->right[0]].name;
    const char *left_attribute = keys->left_count > 1 ? categories[keys->left[1]].name : "";
    const char *right_attribute = keys->right_count > 1 ? categories[keys->right[1]].name : "";
    static char title[64];
    static char left_line[3 * STIMULI_MAX_TEXT];
    static char right_line[3 * STIMULI_MAX_TEXT];
    const char *lines[10];
    int line_count = 0;

    snprintf(title, sizeof title, "Part %d of %d", block_index + 1, PROCEDURE_BLOCK_COUNT);
    lines[line_count++] = title;
    lines[line_count++] = "";
    switch (block->instructions) {
    case INSTRUCTIONS_CATEGORIES_PRACTICE:
    case INSTRUCTIONS_ATTRIBUTES_PRACTICE:
        snprintf(left_line, sizeof left_line, "Put a left finger on the E key for items that belong to the category %s.", left);
        snprintf(right_line, sizeof right_line, "Put a right finger on the I key for items that belong to the category %s.", right);
        lines[line_count++] = left_line;
        lines[line_count++] = right_line;
        if (block->instructions == INSTRUCTIONS_CATEGORIES_PRACTICE) {
            lines[line_count++] = "Items will appear one at a time.";
        }
        lines[line_count++] = "If you make a mistake, a red X will appear. Press the other key to continue.";
        break;
    case INSTRUCTIONS_FIRST_COMBINED:
    case INSTRUCTIONS_SECOND_COMBINED:
        if (block->instructions == INSTRUCTIONS_SECOND_COMBINED) {
            lines[line_count++] = "This is the same as the previous part.";
        }
        snprintf(left_line, sizeof left_line, "Use the E key for %s and for %s.", left, left_attribute);
        snprintf(right_line, sizeof right_line, "Use the I key for %s and for %s.", right, right_attribute);
        lines[line_count++] = left_line;
        lines[line_count++] = right_line;
        lines[line_count++] = "Each item belongs to only one category.";
        if (block->instructions == INSTRUCTIONS_FIRST_COMBINED) {
            lines[line_count++] = "If you make a mistake, a red X will appear. Press the other key to continue.";
        }
        break;
    case INSTRUCTIONS_SWITCH_CATEGORIES:
        lines[line_count++] = "Watch out, the labels have changed position!";
        snprintf(left_line, sizeof left_line, "Use the left finger on the E key for %s.", left);
        snprintf(right_line, sizeof right_line, "Use the right finger on the I key for %s.", right);
        lines[line_count++] = left_line;
        lines[line_count++] = right_line;
        break;
    }
    lines[line_count++] = "Go as fast as you can while being accurate.";
    lines[line_count++] = "Press the space bar when you are ready to start.";
    frontend_show_message(lines, line_count);
}

/* Wait for KEY_CONTINUE; returns 0 on KEY_QUIT. */
static int procedure_wait_for_continue(void)
{
    frontend_discard_pending_keys();
    for (;;) {
        frontend_key_t key = frontend_read_key();
        if (key == KEY_CONTINUE) {
            return 1;
        }
        if (key == KEY_QUIT) {
            return 0;
        }
    }
}

/* One trial: blank, stimulus, keys until the correct one. Returns 0 on KEY_QUIT. */
static int procedure_run_trial(procedure_result_t *result, const stimulus_set_t *set, const block_t *block,
                               int block_index, category_id_t category, int item_index)
{
    frontend_key_t correct_key = procedure_key_is_left(&block->keys, category) ? KEY_LEFT : KEY_RIGHT;
    trial_t trial;
    double started_ms;

    frontend_clear_stimulus();
    procedure_sleep_ms(PROCEDURE_INTER_TRIAL_MS);
    frontend_discard_pending_keys();
    frontend_show_stimulus(set, category, item_index);
    started_ms = procedure_now_ms();

    trial.error_count = 0;
    for (;;) {
        frontend_key_t key = frontend_read_key();
        if (key == KEY_QUIT) {
            return 0;
        }
        if (key != KEY_LEFT && key != KEY_RIGHT) {
            continue;
        }
        if (key == correct_key) {
            break;
        }
        trial.error_count++;
        frontend_show_error();
    }

    trial.latency_ms = procedure_now_ms() - started_ms;
    trial.block_index = block_index;
    trial.category = category;
    trial.item_index = item_index;
    trial.correct_key = correct_key;
    if (result->trial_count < PROCEDURE_MAX_TRIALS) {
        result->trials[result->trial_count++] = trial;
    }
    return 1;
}

static int procedure_run_block(procedure_result_t *result, const stimulus_set_t *set, const block_t *block,
                               int block_index)
{
    category_id_t sequence[PROCEDURE_MAX_TRIALS];
    int next_item[CATEGORY_COUNT];
    int c, t;

    procedure_show_block_instructions(set, block, block_index);
    if (!procedure_wait_for_continue()) {
        return 0;
    }

    procedure_sequence_categories(sequence, block);
    /* Items cycle through each category from a random start, so every item is seen before any repeats. */
    for (c = 0; c < CATEGORY_COUNT; c++) {
        next_item[c] = procedure_random_below(set->categories[c].item_count);
    }

    frontend_show_header(set, &block->keys);
    for (t = 0; t < block->trial_count; t++) {
        category_id_t category = sequence[t];
        int item_count = set->categories[category].item_count;
        int item_index = next_item[category];
        next_item[category] = (item_index + 1) % item_count;
        if (next_item[category] == 0) {
            next_item[category] = procedure_random_below(item_count);
        }
        if (!procedure_run_trial(result, set, block, block_index, category, item_index)) {
            return 0;
        }
    }
    return 1;
}

static int procedure_run(procedure_result_t *result, const stimulus_set_t *set, int pairing_order)
{
    block_t blocks[PROCEDURE_BLOCK_COUNT];
    int b;
    result->trial_count = 0;
    result->pairing_order = pairing_order;
    procedure_define_blocks(blocks, pairing_order);
    for (b = 0; b < PROCEDURE_BLOCK_COUNT; b++) {
        if (!procedure_run_block(result, set, &blocks[b], b)) {
            return 0;
        }
    }
    return 1;
}

#endif
