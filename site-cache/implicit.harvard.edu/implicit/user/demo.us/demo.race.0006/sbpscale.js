

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
		progressBar: '<%= pagesMeta.number %> out of 20',
        header:'Questionnaire',
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
                name: 'sbp1',
		stem: 'Black people have jobs that White people should have.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp2',
		stem: 'Most Black people who receive support from welfare could get along without it if they tried.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp3',
		stem: 'White people and Black people can never be really comfortable with each other, even if they are close friends.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp4',
		stem: 'Most politicians care too much about Black people and not enough about the average citizen.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp5',
		stem: 'Black people come from a less able race and this explains why they are not as well off as most White people.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp6',
		stem: 'How different or similar do you think Black people are to people like yourself in how honest they are?',
		answers: ['Very different', 'Somewhat different', 'Somewhat similar', 'Very similar']
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
                name: 'sbp7',
		stem: 'Suppose that a child of yours had children with a person of very different color and physical characteristics than your own. Do you think you would be very bothered, bothered, bothered a little, or not bothered at  all, if your grandchildren did not physically resemble the people on your side of the family?',
		answers: ['Very bothered', 'Bothered', 'Bothered a little', 'Not bothered at all']
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
                name: 'sbp8',
		stem: 'I would  be willing to have sexual relationships with a Black person.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp9',
		stem: 'I would not mind if a suitably qualified Black person was appointed as my boss.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp10',
		stem: 'I would not mind if a Black  person who  had a similar economic background as mine joined my close family by marriage.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp11',
		stem: 'Black people should not push themselves where they are not wanted.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp12',
		stem: 'Many other groups have overcome prejudice and worked their way  up. Black people should do the same without special favor.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp13',
		stem: 'It is just a matter of some people not trying hard enough. If Black people would only try harder they could be as well off as White people.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp14',
		stem: 'Black people living here teach their children values and skills different from those required to be successful in this country.',
        answers: ['Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree']
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
                name: 'sbp15',
		stem: 'How different or similar do you think Black people are to other people like yourself in the values that they teach their children?',
		answers: ['Very different', 'Somewhat different', 'Somewhat similar', 'Very similar']
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
                name: 'sbp16',
		stem: 'How different or similar do you think Black people are to other people like yourself in their religious beliefs and practices?',
		answers: ['Very different', 'Somewhat different', 'Somewhat similar', 'Very similar']
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
                name: 'sbp17',
		stem: 'How different or similar do you think Black people are to other people like yourself in their sexual values or sexual practices?',
		answers: ['Very different', 'Somewhat different', 'Somewhat similar', 'Very similar']
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
                name: 'sbp18',
		stem: 'How different or similar do you think Black people are to other people like yourself in the language that they speak?',
		answers: ['Very different', 'Somewhat different', 'Somewhat similar', 'Very similar']
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
                name: 'sbp19',
		stem: 'How often have you felt sympathy for Black people?',
		answers: ['Very often', 'Fairly often', 'Not too often', 'Never']
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
                name: 'sbp20',
		stem: 'How often have you felt admiration for Black people?',
		answers: ['Very often', 'Fairly often', 'Not too often', 'Never']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















