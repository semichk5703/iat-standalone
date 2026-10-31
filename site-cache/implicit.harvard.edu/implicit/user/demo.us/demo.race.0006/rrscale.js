

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
                name: 'rr01',
		stem: 'Most Black people who receive money from welfare programs could get along without it if they tried.',
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
                name: 'rr02',
		stem: 'Over the past few years, Black people have gotten less than they deserve.',
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
                name: 'rr03',
		stem: 'Government officials usually pay less attention to a request or complaint from a Black person than from a White person.',
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
                name: 'rr04',
		stem: 'Irish, Italians, Jewish and many other minorities overcame prejudice and worked their way up. Black people should do the same without any special favors.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
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
                name: 'rr05',
		stem: 'It&#39s really a matter of some people not trying hard enough; if black people would try harder they could be just as well off as White people.',
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
                name: 'rr06',
		stem: 'Generations of slavery and discrimination have created conditions that make it difficult for Black people to work their way out of the lower class.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }
]);
	return API.script;
});


















