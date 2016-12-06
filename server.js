var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride  = require('method-override');
var passport = require('passport');
var flash = require('connect-flash');


var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
console.log('connected to MongoDB')

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(session({secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));




app.set('view engine', 'ejs');


require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);