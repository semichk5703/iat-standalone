// mgr.js — the Race IAT study as the live site runs it, built from published files only.
//
// Where each part comes from (PROTOCOL has the source classes):
//   label sets, attribute words, explicit questions, IAT instructions, IAT task
//                       minno-tasks docs/studies/raceiat/ [minno] — the same files, unchanged
//   demographics        minno-tasks scripts/demographics.js [minno], unchanged
//   one scale           Project Implicit's public codebook [dataset], via codebook_items.js
//   order of the parts  the live site's manager [live]: explicits, demographics, the IAT and (desktop only)
//                       one scale in random order, then the last page.  The live site's opening screen,
//                       age check and debriefing are not published, so this study starts at the parts
//                       and ends with its own last page [ours].
define(['managerAPI', './codebook_items.js', './codebook_questionnaire.js'], function (Manager, codebookItems, CodebookQuestionnaire) {
    const API = new Manager();
    const RACEIAT = '../../../upstream/minno-tasks/docs/studies/raceiat/';   // relative to this file
    const DEMOGRAPHICS = '../../../upstream/minno-tasks/scripts/demographics.js';
    // Touch devices skip the scale on the live site [live]; it chooses by entry page, this page by input type [ours].
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    API.setName('mgr');
    init_data_pipe(API, 'offline', {file_type: 'csv'});   // offline/results_sink.js: results stay on this computer

    // Copied from minno-tasks docs/studies/raceiat/mgr.js lines 8-48 [minno]: which label set, and the
    // attribute words (Axt, Feng & Bar-Anan 2021), shuffled so the IAT shows the first 8 of each.
    const raceSet = API.shuffle(['a', 'b'])[0];
    API.addGlobal({
        raceiat: {},
        isTouch: isTouch,
        baseURL: RACEIAT + 'images/',
        raceSet: raceSet,
        blackLabels: [raceSet === 'a' ? 'African Americans' : 'Black people'],
        whiteLabels: [raceSet === 'a' ? 'European Americans' : 'White people'],
        posWords: API.shuffle([
            'Love', 'Cheer', 'Friend', 'Pleasure', 'Adore', 'Cheerful', 'Friendship', 'Joyful',
            'Smiling', 'Cherish', 'Excellent', 'Glad', 'Joyous', 'Spectacular', 'Appealing', 'Delight',
            'Excitement', 'Laughing', 'Attractive', 'Delightful', 'Fabulous', 'Glorious', 'Pleasing', 'Beautiful',
            'Fantastic', 'Happy', 'Lovely', 'Terrific', 'Celebrate', 'Enjoy', 'Magnificent', 'Triumph'
        ]),
        negWords: API.shuffle([
            'Abuse', 'Grief', 'Poison', 'Sadness', 'Pain', 'Despise', 'Failure', 'Nasty',
            'Angry', 'Detest', 'Horrible', 'Negative', 'Ugly', 'Dirty', 'Gross', 'Evil',
            'Rotten', 'Annoy', 'Disaster', 'Horrific', 'Scorn', 'Awful', 'Disgust', 'Hate',
            'Humiliate', 'Selfish', 'Tragic', 'Bothersome', 'Hatred', 'Hurtful', 'Sickening', 'Yucky'
        ])
    });

    const scaleTasks = Object.keys(codebookItems).map(scaleName => ({
        type: 'quest',
        name: scaleName,
        script: new CodebookQuestionnaire(scaleName, codebookItems[scaleName]).script()
    }));

    API.addTasksSet({
        raceiat_instructions: [{
            type: 'message', name: 'raceiat_instructions', buttonText: 'Continue',
            templateUrl: RACEIAT + 'raceiat_instructions.jst', title: 'IAT Instructions', header: 'Implicit Association Test'
        }],
        explicits: [{ type: 'quest', name: 'explicits', scriptUrl: RACEIAT + 'explicits.js' }],
        raceiat: [{ type: 'time', name: 'raceiat', scriptUrl: RACEIAT + 'raceiat.js' }],
        demographics: [{ type: 'quest', name: 'demographics', scriptUrl: DEMOGRAPHICS }],
        lastpage: [{
            type: 'message', name: 'lastpage', last: true,
            template: '<div class="panel-body"><p class="lead">You have completed the study. ' +
                      'Your answers have not been sent anywhere: they are offered below as a file, for you to keep or delete.</p></div>'
        }]
    });

    const parts = [
        {inherit: 'explicits'},
        {inherit: 'demographics'},
        {mixer: 'wrapper', data: [{inherit: 'raceiat_instructions'}, {inherit: 'raceiat'}]}   // instructions just before the IAT
    ];
    if (!isTouch) parts.push({mixer: 'choose', n: 1, data: scaleTasks});

    API.addSequence([
        {mixer: 'random', data: parts},
        {inherit: 'lastpage'}
    ]);

    return API.script;
});
