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
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({
			'local.email': email
		}, function(err, user){
			if(err) {
				return done(err);
			}
			if(!user) {
				return done(null, false, req.flash('loginMessage', 'Please sign up if you are new'));
			}
			if(!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Ooops! Wrong password'));
			}
			return done(null, user);
		});
	}
	));

	passport.use('local-signup', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({
				'local.email': email
			}, function(err, user) {
				if(err) {
					return done(err);
				}
				if(user) {
					return done(null, false, req.flash('signupMessage', 'Username already exists!'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = password;
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