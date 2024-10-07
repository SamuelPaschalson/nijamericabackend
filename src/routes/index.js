const express = require("express");
const router = express.Router();

const userRoute = require("../domains/user");
const businessRoute = require("../domains/business");

router.get("/api/nija", (_, __) =>
	__.status(200).json({ message: "This is a Sonic API service" })
);

router.use("/api/nija/user", userRoute);
router.use("/api/nija/business", businessRoute);

module.exports = router;
