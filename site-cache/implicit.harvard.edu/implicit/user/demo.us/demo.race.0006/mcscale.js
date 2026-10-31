

define(['questAPI'], function(Quest){
    var API = new Quest();

	API.addQuestionsSet('basicSelect', 
	{
		type: 'selectOne',
		autoSubmit:true,
		numericValues:true, 
		required : true, 		
		errorMsg: {
			required: 
			"Please select an answer, or click 'Decline to Answer'"
		},
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'   
	});
    
API.addPagesSet('qPage', 
	{
		progressBar: '<%= pagesMeta.number %> out of 10',
         header: 'Questionnaire',
		decline:true,
		v1style:2,
		numbered: false
	});

    API.addSequence([
    {mixer:'random', // declare the mixer
    data:[
    // 1. This is a page object
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 2a. But only one question
            {
                inherit : {set:'basicSelect'},
                name: 'mc1',
		stem: 'Local governments should be allowed to ban books and movies that they think are harmful to the public.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc2',
		stem: 'Birth control devices should be available to any adult who wants them.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc3',
		stem: 'Men and women should have the same legal rights.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc4',
		stem: 'There are too many shows on television that make fun of traditional family values.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
    }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc5',
		stem: 'Women are happiest if they stick to keeping a home and raising children.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc6',
		stem: 'There should be laws against marriage between Black and White people.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc7',
		stem: "Abortion should be a private matter between a woman and her doctor.",
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc8',
		stem: "The government should prohibit the use of marijuana.",
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc9',
		stem: "Homosexuals should be able to do what they want to so long as they don&#8217t hurt other people.",
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'mc10',
		stem: "If a man and a woman want to live together without getting married, that&#8217s their business.",
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    }  
    ]}
]);
	return API.script;
});














