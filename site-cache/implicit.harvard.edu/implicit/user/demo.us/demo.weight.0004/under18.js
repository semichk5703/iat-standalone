define(['questAPI'], function(Quest){
//Note - this questionnaire is used for all demo studies.  Don't make 
   // weight task specific changes to it.	
	var API = new Quest();
	var isTouch = API.getGlobal().isTouch;
	
	/**
	* Page prototype
	*/
	API.addPagesSet('basicPage',{
		noSubmit:false, //Change to true if you don't want to show the submit button.
		v1style: 2,
		header: 'Questionnaire',
		decline: false,
		declineText: isTouch ? 'Decline' : 'Decline to Answer', 
		autoFocus:true, 
		progressBar: isTouch ? 'Page <%= pagesMeta.number %> out of 1' : 'Page <%= pagesMeta.number %> out of 1'
	});
	
    /**
	* Question prototypes
	*/
	API.addQuestionsSet('basicQ',{
		decline: 'true',
		required : true, 		
		errorMsg: {
			required: isTouch ? "Please select an answer" : 
			"Please select an answer"
		},
		autoSubmit:'true',
		numericValues:'true',
		help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.'
	});

	API.addQuestionsSet('basicSelect',{
		inherit :'basicQ',
		type: 'selectOne'
	});
	
    API.addQuestionsSet('basicDropdown',{
		inherit :'basicQ',
		type : 'dropdown',
		autoSubmit:false
	});
	
    API.addQuestionsSet('therm',{
		inherit: 'basicSelect',
		answers: [
			{text:'10 - Extremely warm', value:10},
			{text:'9 - Very warm', value:9},
			{text:'8 - Moderately warm', value:8},
			{text:'7 - Somewhat warm', value:7},
			{text:'6 - Slightly warm', value:6},
			{text:'5 - Neither warm nor cold', value:5},
			{text:'4 - Slightly cold', value:4},
			{text:'3 - Somewhat cold', value:3},
			{text:'2 - Moderately cold', value:2},
			{text:'1 - Very cold', value:1},
			{text:'0 - Extremely cold', value:0}
		]
	});
	
	/**
	*Specific questions
	*/	

	
    API.addQuestionsSet('under18',{
		inherit : 'basicSelect',
		name: 'under18',
		stem: 'Are you 18 years of age or older?',
		answers: [
			'Yes',
			'No'
		]
	});

	

		API.addSequence([
			{
								inherit:'basicPage', 
								questions: {inherit:'under18'}
							}	
		]);

	return API.script;
});





