// routes/attendanceRoutes.js

const express = require("express");
const router = express.Router();
const {
  submitAttendance,
  attendance,
} = require("../controllers/attendanceController");

router.get("/", attendance);

router.post("/:employeeId", submitAttendance);

module.exports = router;
