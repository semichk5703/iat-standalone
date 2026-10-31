

define(['questAPI'], function(Quest){
    var API = new Quest();

	API.addQuestionsSet('basicSelect', 
	{
		type: 'selectOne',
		autoSubmit:true,
		required : true, 		
		errorMsg: {
			required: 
			"Please select an answer, or click 'Decline to Answer'"
		},
		numericValues:true, 
		helpText: 'Selecting an answer once colors it blue.<br/>You can change your answer by selecting another option.<br/>To confirm, click the selected (blue) button a second time.'   
	});
    
API.addPagesSet('qPage', 
	{
		progressBar: '<%= pagesMeta.number %> out of 12',
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
        name: 'anes1',
		stem: 'Do you feel warm, cold, or neither warm nor cold toward Black people?',
		answers: ['Warm', 'Cold', 'Neither warm nor cold']
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
                name: 'anes2',
		stem: 'How often have you felt sympathy for Black people?',
		answers: ['Always', 'Most of The time', 'About half the time', 'Once in a while', 'Never']
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
                name: 'anes3',
		stem: 'How often have you felt admiration for Black people?',
		answers: ['Always', 'Most of The time', 'About half the time', 'Once in a while', 'Never']
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
                name: 'anes4',
		stem: 'Where would you rate Black people on this scale?',
		answers: ['Very hardworking', 'Moderately hardworking', 'Slightly hardworking', 'Neither hardworking nor lazy', 'Slightly lazy', 'Moderately lazy', 'Very lazy']
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
                name: 'anes5',
		stem: 'Where would you rate Black people on this scale?',
		answers: ['Very intelligent', 'Moderately intelligent', 'Slightly intelligent', 'Neither intelligent nor unintelligent', 'Slightly unintelligent', 'Moderately unintelligent', 'Very unintelligent']
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
                name: 'anes6',
		stem: 'Would you say that Black people have too much influence in politics, just about the right amount of influence in politics, or too little influence in politics?',
		answers: ['Too much influence', 'Just about the right amount of influence', 'Too little influence']
            }
        ]
    }]},
    {mixer:'random', // declare the mixer
    data:[
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'op1',
		stem: 'Does the average person prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
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
                name: 'op2',
		stem: 'Does the culture you live in prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
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
                name: 'op3',
		stem: 'Do most people prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
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
                name: 'op4',
		stem: 'Do your friends tend to prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
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
                name: 'op5',
		stem: 'Do your family members tend to prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
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
                name: 'op6',
		stem: 'Do people you know tend to prefer Black people or White people?',
		answers: ['Strongly prefer White to Black', 'Moderately prefer White to Black', 'Slightly prefer White to Black', 'Neutral', 'Slightly prefer Black to White', 'Moderately prefer Black to White', 'Strongly prefer Black to White']
            }
        ]
    }
    
    ]}
]);
	return API.script;
});

















