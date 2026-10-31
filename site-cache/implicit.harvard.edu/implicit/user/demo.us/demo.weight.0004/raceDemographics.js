define(['questAPI'], function(Quest){

	var API = new Quest();
	var isTouch = API.getGlobal().isTouch;
	

	
	 function checkForOther2a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_asian== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_asian.response.includes(7);}
    }
    
     function checkForOther3a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_black== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_black.response.includes(7);}
    }
    
    function checkForOther4a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_hispanic== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_hispanic.response.includes(7);}
    }
    
    function checkForOther5a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_middleeast== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_middleeast.response.includes(7);}
    }
    
    function checkForOther6a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_pacific== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_pacific.response.includes(7);}
    }
    
    function checkForOther7a(){
     var current  = this.current ;
     if(typeof current.questions.raceomb_003sub_white== 'undefined')
     {
         return false;
     }
     else{
   return current.questions.raceomb_003sub_white.response.includes(7);}
    }

	

	/**
	* Settings
	*/
	API.addSettings('logger',{pulse: 3});


	/**
	* Page prototype
	*/
	API.addPagesSet('basicPage',{
		noSubmit:false, //Change to true if you don't want to show the submit button.
		v1style: 2,
		decline: true,
		declineText: isTouch ? 'Decline' : 'Decline to Answer', 
		autoFocus:true, 
		header: 'Demographics',
		numbered: false
	//	progressBar: isTouch ? 'Page <%= pagesMeta.number %> out of 6' : 'Page <%= pagesMeta.number %> out of 13'
	});

	/**
	* Question prototypes
	*/
	API.addQuestionsSet('basicQ',{
		decline: true,
		required : false,
		errorMsg: {
			required: isTouch ? "Please select an answer, or click 'Decline'" : 
			"Please select an answer, or click 'Decline to Answer'"
		},
		autoSubmit:true,
		numericValues:true
	});

	API.addQuestionsSet('singleChoice',{
		inherit: 'basicQ',
		type: 'selectOne'
	//	help: '<%= pagesMeta.number < 10 %>',
	//	helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.'
	});

	API.addQuestionsSet('text',{
			inherit: 'basicQ',
			type: 'text',
			noSubmit:false
	});

	API.addQuestionsSet('singleChoicedrop',{
		inherit: 'basicQ',
		autoSubmit:false,
		type: 'dropdown'
	});

	API.addQuestionsSet('multiChoice',{
		inherit: 'basicQ',
		type: 'selectMulti',
		css: {color:'#0000FF'}
	});

	API.addQuestionsSet('boolean',{
		inherit: 'basicQ',
        type: 'selectOne',
        buttons: true,
        answers : [
			{text:'Yes', value:1},
			{text:'No', value:0}
		]
	});


	/**
	* Actual questions
	*/
	

	API.addQuestionsSet('raceomb_003_native',{
		inherit: 'singleChoice',
		name: 'raceomb_003_native',
		required: false,
		stemcss: {color:'#0000FF'},
		stem: 'What is your race or ethnicity?<br><i>Please select all groups that apply. You may report more than one group.</i>',
		autoSubmit: false,
		answers: [
			{text:'American Indian or Alaska Native',value:1}
		]
	});
	
	API.addQuestionsSet('raceomb_003_asian',{
		inherit: 'singleChoice',
		name: 'raceomb_003_asian',
		required: false,
		autoSubmit: false,
		answers: [
		    {text:'Asian',value:1}
		]
	});
	
	API.addQuestionsSet('raceomb_003_black',{
		inherit: 'singleChoice',
		name: 'raceomb_003_black',
		required: false,
		autoSubmit: false,
		answers: [
            {text:'Black or African American',value:1}	
        ]
	});
	
	API.addQuestionsSet('raceomb_003_hispanic',{
		inherit: 'singleChoice',
		name: 'raceomb_003_hispanic',
		required: false,
		autoSubmit: false,
		answers: [
            {text:'Hispanic, Latino, or Spanish',value:1}	
        ]
	});
	
	
	API.addQuestionsSet('raceomb_003_middleeast',{
		inherit: 'singleChoice',
		name: 'raceomb_003_middleeast',
		required: false,
		autoSubmit: false,
		answers: [
            {text:'Middle Eastern or North African',value:1}	
        ]
	});
	
	API.addQuestionsSet('raceomb_003_pacific',{
		inherit: 'singleChoice',
		name: 'raceomb_003_pacific',
		required: false,
		autoSubmit: false,
		answers: [
			{text:'Native Hawaiian or other Pacific Islander',value:1}
        ]
	});
	
	API.addQuestionsSet('raceomb_003_white',{
		inherit: 'singleChoice',
		name: 'raceomb_003_white',
		required: false,
		autoSubmit: false,
		answers: [
            {text:'White',value:1}       
        ]
	});
	
	API.addQuestionsSet('raceomb_003_other',{
		inherit: 'singleChoice',
		name: 'raceomb_003_other',
		required: false,
		autoSubmit: false,
		answers: [
            {text:'Some other race or ethnicity',value:1}        
        ]
	});
	
	API.addQuestionsSet('raceomb_003sub_native',{
		inherit: 'text',
		name: 'raceomb_003sub_native',
        stem: '<p align="center"><font color="#0000FF">What American Indian or Alaska Native group(s) do you identify with? (Optional)</font></p>'
	});
	
	API.addQuestionsSet('raceomb_003sub_asian',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_asian',
        stem: '<font color="#0000FF">What Asian group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'Chinese',value:1},
			{text:'Filipino',value:2},
			{text:'Asian Indian',value:3},
			{text:'Vietnamese',value:4},
			{text:'Korean',value:5},
			{text:'Japanese',value:6},
			{text:'A group that is not listed (e.g., Pakistani, Cambodian, Hmong)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_black',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_black',
        stem: '<font color="#0000FF">What Black or African American group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'African American',value:1},
			{text:'Jamaican',value:2},
			{text:'Haitian',value:3},
			{text:'Nigerian',value:4},
			{text:'Ethopian',value:5},
			{text:'Somali',value:6},
			{text:'A group that is not listed (e.g., Ghanaian, South African, Barbadian)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_hispanic',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_hispanic',
        stem: '<font color="#0000FF">What Hispanic, Latino, or Spanish group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'Mexican or Mexican-American',value:1},
			{text:'Puerto Rican',value:2},
			{text:'Cuban',value:3},
			{text:'Salvadoran',value:4},
			{text:'Dominican',value:5},
			{text:'Colombian',value:6},
			{text:'A group that is not listed (e.g., Guatemalan, Spaniard, Ecuadorian)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_middleeast',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_middleeast',
        stem: '<font color="#0000FF">What Middle Eastern or Northern African group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'Lebanese',value:1},
			{text:'Iranian',value:2},
			{text:'Egyptian',value:3},
			{text:'Syrian',value:4},
			{text:'Moroccan',value:5},
			{text:'Israeli',value:6},
			{text:'A group that is not listed (e.g., Algerian, Iraqi, Kurdish)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_pacific',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_pacific',
        stem: '<font color="#0000FF">What Native Hawaiian or other Pacific Islander group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'Native Hawaiian',value:1},
			{text:'Samoan',value:2},
			{text:'Chamorro',value:3},
			{text:'Tongan',value:4},
			{text:'Fijian',value:5},
			{text:'Marshallese',value:6},
			{text:'A group that is not listed (e.g., Palauan, Tahitian, Chuukese)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_white',{
		inherit: 'multiChoice',
		name: 'raceomb_003sub_white',
        stem: '<font color="#0000FF">What White group(s) do you identify with? (Optional)</font>',
        answers: [
			{text:'German',value:1},
			{text:'Irish',value:2},
			{text:'English',value:3},
			{text:'Italian',value:4},
			{text:'Polish',value:5},
			{text:'French',value:6},
			{text:'A group that is not listed (e.g., Scottish, Norwegian, Dutch)',value:7}
		]
	});
	
	API.addQuestionsSet('raceomb_003sub_other',{
		inherit: 'text',
		name: 'raceomb_003sub_other',
        stem: '<font color="#0000FF">What racial or ethnic group(s) do you identify with?</font>'
	});

	
	API.addQuestionsSet('raceomb_003sub_asianother',{
		inherit: 'text',
		name: 'raceomb_003sub_asianother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Pakistani, Cambodian, Hmong).</font>'
	});
	
	API.addQuestionsSet('raceomb_003sub_blackother',{
		inherit: 'text',
		name: 'raceomb_003sub_blackother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Ghanaian, South African, Barbadian).</font>'
	});
	
	API.addQuestionsSet('raceomb_003sub_hispanicother',{
		inherit: 'text',
		name: 'raceomb_003sub_hispanicother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Guatemalan, Spaniard, Ecuadorian).</font>'
	});
	
	API.addQuestionsSet('raceomb_003sub_middleeastother',{
		inherit: 'text',
		name: 'raceomb_003sub_middleeastother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Algerian, Iraqi, Kurdish).</font>'
	});
	
	API.addQuestionsSet('raceomb_003sub_pacificother',{
		inherit: 'text',
		name: 'raceomb_003sub_pacificother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Palauan, Tahitian, Chuukese).</font>'
	});
	
	API.addQuestionsSet('raceomb_003sub_whiteother',{
		inherit: 'text',
		name: 'raceomb_003sub_whiteother',
        stem: '<font color="#0000FF">Please describe what group you identify with (e.g., Scottish, Norwegian, Dutch.)</font>'
	});


	{
		API.addSequence([
			//THIS IS WHERE RACE SHOULD START
			{
				inherit: 'basicPage',
				questions: [ //If required would be set to true, then participants cannot select one and leave the other empty.
					{inherit:'raceomb_003_native', required:false},
					    
					    {remix:true,
                         mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_native.response'}],

                            data:[ 
                                {inherit :'raceomb_003sub_native'}
                            ]},
				
					{inherit:'raceomb_003_asian', required:false},
					
					{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_asian.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_asian'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther2a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_asianother'}
                                ]}
                            ]},
        
					{inherit:'raceomb_003_black', required:false},
					
					{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_black.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_black'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther3a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_blackother'}
                                ]}
                                
                             ]},
                            
                	{inherit:'raceomb_003_hispanic', required:false},
                	
                	{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_hispanic.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_hispanic'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther4a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_hispanicother'}
                                ]}
                                
                             ]},
                	
                	{inherit:'raceomb_003_middleeast', required:false},
                	
                	{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_middleeast.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_middleeast'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther5a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_middleeastother'}
                                ]}
                                
                             ]},
                	
                	{inherit:'raceomb_003_pacific', required:false},
                	
                	{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_pacific.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_pacific'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther6a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_pacificother'}
                                ]}
                                
                             ]},
                	
                	{inherit:'raceomb_003_white', required:false},
                	
                	{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_white.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_white'},
                                {
                                    remix:true,
                                    mixer:'branch',
                                    conditions:[checkForOther7a],
                                        data:[ 
                                            {inherit :'raceomb_003sub_whiteother'}
                            ]}
                                
                             ]},
                	
                	{inherit:'raceomb_003_other', required:false},
                	
                	{
                        remix:true,
                        mixer:'branch',
                        conditions:[{compare: 1, to: 'current.questions.raceomb_003_other.response'}],
                            data:[ 
                                {inherit :'raceomb_003sub_other'}
                                
                             ]}
                    
				]
			}

				
			
			
			//THIS IS WHERE RACE SHOULD END
		
		]);
	}

	return API.script;
});

































