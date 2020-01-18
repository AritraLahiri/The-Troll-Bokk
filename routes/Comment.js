const express 	= require('express'),
	router 		= express.Router(),
	Comment 	= require('../models/comments'),
	campGround 	= require('../models/Camps'),
	middleware 	= require('../middleware');


//====================================================
// 					COMMENTS
//====================================================
router.get('/campgrounds/:id/comment/new', middleware.isLoggedIn, (req, res) => {
	campGround.findById(req.params.id, (error, camps) => {
		if (error) console.log(error);
		else {
			res.render('Comments/new', { campGround: camps });
		}
	});
});
router.post('/campgrounds/:id/comment',middleware.isLoggedIn, (req, res) => {
	campGround.findById(req.params.id, (error, data) => {
		if (error) {
			res.redirect('/campgrounds');
			console.log(error);
		} else {
			Comment.create(req.body.comment, (error, comment) => {
				if (error) console.log(error);
				else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					data.comments.push(comment);
					data.save();
					req.flash("success","Succesfully Commented!")
					res.redirect('/campgrounds/' + data._id);
				}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get('/campgrounds/:id/comment/:comment_id/edit',middleware.isCommentOwner,(req, res) => {
	Comment.findById(req.params.comment_id, (error, foundComment) => {
		if (error) res.redirect('back');
		else {
			res.render('Comments/edit', { comment: foundComment, campGround_id: req.params.id });
		}
	});
});

//COMMENT UPDATE ROUTE
router.put('/campgrounds/:id/comment/:comment_id',middleware.isCommentOwner ,(req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
		if (error) res.redirect('back');
		else res.redirect('/campgrounds/' + req.params.id);
	});
});

//DESTROY COMMENT
router.delete('/campgrounds/:id/comment/:comment_id',middleware.isCommentOwner ,(req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (error, deletedComt) => {
		if (error) {
			res.redirect("back")
		}
		else {
			req.flash("success", "Comment Deleted");
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

module.exports = router;
