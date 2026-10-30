// offline_session.js — a scripted participant takes Project Implicit's own Race IAT through offline/index.html,
// with the network blocked except for the local server, and saves the results the page offers.
//   node test/offline_session.js http://127.0.0.1:8768/offline/index.html?iat=11 results.json
// Playwright's fake clock drives the page's timers and performance.now(), so each response time is exactly
// the latency chosen here (no real waiting): FIRST_PAIRING_MS for the blocks where the targets pair as in
// block 3, REVERSED_PAIRING_MS for blocks 6 and 7.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class ScriptedParticipant {
    static FIRST_PAIRING_MS = 550;
    static REVERSED_PAIRING_MS = 700;

    constructor(raceScriptPath) {
        // the race task's own word lists decide which attribute a word belongs to
        const source = fs.readFileSync(raceScriptPath, 'utf8');
        const words = name => source.split(name + ' : API.shuffle([')[1].split('])')[0].match(/'([^']+)'/g).map(w => w.slice(1, -1));
        this.goodWords = new Set(words('posWords'));
        this.badWords = new Set(words('negWords'));
    }

    /** The category labels an item belongs to, as the header might name them. */
    labelsFor(item) {
        if (/^b[mf]\d/.test(item)) return ['African Americans', 'Black people'];
        if (/^w[mf]\d/.test(item)) return ['European Americans', 'White people'];
        if (this.goodWords.has(item)) return ['Good'];
        if (this.badWords.has(item)) return ['Bad'];
        return null;
    }
}

class OfflineSessionApp {
    async run(url, outputPath) {
        const participant = new ScriptedParticipant(path.join(__dirname, '..', 'upstream/minno-tasks/docs/studies/datapipe.iat.examples/demo.iats/race.js'));
        const browser = await chromium.launch();
        const page = await browser.newPage();
        const blocked = [];
        await page.route('**/*', route => {
            const requested = route.request().url();
            if (/^(blob|data|file):/.test(requested) || (new URL(url).protocol !== 'file:' && requested.startsWith(new URL(url).origin))) return route.continue();
            blocked.push(requested);
            return route.abort();
        });
        await page.clock.install();
        await page.goto(url);
        await this.advance(page, 3000);
        await page.click('text=Black/White');
        await page.click('text=Submit');

        let part = 0, firstPairingText = null, trials = 0;
        for (let step = 0; step < 20000 && !(await page.$('#offline-results a')); step++) {
            await this.advance(page, 20);
            const text = await page.innerText('body');
            const partMatch = text.match(/Part (\d) of 7/);
            if (partMatch && /space bar/.test(text)) {
                part = Number(partMatch[1]);
                await page.keyboard.press(' ');
                continue;
            }
            if (/Press space to continue to the next task/.test(text)) {   // iat11.js finalText
                await page.keyboard.press(' ');
                continue;
            }
            const item = await this.currentItem(page, participant);
            if (!item) continue;
            const header = await page.evaluate(() => document.body.innerText.split('\n').slice(0, 8).join(' '));
            if (part === 3) firstPairingText = header;
            const leftText = header.split('Press "I" for')[0];
            const isLeft = participant.labelsFor(item).some(label => leftText.includes(label));
            const latency = part >= 6 ? ScriptedParticipant.REVERSED_PAIRING_MS : ScriptedParticipant.FIRST_PAIRING_MS;
            await this.advance(page, latency);
            await page.keyboard.press(isLeft ? 'e' : 'i');
            trials++;
        }
        await this.advance(page, 2000);
        console.log(`stopped in part ${part}; screen: ${(await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 200)}`);
        const json = await page.evaluate(() => window.offlineResults.asJson());
        fs.writeFileSync(outputPath, json);
        console.log(`trials answered: ${trials}; blocked external requests: ${blocked.length}`);
        await browser.close();
        return blocked.length === 0 ? 0 : 1;
    }

    async advance(page, milliseconds) {
        await page.clock.runFor(milliseconds);
    }

    /** The item on screen now: a picture's file name or a word the participant knows, or null. */
    async currentItem(page, participant) {
        // the player keeps finished stimuli in the page, hidden, so only visible pictures count
        const pictures = await page.$$eval('#minno-canvas img', images => images
            .filter(i => i.offsetParent !== null && getComputedStyle(i).visibility !== 'hidden' && i.getBoundingClientRect().width > 0)
            .map(i => (i.dataset.offlineSource || i.src).split('/').pop()));   // single-file: src is a data: URI
        const picture = pictures.find(name => participant.labelsFor(name));
        if (picture) return picture;
        const lines = (await page.innerText('#minno-canvas')).split('\n').map(l => l.trim());
        return lines.find(line => participant.labelsFor(line)) || null;
    }
}

new OfflineSessionApp().run(process.argv[2], process.argv[3]).then(code => process.exit(code));
