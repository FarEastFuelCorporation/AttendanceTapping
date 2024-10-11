// routes/others.js

const express = require("express");
const {
  homeController,
  logoutController,
} = require("../controllers/othersController");
const router = express.Router();

router.get("/", homeController);
router.get("/logout", logoutController);

module.exports = router;
