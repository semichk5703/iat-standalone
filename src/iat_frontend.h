/* iat_frontend.h — the display and keyboard interface a frontend implements.
 *
 * The procedure (iat_procedure.h) and app (iat_app.h) drive the test through these calls and nothing else, so a
 * frontend for another toolkit (framebuffer, web, ...) is exactly these functions.  Two are provided:
 * iat_terminal.c (ANSI escapes) and iat_sdl.c (SDL2, pictures).
 */
#ifndef IAT_FRONTEND_H
#define IAT_FRONTEND_H

#include "iat_stimuli.h"

/* Keys the procedure understands; frontend_read_key maps whatever input it has onto these. */
typedef enum {
    KEY_LEFT = 'e',
    KEY_RIGHT = 'i',
    KEY_CONTINUE = ' ',
    KEY_QUIT = 'q'
} frontend_key_t;

/* What the header shows during a block: which categories answer to which key. */
typedef struct {
    category_id_t left[2];
    int left_count;
    category_id_t right[2];
    int right_count;
} key_assignment_t;

/* The pre-IAT overview (minno-tasks docs/studies/raceiat/raceiat_instructions.jst): a heading, a lead
   sentence, a table with one row per group (its name, then its words or its pictures), a closing
   sentence, and how to continue.  Frontends that can draw pictures show them as thumbnails. */
typedef struct {
    const char *heading;
    const char *lead;
    category_id_t row_order[CATEGORY_COUNT];
    const char *closing;
    const char *continue_prompt;
} overview_t;

/* Header text, iat11.js leftKeyText / rightKeyText / orText.  On touch screens iat11 hides the key text. */
#define FRONTEND_LEFT_KEY_TEXT "Press \"E\" for"
#define FRONTEND_RIGHT_KEY_TEXT "Press \"I\" for"
#define FRONTEND_OR_TEXT "or"

/* The labels one side of the header shows, top to bottom, as iat11.js orders them: in combined blocks
   the attribute first, then "or", then the target category (its left1/right1 is the attribute).
   Returns the number of labels (1 or 2). */
static int frontend_header_labels(const key_assignment_t *keys, int left_side, category_id_t labels[2])
{
    const category_id_t *side = left_side ? keys->left : keys->right;
    int count = left_side ? keys->left_count : keys->right_count;
    if (count == 2) {
        labels[0] = side[1];
        labels[1] = side[0];
    } else {
        labels[0] = side[0];
    }
    return count;
}

static void frontend_open(const stimulus_set_t *set);
static void frontend_close(void);

/* Clear the screen and show centred lines of text (instructions). */
static void frontend_show_message(const char **lines, int line_count);

/* Clear the screen and show the overview table. */
static void frontend_show_overview(const stimulus_set_t *set, const overview_t *overview);

/* Clear the screen and show the block header; the stimulus area is empty afterwards. */
static void frontend_show_header(const stimulus_set_t *set, const key_assignment_t *keys);

/* Show one item in the centre, replacing any previous one and any error mark. */
static void frontend_show_stimulus(const stimulus_set_t *set, category_id_t category, int item_index);
static void frontend_clear_stimulus(void);

/* Show the red X that tells the participant the last key was wrong. */
static void frontend_show_error(void);

/* Block until a key the procedure understands is pressed. Returns KEY_QUIT if input is gone. */
static frontend_key_t frontend_read_key(void);

/* Drop keys pressed before now, so an early press does not count as a response. */
static void frontend_discard_pending_keys(void);

#endif
