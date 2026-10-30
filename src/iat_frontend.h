/* iat_frontend.h — the display and keyboard interface a frontend implements.
 *
 * The procedure (iat_procedure.h) drives the test through these eight calls and nothing else, so a
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

static void frontend_open(const stimulus_set_t *set);
static void frontend_close(void);

/* Clear the screen and show centred lines of text (instructions). */
static void frontend_show_message(const char **lines, int line_count);

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
