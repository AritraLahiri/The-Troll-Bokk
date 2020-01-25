//REQUIRING DEPENDENCIES
require('dotenv').config();
const express 	 = require('express'),
	app          = express(),
	bodyParser   = require('body-parser'),
	methodOveride= require('method-override'),
	mongoose 	 = require('mongoose'),
	passport 	 = require('passport'),
	User         = require('./models/Users/user'),
	LocalStrategy= require('passport-local'),
	flash        = require('connect-flash'),
	Comment 	 = require('./models/comments'),
	campGround 	 = require('./models/Camps'),
	seeds		 = require('./seeds');

// REQUIRING ALL ROUTES
const campRoute  = require('./routes/campGround'),
	commentRoute = require('./routes/Comment'),
	authRoute 	 = require('./routes/Auth');

// mongoose.connect('mongodb+srv://aritra:GSf6li1FuXTev75y@cluster0-3ts3r.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false });
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
// APP CONFIG
app.set('view engine', '.ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOveride('_method'));
app.use(flash());


// seeds(); //Seed the Database

//PASSPORT CONFIG
app.use(
	require('express-session')({
		secret: 'This world is full of secrets hidden from our eyes.....',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//USER MIDDLEWARE of USERS
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

//USING ROUTES
app.use(campRoute);
app.use(commentRoute);
app.use(authRoute);

//Server Code
app.listen(process.env.PORT || 3000);
