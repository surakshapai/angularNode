var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	postMessage: String,
	author: {
		userId: {
			type: Number,
			required: true
		},
		postByUser: {
			postId: Number
		},
		username: String,
		name: String
	},
	challengeID: Number,
	timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema);