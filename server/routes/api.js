// routes/api.js

const express = require("express");
const router = express.Router();

// Include your routes
const attendanceRoutes = require("./attendanceRoutes");
const { error404Controller } = require("../controllers/othersController");

// Route to check authentication status
router.get("/session", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.use("/attendance", attendanceRoutes);

router.use(error404Controller);

module.exports = router;
