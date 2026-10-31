define(['questAPI'], function(Quest){

	var API = new Quest();
	var isTouch = API.getGlobal().isTouch;
	 //update 12.5.2022 to remove race question from the demographics file since it'll have to be programmed in a seperate js file so the stylistic formating will not impact the remaining items. 
	
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
		numbered: false,
		progressBar: isTouch ? 'Page <%= pagesMeta.number %> out of 4' : 'Page <%= pagesMeta.number %> out of 9'
	});

	/**
	* Question prototypes
	*/
	API.addQuestionsSet('basicQ',{
		decline: true,
		required : true,
		errorMsg: {
			required: isTouch ? "Please select an answer, or click 'Decline'" : 
			"Please select an answer, or click 'Decline to Answer'"
		},
		autoSubmit:true,
		numericValues:true
	});

	API.addQuestionsSet('singleChoice',{
		inherit: 'basicQ',
		type: 'selectOne', 
		help: '<%= pagesMeta.number < 10 %>',
		helpText: isTouch ? '' : 'Tip: For quick response, click to select your answer, and then click again to submit.'
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
		type: 'selectMulti'
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

	API.addQuestionsSet('basicSelect',{
		inherit :'basicQ',
		type: 'selectOne'
	});

    API.addQuestionsSet('yn',{
		inherit: 'basicSelect',
		answers: [
			{text:'Yes', value:1},
			{text:'No', value:2}
		]
	});

	/**
	* Actual questions
	*/
//	API.addQuestionsSet('birthSex',{
//		inherit: 'singleChoice',
//		name: 'birthSex',
//		stem: "What sex were you assigned at birth, on your original birth certificate?",
//		answers: [
//			{text:'Male',value:1},
//			{text:'Female',value:2}
//		]
//	});


//	API.addQuestionsSet('genderIdentity',{
//		inherit: 'multiChoice',
//		name: 'genderIdentity',
//		stem: "What is your current gender identity? (check all that apply)",
//		answers: [
//			{text:'Male',value:1},
//			{text:'Female',value:2}, 
//			{text:'Trans male/Trans man',value:3}, 
//			{text:'Trans female/Trans woman',value:4}, 
//			{text:'Genderqueer/Gender nonconforming',value:5}, 
//			{text:'A different identity',value:6}
//		]
//	});
	
	// Updated Gender Questions as of 23-03-16
		API.addQuestionsSet('genderIdentity_0002',{
		inherit: 'singleChoice',
		help:false,
		autoSubmit: false,
		name: 'genderIdentity_0002',
		stem: "What is your gender identity?",
		answers: [
			{text:'Man',value:1},
			{text:'Woman',value:2},
		    {text: 'Genderqueer, non-binary, or agender', value:3},
		    {text: 'An identity not listed',value:4}
		]
	});
	
	API.addQuestionsSet('genderIdentity_0002other',{
		inherit: 'text',
		name: 'genderIdentity_0002other',
		required:false,
		stem: "What term would you use to describe your gender identity?"
	});

	API.addQuestionsSet('transIdentity',{
		inherit: 'singleChoice',
		help:false,
		autoSubmit: false,
		name: 'transIdentity',
		stem: "Do you identify as transgender?",
		answers: [
			{text:'Yes',value:1},
			{text:'No',value:2}, 
			{text:'I don\'t know',value:3}
		]
	});

	API.addQuestionsSet('birthMonth',{
		inherit: 'singleChoice',
		style:'multiButtons',
		name: 'birthmonth',
		stem: "What is your birth month?",
		answers: [
			{text:'January',value:1},
			{text:'February',value:2},
			{text:'March',value:3},
			{text:'April',value:4},
			{text:'May',value:5},
			{text:'June',value:6},
			{text:'July',value:7},
			{text:'August',value:8},
			{text:'September',value:9},
			{text:'October',value:10},
			{text:'November',value:11},
			{text:'December',value:12}
		]
	});

	API.addQuestionsSet('birthYear',{
		inherit: 'singleChoicedrop',
		name: 'birthyear',
		stem: "What is your birth year?",
		answers: [
		    {text:'2022',value:2022},
			{text:'2021',value:2021},
			{text:'2020',value:2020},
			{text:'2019',value:2019},
			{text:'2018',value:2018},
			{text:'2017',value:2017},
			{text:'2016',value:2016},
			{text:'2015',value:2015},
			{text:'2014',value:2014},
			{text:'2013',value:2013},
			{text:'2012',value:2012},
			{text:'2011',value:2011},
			{text:'2010',value:2010},
			{text:'2009',value:2009},
			{text:'2008',value:2008},
			{text:'2007',value:2007},
			{text:'2006',value:2006},
			{text:'2005',value:2005},
			{text:'2004',value:2004},
			{text:'2003',value:2003},
			{text:'2002',value:2002},
			{text:'2001',value:2001},
			{text:'2000',value:2000},
			{text:'1999',value:1999},
			{text:'1998',value:1998},
			{text:'1997',value:1997},
			{text:'1996',value:1996},
			{text:'1995',value:1995},
			{text:'1994',value:1994},
			{text:'1993',value:1993},
			{text:'1992',value:1992},
			{text:'1991',value:1991},
			{text:'1990',value:1990},
			{text:'1989',value:1989},
			{text:'1988',value:1988},
			{text:'1987',value:1987},
			{text:'1986',value:1986},
			{text:'1985',value:1985},
			{text:'1984',value:1984},
			{text:'1983',value:1983},
			{text:'1982',value:1982},
			{text:'1981',value:1981},
			{text:'1980',value:1980},
			{text:'1979',value:1979},
			{text:'1978',value:1978},
			{text:'1977',value:1977},
			{text:'1976',value:1976},
			{text:'1975',value:1975},
			{text:'1974',value:1974},
			{text:'1973',value:1973},
			{text:'1972',value:1972},
			{text:'1971',value:1971},
			{text:'1970',value:1970},
			{text:'1969',value:1969},
			{text:'1968',value:1968},
			{text:'1967',value:1967},
			{text:'1966',value:1966},
			{text:'1965',value:1965},
			{text:'1964',value:1964},
			{text:'1963',value:1963},
			{text:'1962',value:1962},
			{text:'1961',value:1961},
			{text:'1960',value:1960},
			{text:'1959',value:1959},
			{text:'1958',value:1958},
			{text:'1957',value:1957},
			{text:'1956',value:1956},
			{text:'1955',value:1955},
			{text:'1954',value:1954},
			{text:'1953',value:1953},
			{text:'1952',value:1952},
			{text:'1951',value:1951},
			{text:'1950',value:1950},
			{text:'1949',value:1949},
			{text:'1948',value:1948},
			{text:'1947',value:1947},
			{text:'1946',value:1946},
			{text:'1945',value:1945},
			{text:'1944',value:1944},
			{text:'1943',value:1943},
			{text:'1942',value:1942},
			{text:'1941',value:1941},
			{text:'1940',value:1940},
			{text:'1939',value:1939},
			{text:'1938',value:1938},
			{text:'1937',value:1937},
			{text:'1936',value:1936},
			{text:'1935',value:1935},
			{text:'1934',value:1934},
			{text:'1933',value:1933},
			{text:'1932',value:1932},
			{text:'1931',value:1931},
			{text:'1930',value:1930},
			{text:'1929',value:1929},
			{text:'1928',value:1928},
			{text:'1927',value:1927},
			{text:'1926',value:1926},
			{text:'1925',value:1925},
			{text:'1924',value:1924},
			{text:'1923',value:1923},
			{text:'1922',value:1922},
			{text:'1921',value:1921},
			{text:'1920',value:1920},
			{text:'1919',value:1919},
			{text:'1918',value:1918},
			{text:'1917',value:1917},
			{text:'1916',value:1916},
			{text:'1915',value:1915},
			{text:'1914',value:1914},
			{text:'1913',value:1913},
			{text:'1912',value:1912},
			{text:'1911',value:1911},
			{text:'1910',value:1910}
		]
	});
	
	//Updated Race Question 7/22

	
//	API.addQuestionsSet('raceomb',{
//		inherit: 'singleChoicedrop',
//		name: 'raceomb002',
//		stem: "What is your race?",
//		autoSubmit: false,
//		answers: [
//			{text:'American Indian/Alaska Native',value:1},
//			{text:'East Asian',value:2},
//			{text:'South Asian',value:3},
//			{text:'Native Hawaiian or other Pacific Islander',value:4},
//			{text:'Black or African American',value:5},
//			{text:'White',value:6},
//			{text:'Other or Unknown',value:7},
//			{text:'Multiracial',value:8}
//		]
//	});

//	API.addQuestionsSet('raceombmulti',{
//		inherit: 'multiChoice',
//		name: 'raceombmulti',
//        stem: "Please select the categories that comprise your race. (Click a category once to select it. Click it again to deselect. You may select as many categories as you wish. When you are finished, click Submit.)",
//        answers: [
//			{text:'American Indian/Alaska Native',value:1},
//			{text:'East Asian',value:2},
//			{text:'South Asian',value:3},
//			{text:'Native Hawaiian or other Pacific Islander',value:4},
//			{text:'Black or African American',value:5},
//			{text:'White',value:6},
//			{text:'Other or Unknown',value:7}
//		]
//	});

//	API.addQuestionsSet('ethnicityomb',{
//		inherit: isTouch ? 'singleChoice' : 'singleChoicedrop',
//        name: 'ethnicityomb',
//        autoSubmit: false,
//        stem: "What is your ethnicity?",
//        answers: [
//			{text:'Hispanic or Latino',value:1},
//			{text:'Not Hispanic or Latino',value:2},
//			{text:'Unknown',value:3}
//		]
//    });

	API.addQuestionsSet('politicalid',{
		inherit: 'singleChoice',
		name: 'politicalid7',
		stem: "What is your political identity?",
		answers: [
			{text:'Strongly Conservative',value:1},
			{text:'Moderately Conservative',value:2},
			{text:'Slightly Conservative',value:3},
			{text:'Neutral',value:4},
			{text:'Slightly Liberal',value:5},
			{text:'Moderately Liberal',value:6},
			{text:'Strongly Liberal',value:7}
		]
	});

	API.addQuestionsSet('num',{
		inherit: 'singleChoice',
		name: 'num002',
		style:'multiButtons',
		stem: "How many Implicit Association Tests (IATs) have you previously performed?",
		answers: [
			'0',
			'1',
			'2',
		  '3-5',
			'6+'
		]
	});

	API.addQuestionsSet('religionid',{
		inherit: 'singleChoice',
		name: 'religionid',
		stem: "How religious do you consider yourself to be?",
		answers: [
			{text:"Strongly religious", value:"4"},
			{text:"Moderately religious", value:"3"},
			{text:"Slightly religious", value:"2"},
			{text:"Not at all religious", value:"1"}
		]
	});

	API.addQuestionsSet('religion2014',{
		inherit: 'singleChoice',
		name: 'religion2014',
		stem: "What is your religious affiliation?",
		answers: [
			{text:"Buddhist/Confucian/Shinto", value:"1"},
			{text:"Christian: Catholic or Orthodox", value:"2"},
			{text:"Christian: Protestant or Other", value:"3"},
			{text:"Hindu", value:"4"},
			{text:"Jewish", value:"5"},
			{text:"Muslim/Islamic", value:"6"},
			{text:"Not Religious", value:"7"},
			{text:"Other Religion", value:"8"}
		]
	});

	var countriesArray = [
		{text:"U.S.A. ",value:1},
		{text:"Afghanistan",value:2},
		{text:"Åland Islands", value:3},
		{text:"Albania",value:4},
		{text:"Algeria",value:5},
		{text:"American Samoa",value:6},
		{text:"Andorra",value:7},
		{text:"Angola",value:8},
		{text:"Anguilla",value:9},
		{text:"Antarctica",value:10},
		{text:"Antigua And Barbuda",value:11},
		{text:"Argentina",value:12},
		{text:"Armenia",value:13},
		{text:"Aruba",value:14},
		{text:"Australia",value:15},
		{text:"Austria",value:16},
		{text:"Azerbaijan",value:17},
		{text:"Bahamas, The",value:18},
		{text:"Bahrain",value:19},
		{text:"Bangladesh",value:20},
		{text:"Barbados",value:21},
		{text:"Belarus",value:22},
		{text:"Belgium",value:23},
		{text:"Belize",value:24},
		{text:"Benin",value:25},
		{text:"Bermuda",value:26},
		{text:"Bhutan",value:27},
		{text:"Bolivia",value:28},
		{text:"Bonaire, Sint Eustatius and Saba", value:29},
		{text:"Bosnia and Herzegovina",value:30},
		{text:"Botswana",value:31},
		{text:"Bouvet Island",value:32},
		{text:"Brazil",value:33},
		{text:"British Indian Ocean Territory",value:34},
		{text:"Brunei",value:35},
		{text:"Bulgaria",value:36},
		{text:"Burkina Faso",value:37},
		{text:"Burundi",value:38},
		{text:"Cambodia",value:39},
		{text:"Cameroon",value:40},
		{text:"Canada",value:41},
		{text:"Cape Verde",value:42},
		{text:"Cayman Islands",value:43},
		{text:"Central African Republic",value:44},
		{text:"Chad",value:45},
		{text:"Chile",value:46},
		{text:"China",value:47},
		{text:"Christmas Island",value:248},
		{text:"Cocos (Keeling) Islands",value:249},
		{text:"Colombia",value:48},
		{text:"Comoros",value:49},
		{text:"Congo, Democratic Republic of the",value:50},
		{text:"Congo, Republic of the",value:51},
		{text:"Cook Islands",value:52},
		{text:"Costa Rica",value:53},
		{text:"Cote D'Ivoire (Ivory Coast)",value:54},
		{text:"Croatia (Hrvatska)",value:55},
		{text:"Cuba",value:56},
		{text:"Curaçao", value:57},
		{text:"Cyprus",value:58},
		{text:"Czech Republic",value:59},
		{text:"Denmark",value:60},
		{text:"Djibouti",value:61},
		{text:"Dominica",value:62},
		{text:"Dominican Republic",value:63},
		{text:"Ecuador",value:64},
		{text:"Egypt",value:65},
		{text:"El Salvador",value:66},
		{text:"Equatorial Guinea",value:67},
		{text:"Eritrea",value:68},
		{text:"Estonia",value:69},
		{text:"Eswatini, Kingdom of", value:70},
		{text:"Ethiopia",value:71},
		{text:"Falkland Islands (Islas Malvinas)",value:72},
		{text:"Faroe Islands",value:73},
		{text:"Fiji Islands",value:74},
		{text:"Finland",value:75},
		{text:"France",value:76},
		{text:"French Guiana",value:77},
		{text:"French Polynesia",value:78},
		{text:"French Southern Territories",value:79},
		{text:"Gabon",value:80},
		{text:"Gambia, The",value:81},
		{text:"Georgia",value:82},
		{text:"Germany",value:83},
		{text:"Ghana",value:84},
		{text:"Gibraltar",value:85},
		{text:"Greece",value:86},
		{text:"Greenland",value:87},
		{text:"Grenada",value:88},
		{text:"Guadeloupe",value:89},
		{text:"Guam",value:90},
		{text:"Guatemala",value:91},
		{text:"Guernsey",value:92},
		{text:"Guinea",value:93},
		{text:"Guinea-Bissau",value:94},
		{text:"Guyana",value:95},
		{text:"Haiti",value:96},
		{text:"Heard and McDonald Islands",value:97},
		{text:"Honduras ",value:98},
		{text:"Hong Kong",value:99},
		{text:"Hungary ",value:100},
		{text:"Iceland ",value:101},
		{text:"India ",value:102},
		{text:"Indonesia ",value:103},
		{text:"Iran ",value:104},
		{text:"Iraq ",value:105},
		{text:"Ireland ",value:106},
		{text:"Isle of Man", value:107},
		{text:"Israel ",value:108},
		{text:"Italy ",value:109},
		{text:"Jamaica ",value:110},
		{text:"Japan ",value:111},
		{text:"Jersey", value:112},
		{text:"Jordan ",value:113},
		{text:"Kazakhstan ",value:114},
		{text:"Kenya ",value:115},
		{text:"Kiribati ",value:116},
		{text:"Korea, North ",value:117},
		{text:"Korea, South",value:118},
		{text:"Kosovo",value:119},
		{text:"Kuwait ",value:120},
		{text:"Kyrgyzstan ",value:121},
		{text:"Laos ",value:122},
		{text:"Latvia ",value:123},
		{text:"Lebanon ",value:124},
		{text:"Lesotho ",value:125},
		{text:"Liberia ",value:126},
		{text:"Libya ",value:127},
		{text:"Liechtenstein ",value:128},
		{text:"Lithuania ",value:129},
		{text:"Luxembourg ",value:130},
		{text:"Macao",value:131},
		{text:"Madagascar ",value:132},
		{text:"Malawi ",value:133},
		{text:"Malaysia ",value:134},
		{text:"Maldives ",value:135},
		{text:"Mali ",value:136},
		{text:"Malta ",value:137},
		{text:"Marshall Islands ",value:138},
		{text:"Martinique ",value:139},
		{text:"Mauritania ",value:140},
		{text:"Mauritius ",value:141},
		{text:"Mayotte ",value:142},
		{text:"Mexico ",value:143},
		{text:"Micronesia, Federated States of ",value:144},
		{text:"Moldova ",value:145},
		{text:"Monaco ",value:146},
		{text:"Mongolia ",value:147},
		{text:"Montenegro",value:148},
		{text:"Montserrat ",value:149},
		{text:"Morocco ",value:150},
		{text:"Mozambique ",value:151},
		{text:"Myanmar/Burma ",value:152},
		{text:"Namibia ",value:153},
		{text:"Nauru ",value:154},
		{text:"Nepal ",value:155},
		{text:"Netherlands, The",value:156},
		{text:"New Caledonia ",value:157},
		{text:"New Zealand ",value:158},
		{text:"Nicaragua ",value:159},
		{text:"Niger ",value:160},
		{text:"Nigeria ",value:161},
		{text:"Niue ",value:162},
		{text:"Norfolk Island ",value:163},
		{text:"North Macedonia, Republic of",value:164},
		{text:"Northern Mariana Islands ",value:165},
		{text:"Norway ",value:166},
		{text:"Oman ",value:167},
		{text:"Pakistan ",value:168},
		{text:"Palau ",value:169},
		{text:"Palestine", value:170},
		{text:"Panama ",value:171},
		{text:"Papua New Guinea ",value:172},
		{text:"Paraguay ",value:173},
		{text:"Peru ",value:174},
		{text:"Philippines ",value:175},
		{text:"Pitcairn",value:176},
		{text:"Poland ",value:177},
		{text:"Portugal ",value:178},
		{text:"Puerto Rico ",value:179},
		{text:"Qatar ",value:180},
		{text:"Réunion ",value:181},
		{text:"Romania ",value:182},
		{text:"Russia ",value:183},
		{text:"Rwanda ",value:184},
		{text:"Saint Barthélemy",value:185},
		{text:"Saint Helena, Ascension and Tristan da Cunha",value:186},
		{text:"Saint Kitts and Nevis ",value:187},
		{text:"Saint Lucia ",value:188},
		{text:"Saint Martin (French part)", value:189},
		{text:"Saint Pierre and Miquelon ",value:190},
		{text:"Saint Vincent and the Grenadines ",value:191},
		{text:"Samoa ",value:192},
		{text:"San Marino ",value:193},
		{text:"Sao Tome and Principe ",value:194},
		{text:"Saudi Arabia ",value:195},
		{text:"Senegal ",value:196},
		{text:"Serbia",value:197},
		{text:"Seychelles ",value:198},
		{text:"Sierra Leone ",value:199},
		{text:"Singapore ",value:200},
		{text:"Sint Maarten (Dutch part)",value:201},
		{text:"Slovakia ",value:202},
		{text:"Slovenia ",value:203},
		{text:"Solomon Islands ",value:204},
		{text:"Somalia ",value:205},
		{text:"South Africa ",value:206},
		{text:"South Georgia and the South Sandwich Islands ",value:207},
		{text:"South Sudan",value:208},
		{text:"Spain ",value:209},
		{text:"Sri Lanka ",value:210},
		{text:"Sudan ",value:211},
		{text:"Suriname ",value:212},
		{text:"Svalbard and Jan Mayen",value:213},
	//	{text:"Swaziland ",value:205},
		{text:"Sweden ",value:214},
		{text:"Switzerland ",value:215},
		{text:"Syria ",value:216},
		{text:"Taiwan ",value:217},
		{text:"Tajikistan ",value:218},
		{text:"Tanzania ",value:219},
		{text:"Thailand ",value:220},
		{text:"Timor-Leste/East Timor",value:221},
		{text:"Togo ",value:222},
		{text:"Tokelau ",value:223},
		{text:"Tonga ",value:224},
		{text:"Trinidad and Tobago ",value:225},
		{text:"Tunisia ",value:226},
		{text:"Turkey ",value:227},
		{text:"Turkmenistan ",value:228},
		{text:"Turks and Caicos Islands ",value:229},
		{text:"Tuvalu ",value:230},
		{text:"Uganda ",value:231},
		{text:"Ukraine ",value:232},
		{text:"United Arab Emirates ",value:233},
		{text:"United Kingdom ",value:234},
		{text:"U.S.A. ",value:1},
		{text:"United States Minor Outlying Islands ",value:235},
		{text:"Uruguay ",value:236},
		{text:"Uzbekistan ",value:237},
		{text:"Vanuatu ",value:229},
		{text:"Vatican City State (Holy See) ",value:238},
		{text:"Venezuela ",value:239},
		{text:"Vietnam ",value:240},
		{text:"Virgin Islands (British) ",value:241},
		{text:"Virgin Islands (U.S.) ",value:242},
		{text:"Wallis and Futuna",value:243},
		{text:"Western Sahara", value: 244},
		{text:"Yemen ",value:245},
		{text:"Zambia ",value:246},
		{text:"Zimbabwe", value:247} //248 and 249 already used, next one down here would be 250
	];

	API.addQuestionsSet('countrycit003',{
		inherit: 'singleChoicedrop',
		name: 'countrycit003',
		stem: "What is the country, territory, or area of geographical interest that you have primary citizenship in?",
		answers: countriesArray
	});

	API.addQuestionsSet('countryres003',{
		inherit: 'singleChoicedrop',
		name: 'countryres003',
		stem: "In what country, territory, or area of geographical interest do you currently live?",
		answers: countriesArray
	});
	API.addQuestionsSet('postcodenow',{
	   inherit: 'text',
	   name: 'postcodenow',
	   stem: "What is the postal code of your primary residence?"
	});

	API.addQuestionsSet('postcodelong',{
	   inherit: 'text',
	   name: 'postcodelong',
	   stem: "What is the postal code where you have lived the longest?"
	});

	API.addQuestionsSet('financialsupport',{
		inherit: 'singleChoice',
		name: 'financialsupport',
		stem: 'How do you support yourself financially?',
		answers: [
			{text:'Self-supported',value:1},
			{text:'Supported by parents, relatives or other guardians',value:2},
			{text:'Supported by partner',value:3}
		]
	});

	API.addQuestionsSet('studentOrNot',{
		inherit: 'singleChoice',
		name: 'studentOrNot',
		stem: 'Are you presently a student in a primary school, secondary school, college, or graduate degree program?',
		answers: [
				 {text:'Yes', value:1},
				 {text:'No', value:2}
		 ]
	});

	API.addQuestionsSet('eduStudent',{
		inherit: 'singleChoicedrop',
		name: 'eduStudent',
		stem: "Please indicate your present student status.",
		answers: [
			{text:'Student in elementary school',value:1},
			{text:'Student in junior high or middle school',value:2},
			{text:'Student in high school',value:3},
			{text:'Student in the first or second year of college',value:4},
			{text:'Student in the third or higher year of college',value:5},
			{text:'Student in M.B.A. program',value:6},
			{text:'Student in other master\'s degree program',value:7},
			{text:'Student in J.D. program',value:8},
			{text:'Student in M.D. program',value:9},
			{text:'Student in Ph.D. program',value:10},
			{text:'Student in other advanced degree program',value:11}
		]
	});

	API.addQuestionsSet('edu',{
		inherit: 'singleChoicedrop',
		name: 'edu',
		stem: "Please indicate the highest level of education that you have completed.",
		answers: [
			 {text:'Elementary school',value:1},
			 {text:'Junior high or middle school',value:2},
			 {text:'Some high school',value:3},
			 {text:'High school graduate',value:4},
			 {text:'Some college',value:5},
			 {text:'Associate\'s degree',value:6},
			 {text:'Bachelor\'s degree',value:7},
			 {text:'Some graduate school',value:8},
			 {text:'Master\'s degree',value:9},
			 {text:'M.B.A.',value:14},
			 {text:'J.D.',value:10},
			 {text:'M.D.',value:11},
			 {text:'Ph.D.',value:12},
			 {text:'Other advanced degree', value:13}
		]
	});

	API.addQuestionsSet('employment',{
		inherit: 'singleChoice',
		name: 'employment',
		stem: "Please indicate your present employment status.",
		answers: [
			{text:"Never employed", value:1},
			{text:"Previously employed; now retired", value:2},
			{text:"Presently unemployed but previously part-time employed", value:3},
			{text:"Presently unemployed but previously full-time employed", value:4},
			{text:"Presently part-time employed", value:5},
			{text:"Presently full-time employed", value:6},
			{text:"Non-standard employment (e.g. self-employed, multiple job holder)", value:7}
		]
	});

	API.addQuestionsSet('occuSelf',{
		inherit: 'singleChoicedrop',
		name: 'occuSelf',
		stem: "Please indicate your full-time or part-time occupation.  If you are now retired please answer by indicating your last full-time job.  If you were previously employed and are not presently employed, please indicate your last part-time or full-time job.",
		numericValues:false,
		answers: [
			{text:"Administrative Support", value:"43-"},
			{text:"Arts/Design/Entertainment/Sports", value:"27-"},
			{text:"Business", value:"13-"},
			{text:"Computer/Math", value:"15-"},
			{text:"Construction/Extraction", value:"47-"},
			{text:"Education", value:"25-"},
			{text:"Engineers/Architects", value:"17-"},
			{text:"Farming, Fishing, Forestry", value:"45-"},
			{text:"Food Service", value:"35-"},
			{text:"Healthcare", value:"2931"},
			{text:"Homemaker or Parenting", value:"00-"},
			{text:"Legal", value:"23-"},
			{text:"Maintenance", value:"37-"},
			{text:"Management", value:"11-"},
			{text:"Military", value:"55-"},
			{text:"Production", value:"51-"},
			{text:"Protective Service", value:"33-"},
			{text:"Repair/Installation", value:"49-"},
			{text:"Sales", value:"41-"},
			{text:"Science", value:"19-"},
			{text:"Service and Personal Care", value:"39-"},
			{text:"Social Service", value:"21-"},
			{text:"Transportation", value:"53-"},
			{text:"Unemployed", value:"9998"}

		]
	});

	API.addQuestionsSet('occupationCategory',{
		inherit: 'singleChoicedrop',
		required:false,
		name: 'occuSelfDetail',
		stem: 'Please select the most appropriate occupation category:'
	});

	API.addQuestionsSet('occuSelfDetail43',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Supervisors", value:"43-1000"},
			{text:"Financial Clerks", value:"43-3000"},
			{text:"Information and Records", value:"43-4000"},
			{text:"Recording, Scheduling, Dispatching, Distributing", value:"43-5000"},
			{text:"Secretaries and Assistants", value:"43-6000"},
			{text:"Other Support (data entry, office clerk, proofreaders)", value:"43-7000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail27',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Art and Design", value:"27-1000"},
		   {text:"Entertainers and Performers", value:"27-2000"},
		   {text:"Media and communication", value:"27-3000"},
		   {text:"Media Equipment workers", value:"27-4000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail13',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Business Operations", value:"13-1000"},
			{text:"Financial Specialists", value:"13-2000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail15',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Computer Specialists", value:"15-1000"},
			{text:"Math Scientists", value:"15-2000"},
			{text:"Math Technicians", value:"15-3000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail47',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Supervisors", value:"47-1000"},
		   {text:"Construction Trades", value:"47-2000"},
		   {text:"Helpers, Construction Trades", value:"47-3000"},
		   {text:"Extraction (e.g., mining, oil)", value:"47-5000"},
		   {text:"Other", value:"47-4000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail25',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Postsecondary Teachers", value:"25-1000"},
		   {text:"Primary, Secondary, and Special Ed Teachers", value:"25-2000"},
		   {text:"Other teachers and instructors", value:"25-3000"},
		   {text:"Librarians, Curators, Archivists", value:"25-4000"},
		   {text:"Other education, training, and library occupations", value:"25-9000"},
		   {text:"Student", value:"25-9999"}
		]
	});

	API.addQuestionsSet('occuSelfDetail17',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Architects, Surveyors, Cartographers", value:"17-1000"},
			{text:"Engineers", value:"17-2000"},
			{text:"Drafters, Engineering and Mapping Technicians", value:"17-3000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail45',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Supervisors", value:"45-1000"},
			{text:"Agriculture", value:"45-2000"},
			{text:"Fishing and Hunting", value:"45-3000"},
			{text:"Forest, Conservation, Logging", value:"45-4000"},
			{text:"Other", value:"45-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail35',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Supervisors", value:"35-1000"},
			{text:"Cooks and food prep", value:"35-2000"},
			{text:"Servers", value:"35-3000"},
			{text:"Other food service workers (e.g., dishwasher, host)", value:"35-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail2931',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Diagnosing and Treating Practitioners (MD, Dentist, etc.)", value:"29-1000"},
		   {text:"Technologists and Technicians", value:"29-2000"},
		   {text:"Nursing and Home Health Assistants", value:"31-1000"},
		   {text:"Occupational and Physical Therapist Assistants", value:"31-2000"},
		   {text:"Other healthcare support", value:"31-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail00',{
		inherit: 'occupationCategory',
		dflt: "00-0000",
		answers: [
			{text:"Homemaker or Parenting", value:"00-0000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail23',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Lawyers, Judges, and related workers", value:"23-1000"},
			{text:"Legal support workers", value:"23-2000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail37',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Building and Grounds Supervisors", value:"37-1000"},
			{text:"Building workers", value:"37-2000"},
			{text:"Grounds Maintenance", value:"37-3000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail11',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Top Executives", value:"1"},
			{text:"Advertising, Sales, PR, Marketing", value:"11-2000"},
			{text:"Operations Specialists", value:"11-3000"},
			{text:"Other Management Occupations", value:"11-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail55',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Officer and Tactical Leaders/Managers", value:"55-1000"},
			{text:"First-line enlisted supervisor/manager", value:"55-2000"},
			{text:"Enlisted tactical, air/weapons, crew, other", value:"55-3000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail51',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Supervisors", value:"51-1000"},
			{text:"Assemblers and Fabricators", value:"51-2000"},
			{text:"Food processing", value:"51-3000"},
			{text:"Metal and Plastic", value:"51-4000"},
			{text:"Printers", value:"51-5000"},
			{text:"Textile, Apparel, Furnishings", value:"51-6000"},
			{text:"Woodworkers", value:"51-7000"},
			{text:"Plant and System Operators", value:"51-8000"},
			{text:"Other", value:"51-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail33',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Supervisors", value:"33-1000"},
		   {text:"Fire fighting and prevention", value:"33-2000"},
		   {text:"Law Enforcement", value:"33-3000"},
		   {text:"Other (e.g., security, lifeguards, crossing guards)", value:"33-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail49',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Supervisors", value:"49-1000"},
		   {text:"Electrical and Electronic", value:"49-2000"},
		   {text:"Vehicle and Mobile Equipment", value:"49-3000"},
		   {text:"Other", value:"49-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail41',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Supervisors", value:"1000"},
		   {text:"Retail", value:"41-2000"},
		   {text:"Sales Representatives and Services", value:"41-3000"},
		   {text:"Wholesale and Manufacturing", value:"41-4000"},
		   {text:"Other sales (e.g., telemarketers, real estate)", value:"41-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail19',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Life Scientists", value:"19-1000"},
		   {text:"Physical scientists", value:"19-2000"},
		   {text:"Social Scientists", value:"19-3000"},
		   {text:"Life, Physical, Social Science Technicians", value:"19-4000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail39',{
		inherit: 'occupationCategory',
		answers: [
			{text:"Supervisors", value:"39-1000"},
			{text:"Animal Care", value:"39-2000"},
			{text:"Entertainment attendants", value:"39-3000"},
			{text:"Funeral Service", value:"39-4000"},
			{text:"Personal Appearance", value:"39-5000"},
			{text:"Transportation, Tourism, Lodging", value:"39-6000"},
			{text:"Other service (e.g., child care, fitness)", value:"39-9000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail21',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Counselors, Social Workers, Community specialists", value:"21-1000"},
		   {text:"Religious Workers", value:"21-2000"}
		]
	});

	API.addQuestionsSet('occuSelfDetail53',{
		inherit: 'occupationCategory',
		answers: [
		   {text:"Supervisors", value:"53-1000"},
		   {text:"Air Transportation", value:"53-2000"},
		   {text:"Motor Vehicle Operators", value:"53-3000"},
		   {text:"Rail Transport", value:"53-4000"},
		   {text:"Water Transport", value:"53-5000"},
		   {text:"Material Moving", value:"53-7000"},
		   {text:"Other", value:"53-6000"}
		]
	});

	API.addQuestionsSet('occuSupporter',{
		inherit: 'occuSelf',
		name: 'occuSupporter',
		stem: "Please indicate the occupation of the person who is most responsible for your support.  " +
		"If that person is retired or otherwise not presently employed, please answer by indicating that person\'s previous employment."
	});

	API.addQuestionsSet('occuSupporterDetail43',{
		inherit: 'occuSelfDetail43',
		name : 'occuSupporterDetail43'
	});

	API.addQuestionsSet('occuSupporterDetail27',{
		inherit: 'occuSelfDetail27',
		name : 'occuSupporterDetail27'
	});

	API.addQuestionsSet('occuSupporterDetail13',{
		inherit: 'occuSelfDetail13',
		name : 'occuSupporterDetail13'
	});

	API.addQuestionsSet('occuSupporterDetail15',{
		inherit: 'occuSelfDetail15',
		name : 'occuSupporterDetail15'
	});

	API.addQuestionsSet('occuSupporterDetail47',{
		inherit: 'occuSelfDetail47',
		name : 'occuSupporterDetail47'
	});

	API.addQuestionsSet('occuSupporterDetail25',{
		inherit: 'occuSelfDetail25',
		name : 'occuSupporterDetail25'
	});

	API.addQuestionsSet('occuSupporterDetail17',{
		inherit: 'occuSelfDetail17',
		name : 'occuSupporterDetail17'
	});

	API.addQuestionsSet('occuSupporterDetail45',{
		inherit: 'occuSelfDetail45',
		name : 'occuSupporterDetail45'
	});

	API.addQuestionsSet('occuSupporterDetail35',{
		inherit: 'occuSelfDetail35',
		name : 'occuSupporterDetail35'
	});

	API.addQuestionsSet('occuSupporterDetail2931',{
		inherit: 'occuSelfDetail2931',
		name : 'occuSupporterDetail2931'
	});

	API.addQuestionsSet('occuSupporterDetail00',{
		inherit: 'occuSelfDetail00',
		name : 'occuSupporterDetail00'
	});

	API.addQuestionsSet('occuSupporterDetail23',{
		inherit: 'occuSelfDetail23',
		name : 'occuSupporterDetail23'
	});

	API.addQuestionsSet('occuSupporterDetail37',{
		inherit: 'occuSelfDetail37',
		name : 'occuSupporterDetail37'
	});

	API.addQuestionsSet('occuSupporterDetail11',{
		inherit: 'occuSelfDetail11',
		name : 'occuSupporterDetail11'
	});

	API.addQuestionsSet('occuSupporterDetail55',{
		inherit: 'occuSelfDetail55',
		name : 'occuSupporterDetail55'
	});

	API.addQuestionsSet('occuSupporterDetail51',{
		inherit: 'occuSelfDetail51',
		name : 'occuSupporterDetail51'
	});

	API.addQuestionsSet('occuSupporterDetail33',{
		inherit: 'occuSelfDetail33',
		name : 'occuSupporterDetail33'
	});

	API.addQuestionsSet('occuSupporterDetail49',{
		inherit: 'occuSelfDetail49',
		name : 'occuSupporterDetail49'
	});

	API.addQuestionsSet('occuSupporterDetail41',{
		inherit: 'occuSelfDetail41',
		name : 'occuSupporterDetail41'
	});

	API.addQuestionsSet('occuSupporterDetail19',{
		inherit: 'occuSelfDetail19',
		name : 'occuSupporterDetail19'
	});

	API.addQuestionsSet('occuSupporterDetail39',{
		inherit: 'occuSelfDetail39',
		name : 'occuSupporterDetail39'
	});

	API.addQuestionsSet('occuSupporterDetail21',{
		inherit: 'occuSelfDetail21',
		name : 'occuSupporterDetail21'
	});

	API.addQuestionsSet('occuSupporterDetail53',{
		inherit: 'occuSelfDetail53',
		name : 'occuSupporterDetail53'
	});

	API.addQuestionsSet('incomeSelf',{
		inherit: 'singleChoicedrop',
		name : 'incomeSelf',
		stem: "Please indicate your yearly income. ",
		answers: [
			{text:'More than $200,000 per year', value:1},
			{text:'Up to $200,000 per year', value:2},
			{text:'Up to $190,000 per year', value:3},
			{text:'Up to $180,000 per year', value:4},
			{text:'Up to $170,000 per year', value:5},
			{text:'Up to $160,000 per year', value:6},
			{text:'Up to $150,000 per year', value:7},
			{text:'Up to $140,000 per year', value:8},
			{text:'Up to $130,000 per year', value:9},
			{text:'Up to $120,000 per year', value:10},
			{text:'Up to $110,000 per year', value:11},
			{text:'Up to $100,000 per year', value:12},
			{text:'Up to $90,000 per year', value:13},
			{text:'Up to $80,000 per year', value:14},
			{text:'Up to $70,000 per year', value:15},
			{text:'Up to $60,000 per year', value:16},
			{text:'Up to $50,000 per year', value:17},
			{text:'Up to $40,000 per year', value:18},
			{text:'Up to $30,000 per year', value:19},
			{text:'Up to $20,000 per year', value:20},
			{text:'Up to $10,000 per year', value:21}
		]
	});

   API.addQuestionsSet('incomeSupporter',{
		inherit: 'incomeSelf',
		name: 'incomeSupporter',
		stem: "Please estimate as best you can the yearly income of the person who is most responsible for your support."
   });

	API.addQuestionsSet('wealthSelf',{
		inherit: 'singleChoicedrop',
		name: 'wealthSelf',
		stem: "Please indicate your overall net worth (assets minus debts).",
		answers: [
			{text:'More than $50 Million',value:1},
			{text:'$25 to 50 Million',value:2},
			{text:'$10 to 25 Million',value:3},
			{text:'$5 to 10 Million',value:4},
			{text:'$1 to 5 Million',value:5},
			{text:'$500,000 to 1 Million',value:6},
			{text:'$100,000 to 500,000',value:7},
			{text:'$50,000 to 100,000',value:8},
			{text:'$40,000 to 50,000',value:9},
			{text:'$30,000 to 40,000',value:10},
			{text:'$20,000 to 30,000',value:11},
			{text:'$10,000 to 20,000',value:12},
			{text:'$5,000 to 10,000',value:13},
			{text:'$0 to 5,000',value:14}
		]
	});

	API.addQuestionsSet('wealthSupporter',{
		inherit: 'wealthSelf',
		name: 'wealthSupporter',
		stem: "Please estimate as best you can the overall net worth (assets minus debts) of the person who is most responsible for your support."
	});

	API.addQuestionsSet('disabled',{
		inherit : 'yn',
		name: 'disabled_001',
		stem: 'Do you have a disability or learning difficulty?'
	});

    API.addQuestionsSet('jewishID',{
		inherit : 'yn',
		name: 'ident',
		stem: 'Do you consider yourself Jewish?'
	});

    API.addQuestionsSet('muslimID',{
		inherit : 'yn',
		name: 'ident',
		stem: 'Do you consider yourself Muslim?'
	});

    API.addQuestionsSet('sexuality',{
		inherit : 'basicSelect',
		name: 'sexuality001',
		stem: 'Do you consider yourself to be:',
		answers: [
			{text:'Heterosexual or Straight',value:1},
			{text:'Lesbian or Gay',value:2},
			{text:'Bisexual',value:3},
			{text:'Queer',value:4},
			{text:'Other',value:5}
		]
	});

    API.addQuestionsSet('comptoothers_001',{
		inherit : 'basicSelect',
		name: 'comptoothers_001',
		stem: 'Compared with others in my racial/ethnic group, I consider my skin tone to be:',
		answers: [
			{text:'Much lighter',value:1},
			{text:'Somewhat lighter',value:2},
			{text:'About the same',value:3},
			{text:'Somewhat darker',value:4},
			{text:'Much darker',value:5}
		]
	});

	API.addQuestionsSet('comptomost',{
		inherit : 'basicSelect',
		name: 'comptomost001',
		stem: 'Compared to most people I interact with, I am:',
		answers: [
			'Much thinner',
			'Moderately thinner',
			'Slightly thinner',
			'About the same',
			'Slightly fatter',
			'Moderately fatter',
			'Much fatter'
		]
	});

	if (isTouch)
	{
		API.addSequence([
			{
				inherit: 'basicPage',
				questions: [
					{inherit:'genderIdentity_0002'},
                    {
                    remix:true,
                    mixer:'branch',
                        conditions:[{compare: 4, to: 'current.questions.genderIdentity_0002.response'}],
                            data:[ 
                                {inherit :'genderIdentity_0002other'}
                    ]}        
				]
			},
			{
				inherit: 'basicPage',
				questions: [
					{inherit: 'transIdentity'}
				]
			},
			{
				inherit: 'basicPage',
				questions: [{inherit: 'politicalid'}]
			},			
{
				inherit: 'basicPage',
				questions: [
					{inherit: 'countryres003', autoSubmit:false}, 
				    {remix:true,
                         mixer:'branch',
                        conditions:[{compare:1, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'}]
					             },
					             
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:15, to:'current.questions.countryres003.response'}],
    
                         data: [
						        	{inherit:'postcodenow'}]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:41, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'}]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:83, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'}]
					        },
					   
					    {remix:true,
                         mixer:'branch',
                        conditions:[{compare:156, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'}]
					        },
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:158, to:'current.questions.countryres003.response'}],
    
                          data: [
						        	{inherit:'postcodenow'}]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:234, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'}]
					        }
			]},
		  {
			  mixer: 'multiBranch',
			  branches: [
				  {
					conditions: [
					  {compare: 'global.imageId', to: 'Disabled'}
					],
					data: [
							{
								inherit: 'basicPage',
								questions: [{inherit: 'disabled'}]
							}
					]
				  },
/*				  {
					conditions: [
					  {compare: 'global.imageId', to: 'Jewish'}
					],
					data: [
							{
								inherit: 'basicPage',
								questions: [{inherit: 'jewishID'}]
							}
					]
				  },*/
/*				  {
					conditions: [
					  {compare: 'global.imageId', to: 'JewishMuslim'}
					],
					data: [
     					 {mixer:'random',
     					 	data: [
								{
									inherit: 'basicPage',
									questions: [{inherit: 'jewishID'}]
								},
								{
									inherit: 'basicPage',
									questions: [{inherit: 'muslimID'}]
								}	
							]	
     					 }
					]
				  },*/
				  {
					conditions: [
					  {compare: 'global.imageId', to: 'GayStraight'}
					],
					data: [
							{
								inherit: 'basicPage',
								questions: [{inherit: 'sexuality'}]
							}
					]
				  },				  
				  {
					conditions: [
					  {compare: 'global.imageId', to: 'ST'}
					],
					data: [
							{
								inherit: 'basicPage',
								questions: [{inherit: 'comptoothers_001'}]
							}
					]
				  },
				  {
					conditions: [
					  {compare: 'global.imageId', to: 'Weight'}
					],
					data: [
							{
								inherit: 'basicPage',
								questions: [{inherit: 'comptomost'}]
							}
					]
				  }				  
			  ]
			}
		]);
	}
	else
	{
		API.addSequence([
			{
				inherit: 'basicPage',
				questions: [
					{inherit:'genderIdentity_0002'},
                    {
                    remix:true,
                    mixer:'branch',
                        conditions:[{compare: 4, to: 'current.questions.genderIdentity_0002.response'}],
                            data:[ 
                                {inherit :'genderIdentity_0002other'}
                    ]} ,
                   

				]
			},
			{
				inherit: 'basicPage',
				questions: [ {inherit: 'transIdentity'}]
			},
			{
				inherit: 'basicPage',
				questions: [{inherit: 'num'}]
			},
			{
				inherit: 'basicPage',
				questions: [{inherit: 'politicalid'}]
			},
			{
				inherit: 'basicPage',
				questions: [{inherit: 'religion2014'}]
			},
			{
				inherit: 'basicPage',
				questions: [{inherit: 'religionid'}]
			},
//			{
//				inherit: 'basicPage',
//				questions: [{inherit: 'countrycit003'}]
//			},
//			{
//				inherit: 'basicPage',
//				questions: [{inherit: 'countryres003'}]
//			},
//			{
//				inherit: 'basicPage',
//				questions: [//If required would be set to true, then participants cannot select one and leave the other empty.
//					{inherit: 'postcodenow', required:false},
//					{inherit: 'postcodelong', required:false}]
//			},

// Updated Country Question 7/22
{
				inherit: 'basicPage',
				questions: [
					{inherit: 'countrycit003', autoSubmit:false},
					{inherit: 'countryres003', autoSubmit:false}, 
				    {remix:true,
                         mixer:'branch',
                        conditions:[{compare:1, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					             },
					             
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:15, to:'current.questions.countryres003.response'}],
    
                         data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:41, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:83, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        },
					   
					    {remix:true,
                         mixer:'branch',
                        conditions:[{compare:156, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        },
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:158, to:'current.questions.countryres003.response'}],
    
                          data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        },
					        
					   {remix:true,
                         mixer:'branch',
                        conditions:[{compare:234, to:'current.questions.countryres003.response'}],
    
                        data: [
						        	{inherit:'postcodenow'},
						        	{inherit:'postcodelong'} ]
					        }
			]},
			{
			   inherit: 'basicPage',
			   questions: [{inherit: 'edu'}]
			},

			/**
			 * Select occupation
			 */
			{
				inherit: 'basicPage',
				questions: [
					// major occupation
					{inherit: 'occuSelf'},
					// minor occupation
					{
						mixer: 'multiBranch',
						remix:true,
						branches: [
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"43-"}],
								data: [{inherit: 'occuSelfDetail43'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"27-"}],
								data: [{inherit: 'occuSelfDetail27'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"13-"}],
								data: [{inherit: 'occuSelfDetail13'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"15-"}],
								data: [{inherit: 'occuSelfDetail15'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"47-"}],
								data: [{inherit: 'occuSelfDetail47'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"25-"}],
								data: [{inherit: 'occuSelfDetail25'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"17-"}],
								data: [{inherit: 'occuSelfDetail17'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"45-"}],
								data: [{inherit: 'occuSelfDetail45'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"35-"}],
								data: [{inherit: 'occuSelfDetail35'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"2931"}],
								data: [{inherit: 'occuSelfDetail2931'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"00-"}],
								data: [{inherit: 'occuSelfDetail00'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"23-"}],
								data: [{inherit: 'occuSelfDetail23'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"37-"}],
								data: [{inherit: 'occuSelfDetail37'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"11-"}],
								data: [{inherit: 'occuSelfDetail11'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"55-"}],
								data: [{inherit: 'occuSelfDetail55'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"51-"}],
								data: [{inherit: 'occuSelfDetail51'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"33-"}],
								data: [{inherit: 'occuSelfDetail33'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"49-"}],
								data: [{inherit: 'occuSelfDetail49'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"41-"}],
								data: [{inherit: 'occuSelfDetail41'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"19-"}],
								data: [{inherit: 'occuSelfDetail19'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"39-"}],
								data: [{inherit: 'occuSelfDetail39'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"21-"}],
								data: [{inherit: 'occuSelfDetail21'}]
							},
							{
								conditions:[{compare: 'questions.occuSelf.response',to:"53-"}],
								data: [{inherit: 'occuSelfDetail53'}]
							}
						]
					}
				]
			}
		]);
	}

	return API.script;
});




























