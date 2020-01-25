const express = require('express'),
	router    = express.Router(),
	passport  = require('passport'),
	campground= require('../models/Camps');
	User      = require('../models/Users/user');

//===========
//AUTH ROUTES
//===========

//SIGNUP NEW
router.get('/register', (req, res) => res.render('register'));

//SIGNUP CREATE
router.post('/register', (req, res) => {
	const newUser = new User({
		username: req.body.username,
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		email:req.body.email,
		avatar: req.body.avatar
	});
	if (req.body.adminCode === process.env.ADMIN_CODE) {
		newUser.isAdmin = true
		req.flash('error','Welcome Admin')
	}
	User.register(newUser, req.body.password, (error, user) => {
		if (error) {
			req.flash('error', error.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/campgrounds');
			req.flash('success', 'Signed in as ' + req.body.username);
		});
	});
});

//LOGIN ROUTE NEW
router.get('/login', (req, res) => res.render('login'));
//LOGIN CREATE
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
	if (req.user.isAdmin) {
		req.flash("success", "HEY Admin!!");
		res.redirect("/campgrounds");
	}
	else {
		req.flash('success', 'Welcome ' + req.body.username);
		res.redirect('/campgrounds');
	}
});
//LOGOUT
router.get('/logout', (req, res) => {
	req.logOut();
	req.flash('success', 'Successfully Logged you out!');
	res.redirect('/campgrounds');
});

router.get("/campgrounds/user/:id", (req, res) => {
	User.findById(req.params.id, (error, foundUser) => {
		if (error) {
			req.flash("error", "Cannot find User");
			res.redirect("/campgrounds");
		}
		else {
			campground.find().where('author.id').equals(foundUser._id).exec(function (err, foundCamps) {
				if (err) {
					req.flash("error", err.message);
					res.redirect("/campgrounds");
				}
				else {
					
					res.render("user/show", { user: foundUser,camp:foundCamps });
				}
			})



		}
	})
})



module.exports = router;
