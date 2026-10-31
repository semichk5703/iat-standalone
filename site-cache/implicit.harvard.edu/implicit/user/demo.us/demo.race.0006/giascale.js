

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
                name: 'gia1',
		stem: "When interacting with Black people, I feel...<br><br>Nervous.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia2',
		stem: "When interacting with Black people, I feel...<br><br>Friendly.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia3',
		stem: "When interacting with Black people, I feel...<br><br>Uncertain.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia4',
		stem: "When interacting with Black people, I feel...<br><br>Comfortable.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia5',
		stem: "When interacting with Black people, I feel...<br><br>Worried.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia6',
		stem: "When interacting with Black people, I feel...<br><br>Trusting.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia7',
		stem: "When interacting with Black people, I feel...<br><br>Threatened.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia8',
		stem: "When interacting with Black people, I feel...<br><br>Confident.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia9',
		stem: "When interacting with Black people, I feel...<br><br>Awkward.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia10',
		stem: "When interacting with Black people, I feel...<br><br>Safe.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia11',
		stem: "When interacting with Black people, I feel...<br><br>Anxious.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
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
                name: 'gia12',
		stem: "When interacting with Black people, I feel...<br><br>At ease.",
		answers: ["Never", "Very rarely", "Rarely", "Occasionally", "Frequently", "Very frequently", "Always"]
            }
        ]
    }
    ]}
]);
	return API.script;
});














