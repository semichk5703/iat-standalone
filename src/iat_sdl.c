/* iat_sdl.c — SDL2 frontend: words and pictures.  Only dependency: SDL2.
 * Build: cc -O2 -std=c99 -o iat-sdl src/iat_sdl.c $(sdl2-config --cflags --libs) -lm
 * Pictures are decoded by stb_image.h and text drawn with font8x8 (both public domain, in third_party/).
 *
 * Environment:  IAT_FULLSCREEN=1 (default 800x600 window), IAT_SCALE=n (font pixel size, default 3).
 * Test hooks:   IAT_ECHO=1 prints "STIM <label>" per stimulus; IAT_STDIN_KEYS=1 also reads keys from
 *               stdin, so test/simulate_participant.py can drive it under SDL_VIDEODRIVER=dummy.
 */
#define _POSIX_C_SOURCE 200809L

#include <stdio.h>
#include <stdlib.h>
#include <sys/select.h>
#include <termios.h>
#include <unistd.h>

#include <SDL.h>

#include "iat_app.h"
#include "iat_frontend.h"

#define STB_IMAGE_IMPLEMENTATION
#define STBI_ONLY_JPEG
#define STBI_ONLY_PNG
#define STBI_ONLY_GIF
#define STBI_NO_LINEAR
#define STBI_NO_HDR
#include "../third_party/stb_image.h"
#include "../third_party/font8x8_basic.h"

int main(int argc, char **argv)
{
    return iat_app_main(argc, argv);
}

/* ---- window state ---- */

static SDL_Window *sdl_window;
static SDL_Renderer *sdl_renderer;
static int sdl_width = 800;
static int sdl_height = 600;
static int sdl_font_scale = 3;            /* pixels per font8x8 cell */
static int sdl_echo_stimuli = 0;
static int sdl_keys_from_stdin = 0;

static const SDL_Color SDL_COLOR_TEXT = { 255, 255, 255, 255 };
static const SDL_Color SDL_COLOR_CATEGORY = { 120, 220, 120, 255 };
static const SDL_Color SDL_COLOR_ERROR = { 255, 60, 60, 255 };

/* Decoded pictures, indexed like the stimulus set. */
static SDL_Texture *sdl_textures[CATEGORY_COUNT][STIMULI_MAX_ITEMS];
static int sdl_texture_width[CATEGORY_COUNT][STIMULI_MAX_ITEMS];
static int sdl_texture_height[CATEGORY_COUNT][STIMULI_MAX_ITEMS];

/* What is on screen.  The renderer is double-buffered, so every present must redraw all of it. */
static struct {
    const stimulus_set_t *set;
    const key_assignment_t *keys;         /* header, or NULL */
    int has_stimulus;
    category_id_t stimulus_category;
    int stimulus_item;
    int error_shown;
} sdl_scene;

static void sdl_fail(const char *what)
{
    fprintf(stderr, "%s: %s\n", what, SDL_GetError());
    exit(1);
}

/* ---- text ---- */

static int sdl_text_characters(const char *text)
{
    int count = 0;
    for (; *text; text++) {
        if (((unsigned char)*text & 0xC0) != 0x80) {
            count++;
        }
    }
    return count;
}

static int sdl_text_width(const char *text)
{
    return sdl_text_characters(text) * 8 * sdl_font_scale;
}

static void sdl_draw_text(int x, int y, const char *text, SDL_Color color)
{
    SDL_SetRenderDrawColor(sdl_renderer, color.r, color.g, color.b, 255);
    for (; *text; text++) {
        unsigned char byte = (unsigned char)*text;
        const char *glyph;
        int row, column;
        if ((byte & 0xC0) == 0x80) {
            continue;                      /* UTF-8 continuation byte: the lead byte already drew '?' */
        }
        glyph = font8x8_basic[byte < 128 ? byte : '?'];
        for (row = 0; row < 8; row++) {
            for (column = 0; column < 8; column++) {
                if (glyph[row] & (1 << column)) {
                    SDL_Rect pixel = { x + column * sdl_font_scale, y + row * sdl_font_scale,
                                       sdl_font_scale, sdl_font_scale };
                    SDL_RenderFillRect(sdl_renderer, &pixel);
                }
            }
        }
        x += 8 * sdl_font_scale;
    }
}

static void sdl_draw_text_centered(int y, const char *text, SDL_Color color)
{
    sdl_draw_text((sdl_width - sdl_text_width(text)) / 2, y, text, color);
}

/* ---- pictures ---- */

static SDL_Texture *sdl_load_picture(const char *path, int *width, int *height)
{
    int channels;
    unsigned char *pixels = stbi_load(path, width, height, &channels, 4);
    SDL_Surface *surface;
    SDL_Texture *texture;
    if (!pixels) {
        fprintf(stderr, "cannot decode %s\n", path);
        return NULL;
    }
    surface = SDL_CreateRGBSurfaceFrom(pixels, *width, *height, 32, *width * 4,
                                       0x000000ff, 0x0000ff00, 0x00ff0000, 0xff000000);
    texture = SDL_CreateTextureFromSurface(sdl_renderer, surface);
    SDL_FreeSurface(surface);
    stbi_image_free(pixels);
    return texture;
}

static void sdl_load_all_pictures(const stimulus_set_t *set)
{
    int c, i;
    for (c = 0; c < CATEGORY_COUNT; c++) {
        for (i = 0; i < set->categories[c].item_count; i++) {
            const stimulus_item_t *item = &set->categories[c].items[i];
            if (item->is_picture) {
                sdl_textures[c][i] = sdl_load_picture(item->text, &sdl_texture_width[c][i], &sdl_texture_height[c][i]);
            }
        }
    }
}

/* ---- scene drawing ---- */

static void sdl_draw_header(void)
{
    const category_t *categories = sdl_scene.set->categories;
    int line_height = 8 * sdl_font_scale + 6;
    int side, i;
    for (side = 0; side < 2; side++) {
        int left_side = side == 0;
        category_id_t labels[2];
        int count = frontend_header_labels(sdl_scene.keys, left_side, labels);
        for (i = -1; i < 2 * count - 1; i++) {
            /* row 0: key text; then label, "or", label */
            const char *text = i < 0 ? (left_side ? FRONTEND_LEFT_KEY_TEXT : FRONTEND_RIGHT_KEY_TEXT)
                                     : (i % 2 ? FRONTEND_OR_TEXT : categories[labels[i / 2]].name);
            SDL_Color color = (i >= 0 && i % 2 == 0) ? SDL_COLOR_CATEGORY : SDL_COLOR_TEXT;
            int x = left_side ? 10 : sdl_width - 10 - sdl_text_width(text);
            sdl_draw_text(x, 10 + line_height * (i + 1), text, color);
        }
    }
}

/* A picture is scaled to 40% of the window height, capped at 60% of its width; a word is centred. */
static void sdl_draw_stimulus(void)
{
    category_id_t c = sdl_scene.stimulus_category;
    int i = sdl_scene.stimulus_item;
    const stimulus_item_t *item = &sdl_scene.set->categories[c].items[i];
    if (item->is_picture && sdl_textures[c][i]) {
        int height = sdl_height * 0.4;
        int width = sdl_texture_width[c][i] * height / sdl_texture_height[c][i];
        SDL_Rect destination;
        if (width > sdl_width * 0.6) {
            width = sdl_width * 0.6;
            height = sdl_texture_height[c][i] * width / sdl_texture_width[c][i];
        }
        destination.x = (sdl_width - width) / 2;
        destination.y = (sdl_height - height) / 2;
        destination.w = width;
        destination.h = height;
        SDL_RenderCopy(sdl_renderer, sdl_textures[c][i], NULL, &destination);
    } else {
        sdl_draw_text_centered(sdl_height / 2 - 4 * sdl_font_scale, stimulus_item_label(item), SDL_COLOR_TEXT);
    }
}

static void sdl_draw_error(void)
{
    int half = 6 * sdl_font_scale;
    int cx = sdl_width / 2;
    int cy = sdl_height / 2 + sdl_height * 0.22;
    int thickness;
    SDL_SetRenderDrawColor(sdl_renderer, SDL_COLOR_ERROR.r, SDL_COLOR_ERROR.g, SDL_COLOR_ERROR.b, 255);
    for (thickness = -2; thickness <= 2; thickness++) {
        SDL_RenderDrawLine(sdl_renderer, cx - half + thickness, cy - half, cx + half + thickness, cy + half);
        SDL_RenderDrawLine(sdl_renderer, cx - half + thickness, cy + half, cx + half + thickness, cy - half);
    }
}

static void sdl_redraw_scene(void)
{
    SDL_SetRenderDrawColor(sdl_renderer, 0, 0, 0, 255);
    SDL_RenderClear(sdl_renderer);
    if (sdl_scene.keys) {
        sdl_draw_header();
    }
    if (sdl_scene.has_stimulus) {
        sdl_draw_stimulus();
    }
    if (sdl_scene.error_shown) {
        sdl_draw_error();
    }
    SDL_RenderPresent(sdl_renderer);
}

/* ---- frontend interface ---- */

static void frontend_open(const stimulus_set_t *set)
{
    Uint32 window_flags = getenv("IAT_FULLSCREEN") ? SDL_WINDOW_FULLSCREEN_DESKTOP : 0;
    sdl_echo_stimuli = getenv("IAT_ECHO") != NULL;
    sdl_keys_from_stdin = getenv("IAT_STDIN_KEYS") != NULL;
    if (getenv("IAT_SCALE")) {
        sdl_font_scale = atoi(getenv("IAT_SCALE"));
    }
    if (sdl_keys_from_stdin && isatty(0)) {
        struct termios raw;            /* keys arrive one byte at a time, not per line */
        tcgetattr(0, &raw);
        raw.c_lflag &= ~(ICANON | ECHO);
        raw.c_cc[VMIN] = 0;
        raw.c_cc[VTIME] = 0;
        tcsetattr(0, TCSANOW, &raw);
    }

    if (SDL_Init(SDL_INIT_VIDEO)) {
        sdl_fail("SDL_Init");
    }
    sdl_window = SDL_CreateWindow("IAT", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                                  sdl_width, sdl_height, window_flags);
    if (!sdl_window) {
        sdl_fail("SDL_CreateWindow");
    }
    sdl_renderer = SDL_CreateRenderer(sdl_window, -1, 0);
    if (!sdl_renderer) {
        sdl_fail("SDL_CreateRenderer");
    }
    SDL_GetRendererOutputSize(sdl_renderer, &sdl_width, &sdl_height);
    sdl_load_all_pictures(set);
    sdl_scene.set = set;
}

static void frontend_close(void)
{
    SDL_DestroyRenderer(sdl_renderer);
    SDL_DestroyWindow(sdl_window);
    SDL_Quit();
}

static void frontend_show_message(const char **lines, int line_count)
{
    int saved_scale = sdl_font_scale;
    int longest = 0;
    int line_height, first_y, i;
    sdl_scene.keys = NULL;
    sdl_scene.has_stimulus = 0;
    sdl_scene.error_shown = 0;

    for (i = 0; i < line_count; i++) {
        if (sdl_text_characters(lines[i]) > longest) {
            longest = sdl_text_characters(lines[i]);
        }
    }
    while (sdl_font_scale > 1 && longest * 8 * sdl_font_scale > sdl_width - 20) {
        sdl_font_scale--;                  /* shrink so the widest line fits the window */
    }
    line_height = 8 * sdl_font_scale + 6;
    first_y = (sdl_height - line_count * line_height) / 2;

    SDL_SetRenderDrawColor(sdl_renderer, 0, 0, 0, 255);
    SDL_RenderClear(sdl_renderer);
    for (i = 0; i < line_count; i++) {
        sdl_draw_text_centered(first_y + i * line_height, lines[i], SDL_COLOR_TEXT);
        if (sdl_echo_stimuli) {
            puts(lines[i]);
        }
    }
    SDL_RenderPresent(sdl_renderer);
    sdl_font_scale = saved_scale;
    if (sdl_echo_stimuli) {
        fflush(stdout);
    }
}

/* Draw text word-wrapped to the window width from y; returns the y below it. */
static int sdl_draw_wrapped(int y, const char *text, SDL_Color color)
{
    int columns = (sdl_width - 40) / (8 * sdl_font_scale);
    int line_height = 8 * sdl_font_scale + 6;
    char line[512];
    while (*text) {
        const char *end = text;
        const char *last_space = NULL;
        int count = 0;
        while (*end && count < columns) {
            if (*end == ' ') {
                last_space = end;
            }
            if (((unsigned char)*end & 0xC0) != 0x80) {
                count++;
            }
            end++;
        }
        if (*end && last_space) {
            end = last_space;
        }
        snprintf(line, sizeof line, "%.*s", (int)(end - text), text);
        sdl_draw_text_centered(y, line, color);
        y += line_height;
        text = end;
        while (*text == ' ') {
            text++;
        }
    }
    return y;
}

/* The source page's table: each group's name, then its words, or its pictures as thumbnails
   (the page shows them 60 px high; here scaled to fit the row across the window). */
static void frontend_show_overview(const stimulus_set_t *set, const overview_t *overview)
{
    int saved_scale = sdl_font_scale;
    int y = 16;
    int r, i;
    sdl_scene.keys = NULL;
    sdl_scene.has_stimulus = 0;
    sdl_scene.error_shown = 0;
    SDL_SetRenderDrawColor(sdl_renderer, 0, 0, 0, 255);
    SDL_RenderClear(sdl_renderer);

    y = sdl_draw_wrapped(y, overview->heading, SDL_COLOR_CATEGORY) + 6;
    sdl_font_scale = saved_scale > 2 ? 2 : saved_scale;
    y = sdl_draw_wrapped(y, overview->lead, SDL_COLOR_TEXT) + 8;
    for (r = 0; r < CATEGORY_COUNT; r++) {
        category_id_t c = overview->row_order[r];
        const category_t *category = &set->categories[c];
        y = sdl_draw_wrapped(y, category->name, SDL_COLOR_CATEGORY);
        if (category->items[0].is_picture) {
            int gap = 4, total_width = 0, height = 60, x;
            for (i = 0; i < category->item_count; i++) {
                total_width += sdl_textures[c][i] ? sdl_texture_width[c][i] * height / sdl_texture_height[c][i] + gap : 0;
            }
            if (total_width > sdl_width - 40) {
                height = height * (sdl_width - 40) / total_width;
                total_width = sdl_width - 40;
            }
            x = (sdl_width - total_width) / 2;
            for (i = 0; i < category->item_count; i++) {
                if (sdl_textures[c][i]) {
                    SDL_Rect thumbnail = { x, y, sdl_texture_width[c][i] * height / sdl_texture_height[c][i], height };
                    SDL_RenderCopy(sdl_renderer, sdl_textures[c][i], NULL, &thumbnail);
                    x += thumbnail.w + gap;
                }
            }
            y += height + 8;
        } else {
            char words[4 * STIMULI_MAX_TEXT];
            int used = 0;
            for (i = 0; i < category->item_count && used < (int)sizeof words - 1; i++) {
                used += snprintf(words + used, sizeof words - used, "%s%s", i ? ", " : "", category->items[i].text);
            }
            y = sdl_draw_wrapped(y, words, SDL_COLOR_TEXT) + 6;
        }
    }
    y = sdl_draw_wrapped(y + 6, overview->closing, SDL_COLOR_TEXT);
    sdl_draw_wrapped(y + 6, overview->continue_prompt, SDL_COLOR_TEXT);
    SDL_RenderPresent(sdl_renderer);
    sdl_font_scale = saved_scale;
    if (sdl_echo_stimuli) {
        printf("%s\n%s\n%s\n", overview->lead, overview->closing, overview->continue_prompt);
        fflush(stdout);
    }
}

static void frontend_show_header(const stimulus_set_t *set, const key_assignment_t *keys)
{
    sdl_scene.set = set;
    sdl_scene.keys = keys;
    sdl_scene.has_stimulus = 0;
    sdl_scene.error_shown = 0;
    sdl_redraw_scene();
}

static void frontend_show_stimulus(const stimulus_set_t *set, category_id_t category, int item_index)
{
    sdl_scene.set = set;
    sdl_scene.has_stimulus = 1;
    sdl_scene.stimulus_category = category;
    sdl_scene.stimulus_item = item_index;
    sdl_scene.error_shown = 0;
    if (sdl_echo_stimuli) {
        printf("STIM %s\n", stimulus_item_label(&set->categories[category].items[item_index]));
        fflush(stdout);
    }
    sdl_redraw_scene();
}

static void frontend_clear_stimulus(void)
{
    sdl_scene.has_stimulus = 0;
    sdl_scene.error_shown = 0;
    sdl_redraw_scene();
}

static void frontend_show_error(void)
{
    sdl_scene.error_shown = 1;
    sdl_redraw_scene();
}

/* ---- keys ---- */

static frontend_key_t sdl_key_from_event(const SDL_Event *event)
{
    if (event->type == SDL_QUIT) {
        return KEY_QUIT;
    }
    if (event->type == SDL_KEYDOWN) {
        switch (event->key.keysym.sym) {
        case SDLK_e: return KEY_LEFT;
        case SDLK_i: return KEY_RIGHT;
        case SDLK_SPACE: return KEY_CONTINUE;
        case SDLK_q:
        case SDLK_ESCAPE: return KEY_QUIT;
        default: break;
        }
    }
    return 0;
}

/* Test hook: one byte from stdin if any is waiting within timeout_us, else 0. */
static frontend_key_t sdl_key_from_stdin(long timeout_us)
{
    fd_set readable;
    struct timeval timeout = { 0, timeout_us };
    unsigned char byte;
    FD_ZERO(&readable);
    FD_SET(0, &readable);
    if (select(1, &readable, NULL, NULL, &timeout) <= 0) {
        return 0;
    }
    if (read(0, &byte, 1) != 1) {
        return KEY_QUIT;
    }
    if (byte == KEY_LEFT || byte == KEY_RIGHT || byte == KEY_CONTINUE || byte == KEY_QUIT) {
        return (frontend_key_t)byte;
    }
    return 0;
}

static frontend_key_t frontend_read_key(void)
{
    SDL_Event event;
    for (;;) {
        frontend_key_t key;
        if (sdl_keys_from_stdin) {
            while (SDL_PollEvent(&event)) {
                key = sdl_key_from_event(&event);
                if (key) {
                    return key;
                }
            }
            key = sdl_key_from_stdin(1000);
            if (key) {
                return key;
            }
            continue;
        }
        if (!SDL_WaitEvent(&event)) {
            return KEY_QUIT;
        }
        key = sdl_key_from_event(&event);
        if (key) {
            return key;
        }
    }
}

static void frontend_discard_pending_keys(void)
{
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_QUIT) {
            exit(1);
        }
    }
    if (sdl_keys_from_stdin) {
        while (sdl_key_from_stdin(0)) {
        }
    }
}
