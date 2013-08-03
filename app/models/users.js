/******DATABASE FILE********/

//Module Dependencies
var mongoose 	= require('mongoose'),
	crypto		= require('crypto'), //To generate hash/salt
	authTypes	= ['facebook'] 		//more to be added later on

//User Schema
var userSchema = new mongoose.Schema({
		name		: String,
		email		: { type : String , lowercase : true, unique : true },
		username 	: { type : String, unique : true },
		provider	: String,
		facebook	: {},
})

//Finally PUBLISH the model to be used in other files and storage etc.
mongoose.model ('Users', userSchema)