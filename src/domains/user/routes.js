const userController = require("./controller");
// const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
 
// create a new user
router.post("/register", userController.user_signup);
router.post("/login", userController.user_login);
router.put("/:user_id", userController.update_user);

module.exports = router;
