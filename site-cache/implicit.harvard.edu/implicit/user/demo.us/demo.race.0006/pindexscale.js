

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
                name: 'pindex1',
		stem: 'Where would you put Black people on this scale?',
		answers: ['Very hard working', 'Moderately hard working', 'Slightly hard working', 'Neither hard working nor lazy', 'Slightly lazy', 'Moderately lazy', 'Very lazy']
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
                name: 'pindex2',
		stem: 'Do Black people tend to be violence prone or do they tend not to be prone to violence?',
		answers: ['Very violence prone', 'Moderately violence prone', 'Slightly violence prone', 'Neutral', 'Slightly not violence prone', 'Moderately not violence prone', 'Very not violence prone']
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
                name: 'pindex3',
		stem: 'Do Black people tend to be unintelligent or tend to be intelligent?',
		answers: ['Very unintelligent', 'Moderately unintelligent', 'Slightly unintelligent', 'Neither intelligent nor unintelligent', 'Slightly intelligent', 'Moderately intelligent', 'Very intelligent']
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
                name: 'pindex4',
		stem: 'Do Black people tend to prefer to be self-supporting or do they tend to prefer to live off welfare?',
		answers: ['Strongly prefer to be self supporting', 'Moderately prefer to be self supporting', 'Slightly prefer to be self supporting', 'Neutral', 'Slightly prefer to live off welfare', 'Moderately prefer to live off welfare', 'Strongly prefer to live off welfare']
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
                name: 'pindex5',
		stem: 'Do Black people tend to be patriotic or do they tend to be unpatriotic?',
		answers: ['Very patriotic', 'Moderately patriotic', 'Slightly patriotic', 'Neutral', 'Slightly unpatriotic', 'Moderately unpatriotic', 'Very unpatriotic']
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
                name: 'pindex6',
		stem: 'Where would you put White people on this scale?',
		answers: ['Very hard working', 'Moderately hard working', 'Slightly hard working', 'Neither hard working nor lazy', 'Slightly lazy', 'Moderately lazy', 'Very lazy']
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
                name: 'pindex7',
		stem: 'Do White people tend to be violence prone or do they tend not to be prone to violence?',
		answers: ['Very violence prone', 'Moderately violence prone', 'Slightly violence prone', 'Neutral', 'Slightly not violence prone', 'Moderately not violence prone', 'Very not violence prone']
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
                name: 'pindex8',
		stem: 'Do White people tend to be unintelligent or tend to be intelligent?',
		answers: ['Very unintelligent', 'Moderately unintelligent', 'Slightly unintelligent', 'Neither intelligent nor unintelligent', 'Slightly intelligent', 'Moderately intelligent', 'Very intelligent']
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
                name: 'pindex9',
		stem: 'Do White people tend to prefer to be self-supporting or do they tend to prefer to live off welfare?',
		answers: ['Strongly prefer to be self supporting', 'Moderately prefer to be self supporting', 'Slightly prefer to be self supporting', 'Neutral', 'Slightly prefer to live off welfare', 'Moderately prefer to live off welfare', 'Strongly prefer to live off welfare']
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
                name: 'pindex10',
		stem: 'Do White people tend to be patriotic or do they tend to be unpatriotic?',
		answers: ['Very patriotic', 'Moderately patriotic', 'Slightly patriotic', 'Neutral', 'Slightly unpatriotic', 'Moderately unpatriotic', 'Very unpatriotic']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















