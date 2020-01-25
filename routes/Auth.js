const express = require('express'),
	router    = express.Router(),
	passport  = require('passport'),
	User      = require('../models/Users/user');

//===========
//AUTH ROUTES
//===========

//SIGNUP NEW
router.get('/register', (req, res) => res.render('register'));

//SIGNUP CREATE
router.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (error, user) => {
		if (error) {
			req.flash('error', error.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/campgrounds');
			req.flash('success', 'Signed in as ' + req.body.username);
		});
	});
});

//LOGIN ROUTE NEW
router.get('/login', (req, res) => res.render('login'));
//LOGIN CREATE
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
	req.flash('success', 'Nice to see you again ' + req.body.username);
	res.redirect('/campgrounds');
});
//LOGOUT
router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success', 'Successfully Logged you out!');
	res.redirect('/campgrounds');
});


module.exports = router;
