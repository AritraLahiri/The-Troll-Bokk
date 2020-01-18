const express 	= require('express'),
	router 		= express.Router(),
	campGround 	= require('../models/Camps'),
	middleware	= require('../middleware');
	
// LANDING PAGE
router.get('/', (req, res) => {
	res.render('campGround/home');
});

// SHOWS ALL THE CAMPS
router.get('/campgrounds', (req, res) => {
	campGround.find({}, (err, allCampGround) => {
		if (err) {
			console.log(error);
		} else {
			res.render('campGround/index', { camp: allCampGround });
		}
	});
});

// ADDS MORE CAMPS
router.post('/campgrounds',middleware.isLoggedIn, (req, res) => {
	const name = req.body.name;
	const price = req.body.price;
	const image 	= req.body.image;
	const desc 		= req.body.descp;
	const author 	= {
			id:req.user._id,
			username:req.user.username
	}
	const newCamp 	= { name: name,price:price, image: image, desc: desc,author:author};

	campGround.create(newCamp, (err) => {
		if (err) {
			console.log(err);
		}
	});

	res.redirect('/campgrounds');
});

// DIRECTS TO ADD CAMPS PAGE
router.get('/campgrounds/new',middleware.isLoggedIn, (req, res) => res.render('campGround/new'));

// SHOW PARTICAULAR CAMPS
router.get('/campgrounds/:id', (req, res) => {
	campGround.findById(req.params.id).populate('comments').exec((error, foundCamps) => {
		error ? console.log(error) : res.render('campGround/show', { campGround: foundCamps});
	});	
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.isCampOwner,(req, res) => {
	campGround.findById(req.params.id, (err,foundground) => {
		res.render("campGround/Edit", { campground: foundground });	
	} )


});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.isCampOwner,(req, res) => {
	campGround.findByIdAndUpdate(req.params.id, req.body.camp, (error, updatedCamp) => {
		(error) ? res.redirect("/campgrounds") : res.redirect("/campgrounds/" + updatedCamp._id);
	});
});

//DELETE CAMPGROUND
router.delete("/campgrounds/:id",middleware.isCampOwner, (req, res) => {
	campGround.findByIdAndRemove(req.params.id, (error, deleteCamp) => {
		(error) ? console.log(error) : res.redirect("/campgrounds");
	});
});


module.exports = router;
