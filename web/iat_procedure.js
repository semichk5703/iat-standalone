// iat_procedure.js — the seven-block procedure (parallel to src/iat_procedure.h). Drives a frontend
// object with the same eight calls as src/iat_frontend.h, as async methods:
//   showMessage(lines), showHeader(set, keys), showStimulus(set, category, itemIndex),
//   clearStimulus(), showError(), readKey() -> 'e' | 'i' | ' ' | 'q', discardPendingKeys(), open(set), close()

import { CATEGORY_TARGET_A, CATEGORY_TARGET_B, CATEGORY_ATTRIBUTE_A, CATEGORY_ATTRIBUTE_B, CATEGORY_COUNT } from './iat_stimuli.js';

export const KEY_LEFT = 'e';
export const KEY_RIGHT = 'i';
export const KEY_CONTINUE = ' ';
export const KEY_QUIT = 'q';

export const PROCEDURE_BLOCK_COUNT = 7;
export const PROCEDURE_INTER_TRIAL_MS = 250;      // iat10.js ITIDuration

const INSTRUCTIONS_CATEGORIES_PRACTICE = 'categories';
const INSTRUCTIONS_ATTRIBUTES_PRACTICE = 'attributes';
const INSTRUCTIONS_FIRST_COMBINED = 'first-combined';
const INSTRUCTIONS_SECOND_COMBINED = 'second-combined';
const INSTRUCTIONS_SWITCH_CATEGORIES = 'switch';

function keys(leftTarget, rightTarget, withAttributes) {
    return withAttributes
        ? { left: [leftTarget, CATEGORY_ATTRIBUTE_A], right: [rightTarget, CATEGORY_ATTRIBUTE_B] }
        : { left: [leftTarget], right: [rightTarget] };
}

/** The seven blocks; first/second are the targets whose pairing with attr_a comes first/second. */
export function procedureDefineBlocks(pairingOrder) {
    const first = pairingOrder === 2 ? CATEGORY_TARGET_B : CATEGORY_TARGET_A;
    const second = pairingOrder === 2 ? CATEGORY_TARGET_A : CATEGORY_TARGET_B;
    return [
        { trialCount: 20, keys: keys(first, second, false), instructions: INSTRUCTIONS_CATEGORIES_PRACTICE },
        { trialCount: 20, keys: { left: [CATEGORY_ATTRIBUTE_A], right: [CATEGORY_ATTRIBUTE_B] }, instructions: INSTRUCTIONS_ATTRIBUTES_PRACTICE },
        { trialCount: 20, keys: keys(first, second, true), instructions: INSTRUCTIONS_FIRST_COMBINED },
        { trialCount: 40, keys: keys(first, second, true), instructions: INSTRUCTIONS_SECOND_COMBINED },
        { trialCount: 28, keys: keys(second, first, false), instructions: INSTRUCTIONS_SWITCH_CATEGORIES },
        { trialCount: 20, keys: keys(second, first, true), instructions: INSTRUCTIONS_FIRST_COMBINED },
        { trialCount: 40, keys: keys(second, first, true), instructions: INSTRUCTIONS_SECOND_COMBINED },
    ];
}

/** Trial order as iat10.js builds it (getMiniMixer2/getMiniMixer4): mini-blocks of one trial per category, each shuffled, targets and
 *  attributes alternating in combined blocks, so left and right responses stay balanced. */
export function procedureSequenceCategories(block, random) {
    const sequence = [];
    const { left, right } = block.keys;
    while (sequence.length < block.trialCount) {
        if (left.length === 2) {
            const targets = random.below(2) ? [right[0], left[0]] : [left[0], right[0]];
            const attributes = random.below(2) ? [right[1], left[1]] : [left[1], right[1]];
            sequence.push(targets[0], attributes[0], targets[1], attributes[1]);
        } else {
            sequence.push(...(random.below(2) ? [right[0], left[0]] : [left[0], right[0]]));
        }
    }
    return sequence;
}

/** Block instructions worded as iat10.js's templates (what implicit.harvard.edu shows). */
export function procedureInstructionLines(set, block, blockIndex, touch) {
    const names = set.categories.map(c => c.name);
    const left = names[block.keys.left[0]], right = names[block.keys.right[0]];
    const leftAttribute = names[block.keys.left[1]] || '', rightAttribute = names[block.keys.right[1]] || '';
    const leftKey = touch ? 'the left green area' : 'the E key';
    const rightKey = touch ? 'the right green area' : 'the I key';
    const lines = [`Part ${blockIndex + 1} of ${PROCEDURE_BLOCK_COUNT}`, ''];
    const errorLine = touch ? 'If you make a mistake, a red X will appear. Touch the other side.'
                            : 'If you make a mistake, a red X will appear. Press the other key to continue.';
    switch (block.instructions) {
    case INSTRUCTIONS_CATEGORIES_PRACTICE:
    case INSTRUCTIONS_ATTRIBUTES_PRACTICE:
        lines.push(`Put a left finger ${touch ? 'over' : 'on'} ${leftKey} for items that belong to the category ${left}.`,
                   `Put a right finger ${touch ? 'over' : 'on'} ${rightKey} for items that belong to the category ${right}.`);
        if (block.instructions === INSTRUCTIONS_CATEGORIES_PRACTICE) lines.push('Items will appear one at a time.');
        lines.push(errorLine);
        break;
    case INSTRUCTIONS_FIRST_COMBINED:
    case INSTRUCTIONS_SECOND_COMBINED:
        if (block.instructions === INSTRUCTIONS_SECOND_COMBINED) lines.push('This is the same as the previous part.');
        lines.push(`Use ${leftKey} for ${left} and for ${leftAttribute}.`, `Use ${rightKey} for ${right} and for ${rightAttribute}.`,
                   'Each item belongs to only one category.');
        if (block.instructions === INSTRUCTIONS_FIRST_COMBINED) lines.push(errorLine);
        break;
    case INSTRUCTIONS_SWITCH_CATEGORIES:
        lines.push('Watch out, the labels have changed position!',
                   `Use the left finger ${touch ? 'over' : 'on'} ${leftKey} for ${left}.`,
                   `Use the right finger ${touch ? 'over' : 'on'} ${rightKey} for ${right}.`);
        break;
    }
    lines.push('Go as fast as you can while being accurate.',
               touch ? 'Touch the lower green area to start.' : 'Press the space bar when you are ready to start.');
    return lines;
}

export class Procedure {
    /** @param options {random, timeScale, touch}  timeScale=100 shrinks waits for automated tests. */
    constructor(frontend, set, pairingOrder, options = {}) {
        this.frontend = frontend;
        this.set = set;
        this.pairingOrder = pairingOrder;
        this.random = options.random;
        this.timeScale = options.timeScale || 1;
        this.touch = !!options.touch;
        this.trials = [];
    }

    nowMs() { return performance.now() * this.timeScale; }
    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms / this.timeScale)); }

    async waitForContinue() {
        this.frontend.discardPendingKeys();
        for (;;) {
            const key = await this.frontend.readKey();
            if (key === KEY_CONTINUE) return true;
            if (key === KEY_QUIT) return false;
        }
    }

    /** Runs all seven blocks. Resolves false if the participant quit. */
    async run() {
        const blocks = procedureDefineBlocks(this.pairingOrder);
        for (let b = 0; b < blocks.length; b++) {
            if (!await this.runBlock(blocks[b], b)) return false;
        }
        return true;
    }

    async runBlock(block, blockIndex) {
        this.frontend.showMessage(procedureInstructionLines(this.set, block, blockIndex, this.touch));
        if (!await this.waitForContinue()) return false;
        const sequence = procedureSequenceCategories(block, this.random);
        // items cycle through each category from a random start, so every item is seen before any repeats
        const nextItem = this.set.categories.map(c => this.random.below(c.items.length));
        this.frontend.showHeader(this.set, block.keys);
        for (const category of sequence) {
            const itemCount = this.set.categories[category].items.length;
            const itemIndex = nextItem[category];
            nextItem[category] = (itemIndex + 1) % itemCount;
            if (nextItem[category] === 0) nextItem[category] = this.random.below(itemCount);
            if (!await this.runTrial(block, blockIndex, category, itemIndex)) return false;
        }
        return true;
    }

    async runTrial(block, blockIndex, category, itemIndex) {
        const correctKey = block.keys.left.includes(category) ? KEY_LEFT : KEY_RIGHT;
        this.frontend.clearStimulus();
        await this.sleep(PROCEDURE_INTER_TRIAL_MS);
        this.frontend.discardPendingKeys();
        this.frontend.showStimulus(this.set, category, itemIndex);
        const startedMs = this.nowMs();
        let errorCount = 0;
        for (;;) {
            const key = await this.frontend.readKey();
            if (key === KEY_QUIT) return false;
            if (key !== KEY_LEFT && key !== KEY_RIGHT) continue;
            if (key === correctKey) break;
            errorCount++;
            this.frontend.showError();
        }
        this.trials.push({ blockIndex, category, itemIndex, correctKey, errorCount, latencyMs: this.nowMs() - startedMs });
        return true;
    }
}
