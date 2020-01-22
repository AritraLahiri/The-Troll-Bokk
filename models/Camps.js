const mongoose = require('mongoose');

// SCHEMA
const campSchema = new mongoose.Schema({
	name: String,
	image: String,
	likes: { type: Number, default: 0 },
	liked: [],
	image_id: String,
	desc: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});
// MODEL
module.exports = mongoose.model('campGround', campSchema);
