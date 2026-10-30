CC ?= cc
CFLAGS ?= -O2 -std=c99 -Wall -Wextra
SDL_CFLAGS ?= $(shell sdl2-config --cflags)
SDL_LIBS   ?= $(shell sdl2-config --libs)
CORE = src/iat_app.h src/iat_frontend.h src/iat_procedure.h src/iat_scoring.h src/iat_stimuli.h

all: iat iat-sdl

iat: src/iat_terminal.c $(CORE)
	$(CC) $(CFLAGS) -o iat src/iat_terminal.c -lm

iat-sdl: src/iat_sdl.c $(CORE) third_party/stb_image.h third_party/font8x8_basic.h
	$(CC) $(CFLAGS) $(SDL_CFLAGS) -o iat-sdl src/iat_sdl.c $(SDL_LIBS) -lm

# A scripted participant runs every stimulus set on both frontends at 100x speed (~2 s each), then two
# independent Python re-implementations of the scoring check the last CSV against the C scorer.
test: all
	@for s in stimuli/*.txt; do \
	  printf '%-34s tty ' $$s; IAT_TIMESCALE=100 python3 test/simulate_participant.py $$s 2>/dev/null | grep -o 'D-score = [^ ]*' || echo FAIL; \
	  printf '%-34s sdl ' $$s; IAT_BIN=./iat-sdl IAT_TIMESCALE=100 python3 test/simulate_participant.py $$s 2>/dev/null | grep -o 'D-score = [^ ]*' || echo FAIL; \
	done
	python3 test/rescore_project_implicit.py results.csv
	python3 test/rescore_greenwald_2003.py results.csv

clean:
	rm -f iat iat-sdl results.csv
