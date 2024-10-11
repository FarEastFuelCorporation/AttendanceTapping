// controllers/employeeController.js

const Employee = require("../models/Employee");
const Vehicle = require("../models/Vehicle");
const VehicleType = require("../models/VehicleType");

// Create Employee controller
async function createEmployeeController(req, res) {
  try {
    // Extracting data from the request body
    let {
      vehicleTypeId,
      plateNumber,
      vehicleName,
      netCapacity,
      ownership,
      createdBy,
    } = req.body;

    plateNumber = plateNumber.toUpperCase();
    vehicleName = vehicleName.toUpperCase();

    // Creating a new vehicle
    await Vehicle.create({
      vehicleTypeId,
      plateNumber,
      vehicleName,
      netCapacity,
      ownership,
      createdBy,
    });

    const vehicles = await Vehicle.findAll({
      include: {
        model: VehicleType,
        as: "VehicleType",
      },
    });

    // Respond with the updated vehicle data
    res.status(201).json({ vehicles });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Employees controller
async function getEmployeesController(req, res) {
  try {
    // Fetch all vehicles from the database
    const employees = await Employee.findAll();

    res.json({ employees });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Employee controller
async function updateEmployeeController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating vehicle with ID:", id);

    let {
      vehicleTypeId,
      plateNumber,
      vehicleName,
      netCapacity,
      ownership,
      createdBy,
    } = req.body;

    plateNumber = plateNumber.toUpperCase();
    vehicleName = vehicleName.toUpperCase();

    // Find the vehicle by ID and update it
    const updatedVehicle = await Vehicle.findByPk(id);

    if (updatedVehicle) {
      // Update vehicle attributes
      updatedVehicle.vehicleTypeId = vehicleTypeId;
      updatedVehicle.plateNumber = plateNumber;
      updatedVehicle.vehicleName = vehicleName;
      updatedVehicle.netCapacity = netCapacity;
      updatedVehicle.ownership = ownership;
      updatedVehicle.updatedBy = createdBy;

      // Save the updated vehicle
      await updatedVehicle.save();

      const vehicles = await Vehicle.findAll({
        include: {
          model: VehicleType,
          as: "VehicleType",
        },
      });

      // Respond with the updated vehicle data
      res.json({
        vehicle: updatedVehicle,
        vehicles,
      });
    } else {
      // If vehicle with the specified ID was not found
      res.status(404).json({ message: `Vehicle with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Employee controller
async function deleteEmployeeController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Vehicle with ID:", id);

    // Find the Vehicle by ID
    const vehicleToDelete = await Vehicle.findByPk(id);

    if (vehicleToDelete) {
      // Update the deletedBy field
      vehicleToDelete.updatedBy = deletedBy;
      vehicleToDelete.deletedBy = deletedBy;
      await vehicleToDelete.save();

      // Soft delete the VehicleType (sets deletedAt timestamp)
      await vehicleToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Vehicle with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Vehicle with the specified ID was not found
      res.status(404).json({ message: `Vehicle with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
};
