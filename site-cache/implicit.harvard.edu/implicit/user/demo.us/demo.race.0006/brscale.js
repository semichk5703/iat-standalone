

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
                name: 'brsf1',
		stem: 'If you want to make accurate predictions, you should use information about a person\'s ethnic group when deciding if they will perform well.',
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
                name: 'brsf2',
		stem: 'If your personal safety is at stake, it&#8217s sensible to avoid members of ethnic groups known to behave more aggressively.',
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
                name: 'brsf4',
		stem: 'Law enforcement officers should pay particular attention to those social groups more heavily involved in crime, even if this means focusing on members of particular ethnic groups.',
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
                name: 'brsf3',
		stem: 'When the only thing you know about someone is their race, it makes sense to use your knowledge of their racial group to form an impression of them.',
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
                name: 'brsf5',
		stem: 'Law enforcement officers should act as if members of all racial groups are equally likely to commit crimes.',
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
                name: 'brsf6',
		stem: 'It is always wrong to avoid someone because members of their racial group are more likely to commit violent crimes.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
    ]}
]);
	return API.script;
});
















