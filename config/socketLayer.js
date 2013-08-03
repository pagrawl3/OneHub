var mongoose = require('mongoose'),
	User = mongoose.model('Users');

//Just a global var for the sectionSocket
var sessionSocket

//must be called prior to the calling of the get method
exports.setSocket = function(socketToSet) {
	sessionSocket = socketToSet
}

//tried to model it similar to app.get but instead use sockets
exports.get = function(channel, callback) {
	sessionSocket.on('connection', function(err, socket, session) {
	 	User.findById(session.passport.user, function (err, user) {
	 		if (!err) {
	 			if (user) {
	 				socket.on(channel, function (data) {
	 					callback(socket, user, data)
	 				})
	 			}
	 		}
	 	});
	})
}

//This does not use session sockets but the regular socket.io
exports.getNormal = function(channel, callback, io) {
	io.set('log level', 1);
	io.sockets.on('connection', function (socket) {
		socket.on(channel, function(data){
			callback(data, socket)
		})
	})
}