/* iat_terminal.c — terminal frontend: libc only (termios + ANSI escapes). Words only; a picture
 * item is shown as its file name.  Build: cc -O2 -std=c99 -o iat src/iat_terminal.c -lm
 *
 * Test hook: IAT_ECHO=1 writes "STIM <label>" on the bottom line for test/simulate_participant.py.
 */
#define _POSIX_C_SOURCE 200809L

#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <termios.h>
#include <unistd.h>

#include "iat_app.h"
#include "iat_frontend.h"

int main(int argc, char **argv)
{
    return iat_app_main(argc, argv);
}

/* ---- terminal state ---- */

static struct termios terminal_saved_settings;
static int terminal_is_raw = 0;
static int terminal_rows = 24;
static int terminal_columns = 80;

static void terminal_restore(void)
{
    if (terminal_is_raw) {
        tcsetattr(0, TCSANOW, &terminal_saved_settings);
        printf("\033[?25h\033[0m\n");   /* cursor back on, attributes reset */
        terminal_is_raw = 0;
    }
}

static void terminal_on_signal(int signal_number)
{
    (void)signal_number;
    terminal_restore();
    _exit(1);
}

/* ---- drawing ---- */

/* Length in characters of a UTF-8 string (continuation bytes do not count). */
static int terminal_text_width(const char *text)
{
    int width = 0;
    for (; *text; text++) {
        if (((unsigned char)*text & 0xC0) != 0x80) {
            width++;
        }
    }
    return width;
}

static void terminal_move_to(int row, int column)
{
    printf("\033[%d;%dH", row, column);
}

static void terminal_clear_screen(void)
{
    printf("\033[2J");
}

static void terminal_print_centered(int row, const char *text)
{
    int column = (terminal_columns - terminal_text_width(text)) / 2;
    terminal_move_to(row, column < 1 ? 1 : column);
    fputs(text, stdout);
}

/* ---- frontend interface ---- */

static void frontend_open(const stimulus_set_t *set)
{
    struct winsize size;
    struct termios raw;
    if (!ioctl(1, TIOCGWINSZ, &size) && size.ws_row && size.ws_col) {
        terminal_rows = size.ws_row;
        terminal_columns = size.ws_col;
    }
    tcgetattr(0, &terminal_saved_settings);
    raw = terminal_saved_settings;
    raw.c_lflag &= ~(ICANON | ECHO | ISIG);
    raw.c_cc[VMIN] = 1;
    raw.c_cc[VTIME] = 0;
    tcsetattr(0, TCSANOW, &raw);
    terminal_is_raw = 1;
    atexit(terminal_restore);
    signal(SIGINT, terminal_on_signal);
    signal(SIGTERM, terminal_on_signal);
    printf("\033[?25l");   /* hide cursor */
    if (set->has_pictures) {
        fprintf(stderr, "note: picture items are shown as file names in the terminal; build iat-sdl for pictures\n");
        procedure_sleep_ms(1500);
    }
}

static void frontend_close(void)
{
    terminal_restore();
    terminal_clear_screen();
    terminal_move_to(1, 1);
}

/* Word-wrap one line into pieces no wider than the terminal; returns the number of pieces. */
static int terminal_wrap(const char *text, int max_width, char pieces[][256], int max_pieces)
{
    int piece_count = 0;
    while (*text && piece_count < max_pieces) {
        const char *end = text;
        const char *last_space = NULL;
        int width = 0;
        while (*end && width < max_width) {
            if (*end == ' ') {
                last_space = end;
            }
            if (((unsigned char)*end & 0xC0) != 0x80) {
                width++;
            }
            end++;
        }
        if (*end && last_space) {
            end = last_space;                   /* break at the last space that fits */
        }
        snprintf(pieces[piece_count++], 256, "%.*s", (int)(end - text), text);
        text = end;
        while (*text == ' ') {
            text++;
        }
    }
    return piece_count;
}

static void frontend_show_message(const char **lines, int line_count)
{
    static char wrapped[40][256];
    int wrapped_count = 0;
    int first_row, i;
    for (i = 0; i < line_count && wrapped_count < 40; i++) {
        if (!lines[i][0]) {
            wrapped[wrapped_count++][0] = '\0';
        } else {
            wrapped_count += terminal_wrap(lines[i], terminal_columns - 2, wrapped + wrapped_count, 40 - wrapped_count);
        }
    }
    first_row = terminal_rows / 2 - wrapped_count / 2;
    terminal_clear_screen();
    for (i = 0; i < wrapped_count; i++) {
        terminal_print_centered(first_row + i < 1 ? 1 : first_row + i, wrapped[i]);
    }
    fflush(stdout);
}

/* The terminal cannot draw pictures, so a picture row says how many there are and where they can be
   seen; that wording is this program's, not the source page's. */
static void frontend_show_overview(const stimulus_set_t *set, const overview_t *overview)
{
    static char rows[CATEGORY_COUNT][4 * STIMULI_MAX_TEXT];
    const char *lines[CATEGORY_COUNT + 8];
    int line_count = 0;
    int r, i;
    lines[line_count++] = overview->heading;
    lines[line_count++] = "";
    lines[line_count++] = overview->lead;
    lines[line_count++] = "";
    for (r = 0; r < CATEGORY_COUNT; r++) {
        const category_t *category = &set->categories[overview->row_order[r]];
        char *row = rows[r];
        int used = snprintf(row, sizeof rows[r], "%s:  ", category->name);
        if (category->items[0].is_picture) {
            snprintf(row + used, sizeof rows[r] - used, "%d pictures (shown by iat-sdl and the web page)", category->item_count);
        } else {
            for (i = 0; i < category->item_count && used < (int)sizeof rows[r] - 1; i++) {
                used += snprintf(row + used, sizeof rows[r] - used, "%s%s", i ? ", " : "", category->items[i].text);
            }
        }
        lines[line_count++] = row;
    }
    lines[line_count++] = "";
    lines[line_count++] = overview->closing;
    lines[line_count++] = overview->continue_prompt;
    frontend_show_message(lines, line_count);
}

static void frontend_show_header(const stimulus_set_t *set, const key_assignment_t *keys)
{
    int side, i;
    terminal_clear_screen();
    for (side = 0; side < 2; side++) {
        int left_side = side == 0;
        const char *key_text = left_side ? FRONTEND_LEFT_KEY_TEXT : FRONTEND_RIGHT_KEY_TEXT;
        category_id_t labels[2];
        int count = frontend_header_labels(keys, left_side, labels);
        for (i = -1; i < 2 * count - 1; i++) {
            /* row 1: key text; then label, "or", label */
            const char *text = i < 0 ? key_text : (i % 2 ? FRONTEND_OR_TEXT : set->categories[labels[i / 2]].name);
            terminal_move_to(2 + i, left_side ? 1 : terminal_columns + 1 - terminal_text_width(text));
            fputs(text, stdout);
        }
    }
    fflush(stdout);
}

static void frontend_show_stimulus(const stimulus_set_t *set, category_id_t category, int item_index)
{
    const char *label = stimulus_item_label(&set->categories[category].items[item_index]);
    terminal_print_centered(terminal_rows / 2, label);
    if (getenv("IAT_ECHO")) {
        terminal_move_to(terminal_rows, 1);
        printf("STIM %s", label);
    }
    fflush(stdout);
}

static void frontend_clear_stimulus(void)
{
    terminal_move_to(terminal_rows / 2, 1);
    printf("\033[K");
    terminal_move_to(terminal_rows / 2 + 1, 1);
    printf("\033[K");
    fflush(stdout);
}

static void frontend_show_error(void)
{
    terminal_move_to(terminal_rows / 2 + 1, terminal_columns / 2 - 1);
    printf("\033[31;1mX\033[0m");
    fflush(stdout);
}

static frontend_key_t frontend_read_key(void)
{
    unsigned char byte;
    if (read(0, &byte, 1) != 1) {
        return KEY_QUIT;
    }
    return (frontend_key_t)byte;
}

static void frontend_discard_pending_keys(void)
{
    struct termios settings;
    unsigned char byte;
    tcgetattr(0, &settings);
    settings.c_cc[VMIN] = 0;                 /* non-blocking reads until the input queue is empty */
    tcsetattr(0, TCSANOW, &settings);
    while (read(0, &byte, 1) == 1) {
    }
    settings.c_cc[VMIN] = 1;
    tcsetattr(0, TCSANOW, &settings);
}
