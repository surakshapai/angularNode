var path = require('path');
var User = require('../finalApp/model/user.js');
var Post = require('../finalApp/model/posts.js');

module.exports = function(app, passport) {

	app.get('/users', function(req, res) {
		User.find({}, function(err, users) {
  			if (err) {
  				console.log(err);
  				throw err;
  			}
			  res.json({'users': users});
		});
	});

	app.get('/userCount', function(req, res) {
		User.find({}, function(err, users) {
			if(err) throw err;
			res.status(200).json({'userCount': users.length});
		})
	})
	
	app.post('/register', function(req, res) {
		var username = req.body.username, 
		password = req.body.password,
		userId = req.body.userId;
		passport.authenticate('local-signup', function(err, user) {
			if(err) {
				res.status(400).json({"err" : 'There is some error'});
			} else {
				res.status(200).json({"username": user.local.username, "userId": user.userId});
			}
		})(req, res);
	});

	app.post('/login', function(req, res) {
		passport.authenticate('local-login', function(err, user) {
			if(!user) {
				res.status(400).json({'err': 'You have not signed up'});
			} else {
				res.status(200).json({'username': user.local.username, 'userId': user.userId});
			}
		})(req, res);
	});

	app.post('/users/post/:userId', function(req, res) {
		var userId = req.body.userId;
		var userPostMessage = req.body.postMessage;

		var newPost = new Post();
		newPost.postMessage = userPostMessage;
		newPost.author.userId = userId;
		newPost.save(function(err, post) {
			if(err) {
				console.log(err);
				throw err;
			}
			res.status(200).json({'postedMessage': post.postMessage});
		});

	});

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}, function(user){
		console.log("User in first callback");
		console.log(user);
	}));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', function(user) {
			if(!user) {
				res.status(400).json({'err': 'There is some problem'});
			} else {
				res.status(200).json({'username': user.facebook.name, 'userProfilePicture': user.facebook.picture});
			}
		}));



}