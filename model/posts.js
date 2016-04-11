var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	postMessage: String,
	author: {
		userId: {
			type: Number,
			required: true
		},
		username: String,
		name: String
	},
	timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema);