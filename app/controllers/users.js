//#######__MODULE DEPENDENCIES__#########
var mongoose 	= require('mongoose'),
	User 		= mongoose.model('Users')

//renders the login page, self-explanatory
exports.login = function (req, res) {
	res.render('index', {
		title	: 'Login'
	})
}


//used during sign in fb, never gets here
exports.signin = function (req, res) {}

//Facebook callback, simple redirect to home after succesful signin
exports.authCallback = function (req, res, next) { res.redirect('/home') }

//Logs out the user, self-explanatory
exports.logout = function (req, res) {
	req.logout()
	res.redirect('/')
}

//Establish a session, comes here after passport verifs in routes
exports.session = function (req, res) {
	res.send({redirect: '/'});
}

// //Learn more about this. But from what I can understand, its used for URL route logic
// exports.user = function (req, res, next, id) {
//   User
//     .findOne({ _id : id })
//     .exec(function (err, user) {
//       if (err) return next(err)
//       if (!user) return next(new Error('Failed to load User ' + id))
//       req.profile = user
//       next()
//     })
// }

// // Used while registering with Facebook
// // Checks if the SmartFolder username chosen by the user has already been taken
// exports.fbRegistration = function(config) {
// 	return function (data, socket) {
// 		User.find({username : data.username}, function(err, docs) {
// 			if(docs.length == 0) {
// 				myusername = data.username
// 				// NOTE: Listeners for both the below emits are in index.js (client-side)
// 				// This proceeds to register the user
// 				socket.emit('fbRegistrationSuccessful', {success: true})
// 			} else {
// 				// This keeps the user on the registration page
// 				socket.emit('fbRegistrationFailed', {success: false})
// 			}
// 		})
// 	}
// }