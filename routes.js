var path = require('path');
var User = require('../finalApp/model/user.js');

module.exports = function(app, passport) {

	app.get('*', function(req, res) {
		res.sendFile( path.join( __dirname, 'public/', 'index.html' ));
	});
	
	app.post('/register', function(req, res) {
		var username = req.body.username, 
		password = req.body.password;
		passport.authenticate('local-signup', function(err, user) {
			if(err) {
				res.status(400).json({"err" : 'There is some error'});
			} else {
				res.status(200).json({"username": user.username});
			}
		})(req, res);
	});

	app.post('/login', function(req, res) {
		passport.authenticate('local-login', function(err, user) {
			if(!user) {
				res.status(400).json({'err': 'You have not signed up'});
			} else {
				console.log(user.local.username);
				res.status(200).json({'username': user.local.username});
			}
		})(req, res);
	});

}