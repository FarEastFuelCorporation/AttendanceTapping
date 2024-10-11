// routes/auth.js

const express = require("express");
const router = express.Router();

const {
  createEmployeeSignupController,
  createEmployeeLoginController,
  createClientSignupController,
  createClientLoginController,
} = require("../controllers/authController");

// Create Employee Signup route
router.post("/employeeSignup", createEmployeeSignupController);

// Create Employee Login route
router.post("/employeeLogin", createEmployeeLoginController);

// Create Client Signup route
router.post("/clientSignup", createClientSignupController);

// Create Client Login route
router.post("/clientLogin", createClientLoginController);

module.exports = router;
