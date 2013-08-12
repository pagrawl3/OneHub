/* ------ LAUNCHPOINT FOR NODE  -------
//
// Launchpoint
// NodeJS based custom bootstrap for instant scaffolding!
//
// Pratham Agrawal
// http://prath.am
//
//-----------------------------------*/

//Each module is optional and configured independantly.
//Don't want it? Just comment out/delete the entire module out.

//Let's start with the basics first so that we have that out of the way
configuredModules 	= {}; //this will store which modules have been activated. Associative array of booleans.
var env 			= 'development' //set the env to development. Don't know why we might need this but ok.

//Basic requires that might be needed. (Might not exist in the future)
var filesystem	= require('fs'),
	http		= require('http'),
	express		= require('express'); //currently required as its an express app lol

//MONGOOSE
//-- MongoDB Driver for a database. Currently no other database is supported. Sorry
var mongoose = require('mongoose');	//require the mongoose module
mongoose.connect('mongodb://localhost/launchpoint'); //the database to connect to. can be external to if you want to deploy to nodejitsu
configuredModules['mongoose'] = true; //Flag it as enabled
//-/MONGOOSE

//MODELS
//-- Require all the models under a given directory
//-- Should only work with mongoose so it is only done if mongoose is used
if (configuredModules['mongoose']) {
	var models_path = __dirname + '/app/models'
	filesystem.readdirSync(models_path).forEach(function (file) {
		require(models_path+'/'+file)
	})
	configuredModules['mongoose'] = true;
}
//-/MODELS

//PASSPORT
//-- Passport.js is used for various user authentication methods. (It pretty much has everything)
//-- This can only exist if models are being used.
if (configuredModules['mongoose']) {
	var passport = require('passport');
	require('./config/passport')(passport); //All the passport configurations are passed into this file
	configuredModules['login'] = true;
}
//-/PASSPORT

//REQUIRED - EXPRESS
//-- Express JS framework for node. This app revolves around it for now.
var app 	= express();
var cookieParser = express.cookieParser('launchpoint')
var params = {
	app 		: app,
	cookieParser: cookieParser
};
if (configuredModules['login'])
	params['passport'] = passport;
if (configuredModules['redis'])
	params['sessionStore'] = sessionStore;

require('./config/express')(params);
configuredModules['express'] = true;
//-/EXPRESS

//SOCKETS
//-- Socket.io is used for realtime communication between the client and the server. Pretty cool if you know how to use it!
var socket 			= require('socket.io'); //require the socket module
var server 			= http.createServer(app); //Create the server
var io 				= socket.listen(server); //Attach the socket.io listener to that server we jsut created
if (configuredModules['login']) {
	var sessionSockets 	= require('session.socket.io'); //Use of session sockets simplifies security for sessions. Only enable if login is enabled
	var sessionSocket 	= new sessionSockets(io, sessionStore, cookieParser, 'jsessionid');
}
configuredModules['socket'] = true; //Flag it as enabled
//-/SOCKETS

//REDIS
//-- Redis can be used to cache the user sessions in a better manner that is more scalable rather than just volatile memory
//-- Again, this can only be used if we are using the login system. (Or the only point of using it rather is this)
if (configuredModules['login']) {
	var redis			= require('redis'),
		redisStore		= require('connect-redis')(express),
		redisClient		= redis.createClient(),
		sessionStore 	= new redisStore({ client: redisClient })
	configuredModules['redis'] = true;
}
//-/REDIS

//AWS (AMAZON WEB SERVICES)
//-- Don't know why you might need it but lets keep it just in case
var	AWS = require('aws-sdk')
AWS.config.update({
	accessKeyId 	: 'ACCESS KEY HERE',
	secretAccessKey : 'SECRET HERE',
	region			: 'REGION HERE'
});
configuredModules['aws'] = true;
//-/AWS (AMAZON WEB SERVICES)

//REQUIRED - ROUTER
//-- This is where all the routes are declared.
var routerParams = {
	app : app
};
if (configuredModules['login'])
	routerParams['passport'] = passport;
if (configuredModules['socket']) {
	routerParams['socket'] = socket;
	routerParams['io'] = io;
}
if (configuredModules['login'])
	routerParams['sessionSocket'] = sessionSocket;

require('./config/routes')(routerParams);
//-/ROUTER

//FINAL OPS
//Start the server listen on ports etc. etc.
if (!configuredModules['socket'])
	var server = http.createServer(app); //Create the server
var port = process.env.PORT || 3000
server.listen(port)
console.log('listening on port '+port)

//EXPOSE APPLICATION //Got it, replaces the default exports and module.exports with app
exports = module.exports = app