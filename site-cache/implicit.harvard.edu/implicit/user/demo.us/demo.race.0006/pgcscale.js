

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
		progressBar: '<%= pagesMeta.number %> out of 11',
         header: 'Questionnaire',
		decline:true,
		v1style:2,
		numbered: false
	});

    API.addSequence([
    {mixer:'wrapper', // declare the mixer
    data:[
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
                name: 'pgc1',
		stem: 'I experience discrimination because of my ethnicity.',
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
                name: 'pgc2',
		stem: 'Other members of my ethnic group experience discrimination.',
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
                name: 'pgc3',
		stem: 'Most of my colleagues don&#8217t have any ethnic prejudices.',
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
                name: 'pgc4',
		stem: 'Many colleagues are biased against people of my ethnic group.',
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
                name: 'pgc5',
		stem: 'More good jobs for other groups comes at the expense of fewer good jobs for members of my group.',
		answers: ['Strongly disagree', ' Moderately disagree', 'Slightly disagree', 'Neither disagree nor agree', 'Slightly agree', 'Moderately agree', 'Strongly agree']
            }
        ]
    }]}]},
    {mixer:'random', // declare the mixer
    data:[
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'caw1',
		stem: 'How warm or cold does the average person feel toward White people?',
		answers: ['Extremely cold', 'Very cold', 'Moderately cold', 'Slightly cold', 'Neither warm or cold', 'Slightly warm', 'Moderately warm', 'Very warm', 'Extremely warm']
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
                name: 'caw2',
		stem: 'How much does the average person like or dislike White people?',
		answers: ['Extremely dislikes', 'Strongly dislikes', 'Moderately dislikes', 'Slightly dislikes', 'Neither likes or dislikes', 'Slightly likes', 'Moderately likes', 'Strongly likes', 'Extremely likes']
            }
        ]    },
    {
        // It has a questions property
	inherit:'qPage',
        questions:[
            // 1a. This is the first question (a text input):
            {
                inherit : {set:'basicSelect'},
                name: 'caw3',
		stem: 'How positive or negative does the average person feel toward White people?',
		answers: ['Extremely negative', 'Very negative', 'Moderately negative', 'Slightly negative', 'Neither positive or negative', 'Slightly positive', 'Moderately positive', 'Very positive', 'Extremely positive']
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
                name: 'caw4',
		stem: 'How warm or cold is society toward White people?',
		answers: ['Extremely cold', 'Very cold', 'Moderately cold', 'Slightly cold', 'Neither warm or cold', 'Slightly warm', 'Moderately warm', 'Very warm', 'Extremely warm']
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
                name: 'caw5',
		stem: 'How much does the culture you live in like or dislike White people?',
		answers: ['Extremely dislikes', 'Strongly dislikes', 'Moderately dislikes', 'Slightly dislikes', 'Neither likes or dislikes', 'Slightly likes', 'Moderately likes', 'Strongly likes', 'Extremely likes']
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
                name: 'caw6',
		stem: 'How positive or negative is society toward White people?',
		answers: ['Extremely negative', 'Very negative', 'Moderately negative', 'Slightly negative', 'Neither positive or negative', 'Slightly positive', 'Moderately positive', 'Very positive', 'Extremely positive']
            }
        ]
    }
    ]}
]);
	return API.script;
});














