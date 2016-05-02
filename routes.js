var path = require('path');
var User = require('../finalApp/model/user.js');
var Post = require('../finalApp/model/posts.js');
var Challenge = require('../finalApp/model/challenge.js');

module.exports = function(app, passport) {

	app.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			if (err) {
				console.log(err);
				throw err;
			}
			res.json({
				'users': users
			});
		});
	});

	app.get('/userCount', function(req, res) {
		User.find({}, function(err, users) {
			if (err) throw err;
			res.status(200).json({
				'userCount': users.length
			});
		})
	});

	app.get('/postCount/:userId', function(req, res) {
		var userId = req.body.userId;

		Post.find({
			'userId': userId
		}, 'postMessage', function(err, posts) {
			if (err) {
				console.log("Error getting post count");
				res.status(500).json({
					"error": "Error getting post count"
				});
			} else {
				res.status(200).json({
					"postCount": posts.length
				});
			}
		});
	});

	app.post('/register', function(req, res) {
		var username = req.body.username,
			password = req.body.password,
			userId = req.body.userId;
		passport.authenticate('local-signup', function(err, user) {
			if (err) {
				res.status(400).json({
					"err": 'There is some error'
				});
			} else {
				res.status(200).json({
					"username": user.local.username,
					"userId": user.userId,
					'userChallenge': user.challenges
				});
			}
		})(req, res);
	});

	app.post('/login', function(req, res) {
		console.log(req.body);
		passport.authenticate('local-login', function(err, user) {
			if (!user) {
				res.status(400).json({
					'err': 'You have not signed up'
				});
			} else {
				res.status(200).json({
					'username': user.local.username,
					'userId': user.userId,
					'userChallenge': user.challenges
				});
			}
		})(req, res);
	});

	// app.get('/auth/facebook', function(req, res) {
	// 	passport.authenticate('facebook', {scope: 'email'}, function(user){
	// 		console.log("User in first callback");
	// 		console.log(user);
	// 	})(req, res);
	// });

	// app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

	// app.get('/auth/facebook/callback', function(req, res) {
	// 	passport.authenticate('facebook', function(err, user) {
	// 		console.log("Second callback");
	// 		console.log(user + "user in second callback");
	// 		if(!user) {
	// 			console.log(err);
	// 		} else {
	// 			res.redirect('/success');
	// 		}
	// 	})(req, res);
	// });

	app.get('/auth/facebook',
		passport.authenticate('facebook'),
		function(req, res) {});

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			failureRedirect: '/'
		}),
		function(req, res) {
			console.log("Success redirect");
			res.redirect('/success');
		});


	app.get('/success', function(req, res) {
		console.log("Inside the success callback");
		console.log(res);
		console.log(req);
	});
	// app.get('/auth/facebook/callback', function(req, res) {
	// 	passport.authenticate('facebook', function(user) {
	// 		if(!user) {
	// 			res.status(400).json({'err': 'There is some problem'});
	// 		} else {
	// 			console.log("User in callback");
	// 			res.status(200).json({'username': user.facebook.name, 'userProfilePicture': user.facebook.picture});
	// 		}
	// 	})(req, res);
	// });

	app.post('/users/post/:userId', function(req, res) {
		var userID = req.params.userId;
		var userPostMessage = req.body.postMessage;
		var postId = req.body.postId;
		var challengeID = req.body.challengeID;

		Challenge.find({'authorID': userID, 'challengeDetails.id': challengeID}, function(err, challenge) {
			challenge[0].posts.push({
				postMessage: userPostMessage,
				postId: postId
			});
			challenge[0].save(function(err, challenge) {
				if(err) {
					console.log(err);
					throw err;
				} else {
					res.status(200).json({
						'postedMessage': userPostMessage
					});
				}
			})
		})
	})

	/*
	// Route to handle addition of user's new posts
	app.post('/users/post/:userId', function(req, res) {
		// Access fronend user data using the request object
		var userId = req.body.userId;
		var userPostMessage = req.body.postMessage;
		var postId = req.body.postId;
		var challengeId = req.body.challengeID;
		// Get user from the database using userID. 
		// This saves the new post corresponding to the user posting it
		var username;
		User.find({
			'userId': userId
		}, 'local', function(err, user) {
			username = user.username;
		});

		// Create new post to save in the database
		var newPost = new Post();
		// Assign the new post values that the user entered
		newPost.postMessage = userPostMessage;
		newPost.author.userId = userId;
		newPost.author.postByUser.postId = postId;
		newPost.author.username = username;
		newPost.challengeID = challengeId;

		// Save the new post in the database
		newPost.save(function(err, post) {
			if (err) {
				console.log(err);
				throw err;
			}
			// Send success status back to the frontend
			// Also send updated post object
			res.status(200).json({
				'postedMessage': post.postMessage
			});
		});

	});

*/
	app.get('/previousPostsByUser/:userId', function(req, res) {
		var userId = req.params.userId;
		if (userId) {
			Post.find({
				'author.userId': userId
			}, function(err, posts) {
				if (err) {
					console.log(err);
					res.status(500).json({
						'err': 'Error in retrieving all posts by user'
					});
				} else {
					var allPostsByUser = [],
						nOfPosts = posts.length;
					if (nOfPosts === 0) {
						res.status(200).json({
							'isNewUser': true
						});
					} else {
						User.find({
								'userId': userId
							},
							function(err, user) {
								console.log(user[0].challenges);
							})
						console.log(posts);
						for (var i = 0; i < posts.length; i++) {

							allPostsByUser.push({
								'postId': posts[i].author.postByUser.postId,
								'postMessage': posts[i].postMessage
							});
						}
						res.status(200).json({
							'isNewUser': false,
							'allposts': allPostsByUser,
							'numberOfPosts': nOfPosts
						});
					}
				}
			})
		}

	});

	app.delete('/deleteUserPost', function(req, res) {
		var userId = req.body.postDetails.userId;
		var postId = req.body.postDetails.postId;

		Post.remove({
			'author.userId': userId,
			'author.postByUser.postId': postId
		}, function(err, post) {
			if (err) {
				console.log("Error finding the post");
			} else {
				console.log("Removed");
			}
		})
	});

	// app.post('/saveUserChallenge/:userId', function(req, res) {
	// 	var userId = req.params.userId;
	// 	var newChallenge = req.body;

	// 	User.find({'userId': userId}, function(err, user) {
	// 		if(err) {
	// 			console.log("Error in saving new user challenge");
	// 			console.log(err);
	// 		} else {
	// 			var currentLength = user[0].challenges.length;
	// 			user[0].challenges.push({id: currentLength+1, title: req.body.cTitle, color: req.body.cColor, days: req.body.cDays, date: req.body.cDate, penalty: req.body.cPenalty});
	// 			user[0].save(function(err) {
	// 				if(err) {
	// 					console.log("Error saving challenge");
	// 					res.status(500).json({'errorMessage': 'Cannot save in the db'});
	// 				} else {
	// 					console.log("Sending back the status");
	// 					res.status(200).json({'savedChallenge': {id: currentLength+1, title: req.body.cTitle, color: req.body.cColor, days: req.body.cDays, date: req.body.cDate, penalty: req.body.cPenalty}});
	// 				}
	// 			});
	// 		}
	// 	})
	// });

	app.post('/saveUserChallenge/:userId', function(req, res) {
		var userID = req.params.userId;
		var challengeLength;

		Challenge.find({}, function(err, challenges) {
			if (err) {
				console.log("Error getting previous challenges in /saveUserChallenge");
				console.log(err);
			} else if (challenges.length === 0) {
				challengeLength = 0;
			} else {
				challengeLength = challenges.length;
			}

			var challenge = new Challenge();
			challenge.challengeDetails.id = req.body.cID;
			challenge.challengeDetails.title = req.body.cTitle;
			challenge.challengeDetails.color = req.body.cColor;
			challenge.challengeDetails.days = req.body.cDays;
			challenge.challengeDetails.date = req.body.cDate;
			challenge.challengeDetails.penalty = req.body.cPenalty;
			challenge.authorID = userID;

			challenge.save(function(err, challenge) {
				if (err) {
					console.log("Error saving challenge in /saveUserChallenge");
					console.log(err);
					res.status(500).json({
						'errorMessage': 'Cannot save in the db'
					});
				} else {
					res.status(200).json({
						'savedChallenge': {
							id: challenge.challengeDetails.id,
							title: challenge.challengeDetails.title,
							color: challenge.challengeDetails.color,
							days: challenge.challengeDetails.days,
							date: challenge.challengeDetails.date,
							penalty: challenge.challengeDetails.penalty
						}
					});
				}
			})
		});
	})

}