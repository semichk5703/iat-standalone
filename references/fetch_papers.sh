#!/bin/sh
# fetch-papers.sh — download the primary papers into references/ (not committed: publisher copyright).
# Author-hosted copies are used where the author posts them; the rest resolve through the DOI, which
# lands on the publisher page (open access varies; a library login may be needed).
set -e
cd "$(dirname "$0")"
get() { # name url
    if [ -s "$1" ]; then echo "have $1"; return; fi
    echo "$1 <- $2"
    curl -fL --retry 3 -o "$1" "$2" || echo "  FAILED ($?): fetch by hand from $2"
}
get greenwald-nosek-banaji-2003-scoring.pdf 'https://faculty.washington.edu/agg/pdf/GB&N.JPSP.2003.pdf'
get greenwald-mcghee-schwartz-1998-iat.pdf  'https://faculty.washington.edu/agg/pdf/Gwald_McGh_Schw_JPSP_1998.OCR.pdf'
get nosek-greenwald-banaji-2005-method.pdf  'https://doi.org/10.1177/0146167204271418'
get lane-banaji-nosek-greenwald-2007.pdf    'https://doi.org/10.1037/0022-3514.85.2.197'
get nosek-etal-2007-pervasiveness.pdf       'https://doi.org/10.1080/10463280701489053'
echo "Greenwald's full list of author-posted PDFs: https://faculty.washington.edu/agg/bydate.htm"
