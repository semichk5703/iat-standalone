CC ?= cc
CFLAGS ?= -O2 -std=c99 -Wall
SDL_CFLAGS ?= $(shell sdl2-config --cflags)
SDL_LIBS   ?= $(shell sdl2-config --libs)

all: iat iat-sdl
iat: iat.c core.h
	$(CC) $(CFLAGS) -o iat iat.c -lm
iat-sdl: iat-sdl.c core.h third_party/stb_image.h third_party/font8x8_basic.h
	$(CC) $(CFLAGS) $(SDL_CFLAGS) -o iat-sdl iat-sdl.c $(SDL_LIBS) -lm
# full simulated session on every stimulus set, both frontends, at 100x speed (~2 s each),
# then an independent Python re-score of the last CSV against the C scorer
test: all
	@for s in stimuli/*.txt; do \
	  printf '%-34s tty ' $$s; IAT_TIMESCALE=100 python3 test/simulate.py $$s 2>/dev/null | grep -o 'D-score = [^ ]*' || echo FAIL; \
	  printf '%-34s sdl ' $$s; IAT_BIN=./iat-sdl IAT_TIMESCALE=100 python3 test/simulate.py $$s 2>/dev/null | grep -o 'D-score = [^ ]*' || echo FAIL; \
	done; python3 test/rescore.py results.csv; python3 test/rescore_2003.py results.csv
clean:
	rm -f iat iat-sdl results.csv
