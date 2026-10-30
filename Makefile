CC ?= cc
CFLAGS ?= -O2 -std=c99 -Wall -Wextra
SDL_CFLAGS ?= $(shell sdl2-config --cflags)
SDL_LIBS   ?= $(shell sdl2-config --libs)
CORE = src/iat_app.h src/iat_frontend.h src/iat_procedure.h src/iat_scoring.h src/iat_stimuli.h

all: iat iat-sdl

# Project Implicit's own studies as one self-contained HTML file that opens from disk: dist/iat-offline.html
offline-single:
	python3 tools/build_offline_html.py dist/iat-offline.html

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

# Project Implicit's own Race IAT run offline by a scripted participant (needs node with playwright), served
# from the repository and then as the single file from disk; their in-page score must agree with ours.
OFFLINE_TEST_PORT = 8768
test-offline: offline-single
	python3 -m http.server $(OFFLINE_TEST_PORT) --bind 127.0.0.1 >/dev/null 2>&1 & server=$$!; sleep 1; \
	  node test/offline_session.js 'http://127.0.0.1:$(OFFLINE_TEST_PORT)/offline/index.html?iat=11' results-served.json; status=$$?; \
	  kill $$server; exit $$status
	python3 test/offline_agreement.py results-served.json
	node test/offline_session.js "file://$(CURDIR)/dist/iat-offline.html?iat=11" results-single.json
	python3 test/offline_agreement.py results-single.json

clean:
	rm -f iat iat-sdl results.csv results-served.json results-single.json
	rm -rf dist
