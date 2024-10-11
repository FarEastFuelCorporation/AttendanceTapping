// routes/switchUserRoutes.js

const express = require("express");
const router = express.Router();
const {
  getEmployeeRolesOtherRolesController,
  getEmployeeRolesOtherRoleController,
  updateEmployeeRolesOtherRoleController,
} = require("../controllers/switchUserController");

// Get EmployeeRolesOtherRoles route
router.get("/", getEmployeeRolesOtherRolesController);

// Get EmployeeRolesOtherRole route
router.get("/:id", getEmployeeRolesOtherRoleController);

// Update Dispatched Transaction route
router.put("/:id", updateEmployeeRolesOtherRoleController);

module.exports = router;
