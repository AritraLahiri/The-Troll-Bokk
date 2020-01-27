const express = require('express'),
	router = express.Router(),
	campGround = require('../models/Camps'),
	middleware = require('../middleware'),
	multer = require('multer'),
	storage = multer.diskStorage({
		filename: function(req, file, callback) {
			callback(null, Date.now() + file.originalname);
		}
	}),
	imageFilter = function(req, file, cb) {
		// accept image files only
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
	upload = multer({ storage: storage, fileFilter: imageFilter }),
	cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'dzdmmkzcb',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

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
			//Array Shuffling Code
			// const array = (arr) => {
			// 	if (!arr.length) return arr
			// 	let res;
			// 	//SWAPING BETWEEN TWO NUMBERS
			// 	const swap = (arr, i, j) => {
			// 		const temp = arr[i];
			// 		arr[i] = arr[j];
			// 		arr[j] = temp;
			// 		return arr;
			// 	};
			// 	const n = arr.length;
			// 	//CREATING A COPY OF ORIGINAL ARRAY
			// 	const shuffled = arr.slice();
			// 	//SWAPPING BETWEEN RANDOM NUMBERS
			// 	for (let i = 0; i < n; i++) {
			// 		res = swap(shuffled, i, Math.floor(Math.random() * n));
			// 	}
			// 	return res;
			// };

			// allCampGround = array(allCampGround);
			res.render('campGround/index', { camp: allCampGround });
		}
	});
});

// ADDS MORE CAMPS
router.post('/campgrounds', middleware.isLoggedIn, upload.single('image'), (req, res) => {
	cloudinary.uploader.upload(req.file.path, (result) => {
		// add cloudinary url for the image to the campground object under image property
		req.body.campground.image = result.secure_url;
		//Add IMAGE PUBLIC ID TO OBJECT
		req.body.campground.image_id = result.public_id;

		// add author to campground
		req.body.campground.author = {
			id: req.user._id,
			username: req.user.username
		};
		campGround.create(req.body.campground, (err, campground) => {
			if (err) {
				req.flash('error', err.message);
				return res.redirect('back');
			}
			res.redirect('/campgrounds/' + campground.id);
		});
	});
});

// DIRECTS TO ADD CAMPS PAGE
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => res.render('campGround/new'));

// SHOW PARTICAULAR CAMPS
router.get('/campgrounds/:id', (req, res) => {
	campGround.findById(req.params.id).populate('comments').exec((error, foundCamps) => {
		error ? console.log(error) : res.render('campGround/show', { campGround: foundCamps });
	});
});

//Likes Route
router.get('/campgrounds/:id/like', middleware.isLoggedIn, (req, res) => {
	campGround.findById(req.params.id, (error, foundCamp) => {
		if (error) req.flash('error', err.message);
		else {
			if (foundCamp.liked.indexOf(req.user.username) === -1) {
				foundCamp.liked.push(req.user.username);
				foundCamp.likes++;
				foundCamp.save();
				res.redirect('back');
			} else {
				let index = foundCamp.liked.indexOf(req.user.username);
				foundCamp.liked.splice(index, 1);
				foundCamp.likes--;
				foundCamp.save();
				console.log(foundCamp.liked);
				res.redirect('back');
			}
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get('/campgrounds/:id/edit', middleware.isCampOwner, (req, res) => {
	campGround.findById(req.params.id, (err, foundground) => {
		res.render('campGround/Edit', { campground: foundground });
	});
});

// //UPDATE CAMPGROUND ROUTE
router.put('/campgrounds/:id', upload.single('image'), function(req, res) {
	campGround.findById(req.params.id, async function(err, campground) {
		if (err) {
			req.flash('error', err.message);
			console.log('ERROR IN DATABASE QUERY');
			res.redirect('back');
		} else {
			if (req.file) {
				try {
					await cloudinary.uploader.destroy(campground.image_id);
					var result = await cloudinary.uploader.upload(req.file.path);
					campground.image_id = result.public_id;
					campground.image = result.secure_url;
				} catch (err) {
					console.log('ERROR IN FILE CLOUDINARY');
					req.flash('error', err.message);
					return res.redirect('back');
				}
			}
			campground.name = req.body.name;
			campground.desc = req.body.desc;
			campground.save();
			req.flash('success', 'Successfully Updated!');
			res.redirect('/campgrounds/' + campground._id);
		}
	});
});

//DELETE CAMPGROUND
router.delete('/campgrounds/:id', middleware.isCampOwner, (req, res) => {
	campGround.findByIdAndRemove(req.params.id, (error, deleteCamp) => {
		error ? console.log(error) : res.redirect('/campgrounds');
	});
});

module.exports = router;
