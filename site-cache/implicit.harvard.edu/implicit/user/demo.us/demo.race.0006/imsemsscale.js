

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
                name: 'imsems1',
		stem: 'Because of today&#8217s PC (politically correct) standards, I try to appear nonprejudiced.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems2',
		stem: 'I try to hide any negative prejudicial thoughts in order to avoid negative reactions from others.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems3',
		stem: 'If I acted prejudiced, I would be concerned that others would be angry with me.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems4',
		stem: 'I attempt to appear nonprejudiced in order to avoid disapproval from others.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems5',
		stem: 'I try to act nonprejudiced because of pressure from others.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems6',
		stem: 'I attempt to act in nonprejudiced ways because it is personally important to me.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems7',
		stem: 'According to my personal values, using stereotypes is OK.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems8',
		stem: 'I am personally motivated by my beliefs to be nonprejudiced.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems9',
		stem: 'Because of my personal values, I believe that using stereotypes is wrong.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
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
                name: 'imsems10',
		stem: 'Being nonprejudiced is important to my self-concept.',
		answers: ['Very strongly disagree','Strongly disagree','Moderately disagree','Slightly disagree','Neither agree nor disagree','Slightly agree','Moderately agree','Strongly agree','Very strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















