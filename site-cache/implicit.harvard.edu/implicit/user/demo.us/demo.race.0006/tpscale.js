

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
                name: 'tp1',
		stem: 'Generally speaking, would you say that most people can be trusted or that you can&#8217;t be too careful in dealing with people?',
		answers: ["Most people can be trusted", "Can't be too careful"]
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
                name: 'tp2',
		stem: "Would you say that most of the time people try to be helpful, or that they are mostly just looking out for themselves?",
		answers: ["Try to be helpful", "Look out for themselves"]
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
                name: 'tp3',
		stem: 'Do you think that most people would try to take advantage of you if they got the chance or would they try to be fair?',
		answers: ["Take advantage", "Try to be fair"]
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
                name: 'cab1',
		stem: 'How warm or cold does the average person feel toward Black people?',
		answers: ["Extremely cold", "Very cold", "Moderately cold", "Slightly cold", "Neither warm or cold", "Slightly warm", "Moderately warm", "Very warm", "Extremely warm"]
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
                name: 'cab2',
		stem: "How much does the average person like or dislike Black people?",
		answers: ["Extremely dislikes", "Very much dislikes", "Moderately dislikes", "Slightly dislikes", "Neither likes or dislikes", "Slightly likes", "Moderately likes", "Very much likes", "Extremely likes"]
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
                name: 'cab3',
		stem: "How positive or negative does the average person feel toward Black people?",
		answers: ["Extremely negative", "Very negative", "Moderately negative", "Slightly negative", "Neither positive or negative", "Slightly positive", "Moderately positive", "Very positive", "Extremely positive"]
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
                name: 'cab4',
		stem: "How warm or cold is society toward Black people?",
		answers: ["Extremely cold", "Very cold", "Moderately cold", "Slightly cold", "Neither warm or cold", "Slightly warm", "Moderately warm", "Very warm", "Extremely warm"]
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
                name: 'cab5',
		stem: "How much does the culture you live in like or dislike Black people?",
		answers: ["Extremely dislikes", "Very much dislikes", "Moderately dislikes", "Slightly dislikes", "Neither likes or dislikes", "Slightly likes", "Moderately likes", "Very much likes", "Extremely likes"]
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
                name: 'cab6',
		stem: "How positive or negative is society toward Black people?",
		answers: ["Extremely negative", "Very negative", "Moderately negative", "Slightly negative", "Neither positive or negative", "Slightly positive", "Moderately positive", "Very positive", "Extremely positive"]
            }
        ]
    }
    ]}
]);
	return API.script;
});














