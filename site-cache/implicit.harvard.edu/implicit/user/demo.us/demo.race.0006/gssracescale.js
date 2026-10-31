

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
		progressBar: '<%= pagesMeta.number %> out of 22',
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
                name: 'gsrace1',
		stem: 'Do you think there should be laws against marriages between Black and White people?',
		answers: ['Yes', 'No']
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
                name: 'gsrace2',
		stem: 'White people have the right to keep Black people out of their neighborhoods if they want to, and Black people should respect that right.',
		answers: ['Agree', 'Neither agree nor disagree','Disagree']
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
                name: 'gsrace3',
		stem: 'How strongly would you object if a member of your family wanted to bring a Black friend home to dinner?',
		answers: ['Object strongly', 'Object mildly', 'Not object at all']
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
                name: 'gsrace4a',
		stem: 'How in favor would you be of living in a neighborhood where half of your neighbors were Black people?',
		answers: ['Very much in favor', 'Somewhat in favor', 'Neither in favor or opposed', 'Somewhat opposed', 'Very much opposed']
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
                name: 'gsrace4b',
		stem: 'How in favor would you be of having a close relative or family member marry a Black person?',
		answers: ['Very much in favor', 'Somewhat in favor', 'Neither in favor or opposed', 'Somewhat opposed', 'Very much opposed']
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
                name: 'gsrace5',
		stem: 'If a Black person with the same income and education as you moved into your block, would it make any difference to you?',
		answers: ['Would make a difference', 'Would make no difference']
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
                name: 'gsrace6',
		stem: 'How would it make you feel if a close relative of yours were planning to marry a Black person?',
		answers: ['Very uneasy', 'Somewhat uneasy', 'Not uneasy at all']
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
                name: 'gsrace7',
		stem: 'If your party nominated a Black person for President, would you vote for them if they were qualified for the job?',
		answers: ['Yes', 'No']
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
                name: 'gsrace8',
		stem: 'Would you yourself have any objections to sending your children to a school where half of the children are Black?',
		answers: ['Object strongly', 'Object mildly', 'Not object at all']
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
                name: 'gsrace9',
		stem: 'Do you think White students and Black students should go to the same schools or separate schools?',
		answers: ['Separate schools', 'Same schools']
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
                name: 'gsrace10',
		stem: 'If you could find the housing that you would want and like, would you rather live in a neighborhood that is all Black; mostly Black; half Black; half White; mostly White; or all White?',
		answers: ['All Black', 'Mostly Black', 'Half Black', 'Half White', 'Mostly White', 'All White']
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
                name: 'gsrace11',
		stem: 'Do Black people attend the church that you, yourself, attend most often, or not?',
		answers: ['Yes', 'No', 'Do not attend church']
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
                name: 'gsrace12',
		stem: 'Black people shouldn\'t push themselves where they\'re not wanted.',
		answers: ['Agree', 'Neither agree nor disagree','Disagree']
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
                name: 'gsrace13',
		stem: 'Have you ever stopped buying certain products because of the way the company or country which makes them has treated Black people?',
		answers: ['Yes', 'No']
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
                name: 'gsrace14a',
		stem: 'You can expect special problems with marriages between Black and White people.',
		answers: ['Agree', 'Neither agree nor disagree','Disagree']
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
                name: 'gsrace14b',
		stem: 'You can expect special problems with Black supervisors getting along with workers that are mostly White.',
		answers: ['Agree', 'Neither agree nor disagree','Disagree']            }
        ]    
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gsrace15',
		stem: 'A school board should not hire a person to teach if that person belongs to an organization that opposes school integration.',
		answers: ['Agree', 'Neither agree nor disagree','Disagree']            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gsrace16',
		stem: 'If you were driving through the neighborhoods in a city, would you go out of your way to avoid going through a Black section?',
		answers: ['Yes', 'No']
            }
        ]
    },
    
    {
        mixer:'wrapper',
        data:[
    
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gsrace17',
		stem: 'If you and your friends belonged to a social club that would not let Black people join, would you try to change the rules so that Black people could join?',
		answers: ['Yes', 'No']
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
                name: 'gsrace18',
		stem: 'If you could not get the rules changed, do you think you would resign from the club, even if your friends didn&#8217t?',
		answers: ['Yes', 'No']
            }
        ]
    }
]},
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gsrace19',
		stem: 'How important is the race relations issues to you?',
		answers: ['One of the most important issues', 'Important', 'Not very important', 'Not important at all']
            }
        ]    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gsrace20',
		stem: 'How concerned are you personally about race relations?',
		answers: ['Very concerned', 'Somewhat concerned', 'Not very concerned','Not concerned at all']
            }
        ]
    }
    ]}
]);
	return API.script;
});















