let middlewareObj = {};
const Comment = require('../models/comments'),
	campGround = require('../models/Camps'),
	flash = require('connect-flash');

//MIDDLEWARE WHO CAN EDIT OR DELETE COMMENT(AUTHORIZATION)
middlewareObj.isCommentOwner = function isCommentOwner(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash('error', 'Sorry you not welcomed here :(');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must be logged in first!');
		res.redirect('back');
	}
};

//MIDDLEWARE  CAMP-PERMISSIONS or WHO CAN EDIT-DELETE
middlewareObj.isCampOwner = function isCampOwner(req, res, next) {
	if (req.isAuthenticated()) {
		campGround.findById(req.params.id, (err, foundGround) => {
			if (err) {
				res.redirect('back');
			} else {
				if (foundGround.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash('error', 'Sorry you are not welcomed Here!');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You must be logged in first!');
		res.redirect('back');
	}
};

//MIDLLEWARE ISLOGGEDIN
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	else {
		req.flash('error', 'You must be logged in first!');
		res.redirect('/login');
	}
};

module.exports = middlewareObj;
