#!/bin/sh
# regen-stimuli.sh — regenerate the machine-converted stimulus sets from the pinned minno-tasks submodule.
# Hand-transcribed sets (skintone, sexuality, religion, flowers-insects) are not touched; see their headers.
set -e; cd "$(dirname "$0")"
Q=upstream/minno-tasks/IAT/qualtrics
conv() { python3 -I minno2stim.py "$Q/$1.js" > "stimuli/$2.txt"; echo "stimuli/$2.txt <- $1.js"; }
conv demoRace0005 race;                  conv exampleQIATage age;              conv weightIATexample weight
conv exampleQIATdisability disability;   conv weaponsIATexample weapons;       conv exampleQIATpresident2 presidents-trump-obama
conv exampleQIATasianamer asian-american; conv exampleQIATnativeamer native-american
conv exampleQIATgendercareer gender-career; conv demogenderscience0002 gender-science; conv exampleQIATarab arab-muslim
conv exampleQiatDebFull deb-full;        conv iatashmiz hebrew-ashkenazi-mizrahi; conv ashmiziat hebrew-ashkenazi-mizrahi-2
