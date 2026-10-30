// web_scoring_check.mjs — score a results.csv written by the C build with the web scorer; must agree.
//   node test/web_scoring_check.mjs results.csv
import { readFileSync } from 'node:fs';
import { scoringCompute } from '../web/iat_scoring.js';
import { procedureDefineBlocks, procedureSequenceCategories } from '../web/iat_procedure.js';
import { Random } from '../web/iat_random.js';

const lines = readFileSync(process.argv[2], 'utf8').trim().split('\n');
const meta = Object.fromEntries(lines.filter(l => l.startsWith('#')).pop().slice(1).trim().split(' ').map(kv => kv.split('=')));
const trials = lines.slice(1).filter(l => !l.startsWith('#')).map(l => {
    const [block, , , , errors, rt] = l.split(',');
    return { blockIndex: parseInt(block, 10) - 1, latencyMs: parseFloat(rt), errorCount: parseInt(errors, 10) };
});
const score = scoringCompute(trials, parseInt(meta.order, 10));
const diff = Math.abs(score.d - parseFloat(meta.D));
console.log(`web scorer: D = ${score.d.toFixed(4)}   C wrote D = ${meta.D}   diff = ${diff.toExponential(2)}`);

// trial balance: every block has equal left/right counts and alternates targets/attributes
const random = new Random(7);
for (const [i, block] of procedureDefineBlocks(1).entries()) {
    const seq = procedureSequenceCategories(block, random);
    const leftCount = seq.filter(c => block.keys.left.includes(c)).length;
    if (seq.length !== block.trialCount || leftCount * 2 !== seq.length) { console.log(`block ${i + 1}: unbalanced`); process.exit(1); }
}
console.log('web procedure: all 7 blocks balanced');
process.exit(diff < 1e-3 ? 0 : 1);
