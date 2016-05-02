var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// schema 

var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String,
	},
	registered: {
		type: Date,
		default: Date.now
	},
	userId: Number,
	facebook: {
		id: Number,
		name: String,
		picture: String
	},
	challenges: [{
		id: Number,
		title: String,
		color: String,
		days: String,
		date: Date,
		penalty: String
	}]
});

// Hash generation
userSchema.methods.generateHash = function(password) {
	console.log(password);
	var salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt, null);
}

// Authenticating password
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}


// Mongoose models reprensent documents which are saved and retrieved from the db
module.exports = mongoose.model('User', userSchema);