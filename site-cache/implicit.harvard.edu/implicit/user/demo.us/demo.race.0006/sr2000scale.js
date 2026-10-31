

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
		progressBar: '<%= pagesMeta.number %> out of 8',
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
                name: 'sr20001',
		stem: 'It&#8217;s really a matter of some people not trying hard enough; if Black people would only try harder they could be just as well off as White people.',
		answers: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"]
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
                name: 'sr20002',
		stem: "Irish, Italian, Jewish and many other minorities overcame prejudice and worked their way up.  Black people should do the same.",
		answers: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"]
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
                name: 'sr20003',
		stem: "Some say that Black leaders have been trying to push too fast.  Others feel that they haven't pushed fast enough.  What do you think?",
		answers: ["Trying to push very much too fast", "Going too slowly", "Moving at about the right speed"]
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
                name: 'sr20004',
		stem: "How much of the racial tension that exists today do you think Black people are responsible for creating?",
		answers: ["All of it", "Most", "Some", "Not much at all"]
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
                name: 'sr20005',
		stem: "How much discrimination against Black people do you feel there is today, limiting their chances to get ahead?",
		answers: ["A lot", "Some", "Just a little", "None at all"]
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
                name: 'sr20006',
		stem: "Generations of slavery and discrimination have created conditions that make it difficult for Black people to work their way out of the lower class.",
		answers: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"]
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
                name: 'sr20007',
		stem: "Over the past few years, Black people have gotten less than they deserve.",
		answers: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"]
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
                name: 'sr20008',
		stem: "Over the past few years, Black people have gotten more economically than they deserve.",
		answers: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"]
            }
        ]
    }
    ]}
]);
	return API.script;
});














