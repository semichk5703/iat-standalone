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
		progressBar: '<%= pagesMeta.number %> out of 16',
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
                name: 'sdof1',
		stem: 'Some groups of people are simply inferior to other groups.',
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
                name: 'sdof2',
		stem: 'In getting what you want, it is sometimes necessary to use force against other groups.',
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
                name: 'sdof3',
		stem: 'It is OK if some groups have more of a chance in life than others.',
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
                name: 'sdof4',
		stem: 'To get ahead in life, it is sometimes necessary to step on other groups.',
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
                name: 'sdof5',
		stem: 'If certain groups stayed in their place, we would have fewer problems.',
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
                name: 'sdof6',
		stem: 'It&#39;s probably a good thing that certain groups are at the top and other groups are at the bottom.',
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
                name: 'sdof7',
		stem: 'Inferior groups should stay in their place.',
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
                name: 'sdof8',
		stem: 'Sometimes other groups must be kept in their place.',
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
                name: 'sdof9',
		stem: 'It would be good if groups could be equal.',
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
                name: 'sdof10',
		stem: 'Group equality should be our ideal.',
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
                name: 'sdof11',
		stem: 'All groups should be given an equal chance in life.',
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
                name: 'sdof12',
		stem: 'We should do what we can to equalize conditions for different groups.',
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
                name: 'sdof13',
		stem: 'Increased social equality is beneficial to society.',
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
                name: 'sdof14',
		stem: 'We would have fewer problems if we treated people more equally.',
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
                name: 'sdof15',
		stem: 'We should strive to make incomes as equal as possible.',
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
                name: 'sdof16',
		stem: 'No one group should dominate in society.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']}
        ]
    }
    ]}
]);
	return API.script;
});
















