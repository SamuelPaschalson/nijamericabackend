const businessController = require("./controller");
// const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// create a new business
router.get("/fetch-business/:business_id", businessController.fetch_business);
router.post("/add-business", businessController.list_business);
router.get("/add-reviews", businessController.count);
router.get("/reviews", businessController.count);
router.get("/add-products", businessController.count);
router.get("/products", businessController.count);
router.get("/count/:userId", businessController.count_businesses_by_user);

module.exports = router;
