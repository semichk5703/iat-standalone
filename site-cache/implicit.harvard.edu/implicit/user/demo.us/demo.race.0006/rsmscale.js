

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
		progressBar: '<%= pagesMeta.number %> out of 6',
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
                name: 'rsm1',
		stem: 'Please indicate how well you think the word(s) below describes Black people as a group.<br/><br/>Lazy.',
		answers: ['Never accurate', 'Very rarely accurate', 'Rarely accurate', 'Ocassionally accurate', 'Frequently accurate', 'Very frequently accurate', 'Always accurate']
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
                name: 'rsm2',
		stem: 'Please indicate how well you think the word(s) below describes Black people as a group.<br/><br/>Determined to succeed.',
		answers: ['Never accurate', 'Very rarely accurate', 'Rarely accurate', 'Ocassionally accurate', 'Frequently accurate', 'Very frequently accurate', 'Always accurate']
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
                name: 'rsm3',
		stem: 'Please indicate how well you think the word(s) below describes Black people as a group.<br/><br/>Dependable',
		answers: ['Never accurate', 'Very rarely accurate', 'Rarely accurate', 'Ocassionally accurate', 'Frequently accurate', 'Very frequently accurate', 'Always accurate']
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
                name: 'rsm4',
		stem: 'Please indicate how well you think the word(s) below describes Black people as a group.<br/><br/>Hardworking.',
		answers: ['Never accurate', 'Very rarely accurate', 'Rarely accurate', 'Ocassionally accurate', 'Frequently accurate', 'Very frequently accurate', 'Always accurate']
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
                name: 'rsm6',
		stem: 'Please indicate how well you think the word(s) below describes Black people as a group.<br/><br/>Aggressive/Violent',
		answers: ['Never accurate', 'Very rarely accurate', 'Rarely accurate', 'Ocassionally accurate', 'Frequently accurate', 'Very frequently accurate', 'Always accurate']
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
                name: 'rsm5',
		stem: 'Most Black parents don\'t teach their children the self-discipline and skills it takes to get ahead in America.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});


















