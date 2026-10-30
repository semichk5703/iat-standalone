// iat_app.js — session flow and result display (parallel to src/iat_app.h).
// URL parameters:  ?stimuli=../stimuli/race.txt  &order=1|2  &seed=N  &touch=1  &intro=0  &timescale=100 (tests)

import { StimulusSet, CATEGORY_TARGET_A, CATEGORY_TARGET_B, CATEGORY_ATTRIBUTE_A, CATEGORY_ATTRIBUTE_B } from './iat_stimuli.js';
import { Random } from './iat_random.js';
import { Procedure } from './iat_procedure.js';
import { scoringCompute, scoringStrengthLabel, SCORING_VERSION } from './iat_scoring.js';
import { DomFrontend } from './iat_frontend_dom.js';

export class IatApp {
    constructor(root, params = new URLSearchParams(location.search)) {
        this.root = root;
        this.stimuliUrl = params.get('stimuli') || '../stimuli/flowers-insects.txt';
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

    /** minno-tasks docs/studies/raceiat/raceiat_instructions.jst (parallel to app_show_welcome). */
    welcomeLines(set) {
        const keysText = this.touch ? 'the left and right green areas' : "the 'E' and 'I' computer keys";
        return [
            `Next, you will use ${keysText} to categorize items into groups as fast as you can.`,
            'These are the four groups and the items that belong to each:', '',
            ...set.categories.map(c => `${c.name}:  ${c.items[0].isPicture ? '[pictures]' : c.items.map(i => i.text).join(', ')}`),
            '', 'There are seven parts. The instructions change for each part. Pay attention!',
            this.touch ? 'Touch the lower green area to continue.' : 'Press the space bar to continue.',
        ];
    }

    resultLines(set, score, trials) {
        const names = set.categories.map(c => c.name);
        const signed = v => (v >= 0 ? '+' : '') + v.toFixed(3);
        const lines = [`D-score = ${signed(score.d)}   (practice ${signed(score.dPractice)}, test ${signed(score.dTest)}; single-parcel ${signed(score.dSingleParcel)})`];
        if (score.feedbackMessage) {
            lines.push(score.feedbackMessage);       // implicit.harvard.edu shows only this message
            return lines;
        }
        lines.push(
            `${scoringStrengthLabel(score.d)} association of ${names[CATEGORY_TARGET_A]}+${names[CATEGORY_ATTRIBUTE_A]} / ${names[CATEGORY_TARGET_B]}+${names[CATEGORY_ATTRIBUTE_B]}` +
                (score.d > 0 ? ' (faster with this pairing)' : score.d < 0 ? ' (faster with the reverse pairing)' : ''),
            `Mean latency ms: first pairing ${score.meanFirstMs.toFixed(0)} | reversed ${score.meanReversedMs.toFixed(0)} | pairing order ${this.pairingOrder}`);
        // Greenwald, Brendl et al. 2019, p. 18: test-retest "nearer to .50 and often lower" for sensitive attitudes
        lines.push('', 'A single IAT is a snapshot (test-retest about r = .5 or lower), not a measurement of a person.');
        return lines;
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

    async run() {
        const random = new Random(this.seed);
        const set = await StimulusSet.load(this.stimuliUrl);
        set.randomizeSession(random);
        if (this.pairingOrder !== 1 && this.pairingOrder !== 2) this.pairingOrder = 1 + random.below(2);

        const frontend = new DomFrontend(this.root, this.touch);
        const procedure = new Procedure(frontend, set, this.pairingOrder, { random, timeScale: this.timeScale, touch: this.touch });
        frontend.open(set);
        if (this.showIntroduction) {
            frontend.showMessage(this.introductionLines(set));
            if (!await procedure.waitForContinue()) { frontend.showMessage(['aborted']); return; }
        }
        frontend.showMessage(this.welcomeLines(set));
        if (!await procedure.waitForContinue() || !await procedure.run()) { frontend.showMessage(['aborted']); return; }

        const score = scoringCompute(procedure.trials, this.pairingOrder);
        frontend.showMessage(this.resultLines(set, score, procedure.trials));
        const link = document.createElement('a');
        link.textContent = 'download results.csv';
        link.href = URL.createObjectURL(new Blob([this.csv(set, procedure.trials, score)], { type: 'text/csv' }));
        link.download = 'results.csv';
        this.root.querySelector('.message').append(link);
    }
}
