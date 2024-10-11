// routes/hr_dashboard.js

const express = require("express");
const { getEmployeeRecords } = require("../controllers/hrDashboardController");
const router = express.Router();

// Dashboard route
router.get("/employee", getEmployeeRecords);

module.exports = router;
