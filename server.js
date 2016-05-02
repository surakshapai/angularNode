// Create and initiate express
var express = require('express');
var app = express();
// Require all modules needed
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var configDB = require('../finalApp/config/database.js');

console.log(configDB.url);

mongoose.connect(configDB.url);
require('../finalApp/config/passport')(passport);

// App configuration at server-side
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views/');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(require('express-session')({
	secret: 'challengeapp',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


require('../finalApp/routes.js')(app, passport);

app.get('*', function(req, res) {
		 res.header("Access-Control-Allow-Origin", 'http://facebook.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  res.header('Access-Control-Allow-Credentials', false);
		res.sendFile( path.join( __dirname, 'public/', 'index.html' ));
	});
app.listen(port);