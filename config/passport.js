var User = require('../model/user');
var localStrategy = require('passport-local').Strategy;

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

	passport.use('local-login', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
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

	passport.use('local-signup', new localStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, username, password, done) {

		process.nextTick(function() {
			
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
}