define(['managerAPI'], function(Manager) {

	function runStudy(isTouch)
	{
		var API = new Manager();

		API.setName('mgr');
		//API.addSettings('skip',true);
		API.addSettings('skin','demo');
		API.addSettings('DEBUG', {level: 'error'});
		var global=API.getGlobal();
		const d = new Date();
        let month = d.getMonth()+1; //js months start at 0 instead of 1
        let year = d.getFullYear()-18; //under 18 if born in later year
        let year2=year-1; //under 18 if born after current month in next year
		var demoheader='<style type="text/css">.navbar-inverse .navbar-nav > li > a {color:#dbdbdb;font-weight: bold;}</style><nav class="navbar navbar-inverse navbar-fixed-top"><div class="container">		<div class="navbar-header">			<button type="button" class="navbar-toggle collapsed" ng-click="showNavbar = !showNavbar" aria-expanded="false" aria-controls="navbar">				<span class="sr-only">Toggle navigation</span>				<span class="icon-bar"></span>			<span class="icon-bar"></span>				<span class="icon-bar"></span>		</button>		<a class="navbar-brand" href="http://www.projectimplicit.net/index.html" >				<img width="20" height="20" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAD9klEQVR42m3T/U+TVxQH8HMvLftb5g+dZDFpzJY0mdR1CAxqEWxpq9JiW0oHzOnGQiOLGqFF12kVKuXVUkqrK1KQFx1bcFGnYS/dsizLksVfTNhUthmTGe/ZuU+BSUuTb3J77+3nOec+t8C8mfvw3txzaLsp4OhXAtq/FuC/K+CT+wJOfSegKysg8JOA7h8FnP5ewIllAZ33BHTcFvDhkoAjiwJaFgQ0X1/l7kwvgHf6OfPNImtdQPhgEaH9FoL/NkLnNwgnv0Xo+gEJzEWO5VznPdpzJ7f36CKytgVUDE/mH4CmabEB0iJ8dEs+HeE4gSeWEU6/BMrxSZo7TmDHndzezSACeDIEXkdonSfwywfQsWSEzrs7lJxa3gHdWcrPa8nm5tbXP16qoK5+lcVIg3mmCHQT6J1GOkcB79+sgbxPLBYrSU4k5pITEzdGotGd+et09ruhZV6w5hlkbgm6rgnWRKUqVU5r8/cHurqyZ4NBcSYYQBr/ptPpVJs2+GY0INttmkbmmiSwcVIosneGUgj6vE2rzR4PruWZ3+/fDLpmNMybq441fk6g46pgh0mWB7oFeMCyv8VmMf9rs1he2Mzm9oKWJUgdSoM5rhB4KCWUweE0gitdAILJX/yau0df4ggYtpkSxYVgWiNbZc6ryA4lCbRPCGVAE+BK5YF+Dq037NC28BDa5le4b7YRnL3qAlBiDSlk9gSB1rhg9nEEiTa8BJpMReCdbaZ/wAr45pS7Si/uEW/OHAN/9v9KrUmNgh1IILOOEWi+LFg9DaRuXwP9VJk77aMb8Cd46OLT+SqXlsbgmnrC3ZPHNiqVoH0NM48SWDssYP8IgiVG4KgWTIkiOJiyg+PKinxh4EwL1phGGXDSW5RzjtQj3pB0gu4LFVhjGqiPKRirHUZgpgHB9g0i1A3LSS3Ux18F2/hDqljAweQqHcXv8oyVNKQe0MMeK0dki6+ALfE61BFIBbHaISSLQOMlwff2I6sZQHXNgBZqh0qo2r/BOvaY2+OtYB8flEAu8QS3JT209gdV9UxVF3sDjEMaWRA3RZEbLxFY2St4VR8STGBEC9v8xWAZe5OyEwyhV+jpYbBcRhluHh1R1qkTlWVEJ9dVVZFSZowKXh1BXnmRwLLzgpeHkdEXdXlki3sYDfN9QyhTVDM4pTYNbM+lb7tqb7+eV/f9wt/tRV5xAXnZOQINoRf8nc+Q0Rd1eagQrI6EZSsyzNgvWFUEmeyIEFbZpxTD95xHaXBDiEB9zxO++yyytz9FtWELcM+FsFLBeiou5qrJg6TB9T1PgZcGz/Fdgb9YaQ+qdwULwbJQWPnheqiTDYSK4PozuZQGn6re6j7yHw6qbqUIb1GZAAAAAElFTkSuQmCC" />			</a>		</div>		<div id="navbar" class="collapse navbar-collapse" ng-class="{in:showNavbar}">			<ul class="nav navbar-nav">				<li ><a href="/implicit/research/">Try a study</a></li>				<li><a href="/implicit/takeatest.html" >Take a test</a></li>				<li><a href="/implicit/education.html">Background</a></li>				<li><a href="/implicit/help.html">Tech Support</a></li>				<li><a href="/implicit/aboutus.html">The Scientists</a></li>				<li><a href="https://4agc.com/donation_pages/9dda692c-6aa1-47e7-852d-58d396ebd3af">Donate</a></li>			</ul>		</div><!--/.nav-collapse -->	</div></nav>'
	    var demofooter='<footer role="contentinfo">	<style type="text/css">		footer {text-align:center;border-top: 1px solid #e5e5e5;margin-top:50px;color: #767676;padding: 30px 0;}		footer li {display: inline;padding: 0 2px}	</style>	<ul class="text-muted">		<li><button onClick="window.print()" class="btn btn-default">			<span aria-hidden="true" class="glyphicon glyphicon-print"></span>			Print Page		</button></li>		<li>·</li>		<li><a href="/implicit/backgroundinformation.html">Background Information</a></li>		<li>·</li>		<li><a href="/implicit/privacy.html">Privacy Information</a></li>		<li>·</li>		<li><a href="/implicit">Project Implicit Home</a></li>	</ul></footer>'
    
		API.addGlobal({
		//YBYB: change when copying back to the correct folder
		//  baseURL: '/implicit/user/education/weight/demo.weight.0003/images/'
			baseURL: '/implicit/user/demo.us/demo.weight.0004/images/',
			isTouch:isTouch, 
	    posWords : API.shuffle([
            'Love', 'Cheer', 'Friend', 'Pleasure', 
            'Adore', 'Cheerful', 'Friendship', 'Joyful', 
            'Smiling','Cherish', 'Excellent', 'Glad', 
            'Joyous', 'Spectacular', 'Appealing', 'Delight', 
            'Excitement', 'Laughing', 'Attractive','Delightful', 
            'Fabulous', 'Glorious', 'Pleasing', 'Beautiful', 
            'Fantastic', 'Happy', 'Lovely', 'Terrific', 
            'Celebrate', 'Enjoy', 'Magnificent', 'Triumph']), 
        negWords : API.shuffle([
            'Abuse', 'Grief', 'Poison', 'Sadness', 
            'Pain', 'Despise', 'Failure', 'Nasty', 
            'Angry', 'Detest', 'Horrible', 'Negative', 
            'Ugly', 'Dirty', 'Gross', 'Evil', 
            'Rotten','Annoy', 'Disaster', 'Horrific',  
            'Scorn', 'Awful', 'Disgust', 'Hate', 
            'Humiliate', 'Selfish', 'Tragic', 'Bothersome', 
            'Hatred', 'Hurtful', 'Sick', 'Yucky']),
        groupA : 'Thin people', //category2 in iat.js
        groupB : 'Fat people',  //category1 in iat.js
        attributeA : 'Good', //attribute2 in iat.js
        attributeB : 'Bad',  //attribute1 in iat.js 
        dataviz : '/implicit/user/demo.us/demo.weight.0003/images/weightbreakdown.jpg',
        imageId: 'Weight'
		});
		API.save({isTouch:isTouch});
		
		if (isTouch)
		{
			var injectedStyle = [
				'[piq-page] {background-color: #fff; border: 1px solid transparent; border-radius: 4px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); margin-bottom: 20px; border-color: #bce8f1;}',
				'[piq-page] > ol {margin: 15px;}',
				'[piq-page] > .btn-group {margin: 0px 15px 15px 15px;}',
                '.container {padding:5px;}',
                '[pi-quest]::before, [pi-quest]::after {content: " ";display: table;}',
				'[pi-quest]::after {clear: both;}',
				'[pi-quest] h3 { border-bottom: 1px solid transparent; border-top-left-radius: 3px; border-top-right-radius: 3px; padding: 10px 15px; color: inherit; font-size: 2em; margin-bottom: 20px; margin-top: 0;background-color: #d9edf7;border-color: #bce8f1;color: #31708f;}',
				'[pi-quest] .form-group > label {font-size:1.2em; font-weight:normal;}',
				
				'[pi-quest] .btn-toolbar {margin:15px;float:none !important; text-align:center;position:relative;}',
				'[pi-quest] [ng-click="decline($event)"] {position:absolute;right:0;bottom:0}',
				'[pi-quest] [ng-click="submit()"] {width:30%;line-height: 1.3333333;border-radius: 6px;}',
				// larger screens
				'@media (min-width: 480px) {',
					' [pi-quest] [ng-click="submit()"] {width:30%;padding: 10px 16px;font-size: 1.6em;}',
				'}',
				// phones and smaller screens
				'@media (max-width: 480px) {',
					' [pi-quest] [ng-click="submit()"] {padding: 8px 13px;font-size: 1.2em;}',
					' [pi-quest] [ng-click="decline($event)"] {font-size: 0.9em;padding:3px 6px;}',
				'}'
    		].join('');

    		API.addSettings('injectStyle', injectedStyle);
		}
	

		API.addTasksSet({
			instructions: [{
				type: 'message',
				buttonText: 'Continue'
			}],

			realstart: [{
				inherit: 'instructions',
				name: 'realstart',
				templateUrl: 'realstart.jst',
				title: 'Consent',
				piTemplate: true,
				header: 'Welcome'
			}],
				ageCheck: [{
				type: 'quest',
				name: 'ageCheck',
				scriptUrl: 'agequest.js'
			}],
			under18: [{
				type: 'quest',
				name: 'under18',
				scriptUrl: 'under18.js'
			}],
			tooYoung: [{
				inherit: 'instructions',
				name: 'tooYoung',
				templateUrl: 'tooyoung.jst',
				title: 'Not Eligible ',
				piTemplate: true,
				header: 'Not Eligible ',
				buttonHide : true
			}],
			piYouth: [{
				inherit: 'instructions',
				name: 'tooYoung',
				templateUrl: 'piyouth.jst',
				title: 'Not Eligible ',
				piTemplate: true,
				header: 'Not Eligible ',
			}],
			instiat: [{
				inherit: 'instructions',
				name: 'instiat',
				templateUrl: 'instiat_weight.jst',
				title: 'IAT Instructions',
				piTemplate: true,
				header: 'Implicit Association Test'
			}],

			explicits: [{
				type: 'quest',
				name: 'explicits',
				scriptUrl: 'explicits.js'
			}],

			iat: [{
				type: 'time',
				name: 'iat',
				//version: '0.3',
				scriptUrl: 'weightiat.js'
			}],
			    
        redirect: [{
            type:'redirect',
           name:'redirect',
           last:true,
            url:"/implicit/Launch?study=/user/nicolef/piyouth.overall//manager.expt.xml"      
      }] ,

			     raceDemographics: [{
            type:'quest',
            name:'race',
            piTemplate:true,
            scriptUrl:'/implicit/user/demo.us/demo.weight.0004/raceDemographics.js'
       }],
      demographics: [{
            type:'quest',
            name:'demographics',
            piTemplate:true,
            scriptUrl:'/implicit/user/demo.us/demo.weight.0004/oldDemographics.js'
       }],
       oldStyle:[{
    type:'injectStyle',
    css: '[pi-quest] input {margin-bottom: 5px;} [pi-quest] .form-group {margin-bottom: 15px;} {font-size:1.2em; font-weight:normal;}'
}],
raceStyle:[{
    type:'injectStyle',
    css: '[pi-quest] input {margin-bottom: 10px;} [pi-quest] .form-group {margin-bottom: -20px;} {font-size:1.2em; font-weight:normal;}'
}],

				debriefing: [{
				type: 'quest',
				name: 'debriefing',
				scriptUrl: 'debriefing.js',
				preText: demoheader,
                postText: demofooter
			}],

		lastpage: [	{
			    	inherit: 'instructions',
				name: 'debriefing',
				templateUrl: '/implicit/user/demo.us/demo.weight.0004/allDemoLastpage.jst',
				title: 'Debriefing',
				preText: demoheader,
                postText: demofooter,
                piTemplate:true,
                last:true,
                buttonHide:true
			}]
		});

		API.addSequence([
			{inherit: 'realstart'},
			{inherit: 'ageCheck'},
			{mixer: 'branch',
              conditions: [
                  {or:[[{compare: 'global.ageCheck.questions.birthmonth.response', to: month, operator: 'greaterThan'},
                {compare: 'global.ageCheck.questions.birthyear.response', to: year2, operator: 'greaterThan'}],
                [{compare: 'global.ageCheck.questions.birthyear.response', to: year, operator: 'greaterThan'}]]}
              ],
              data: [
                  {mixer: 'branch',
              conditions: [
                  {or:[[{compare: 'global.ageCheck.questions.birthmonth.response', to: month, operator: 'greaterThan'},
                {compare: 'global.ageCheck.questions.birthyear.response', to: year2+4, operator: 'greaterThan'}],
                [{compare: 'global.ageCheck.questions.birthyear.response', to: year+4, operator: 'greaterThan'}]]}
              ],
              data: [
                {inherit: 'tooYoung'}],
                      elseData:[{ inherit: 'piYouth'},{ inherit: 'redirect'}]
                      }]},
			{mixer: 'branch',
              conditions: [
                  {compare: 'global.ageCheck.questions.birthmonth.response', to: month},
                   {compare: 'global.ageCheck.questions.birthyear.response', to: year2, operator: 'greaterThan'}
              ],
              data: [
                {inherit: 'under18'},
                {mixer: 'branch',
              conditions: [
                {compare: 'global.under18.questions.under18.response', to: 2}
              ],
              data: [
                {inherit: 'piYouth'},{ inherit: 'redirect'}]}
                ]
			    
			},
			{
				mixer:'random', // randomize sequence of variables
				data:[
				    
					{inherit: 'explicits'},
                    {mixer:'wrapper',
					    data:[  {inherit:'raceStyle'},
                        {inherit:'raceDemographics'},
                        {inherit:'oldStyle'},
                        {inherit:'demographics'}]
					},
					{
						mixer: 'wrapper',
						data: [
							{inherit: 'instiat'},
							{inherit: 'iat'}
						]
					}
				]
			},
			{inherit: 'lastpage'}
		]);

		return API.script;
	}
	
	return runStudy;
});





























