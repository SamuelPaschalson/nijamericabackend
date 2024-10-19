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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Product schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  reviews: [reviewSchema], // Product reviews
});

const businessSchema = new mongoose.Schema({
  business_name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  business_owner: {
    type: String,
    required: true,
  },
  business_description: {
    type: String,
  },
  location: {
    type: String,
  },
  business_id: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema], // Business reviews
  products: [productSchema],
});

module.exports = mongoose.model("Business", businessSchema, "business");
