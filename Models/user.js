var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	facebookId: String,
	admin:   {
		type: Boolean,
		default: false
	}
});
User.plugin(passportLocalMongoose);


var Users = mongoose.model('User', User);

module.exports = Users;