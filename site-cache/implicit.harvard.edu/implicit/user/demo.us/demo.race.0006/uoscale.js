

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
                name: 'uo1',
		stem: 'The similarities between males and females are greater than the differences.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo2',
		stem: 'I tend to value similarities over differences when I meet someone.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo3',
		stem: 'At one level of thinking we are all of a kind.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo4',
		stem: 'I can understand almost anyone because I&#8217;m a little like everyone.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo5',
		stem: 'Little differences among people mean a lot.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo6',
		stem: 'I can see myself fitting into many groups.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo7',
		stem: 'There is a potential for good and evil in all of us.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo8',
		stem: 'When I look into the eyes of others I see myself.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo9',
		stem: 'I could never get accustomed to living in another country.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo10',
		stem: 'When I first meet someone I tend to notice differences between myself and the other person.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo11',
		stem: '&#145;Between&#146; describes my position with regard to groups better than does &#145;in&#146; and &#145;out&#146;.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo12',
		stem: 'The same spirit dwells in everyone.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo13',
		stem: 'Older people are very different than I am.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo14',
		stem: 'I can tell a great deal about a person by knowing their gender.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo15',
		stem: 'There is a certain beauty in everyone.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo16',
		stem: 'I can tell a great deal about a person by knowing his or her age.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo17',
    stem: 'Men and women will never totally understand each other because of their inborn differences.',
    answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo18',
		stem: 'Everyone in the world is very much alike because in the end we all die.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo19',
		stem: 'I have difficulty relating to persons who are much younger than I am.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'uo20',
		stem: 'When I meet someone I tend to notice similarities between myself and the other person.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});






