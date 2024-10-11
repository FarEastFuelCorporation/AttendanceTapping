// controllers/switchUserController.js

const EmployeeRolesOtherRole = require("../models/EmployeeRolesOtherRole");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee");
const EmployeeRole = require("../models/EmployeeRole");

// Get EmployeeRolesOtherRoles controller
async function getEmployeeRolesOtherRolesController(req, res) {
  try {
    // Fetch all EmployeeRolesOtherRole from the database
    const employeeRolesOtherRoles = await EmployeeRolesOtherRole.findAll();

    // Respond with the updated data
    res.json({ employeeRolesOtherRoles });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get EmployeeRolesOtherRole controller
async function getEmployeeRolesOtherRoleController(req, res) {
  try {
    const { id } = req.params; // Get userId from the request parameters

    // Fetch EmployeeRolesOtherRole for the specific userId
    const employeeRolesOtherRole = await EmployeeRolesOtherRole.findAll({
      where: {
        employeeId: id, // Assuming there is a userId field in the EmployeeRolesOtherRole model
      },
      include: {
        model: EmployeeRole,
        as: "EmployeeRole",
      },
      order: [
        ["employeeRoleId", "ASC"], // Sorting by employeeRoleId in ascending order (change 'ASC' to 'DESC' for descending)
      ],
    });

    // Respond with the updated data
    res.json({ employeeRolesOtherRole });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update EmployeeRolesOtherRole controller
async function updateEmployeeRolesOtherRoleController(req, res) {
  try {
    const { id } = req.params; // Get employeeId from the request parameters
    const { roleId } = req.body; // Get the new roleId from the request body

    // Find the EmployeeRolesEmployee by employeeId
    const employeeRolesEmployee = await EmployeeRolesEmployee.findOne({
      where: { employeeId: id },
    });

    console.log("roleId", roleId);

    if (employeeRolesEmployee) {
      // Set the new roleId and mark the field as changed
      employeeRolesEmployee.set("employeeRoleId", roleId);
      employeeRolesEmployee.changed("employeeRoleId", true);

      // Save the updated EmployeeRolesEmployee
      await employeeRolesEmployee.save();

      console.log("Updated EmployeeRolesEmployee:", employeeRolesEmployee);

      // Respond with the updated data
      res.json({ employeeRolesEmployee });
    } else {
      // If EmployeeRolesEmployee with the specified employeeId was not found
      res.status(404).json({ message: `Employee with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating employee role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getEmployeeRolesOtherRolesController,
  getEmployeeRolesOtherRoleController,
  updateEmployeeRolesOtherRoleController,
};
