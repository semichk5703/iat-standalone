// codebook_questionnaire.js — one scale from Project Implicit's public codebook as a minno-quest questionnaire.
// The items' wording and answer codes come from codebook_items.js unchanged (tools/codebook_to_questionnaires.py);
// only the page around them is this repository's own [ours], because the codebook records answers, not layout.
define(['questAPI'], function (Quest) {

    /** Builds the questionnaire script for one scale: all its items on one page, in the codebook's numbered
     *  order, each one optional (the live site's demographics let a participant decline any question too). */
    class CodebookQuestionnaire {
        constructor(scaleName, items) {
            this.scaleName = scaleName;   // the codebook prefix, e.g. 'sdof'; it names the task in the results
            this.items = items;           // [{name, stem, answers: [{text, value}]}], from codebook_items.js
        }

        question(item) {
            return { type: 'selectOne', name: item.name, stem: item.stem, answers: item.answers };
        }

        script() {
            const API = new Quest();
            API.addSequence([{
                header: 'Questionnaire',          // the header the live site's scale pages show [live]
                questions: this.items.map(item => this.question(item)),
                submitText: 'Submit',
            }]);
            return API.script;
        }
    }

    return CodebookQuestionnaire;
});
