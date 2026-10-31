

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
                name: 'paaq1',
		stem: 'Black people do not have the same employment opportunities that White people do.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq2',
		stem: 'It is surprising that Black people do as well as they do, considering all the obstacles they face.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq3',
		stem: 'Too many Black people still lose out on jobs and promotions because of their skin color.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq4',
		stem: 'Most big corporations are really interested in treating their Black and White employees equally.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq5',
		stem: 'Most Black people are no longer discriminated against.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq6',
		stem: 'Black people have more to offer than they have been allowed to show.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq7',
		stem: 'The typical urban ghetto public school is not as good as it should be to provide equal opportunities for Black people.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq8',
		stem: 'This country would be better off if it were more willing to assimilate the good things in Black culture.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq9',
		stem: 'Sometimes Black job seekers should be given special consideration in hiring.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq10',
		stem: 'Many people show a real lack of understanding of the problems that Black people face.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq11',
		stem: 'The root cause of most of the social and economic ills of Black people is the weakness and instability of the Black family.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq12',
		stem: 'Although there are exceptions, Black urban neighborhoods do not seem to have strong community organization or leadership.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq13',
		stem: 'On the whole, Black people do not stress education and training.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq14',
		stem: 'Many Black teenagers don&#8217t respect themselves or anyone else.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq15',
		stem: 'Black people don&#8217t seem to use opportunities to own and operate little shops and businesses.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq16',
		stem: 'Very few Black people are just looking for a free ride.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq17',
        stem: 'Black children would do better in school if their parents had better attitudes about learning.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq18',
		stem: 'Black people should take the jobs that are available and then work their way up to better jobs.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq19',
		stem: 'One of the biggest problems for a lot of Black people is their lack of self-respect.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
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
                name: 'paaq20',
		stem: 'Most Black people have the drive and determination to get ahead.',
		answers: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]
            }
        ]
    }
    ]}
]);
	return API.script;
});








