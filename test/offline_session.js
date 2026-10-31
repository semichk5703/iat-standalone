// offline_session.js — a scripted participant takes a study through offline/index.html, with the network blocked
// except for the local server, and saves the results the page offers.  The study is the page's default (the race
// study: questionnaires and Project Implicit's Race IAT) or minno-tasks' demo menu, where it picks Black/White.
//   node test/offline_session.js http://127.0.0.1:8768/offline/index.html results.json
// On questionnaire pages it picks each question's first answer, or declines a page that asks for more.
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
        const participant = new ScriptedParticipant(path.join(__dirname, '..', 'upstream/minno-tasks/docs/studies/raceiat/mgr.js'));
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
        if (await page.$('text=Choose a task')) {          // minno-tasks' demo menu
            await page.click('text=Black/White');
            await page.click('text=Submit');
        }

        let part = 0, firstPairingText = null, trials = 0;
        const pagesSeen = [];
        for (let step = 0; step < 20000 && !(await page.$('#offline-results a')); step++) {
            await this.advance(page, 20);
            const text = await page.innerText('body');
            if (await this.answerPage(page, pagesSeen)) continue;
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
        console.log(`pages answered: ${pagesSeen.join(', ') || 'none'}`);
        console.log(`trials answered: ${trials}; blocked external requests: ${blocked.length}`);
        for (const address of blocked) console.log(`  blocked: ${address}`);
        await browser.close();
        return blocked.length === 0 ? 0 : 1;
    }

    /** A questionnaire or message page: answer it and move on.  Returns false on any other screen. */
    async answerPage(page, pagesSeen) {
        const form = await page.$('[piq-page]');
        if (form) {
            pagesSeen.push((await page.innerText('[piq-page] h3').catch(() => '?')).trim());
            for (const list of await page.$$('[piq-page] [quest-select-one] .list-group')) {
                const first = await list.$('button.list-group-item');
                if (first) await first.click();
            }
            await this.advance(page, 50);
            const invalid = await page.$('[piq-page].ng-invalid');
            const decline = await page.$('[piq-page] button:has-text("Decline")');
            const submit = await page.$('[piq-page] button:has-text("Submit")');
            const button = invalid && decline ? decline : submit || decline;
            if (!button) return false;
            await button.click();
            if (button === decline) {                       // minno-quest asks to confirm a decline with a second press
                await this.advance(page, 50);
                const again = await page.$('[piq-page] button:has-text("Decline")');
                if (again) await again.click();
            }
            await this.advance(page, 300);
            return true;
        }
        const messageButton = await page.$('#minno-canvas [pi-message-done]');
        if (messageButton && await messageButton.isVisible()) {
            pagesSeen.push('message');
            await messageButton.click();
            await this.advance(page, 300);
            return true;
        }
        return false;
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
