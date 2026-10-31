

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
		progressBar: '<%= pagesMeta.number %> out of 7',
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
                name: 'nr1',
		stem: "Do you feel that Black people in this country have tried to move...",
		answers: ["Too fast", "Too slow", "At about the right pace"]
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
                name: 'nr2',
		stem: "If Black people moved into my neighborhood, it would personally upset me...",
		answers: ["A lot", "Some but not a lot", "Only a little", "Not at all"]
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
                name: 'nr3',
		stem: "It's been said that if Black children all went to school with White children, the education of White children would suffer.  The reason given is that Black children would hold back the White children. Do you believe that or not?",
		answers: ["Don't believe", "Not sure", "Believe"]
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
                name: 'nr4',
		stem: "Black people are more likely to make progress in the future by being patient and not pushing so hard for change.",
		answers: ["Disagree", "Not sure", "Agree"]
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
                name: 'nr5',
		stem: "If a fully qualified black whose views were acceptable to you were nominated to run for president, how likely do you think you would be to vote for that candidate?",
		answers: ["Very likely", "Not at all likely"]
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
                name: 'nr6',
		stem: "Whether you agree or not with the idea of affirmative action, do you think Black people are given special consideration and hired before White people for jobs...",
		answers: ["Frequently", "Occasionally", "Hardly ever", "Never at all"]
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
                name: 'nr7',
		stem: "How about in higher education institutions, that is, colleges and universities?  Do you think Black people are given special consideration and admitted before White people in higher education institutions...",
		answers: ["Frequently", "Occasionally", "Hardly ever", "Never at all"]
            }
        ]
    }
    ]}
]);
	return API.script;
});












