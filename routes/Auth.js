const express = require('express'),
	router    = express.Router(),
	passport  = require('passport'),	
	User   	  =	require('../models/Users/user');

//===========
//AUTH ROUTES
//===========

//SIGNUP NEW
router.get('/register', (req, res) => res.render('register'));

//SIGNUP CREATE
router.post('/register', (req, res) => {
	User.register(new User({ username: req.body.username }), req.body.password, (error, user) => {
		if (error) {
			console.log(error);
			req.flash("error",error.message)
			res.redirect('/register');
		} else {
			passport.authenticate('local', { failureRedirect: '/register' });
			req.flash("success","Signed in as " + req.body.username);
			res.redirect('/campgrounds');
		}
	});
});

//LOGIN ROUTE NEW
router.get("/login", (req, res) => res.render("login"));
//LOGIN CREATE
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), (req, res) => {
	req.flash("success", "Nice to see you again " + req.body.username);
	res.redirect("/campgrounds");
});
//LOGOUT
router.get("/logout", (req, res) => {
	req.logOut();
	req.flash("success", "Successfully Logged you out!");
	res.redirect("/campgrounds");
})

//MIDLLEWARE ISLOGGEDIN
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next()
	else res.redirect("/login");
}

module.exports = router