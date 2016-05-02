var User = require('../model/user');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('../config/auth.js');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	/* Whole object is retrieved in this function using the same user ID.
	The object is retrieved from the connected db 
	*/
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Handle login of user
	passport.use('local-login', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	// Check if user exists, if he exists, check if 
	// entered credentials are correct
	function(req, username, password, done) {
		User.findOne({
			'local.username': username
		}, function(err, user){
			if(err) {
				return done(err);
			}
			if(!user) {
				return done(null, false, {'loginMessage': 'Please sign up if you are new'});
			}
			if(!user.validPassword(password)) {
				return done(null, false, {'loginMessage':'Ooops! Wrong password'});
			}
			return done(null, user);
		});
	}
	));

	passport.use('local-signup', new localStrategy(
	{
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {
		process.nextTick(function() {
			console.log("userId" + req.body.userId);
			
			User.findOne({
				'local.username': username
			}, function(err, user) {
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, false, {message: 'Username already exists!'});
				} else {
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.userId = req.body.userId;
					newUser.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use(new facebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'name', 'displayName', 'photos', 'profileUrl']
	},

	function(token, refreshToken, profile, done) {
		User.findOne({'facebook.id': profile.id}, function(err, user) {
			if(err) {
				console.log("Comign here");
				return done(err);
			} 
			if(user) {
				return done(user);
			} else {
				var newUser = new User();

				newUser.facebook.id = profile.id;
				newUser.facebook.name = profile.displayName;
				// newUser.facebook.email = profile.emails[0].value;
				newUser.facebook.picture = profile.photos[0].value;

				newUser.save(function(err) {
					if(err) {
						throw err;
					}
					return done(newUser);
				});
			}
		});
	}));
}