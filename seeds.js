const mongoose = require('mongoose');
const campGround = require('./models/Camps');
const Comment = require('./models/comments');
const data = [
	{
		name: "Cloud's Rest",
		image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
		desc:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'Desert Mesa',
		image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
		desc:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	},
	{
		name: 'Canyon Floor',
		image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
		desc:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
	}
];

const dataBase = () => {
	campGround.deleteMany({}, (error) => {
		if (error) {
			console.log(error);
		}
	});
	Comment.deleteMany({}, (error) => {
		if (error) console.log(error);
	});
	data.forEach((seed) => {
		campGround.create(seed, (error, data) => {
			if (error) console.log(error);
			else {
				Comment.create(
					{
						text: 'What  a nice place it is ! ',
						author: 'Homer'
					},
					(error, comment) => {
						if (error) console.log(error);
						else {
							data.comments.push(comment);
							data.save();
						}
					}
				);
			}
		});
	});
};
module.exports = dataBase;
