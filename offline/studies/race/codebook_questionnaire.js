// codebook_questionnaire.js — one scale from Project Implicit's public codebook as a minno-quest questionnaire.
// The items' wording and answer codes come from codebook_items.js unchanged (tools/codebook_to_questionnaires.py,
// [dataset]).  The page settings follow the live site's scale files [live: demo.race.0006/*scale.js, e.g.
// sdoscale.js's basicSelect and qPage sets; references/live-site/manifest.txt has their sha256]: one question
// per page, pages in random order, an answer is required unless declined, and choosing an answer twice
// submits it.
define(['questAPI'], function (Quest) {

    /** Builds the questionnaire script for one scale. */
    class CodebookQuestionnaire {
        // the live site's wording for these settings [live]
        static REQUIRED_MESSAGE = "Please select an answer, or click 'Decline to Answer'";
        static HELP_TEXT = 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.' +
                           '<br/>To confirm, click the selected (blue) button a second time.';

        constructor(scaleName, items) {
            this.scaleName = scaleName;   // the codebook prefix, e.g. 'sdof'; it names the task in the results
            this.items = items;           // [{name, stem, answers: [{text, value}]}], from codebook_items.js
        }

        page(item) {
            return {
                header: 'Questionnaire',
                progressBar: `<%= pagesMeta.number %> out of ${this.items.length}`,
                decline: true,
                v1style: 2,
                numbered: false,
                questions: [{
                    type: 'selectOne',
                    autoSubmit: true,
                    required: true,
                    errorMsg: { required: CodebookQuestionnaire.REQUIRED_MESSAGE },
                    helpText: CodebookQuestionnaire.HELP_TEXT,
                    name: item.name,
                    stem: item.stem,
                    answers: item.answers,        // with the codebook's codes as values, so results read against it
                }],
            };
        }

        script() {
            const API = new Quest();
            API.addSequence([{ mixer: 'random', data: this.items.map(item => this.page(item)) }]);
            return API.script;
        }
    }

    return CodebookQuestionnaire;
});
