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

static void frontend_show_message(const char **lines, int line_count)
{
    int first_row = terminal_rows / 2 - line_count / 2;
    int i;
    terminal_clear_screen();
    for (i = 0; i < line_count; i++) {
        terminal_print_centered(first_row + i, lines[i]);
    }
    fflush(stdout);
}

static void frontend_show_header(const stimulus_set_t *set, const key_assignment_t *keys)
{
    int i;
    terminal_clear_screen();
    terminal_move_to(1, 1);
    printf("Press E for:");
    terminal_move_to(1, terminal_columns - 13);
    printf("Press I for:");
    for (i = 0; i < keys->left_count; i++) {
        terminal_move_to(2 + i, 1);
        fputs(set->categories[keys->left[i]].name, stdout);
    }
    for (i = 0; i < keys->right_count; i++) {
        const char *name = set->categories[keys->right[i]].name;
        terminal_move_to(2 + i, terminal_columns - terminal_text_width(name));
        fputs(name, stdout);
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
