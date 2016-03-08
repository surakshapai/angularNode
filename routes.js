var path = require('path');
var User = require('../finalApp/model/user.js');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index', {
			user: req.user
		});
	});

	app.get('/register', function(req, res) {
		res.render('register', {});
	});

	app.post('/register', function(req, res) {
		User.register(new User({
				username: req.body.user
			}),
			req.body.password,
			function(err, user) {
				if (err) {
					return res.status(500).json({
						err: err
					});
				}

				passport.authenticate('local')(req, res, function() {
					res.redirect('/');
				});
			});
	});

	app.get('/login', passport.authenticate('local'), function(req, res) {
		res.redirect('/');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/ping', function(req, res) {
		res.render('pong');
	});

	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.end(JSON.stringify({
			message: err.message,
			error: {}
		}));
	});
}