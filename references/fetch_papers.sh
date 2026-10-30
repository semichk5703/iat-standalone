#!/bin/sh
# fetch_papers.sh — (re)download the primary papers into references/ (tracked with git-lfs; copyright: NOTICE).
# All are author-posted copies from Anthony Greenwald's publication list,
# https://faculty.washington.edu/agg/bydate.htm (URLs checked 2026-10).
#
#   sh references/fetch_papers.sh
# Windows PowerShell, using the bash that ships with Git for Windows:
#   & "$(Split-Path (Split-Path (Get-Command git).Source))\bin\bash.exe" references/fetch_papers.sh
#
# A download is kept only if it starts with the PDF signature "%PDF"; anything else (an HTML error or
# sign-in page) is saved as <name>.html beside it so the cause can be read, and the script says so.
cd "$(dirname "$0")"
AUTHOR_PDFS=https://faculty.washington.edu/agg/pdf
failures=0

fetch_paper() {  # local-name url [fallback-url]
    name=$1; shift
    if [ -s "$name" ] && head -c 4 "$name" | grep -q '%PDF'; then
        echo "have $name"; return 0
    fi
    for url in "$@"; do
        echo "$name <- $url"
        if ! curl -fL --retry 2 -sS -o "$name.part" "$url"; then
            echo "  curl failed (exit $?) for $url"
            continue
        fi
        if head -c 4 "$name.part" | grep -q '%PDF'; then
            mv "$name.part" "$name"; echo "  ok  $(wc -c < "$name") bytes"; return 0
        fi
        mv "$name.part" "${name%.pdf}.html"
        echo "  not a PDF (server sent $(head -c 60 "${name%.pdf}.html" | tr -d '\r\n')...); saved as ${name%.pdf}.html"
    done
    failures=$((failures + 1))
    return 1
}

fetch_paper greenwald-mcghee-schwartz-1998-iat.pdf     "$AUTHOR_PDFS/Gwald_McGh_Schw_JPSP_1998.OCR.pdf"
fetch_paper greenwald-nosek-banaji-2003-scoring.pdf    "$AUTHOR_PDFS/GN&B.JPSP.2003.pdf" "$AUTHOR_PDFS/GB&N.JPSP.2003.pdf"
fetch_paper nosek-greenwald-banaji-2005-method.pdf     "$AUTHOR_PDFS/NGB2005.PSPB.pdf"
fetch_paper lane-banaji-nosek-greenwald-2007-method.pdf "$AUTHOR_PDFS/Lane%20et%20al.UUIAT4.2007.pdf"
fetch_paper nosek-etal-2007-pervasiveness.pdf          "$AUTHOR_PDFS/Nosek%20&%20al.PCIAS.ERSP.2007.pdf"

echo "$failures failed"
[ "$failures" -eq 0 ]
