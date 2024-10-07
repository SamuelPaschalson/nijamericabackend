const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true },
		phonenumber: { type: String, required: true },
		password: { type: String, required: true },
		image: { type: String, default: "avatar.png" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "user");
