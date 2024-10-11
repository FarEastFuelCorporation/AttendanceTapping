// routes/departmentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createDepartmentController,
  getDepartmentsController,
  updateDepartmentController,
  deleteDepartmentController,
} = require("../controllers/departmentController");

// Create Department route
router.post("/", createDepartmentController);

// Get Department route
router.get("/", getDepartmentsController);

// Update Department route
router.put("/:id", updateDepartmentController);

// Delete Department route
router.delete("/:id", deleteDepartmentController);

module.exports = router;
