

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
		progressBar: '<%= pagesMeta.number %> out of 21',
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
                name: 'raw1',
		stem: 'Most people spend too much time in unprofitable amusements.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw2',
		stem: 'Our society would have fewer problems if people had less leisure time.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw3',
		stem: 'Money acquired easily is usually spent unwisely.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw4',
		stem: 'Most people who don&#39;t succeed in life are just plain lazy.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw5',
		stem: 'Anyone who is willing and able to work hard has a good chance of succeeding.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw6',
		stem: 'People who fail at a job have usually not tried hard enough.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw7',
		stem: 'Life would have very little meaning if we never had to suffer.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw8',
		stem: 'The person who can approach an unpleasant task with enthusiasm is the person who gets ahead.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw9',
		stem: 'If people work hard enough they are likely to make a good life for themselves.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw10',
		stem: 'I feel uneasy when there is little work for me to do.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw11',
		stem: 'A distaste for hard work usually reflects a weakness of character.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw12',
		stem: 'One should be kind to all people.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw13',
		stem: 'One should find ways to help others less fortunate than oneself.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw14',
		stem: 'A person should be concerned about the well-being of others.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw15',
		stem: 'There should be equality for everyone because we are all human beings.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw16',
		stem: 'Those who are unable to provide for their basic needs should be helped by others.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw17',
		stem: 'A good society is one in which people feel responsible for one another.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw18',
		stem: 'Everyone should have an equal chance and an equal say in most things.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw19',
		stem: 'Acting to protect the rights and interests of other members of the community is a major obligation for all people.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw20',
		stem: 'In dealing with criminals, the courts should recognize that many are victims of circumstances.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'raw21',
		stem: 'Prosperous nations have a moral obligation to share some of their wealth with poor nations.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















