// controllers/dispatchedTransactionController.js

const Department = require("../models/Department");

// Create Department controller
async function createDepartmentController(req, res) {
  try {
    // Extracting data from the request body
    let { department, createdBy } = req.body;

    if (department) {
      department = department.toUpperCase();
    }

    // Creating a new departments
    await Department.create({
      department,
      createdBy,
    });

    // Fetch all departments from the database
    const departments = await Department.findAll({
      order: [["department", "ASC"]],
    });

    // Respond with the updated data
    res.json({ departments });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Departments controller
async function getDepartmentsController(req, res) {
  try {
    // Fetch all departments from the database
    const departments = await Department.findAll({
      order: [["department", "ASC"]],
    });

    // Respond with the updated data
    res.json({ departments });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Department controller
async function updateDepartmentController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating department with ID:", id);

    // Extracting data from the request body
    let { department, createdBy } = req.body;

    if (department) {
      department = department.toUpperCase();
    }

    // Find the department by UUID (id) and update it
    const updatedDepartment = await Department.findByPk(id);

    if (updatedDepartment) {
      // Update department attributes
      updatedDepartment.department = department;
      updatedDepartment.updatedBy = createdBy;

      // Save the updated department
      await updatedDepartment.save();

      // Fetch all departments from the database
      const departments = await Department.findAll({
        order: [["department", "ASC"]],
      });

      // Respond with the updated data
      res.json({ departments });
    } else {
      // If dispatched transaction with the specified ID was not found
      res.status(404).json({ message: `Department with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Department controller
async function deleteDepartmentController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting department with ID:", id);

    // Find the department by UUID (id)
    const departmentToDelete = await Department.findByPk(id);

    if (departmentToDelete) {
      // Update the deletedBy field
      departmentToDelete.updatedBy = deletedBy;
      departmentToDelete.deletedBy = deletedBy;
      await departmentToDelete.save();

      // Soft delete the department (sets deletedAt timestamp)
      await departmentToDelete.destroy();

      // Fetch all departments from the database
      const departments = await Department.findAll({
        order: [["department", "ASC"]],
      });

      // Respond with the updated data
      res.json({ departments });
    } else {
      // If department with the specified ID was not found
      res.status(404).json({ message: `department with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createDepartmentController,
  getDepartmentsController,
  updateDepartmentController,
  deleteDepartmentController,
};
