# iat — a small, offline Implicit Association Test

A self-contained implementation of the Implicit Association Test (Greenwald, McGhee & Schwartz, 1998)
in its seven-block form, scored with the D measure (Greenwald, Nosek & Banaji, 2003), following the code
implicit.harvard.edu runs (minno-tasks `IAT/iat11.js`, scored by its `scorer/nogaScorer.js`).

It comes in three forms with the same procedure, scoring, stimuli files and results files; each is
written module for module in parallel (`src/iat_*.h` and `web/iat_*.js`) and `make test` checks they agree:

| form                 | needs                       | stimuli          | runs on |
|----------------------|-----------------------------|------------------|---------|
| `iat` (terminal)     | a C compiler; libc          | words            | any terminal, serial console, Linux framebuffer |
| `iat-sdl` (window)   | a C compiler; SDL2          | words + pictures | X11, Wayland, Windows, or a framebuffer via `SDL_VIDEODRIVER=kmsdrm` |
| web page             | a browser                   | words + pictures | desktop and phone browsers; keyboard or touch |

Eighteen ready-made task sets are included (race, age, weight, skin tone, disability, religion,
sexuality, weapons, presidents, Asian-American, Native American, gender–career, gender–science,
Arab-Muslim, and others), taken from Project Implicit's open task library with full provenance.

## Run

Keys everywhere: **E** = left, **I** = right, **Space** = continue, **Q**/Esc = quit. On a touch screen
the web page uses Project Implicit's touch layout instead: green areas at the left and right edges
answer, the area along the bottom continues.

**Terminal and window** (`iat`, `iat-sdl`):

    git clone --recurse-submodules <this repo>     # submodules are only needed for tools/provenance.sh verify
    make                                            # or: make iat   (no SDL needed)
    ./iat-sdl stimuli/race.txt
    ./iat stimuli/gender-career.txt --order 2 --out me.csv

Guix: `guix shell gcc-toolchain make pkg-config sdl2-compat -- make`.
Debian/Ubuntu: `apt install build-essential libsdl2-dev`.
If `sdl2-config` is missing: `make SDL_CFLAGS="$(pkg-config --cflags sdl2)" SDL_LIBS="$(pkg-config --libs sdl2)"`.

**Web page**, two ways:

- *One file, no server* (`make web-single`, or `python3 tools/build_single_html.py`): writes
  `dist/iat.html`, about 2 MB, with the code, all eighteen sets and their pictures inside. Copy it
  anywhere and open it in a browser; it starts with a menu of the sets. This is the form to carry to
  another computer or a phone.
- *Served from the repository* (`python3 -m http.server 8000 --bind 127.0.0.1` in the repository root):
  open `http://127.0.0.1:8000/web/index.html?stimuli=../stimuli/race.txt`. Edits to `web/` or
  `stimuli/` show up on reload, so this is the form for working on it.

Results download from the last screen as the same CSV the programs write.

**Options**, the same in all three forms:

| command line   | web page (URL)  | meaning |
|----------------|-----------------|---------|
| `STIMULI_FILE` | `?stimuli=PATH` | which set to run (single file without it: a menu) |
| `--order 1\|2` | `&order=1\|2`   | which pairing comes first (default: random, as Project Implicit; alternate across sittings if you repeat) |
| `--seed N`     | `&seed=N`       | replay: every choice comes from a generator seeded with N (default: every choice from the operating system: `getrandom()` / `crypto.getRandomValues`) |
| `--no-intro`   | `&intro=0`      | skip the opening screen (transcribed from the live site; not in minno-tasks) |
| `--out FILE`   | (download link) | results file (default `results.csv`); see "Results files" below |
| —              | `&touch=1`      | force the touch layout (it switches on by itself on touch screens) |
| `IAT_FULLSCREEN=1`, `IAT_SCALE=n` | — | `iat-sdl` fullscreen (default 800×600 window); font pixel size (default 3) |

## What the score means

For each half of the combined blocks (practice: parts 3 and 6; test: parts 4 and 7),
`(mean latency, reversed pairing − mean latency, first-listed pairing) / pooled SD`; D is the mean of
the two, as on implicit.harvard.edu. As there, no result is given if more than 10% of responses were
under 300 ms or more than 40% had errors. **D > 0** means you were faster when *target_a* shared a key with *attr_a* (as named in
the stimuli file). Project Implicit's feedback bands: |D| < 0.15 little or none, < 0.35 slight,
< 0.65 moderate, otherwise strong.

Read it as a snapshot, not a verdict: for socially sensitive attitudes, test–retest reliability is
"nearer to .50 and often lower" (Greenwald, Brendl et al., 2019, p. 18), scores shift with context, and
the measure characterises groups much better than it does individuals (see
[REFERENCES.md](REFERENCES.md), "On interpretation"). It is not a screening tool.

## Results files

A results file holds the session's data, not its score:

    # iat results, format 2
    # stimuli: stimuli/race.txt
    # pairing_order: 1                  which pairing came first; scoring needs it
    # random: os                        or "seed N" for a replayable session
    block,category,item,correct_key,errors,rt_ms
    1,European Americans,wm1_nc.jpg,i,0,386.8
    ...
    # displayed: scoring=iat11 D=1.1340 ... feedback=shown

The last line records what the session showed and under which scoring rules, as history. The score
itself is always recomputed from the trials, so it never goes stale when the rules change:

    python3 tools/rescore_csv.py results.csv [more.csv ...]      # current score of each session
    python3 tools/rescore_csv.py --output new.csv old.csv        # convert an earlier build's file

Files from earlier builds (score and pairing order on one trailing `#` line) are read as they are;
`--output` writes them in the current format, keeping their old score as a labelled `# displayed:`
line, and never overwrites the original. It writes UTF-8 itself, so use `--output` rather than `>`
in PowerShell 5, whose `>` writes UTF-16.

## Fidelity to the mainstream implementation

[PROTOCOL](PROTOCOL) traces every parameter to the paper it comes from (page-checked) and to the code
implicit.harvard.edu runs: [minno-tasks](https://github.com/baranan/minno-tasks) `IAT/iat11.js`, the
demo site's task configs in `docs/studies/datapipe.iat.examples/demo.iats/`, and `scorer/nogaScorer.js`.
A browser capture of the live Race IAT confirmed the site serves exactly these files. That covers block lengths
(20/20/20/40/28/20/40), balanced mini-block trial order, the 250 ms inter-trial interval, must-correct
errors, the 400 ms–10 s trial filter, the two-parcel D of Greenwald et al. (2003, Table 4), when a
result is withheld (too fast, too many errors, too few trials) and the site's wording for it,
instruction wording, 8-of-32 attribute-word sampling, per-session label sets, and feedback cut-offs.
Where Project Implicit departs from a paper, PROTOCOL says so.
`make test` drives a scripted participant through every task set on both frontends at 100× speed and
re-scores the output with independent re-implementations (`test/rescore_project_implicit.py`,
`test/rescore_greenwald_2003.py`, `test/web_scoring_check.mjs`); they agree with the C scorer to < 10⁻³.

## Stimuli

`stimuli/*.txt` is a four-category text format; items are words, or picture files (`.jpg/.png/.gif`,
paths relative to the file, shell globs allowed):

    target_a: Flowers
    target_a_items: orchid, tulip, rose, ../media/project-implicit/race-faces/*.jpg
    target_b: ...      attr_a: ...      attr_b: ...

Each file's header states where it came from and the upstream commit. Thirteen sets are generated by
`tools/regen_stimuli.sh` from the pinned `upstream/minno-tasks` submodule via `tools/minno_to_stimuli.py`
(which converts any minno-tasks IAT config). Five are kept by hand — race (from the demo site's
`demo.iats/race.js`), skin tone, sexuality and religion (upstream builds them in code), and
flowers-insects (a demonstration set; its header explains why it is not yet the 1998 lists) — and
their headers say what was chosen. `media/minno/` is a byte-for-byte copy of
`upstream/minno-tasks/docs/images/` (git-lfs).

`media/project-implicit/` holds Project Implicit's study-material sets, fetched from Google Drive by
`tools/fetch_media.ps1`; they are made available "for academic research purposes" (see NOTICE).
Reference them from your own stimuli files.

## Provenance

Every file copied from another repository is checked against a git submodule pinned to an exact commit:

    git submodule update --init
    git lfs pull                      # the images and PDFs, if the clone did not fetch them
    tools/provenance.sh verify        # compares third_party/ and media/minno/ byte-for-byte with upstream/
    tools/provenance.sh manifest      # regenerates PROVENANCE.txt (commit hashes + sha256 of every file)

See [NOTICE](NOTICE) for licenses (minno-tasks: Apache-2.0; stb_image: public
domain/MIT; font8x8: public domain; papers and Project Implicit study materials: their own terms) and
[LICENSE](LICENSE) for this repository's own code (MIT).

## Layout

    src/iat_app.h          command line, session flow, results file and score output (entry: iat_app_main)
    src/iat_procedure.h    the seven blocks, trial sequencing, timing          (entry: procedure_run)
    src/iat_scoring.h      the D measure                                      (entry: scoring_compute)
    src/iat_stimuli.h      the four categories and the stimuli file format    (entry: stimuli_load)
    src/iat_frontend.h     the eight display/keyboard calls a frontend implements
    src/iat_terminal.c     terminal frontend (termios + ANSI)
    src/iat_sdl.c          SDL2 frontend (pictures; retained scene redrawn per frame)
    web/iat_*.js           the web form, module for module parallel to src/ (plus iat_resources.js:
                           fetched from a server, or embedded in the single file)
    web/index.html         the web page
    stimuli/               18 task sets
    media/minno/           minno-tasks docs/images (git-lfs)
    media/project-implicit/  Project Implicit study materials (git-lfs; tools/fetch_media.ps1)
    tools/minno_to_stimuli.py   minno-tasks config -> stimuli file
    tools/regen_stimuli.sh      rebuild the 13 converted sets from the submodule
    tools/provenance.sh         verify / sync / manifest  ->  PROVENANCE.txt
    tools/rescore_csv.py        score results files from their trials; convert earlier builds' files
    tools/build_single_html.py   dist/iat.html: the web form as one self-contained file (make web-single)
    tools/fetch_media.ps1, tools/fetch_drive_missing.py   Windows: fetch Project Implicit study materials
    test/simulate_participant.py        pty-driven scripted participant (make test)
    test/rescore_project_implicit.py    independent re-implementation of nogaScorer.js (iat11 settings)
    test/rescore_greenwald_2003.py      independent re-implementation of 2003 Table 4
    test/web_scoring_check.mjs   web scorer vs the C scorer's results file
    references/            papers.bib, fetch_papers.sh, and the papers (PDF, git-lfs)
    third_party/           stb_image.h, font8x8_basic.h (copies of upstream/)
    upstream/              git submodules: minno-tasks, stb, font8x8
    PROTOCOL, REFERENCES.md, NOTICE, LICENSE, CITATION.cff

Naming: `module_verb_object` functions, `thing_t` types, one statement per line; each header opens
with its public type and entry point, implementation below the rule.

## Citing

Cite Greenwald et al. (1998, 2003) for the method, Nosek et al. (2007) if you use Project Implicit's
study materials, and minno-tasks for the stimuli; `CITATION.cff` and `references/papers.bib` have the
metadata.
