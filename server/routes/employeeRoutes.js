// routes/employeeRoutes.js

const express = require("express");
const router = express.Router();
const {
  createEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
} = require("../controllers/employeeController");

// Create Employee route
router.post("/", createEmployeeController);

// Get Employees route
router.get("/", getEmployeesController);

// Update Employee route
router.put("/:id", updateEmployeeController);

// Delete Employee route
router.delete("/:id", deleteEmployeeController);

module.exports = router;
