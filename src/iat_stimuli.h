/* iat_stimuli.h — the four stimulus categories of an IAT and the text file format that defines them.
 *
 * File format (one category per pair of lines; '#' lines are comments):
 *     target_a: Flowers
 *     target_a_items: orchid, tulip, ../media/faces/[a-z]*.jpg  (globs allowed)
 *     target_b / attr_a / attr_b likewise
 * An item ending in .jpg/.png/.gif is a picture; its path is relative to the stimuli file and may be a
 * shell glob.  Everything else is a word, shown verbatim (UTF-8).
 *
 * Two optional per-session randomisations, as implicit.harvard.edu's tasks do them (minno-tasks
 * docs/studies/datapipe.iat.examples/demo.iats/race.js: one of two label sets is chosen at random, and
 * posWords/negWords are API.shuffle()d and the first 8 used, "Based on Axt, Feng, & Bar-Anan (2021)"):
 *     target_a: Black people | African Americans      alternative labels; one index is chosen per session
 *     attr_a_sample: 8                                show a random 8 of the listed items this session
 */
#ifndef IAT_STIMULI_H
#define IAT_STIMULI_H

#include <glob.h>
#include <libgen.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "iat_random.h"

#define STIMULI_MAX_ITEMS 64
#define STIMULI_MAX_TEXT 256

/* Which of the four categories an item or a key assignment refers to. */
typedef enum {
    CATEGORY_TARGET_A = 0,
    CATEGORY_TARGET_B = 1,
    CATEGORY_ATTRIBUTE_A = 2,
    CATEGORY_ATTRIBUTE_B = 3,
    CATEGORY_COUNT = 4
} category_id_t;

typedef struct {
    char text[STIMULI_MAX_TEXT];   /* the word, or the picture's path */
    int is_picture;
} stimulus_item_t;

#define STIMULI_MAX_NAME_VARIANTS 4

typedef struct {
    char name[STIMULI_MAX_TEXT];   /* category label shown in headers and instructions (the chosen variant) */
    char name_variants[STIMULI_MAX_NAME_VARIANTS][STIMULI_MAX_TEXT];
    int name_variant_count;
    stimulus_item_t items[STIMULI_MAX_ITEMS];
    int item_count;
    int sample_count;              /* 0: show all items; n: a random n of them per session */
} category_t;

typedef struct {
    category_t categories[CATEGORY_COUNT];
    int has_pictures;
} stimulus_set_t;

/* Load a stimuli file.  Exits with a message on a malformed file; abnormal input is a user error here. */
static void stimuli_load(stimulus_set_t *set, const char *path);

/* Apply the per-session randomisations (label variant, item samples). */
static void stimuli_randomize_session(stimulus_set_t *set, random_t *random);

/* The short label of an item: the word itself, or a picture's file name without directories. */
static const char *stimulus_item_label(const stimulus_item_t *item);

/* ---------------------------------------------------------------------------------------------- */

static const char *STIMULI_CATEGORY_KEYS[CATEGORY_COUNT] = { "target_a", "target_b", "attr_a", "attr_b" };

static void stimuli_trim(char *text)
{
    char *end;
    while (*text == ' ' || *text == '\t') {
        memmove(text, text + 1, strlen(text));
    }
    end = text + strlen(text);
    while (end > text && strchr(" \t\r\n", end[-1])) {
        *--end = '\0';
    }
}

static int stimuli_is_picture_path(const char *text)
{
    size_t length = strlen(text);
    const char *extension;
    if (length < 5) {
        return 0;
    }
    extension = text + length - 4;
    return !strcasecmp(extension, ".jpg") || !strcasecmp(extension, ".png") || !strcasecmp(extension, ".gif")
        || !strcasecmp(extension - 1, ".jpeg");
}

static const char *stimulus_item_label(const stimulus_item_t *item)
{
    const char *slash = strrchr(item->text, '/');
    return slash ? slash + 1 : item->text;
}

static void stimuli_add_item(stimulus_set_t *set, category_t *category, const char *text, int is_picture)
{
    stimulus_item_t *item;
    if (category->item_count >= STIMULI_MAX_ITEMS) {
        return;
    }
    item = &category->items[category->item_count++];
    strncpy(item->text, text, STIMULI_MAX_TEXT - 1);
    item->is_picture = is_picture;
    if (is_picture) {
        set->has_pictures = 1;
    }
}

/* Expand a picture entry (possibly a glob) relative to the stimuli file's directory. */
static void stimuli_add_pictures(stimulus_set_t *set, category_t *category, const char *entry, const char *directory)
{
    char pattern[STIMULI_MAX_TEXT];
    glob_t matches;
    size_t i;
    if (entry[0] == '/') {
        strncpy(pattern, entry, STIMULI_MAX_TEXT - 1);
    } else {
        snprintf(pattern, STIMULI_MAX_TEXT, "%s/%s", directory, entry);
    }
    if (glob(pattern, 0, NULL, &matches) == 0) {
        for (i = 0; i < matches.gl_pathc; i++) {
            stimuli_add_item(set, category, matches.gl_pathv[i], 1);
        }
    } else {
        fprintf(stderr, "warning: no file matches %s\n", pattern);
    }
    globfree(&matches);
}

static void stimuli_parse_items(stimulus_set_t *set, category_t *category, char *list, const char *directory)
{
    char *entry = strtok(list, ",");
    category->item_count = 0;
    while (entry) {
        stimuli_trim(entry);
        if (stimuli_is_picture_path(entry)) {
            stimuli_add_pictures(set, category, entry, directory);
        } else if (*entry) {
            stimuli_add_item(set, category, entry, 0);
        }
        entry = strtok(NULL, ",");
    }
}

/* "Black people | African Americans": alternatives separated by '|'; the first is the default name. */
static void stimuli_parse_name_variants(category_t *category, char *value)
{
    char *variant = strtok(value, "|");
    category->name_variant_count = 0;
    while (variant && category->name_variant_count < STIMULI_MAX_NAME_VARIANTS) {
        stimuli_trim(variant);
        strncpy(category->name_variants[category->name_variant_count++], variant, STIMULI_MAX_TEXT - 1);
        variant = strtok(NULL, "|");
    }
    if (category->name_variant_count) {
        strcpy(category->name, category->name_variants[0]);
    }
}

/* An item listed under two categories has no correct key, so the file is rejected rather than scored. */
static void stimuli_check_disjoint(const stimulus_set_t *set)
{
    int a, b, i, j;
    for (a = 0; a < CATEGORY_COUNT; a++) {
        for (b = a + 1; b < CATEGORY_COUNT; b++) {
            for (i = 0; i < set->categories[a].item_count; i++) {
                for (j = 0; j < set->categories[b].item_count; j++) {
                    const char *label_a = stimulus_item_label(&set->categories[a].items[i]);
                    const char *label_b = stimulus_item_label(&set->categories[b].items[j]);
                    if (!strcmp(label_a, label_b)) {
                        fprintf(stderr, "stimuli: '%s' appears in both %s and %s\n",
                                label_a, set->categories[a].name, set->categories[b].name);
                        exit(1);
                    }
                }
            }
        }
    }
}

static void stimuli_load(stimulus_set_t *set, const char *path)
{
    char directory_buffer[STIMULI_MAX_TEXT];
    const char *directory;
    char line[4096];
    int c;
    FILE *file = fopen(path, "r");
    if (!file) {
        perror(path);
        exit(1);
    }
    memset(set, 0, sizeof *set);
    strncpy(directory_buffer, path, STIMULI_MAX_TEXT - 1);
    directory = dirname(directory_buffer);

    while (fgets(line, sizeof line, file)) {
        char *colon = strchr(line, ':');
        char *key = line;
        char *value;
        if (!colon || line[0] == '#') {
            continue;
        }
        *colon = '\0';
        value = colon + 1;
        stimuli_trim(key);
        stimuli_trim(value);
        for (c = 0; c < CATEGORY_COUNT; c++) {
            const char *category_key = STIMULI_CATEGORY_KEYS[c];
            size_t key_length = strlen(category_key);
            if (!strcmp(key, category_key)) {
                stimuli_parse_name_variants(&set->categories[c], value);
            } else if (!strncmp(key, category_key, key_length) && !strcmp(key + key_length, "_sample")) {
                set->categories[c].sample_count = atoi(value);
            } else if (!strncmp(key, category_key, key_length) && !strcmp(key + key_length, "_items")) {
                stimuli_parse_items(set, &set->categories[c], value, directory);
            }
        }
    }
    fclose(file);

    for (c = 0; c < CATEGORY_COUNT; c++) {
        if (!set->categories[c].item_count || !set->categories[c].name[0]) {
            fprintf(stderr, "stimuli: missing or empty %s\n", STIMULI_CATEGORY_KEYS[c]);
            exit(1);
        }
    }
    stimuli_check_disjoint(set);
}

/* Keep a random sample_count of the items (partial Fisher-Yates shuffle, then truncate). */
static void stimuli_sample_items(category_t *category, random_t *random)
{
    int i;
    if (category->sample_count <= 0 || category->sample_count >= category->item_count) {
        return;
    }
    for (i = 0; i < category->sample_count; i++) {
        int j = i + random_below(random, category->item_count - i);
        stimulus_item_t swapped = category->items[i];
        category->items[i] = category->items[j];
        category->items[j] = swapped;
    }
    category->item_count = category->sample_count;
}

static void stimuli_randomize_session(stimulus_set_t *set, random_t *random)
{
    int most_variants = 0;
    int chosen_variant;
    int c;
    for (c = 0; c < CATEGORY_COUNT; c++) {
        if (set->categories[c].name_variant_count > most_variants) {
            most_variants = set->categories[c].name_variant_count;
        }
    }
    /* One index for every category, so paired labels ("African Americans"/"European Americans") agree. */
    chosen_variant = random_below(random, most_variants);
    for (c = 0; c < CATEGORY_COUNT; c++) {
        category_t *category = &set->categories[c];
        if (chosen_variant < category->name_variant_count) {
            strcpy(category->name, category->name_variants[chosen_variant]);
        }
        stimuli_sample_items(category, random);
    }
}

#endif
