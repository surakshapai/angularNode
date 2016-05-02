var mongoose = require('mongoose');

var challengeSchema = mongoose.Schema({
	challengeDetails: {
		title: String,
		id: Number,
		color: String,
		days: String,
		date: Date,
		penalty: String
	},
	authorID: Number,
	posts: [{
		postMessage: String,
		postId: Number,
		timestamp: {
			type: Date,
			default: Date.now
		}
	}]
});


module.exports = mongoose.model('Challenge', challengeSchema);