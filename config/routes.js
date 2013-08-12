module.exports = function(params) {

	var app = params['app'];
	if (params['passport'])
		var passport = params['passport'];
	if (params['io'])
		var io = params['io'];
	if (params['sessionSocket']) {
		var sock 			= require('./socketLayer')
		var sessionSocket 	= params['sessionSocket'];
		sock.setSocket(sessionSocket);
	}

	//__IMPORT ALL THE CONTROLLERS
	var users  			= require('../app/controllers/users');
	var main  			= require('../app/controllers/main');

	if (configuredModules['login']) {
		app.get ('/auth/facebook'			, passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/' }), users.signin)
	 	app.get ('/auth/facebook/callback'	, passport.authenticate('facebook', { failureRedirect: '/' }), users.authCallback)
		app.get ('/logout'					, users.logout)
	}

	sock.getNormal('test', function(data, socket) {
		console.log('message on server received');
		socket.emit('testSuccess', {success: 'yay!'});
	}, io);

 	//__FINALLY IF THERE IS NO KNOWN URL INCL. '/' THEN GO TO HOME
 	app.get('/*', main.index);
}

