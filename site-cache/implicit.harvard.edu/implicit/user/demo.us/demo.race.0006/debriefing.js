define(['questAPI'], function(Quest){

	var API = new Quest();
	
let countryImage= '/implicit/user/demo.us/demo.race.0006/debriefimages/places_county.png';
let stateImage='/implicit/user/demo.us/demo.race.0006/debriefimages/places_state.png';
let ageImage='/implicit/user/demo.us/demo.race.0006/debriefimages/people_age.cats.png';
let eduImage='/implicit/user/demo.us/demo.race.0006/debriefimages/people_edu.cats.png';
let genderImage='/implicit/user/demo.us/demo.race.0006/debriefimages/people_gender.cats.png';
let ideImage='/implicit/user/demo.us/demo.race.0006/debriefimages/people_ideology.cats.png';
let raceImage='/implicit/user/demo.us/demo.race.0006/debriefimages/people_race.cats.png';
let overallImage='/implicit/user/demo.us/demo.race.0006/debriefimages/overall.png';
function showOverall(){
  document.getElementById('people').style.display ='none';
  document.getElementById('places').style.display = 'none';
  document.getElementById("peopleCheck").checked = false;
  uncheckAll();
  document.getElementById("overallCheck").checked = true;
  updateFeedbackImage(overallImage);
}
function showPlaces(){
  document.getElementById('people').style.display ='none';
  document.getElementById('places').style.display = 'block';
  uncheckAll();
  document.getElementById("placesCheck").checked = true;
}
function showPeople(){
    if(document.getElementById("peopleCheck").checked){
    document.getElementById('people').style.display ='block';
  document.getElementById('places').style.display = 'none';
  uncheckAll();
  document.getElementById("peopleCheck").checked = true;
    }
    else
    {
        
    }
}
function updateFeedbackImage(newUrl, uncheck)
{
    document.getElementById("feedbackGraph").src=newUrl;
    if(uncheck){
    document.getElementById(uncheck).checked = false;}
}
function uncheckAll() {
  document.querySelectorAll('input[type="radio"]')
    .forEach(el => el.checked = false);
}


var newhtml="\t<script>\r\n\t\t\t\r\nfunction updateFeedbackImage(newUrl, places)\r\n{\r\n    document.getElementById(\"feedbackGraph\").src=newUrl;\r\n    if(places){\r\n         document.getElementById(\'places\').style.display =\'block\';\r\n    }\r\n    else\r\n    {\r\n        document.getElementById(\'places\').style.display =\'none\';\r\n    }\r\n}\r\n\t\t\t\t\tfunction showOverall(){\r\n  document.getElementById(\'places\').style.display = \'none\';\r\n  uncheckAll();\r\n  document.getElementById(\"overallCheck\").checked = true;\r\n  updateFeedbackImage(\'/implicit/user/demo.us/demo.race.0006/debriefimages/overall.png\');\r\n}\r\n\t\t\t\t\tfunction showPlaces(){\r\n  document.getElementById(\'people\').style.display =\'none\';\r\n  document.getElementById(\'places\').style.display = \'block\';\r\n  uncheckAll();\r\n  document.getElementById(\"placesCheck\").checked = true;\r\n}\r\nfunction showPeople(){\r\n    if(document.getElementById(\"peopleCheck\").checked){\r\n    document.getElementById(\'people\').style.display =\'block\';\r\n  document.getElementById(\'places\').style.display = \'none\';\r\n  uncheckAll();\r\n  document.getElementById(\"peopleCheck\").checked = true;\r\n    }\r\n    else\r\n    {\r\n        \r\n    }\r\n}\r\nfunction uncheckAll() {\r\n  document.querySelectorAll(\'input[type=\"radio\"]\')\r\n    .forEach(el => el.checked = false);\r\n}\r\nlet countryImage= \'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/places_county.png\'\r\nlet stateImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/places_state.png\'\r\nlet ageImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/people_age.cats.png\'\r\nlet eduImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/people_edu.cats.png\'\r\nlet genderImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/people_gender.cats.png\'\r\nlet ideImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/people_ideology.cats.png\'\r\nlet raceImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/people_race.cats.png\'\r\nlet overallImage=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/overall.png\'\r\n<\/script>\r\n\r\n<p class=\"toppadding\"><\/p>\r\n<p><b>Here\u2019s what we found in our study of 3.6 million people:<\/b><\/p>\r\n<input type=\"radio\" id=\'overallCheck\' checked name=\"topCheck\" value=\"igotnone\" onclick=\"updateFeedbackImage('/implicit/user/demo.us/demo.race.0006/debriefimages/overall.png');\" \/>\r\nOverall Findings &nbsp;<br\/>\r\n<input type=\"radio\" value=\"peo\"  name=\"topCheck\" onclick=\"updateFeedbackImage(ageImage);\")>\r\nFindings by Age &nbsp;<br\/>\r\n<input type=\"radio\" value=\"edu\"  name=\"topCheck\" onclick=\"updateFeedbackImage(eduImage);\">\r\nFindings by Education &nbsp;<br\/>\r\n<input type=\"radio\" value=\"edu\"  name=\"topCheck\" onclick=\"updateFeedbackImage(genderImage);\">\r\nFindings by Gender &nbsp;<br\/>\r\n<input type=\"radio\" value=\"edu\"  name=\"topCheck\" onclick=\"updateFeedbackImage(ideImage);\">\r\nFindings by Political Ideology &nbsp;<br\/>\r\n<input type=\"radio\" value=\"edu\"  name=\"topCheck\" onclick=\"updateFeedbackImage(raceImage);\">\r\nFindings by Race &nbsp;<br\/>\r\n<input type=\"radio\" value=\"country\"  name=\"topCheck\" onclick=\"updateFeedbackImage(countryImage,\'stateCheck\');\">\r\nFindings by Region of the United States &nbsp;<br\/>\r\n<\/div>\r\n<br\/>\r\n<img id=\'feedbackGraph\'  src=\'\/implicit\/user\/demo.us\/demo.race.0006\/debriefimages\/overall.png\' >\r\n <div id=\"places\" style=\'display:none\'>\r\n     <p><span style=\"color: orange\">Orange<\/span> values indicate that participants were faster to sort \'White\' with \'Good\'.<br\/> \r\n<span style=\"color:blue\">Blue<\/span> values indicate that participants were faster to sort \'Black\' with \'Good\'. <br\/>\r\n<span style=\"color:#3d3d3d\">Grey<\/span> values indicate areas with fewer than 50 observations.<\/p>\r\n     <\/div>";

	var info = ''+
		'<div class="jumbotron jumbotron-dark">' +
		
		'<p style="font-size:20px; font-weight: bold">During the Implicit Association Test (IAT) you just completed:</p>' +
			'<p style="font-size:18px; font-weight: bold"><%= global.iat.feedback %></p></div>' + 
		'<p><b>Disclaimer:</b> These IAT results are provided for educational purposes only. ' + 
		'The results may fluctuate and should not be used to make important decisions. ' + 
		'The results are influenced by variables related to the test ' + 
		'(e.g., the words or images used to represent categories) ' + 
		'and the person (e.g., being tired, what you were thinking about before the IAT).</p>' +
		'<p><b>How does the IAT work?</b></p>' +
		'<p>The IAT measures associations between concepts ' + 
		'(e.g., <%= global.groupA %> and <%= global.groupB %>) ' + 
		'and evaluations (e.g., <%= global.attributeA %>, <%= global.attributeB %>). ' + 
		'People are quicker to respond when items that are more closely related in their mind share the same button. ' + 
		'For example, an implicit preference for <%= global.groupA %> relative to <%= global.groupB %> ' + 
		'means that you are faster to sort words when \'<%= global.groupA %>\' ' + 
		'and \'<%= global.attributeA %>\' share a button ' + 
		'relative to when \'<%= global.groupB %>\' and \'<%= global.attributeA %>\' share a button.</p>' + 
		'<p>Studies that summarize data across many people find that the IAT predicts discrimination ' + 
		'in hiring, education, healthcare, and law enforcement. ' + 
		'However, taking an IAT once (like you just did) is not likely to predict your future behavior well.</p>' + 
		
		'<p><b>Does the order in which I took the IAT matter?</b></p>'+
		'<p>The order in which you take the test can influence your results, but the effect is small. ' + 
		'We minimize this effect by giving practice trials after the categories switch sides. ' + 
		'We also randomly assign the order of the IAT so that some people get one order and other people get the reverse order.</p>'+ 
		'<p><b>I still have questions about the IAT.</b></p>'+
		'<p>If you have questions about the IAT, please consult the links at the top of the page, ' + 
		'where you will find answers to frequently asked questions, links to related research, ' + 
		'and additional information about implicit associations. ' + 
		'You may also <a href="mailto:demofeedback@projectimplicit.net">email us</a>  with questions or comments.</p>'+
        newhtml;
	API.addSequence([
	{
		mixer:'branch',
		conditions:[
			{compare:'global.isTouch', to:true}
		],
		data: //Touch
		[{
			header: 'Debriefing',
			questions:[
				{
					type:'info',
					name: 'iatresults',
					description: info
				}
			]
		}],
		elseData: // Not touch
		[{
			header: 'Debriefing',
			questions:[
				{
					type:'info',
					name: 'iatresults',
					description: info + '<hr>' + 
					'<p style="font-size:20px;">Please answer the following questions about your results:</p>'
				},
				{
					type:'dropdown',
					name: 'broughtwebsite',
					description:'<p>1. What brought you to this website?</p>',
					answers: [
						'Assignment for school',
						'Assignment for work',
						'Mention in a news story (any medium)',
						'Mention or link at a non-news Internet site',
						'My Internet search for this topic or a related topic',
						'Recommendation of a friend or co-worker',
						'Other'
					]
				},
				{
					type:'grid',
					name: 'iatevaluations',
					description: '<p>2. What do you think of the IAT?</p>',
					columns: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
					rows:[
						'To what extent did you enjoy trying the IAT?',
						'To what extent did the IAT score you received change your view of yourself?',
						'To what extent are you skeptical of the IAT score that you received?'
					],
					rowStemCss: {width:'280px'}
				},
				{
					type:'info',
					description:'<p style="font-size:20px;">Click "Submit" to submit your answers.</p>'
				}
			]
		}]
    }
    ]);
    
	return API.script;
});



















