

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
                name: 'atb1',
		stem: 'If a Black person were put in charge of me, I would not mind taking advice and direction from him or her.',
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
                name: 'atb2',
		stem: 'If I had a chance to introduce Black visitors to my friends and neighbors, I would be pleased to do so.',
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
                name: 'atb3',
		stem: 'I would rather not have Black people live in the same apartment building I live in.',
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
                name: 'atb4',
		stem: 'I would probably feel somewhat self-conscious dancing with a Black person in a public place.',
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
                name: 'atb5',
		stem: 'I would not mind at all if a Black family with about the same income and education as me moved in next door.',
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
                name: 'atb6',
		stem: 'I think that Black people look more similar to each other than White people do.',
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
                name: 'atb7',
		stem: 'Interracial marriage should be discouraged to avoid the &#8217;who-am-I?&#8217; confusion that the children feel.',
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
                name: 'atb8',
		stem: 'I get very upset when I hear a White person make a prejudicial remark about Black people.',
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
                name: 'atb9',
		stem: 'I favor open housing laws that allow more racial integration of neighborhoods.',
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
                name: 'atb10',
		stem: 'It would not bother me if my new roommate was Black.',
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
                name: 'atb11',
		stem: 'It is likely that Black people will bring violence to neighborhoods when they move in.',
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
                name: 'atb12',
		stem: 'I enjoy a funny racial joke, even if some people might find it offensive.',
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
                name: 'atb13',
		stem: 'The federal government should take decisive steps to override the injustices Black people suffer at the hands of local authorities.',
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
                name: 'atb14',
		stem: 'Black and White people are inherently equal.',
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
                name: 'atb15',
		stem: 'Black people are demanding too much too fast in their push for equal rights.',
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
                name: 'atb16',
		stem: 'White people should support Black people in their struggle against discrimination and segregation.',
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
                name: 'atb17',
		stem: 'Generally, Black people are not as smart as White people.',
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
                name: 'atb18',
		stem: 'I worry that in the next few years I may be denied my application for a job or a promotion because of preferential treatment given to minority group members.',
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
                name: 'atb19',
		stem: 'Racial integration (of schools, businesses, residences, etc.) has benefited both Black and White people.',
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
                name: 'atb20',
		stem: 'Some Black people are so touchy about race that it is difficult to get along with them.',
		answers: ['Strongly disagree', 'Moderately disagree', 'Slightly disagree', 'Neither agree nor disagree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















