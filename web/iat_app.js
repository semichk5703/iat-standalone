// iat_app.js — session flow and result display (parallel to src/iat_app.h).
// URL parameters:  ?stimuli=../stimuli/race.txt  &order=1|2  &seed=N  &touch=1  &intro=0  &timescale=100 (tests)

import { StimulusSet, CATEGORY_TARGET_A, CATEGORY_TARGET_B, CATEGORY_ATTRIBUTE_A, CATEGORY_ATTRIBUTE_B } from './iat_stimuli.js';
import { Random } from './iat_random.js';
import { Procedure } from './iat_procedure.js';
import { scoringCompute, scoringFeedbackBand, SCORING_VERSION } from './iat_scoring.js';
import { DomFrontend } from './iat_frontend_dom.js';
import { FetchedResources, EmbeddedResources } from './iat_resources.js';

export class IatApp {
    constructor(root, params = new URLSearchParams(location.search)) {
        this.root = root;
        // The single-file build defines IAT_EMBEDDED_FILES; served pages fetch from the server.
        this.resources = globalThis.IAT_EMBEDDED_FILES ? new EmbeddedResources(globalThis.IAT_EMBEDDED_FILES) : new FetchedResources();
        this.stimuliUrl = params.get('stimuli');                     // null: offer a menu, or the default set
        this.pairingOrder = parseInt(params.get('order'), 10) || 0;      // 0: random, as Project Implicit
        this.seed = params.has('seed') ? parseInt(params.get('seed'), 10) : undefined;
        this.touch = params.has('touch') ? params.get('touch') !== '0' : matchMedia('(pointer: coarse)').matches;
        this.timeScale = parseFloat(params.get('timescale')) || 1;
        this.showIntroduction = params.get('intro') !== '0';      // intro=0 skips the opening screen
    }

    /** implicit.harvard.edu's opening screen, minus the questionnaire and duration it mentions there
     *  (parallel to app_show_introduction in src/iat_app.h). Transcribed from the live site, not from
     *  minno-tasks; intro=0 omits it. */
    introductionLines(set) {
        const sorted = set.hasPictures ? 'pictures and words' : 'words';
        return [
            'Implicit Association Test', '',
            `In this study you will complete an Implicit Association Test (IAT) in which you will be asked to sort ${sorted} into groups as fast as you can.`,
            'At the end, you will receive your IAT result.', '',
            this.touch ? 'Touch the lower green area to continue.' : 'Press the space bar to continue.',
        ];
    }

    /** The overview implicit.harvard.edu shows before the IAT: minno-tasks docs/studies/raceiat/
     *  raceiat_instructions.jst word for word, rows in its order (attribute2, attribute1, category1,
     *  category2), with its touch wording on touch screens (parallel to app_show_welcome). */
    overview() {
        return {
            heading: 'IAT Instructions',
            lead: `Next, ${this.touch ? 'you will' : "you will use the 'E' and 'I' computer keys to"} categorize items into groups as fast as you can. ` +
                  'These are the four groups and the items that belong to each:',
            rowOrder: [CATEGORY_ATTRIBUTE_B, CATEGORY_ATTRIBUTE_A, CATEGORY_TARGET_A, CATEGORY_TARGET_B],
            closing: 'There are seven parts.  The instructions change for each part.  Pay attention!',
            startButton: 'Start',
        };
    }

    /** Project Implicit's result sentence (iat11.js fb_* messages, filled as its getFB does). */
    resultSentence(set, d) {
        const [targetA, targetB, attributeA, attributeB] = set.categories.map(c => c.name);
        const band = scoringFeedbackBand(d);
        if (!band.speed) {
            return `You were about equally fast at sorting '${targetA}' with '${attributeA}' and '${targetB}' with '${attributeB}' ` +
                   `and at sorting '${targetB}' with '${attributeA}' and '${targetA}' with '${attributeB}'.`;
        }
        const [faster, slower] = band.reversed ? [targetB, targetA] : [targetA, targetB];   // iat11's categoryA, categoryB
        return `You were ${band.speed} faster at sorting '${faster}' with '${attributeA}' and '${slower}' with '${attributeB}' ` +
               `than '${slower}' with '${attributeA}' and '${faster}' with '${attributeB}'`;
    }

    /** The site shows only the result sentence (or the withheld message). The rest is this program's:
     *  the D line for whoever runs the session, and a note on reliability (Greenwald, Brendl et al. 2019,
     *  p. 18: test-retest "nearer to .50 and often lower" for sensitive attitudes). */
    resultLines(set, score) {
        const signed = v => (v >= 0 ? '+' : '') + v.toFixed(3);
        return [
            score.feedbackMessage || this.resultSentence(set, score.d), '',
            `D-score = ${signed(score.d)}   (practice ${signed(score.dPractice)}, test ${signed(score.dTest)}; ` +
                `single-parcel ${signed(score.dSingleParcel)}; pairing order ${this.pairingOrder})`,
            'A single IAT is a snapshot (test-retest about r = .5 or lower), not a measurement of a person.',
        ];
    }

    /** Results file, format 2, as the C build writes it (src/iat_app.h app_write_csv): data and the facts
     *  needed to score it; the last line records what was displayed and under which scoring rules. */
    csv(set, trials, score) {
        const rows = trials.map(t => [t.blockIndex + 1, set.categories[t.category].name, set.categories[t.category].items[t.itemIndex].label,
                                      t.correctKey, t.errorCount, t.latencyMs.toFixed(1)].join(','));
        return ['# iat results, format 2',
                `# stimuli: ${this.stimuliUrl}`,
                `# pairing_order: ${this.pairingOrder}`,
                `# random: ${this.seed === undefined ? 'os' : 'seed ' + this.seed}`,
                'block,category,item,correct_key,errors,rt_ms', ...rows,
                `# displayed: scoring=${SCORING_VERSION} D=${score.d.toFixed(4)} d_practice=${score.dPractice.toFixed(4)} d_test=${score.dTest.toFixed(4)} ` +
                `D_single_parcel=${score.dSingleParcel.toFixed(4)} fast=${score.fastFraction.toFixed(4)} errors=${score.errorFraction.toFixed(4)} feedback=${score.feedbackName}`,
               ].join('\n') + '\n';
    }

    /** Which stimuli file to run: the ?stimuli= parameter, else a menu of the embedded sets, else the default. */
    async chooseStimuli(frontend) {
        if (this.stimuliUrl) return this.stimuliUrl;
        const paths = this.resources.stimuliPaths();
        if (!paths) return '../stimuli/flowers-insects.txt';
        const names = paths.map(p => p.split('/').pop().replace(/\.txt$/, ''));
        const index = await frontend.showChoice(['Implicit Association Test', '', 'Choose a test:'], names);
        return paths[index];
    }

    async run() {
        const random = new Random(this.seed);
        const frontend = new DomFrontend(this.root, this.touch);
        this.stimuliUrl = await this.chooseStimuli(frontend);
        const set = await StimulusSet.load(this.stimuliUrl, this.resources);
        set.randomizeSession(random);
        if (this.pairingOrder !== 1 && this.pairingOrder !== 2) this.pairingOrder = 1 + random.below(2);

        const procedure = new Procedure(frontend, set, this.pairingOrder, { random, timeScale: this.timeScale, touch: this.touch });
        frontend.open(set);
        if (this.showIntroduction) {
            frontend.showMessage(this.introductionLines(set));
            if (!await procedure.waitForContinue()) { frontend.showMessage(['aborted']); return; }
        }
        frontend.showOverview(set, this.overview());
        if (!await procedure.waitForContinue() || !await procedure.run()) { frontend.showMessage(['aborted']); return; }

        const score = scoringCompute(procedure.trials, this.pairingOrder);
        frontend.showMessage(this.resultLines(set, score));
        const link = document.createElement('a');
        link.textContent = 'download results.csv';
        link.href = URL.createObjectURL(new Blob([this.csv(set, procedure.trials, score)], { type: 'text/csv' }));
        link.download = 'results.csv';
        this.root.querySelector('.message').append(link);
    }
}
