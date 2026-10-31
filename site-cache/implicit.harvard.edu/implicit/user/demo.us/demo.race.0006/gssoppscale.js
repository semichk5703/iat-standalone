

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
		progressBar: '<%= pagesMeta.number %> out of 9',
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
                name: 'gssopp1',
		stem: 'Do you feel that a Black person who has the same education and qualifications can get as good a job as a White person?',
		answers: ['Almost always', 'Sometimes', 'Almost never']
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
                name: 'gssopp2',
		stem: 'If a Black person has the same qualifications as a White person, do you feel that he or she can make as much money?',
		answers: ['Almost always', 'Sometimes', 'Almost never']            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gssopp3',
		stem: 'Do you think the opportunities for Black people to get ahead have improved in the last five years, remained about the same, or gotten worse?',
		answers: ['Improved', 'Remained about the same', 'Gotten worse']            }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gssopp4',
		stem: 'In the next five years, do you think that opportunities for Black people to get ahead will improve, remain about the same, or get worse?',
		answers: ['Will improve', 'Remain about the same', 'Get worse']    }
        ]
    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'gssopp5',
		stem: 'How important is a person&#8217s race for getting ahead in life?',
		answers: ['Essential', 'Very important', 'Fairly important', 'Not very important', 'Not important at all']
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
                name: 'gssopp6',
		stem: 'Some people think that certain groups have too much influence in life and politics, while other people feel that certain groups don&#8217t have as much influence as they deserve.  How much influence do you think Black people have?',
		answers: ['Too much influence', 'Right amount of influence', 'Too little influence']
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
                name: 'gssopp7',
		stem: 'How much discrimination is there that hurts the chances of Black people to get good paying jobs?',
		answers: ['A lot', 'Some', 'Only a little', 'None at all']
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
                name: 'gssopp8',
		stem: 'How much discrimination is there that makes it hard for Black people to buy or rent housing wherever they want?',
		answers: ['A lot', 'Some', 'Only a little', 'None at all']
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
                name: 'gssopp9',
		stem: 'What do you think the chances are these days that a White person will not get a job or promotion while an equally or less qualified Black person gets one instead?',
		answers: ['Very likely', 'Somewhat likely', 'Not very likely']
            }
        ]
    }
    ]}
]);
	return API.script;
});







