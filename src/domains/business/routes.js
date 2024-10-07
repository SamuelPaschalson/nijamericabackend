const businessController = require("./controller");
// const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// create a new business
router.get("/fetch-list", businessController.fetch_business);
router.post("/add-business", businessController.list_business);

module.exports = router;
