

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
                name: 'efp1',
		stem: 'There are many poor people in the world because of...<br><br>Lack of thrift and proper money-management skills.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp2',
		stem: 'There are many poor people in the world because of...<br><br>Lack of effort by the poor themselves.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp3',
		stem: 'There are many poor people in the world because of...<br><br>Lack of ability and talent.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp4',
		stem: 'There are many poor people in the world because of...<br><br>Their background gives them attitudes that keep them from improving their condition.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp5',
		stem: 'There are many poor people in the world because of...<br><br>Failure of society to provide good schools for all.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp6',
		stem: 'There are many poor people in the world because of...<br><br>Loose morals and drunkenness.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp7',
		stem: 'There are many poor people in the world because of...<br><br>Sickness and physical handicaps.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp8',
		stem: 'There are many poor people in the world because of...<br><br>Low wages in some business and industries.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp9',
		stem: 'There are many poor people in the world because of...<br><br>Failure of private industry to provide enough jobs.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp10',
		stem: 'There are many poor people in the world because of...<br><br>Prejudice and discrimination against poor people.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp11',
		stem: 'There are many poor people in the world because of...<br><br>Being taken advantage of by rich people.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
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
                name: 'efp12',
		stem: 'There are many poor people in the world because of...<br><br>Just bad luck.',
		answers: ['Not at all important', 'Slightly important', 'Moderately imporant', 'Very important', 'Extremely important']
            }
        ]
    }
    
    
    
    ]}
]); 	return API.script;
});














