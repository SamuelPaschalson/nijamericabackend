const userController = require("./controller");
// const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// create a new user
router.post("/register", userController.user_signup);
router.post("/login", userController.user_login);
router.put("/:user_id", userController.update_user);
router.put("/change-password/:user_id", userController.change_password);
router.delete("/delete-account/:userId", userController.delete_account);

module.exports = router;
