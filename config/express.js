var express = require('express')
	path 		= require('path'),
	rootPath	= path.normalize(__dirname + '/..');

module.exports = function (params) {
	var app = params['app'];

	app.set('showStackError', true)
	app.use(express.compress ({
		filter: function (req,res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	//Use the default favicon
	app.use(express.favicon())
	//Setup the public serving directory
	app.use(express.static(rootPath + '/assets/public'))
	//Set to use express loggers
	app.use(express.logger('dev'))
	//Set the view templating engine and the views directory
	app.set('views', rootPath + '/app/views')
	app.set('view engine', 'jade')	//right now only jade is supported. Will change in the future.

	//Default app configurations //TODO: UNDERSTAND THESE
	app.configure(function() {
		//bodyParser
		app.use(express.bodyParser())
		app.use(express.methodOverride())
		//cookieParser
		if (params['cookieParser'])
			app.use(params['cookieParser'])
		if (params['sessionStore']) //Express sessions -- use custom Redis memory store to persist session between restarts and scalability
			app.use(express.session({ store: params['sessionStore'], secret: "launchpoint", key: 'jsessionid' }))
		if (params['passport']) {
			//Initialize passport sessions
			app.use(passport.initialize())
			app.use(passport.session())
		}

		//Use the router -- EXPLICITLY DEFINED AT THE END (Can be implicit -- Why?)
		app.use(app.router)
	})
}