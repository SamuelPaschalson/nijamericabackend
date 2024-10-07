const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: {
		type: String,
		required: true,
	},
});

const businessSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	website: {
		type: String,
	},
	category: {
		type: String,
	},
	location: {
		type: String,
	},
	// reviews: [reviewSchema],
});

module.exports = mongoose.model("Business", businessSchema, "business");
