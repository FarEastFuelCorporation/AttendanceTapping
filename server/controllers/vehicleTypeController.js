// controllers/vehicleTypeController.js

const VehicleType = require("../models/VehicleType");

// Create Vehicle Type controller
async function createVehicleTypeController(req, res) {
  try {
    // Extracting data from the request body
    let { typeOfVehicle, createdBy } = req.body;

    typeOfVehicle = typeOfVehicle.toUpperCase();

    // Creating a new vehicle type
    await VehicleType.create({
      typeOfVehicle,
      createdBy,
    });

    const vehicleTypes = await VehicleType.findAll();

    // Respond with the updated vehicle type data
    res.status(201).json({ vehicleTypes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Vehicle Types controller
async function getVehicleTypesController(req, res) {
  try {
    // Fetch all vehicleTypes from the database
    const vehicleTypes = await VehicleType.findAll({
      order: [["typeOfVehicle", "ASC"]],
    });

    res.json({ vehicleTypes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Vehicle Type controller
async function updateVehicleTypeController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating vehicle type with ID:", id);

    let { typeOfVehicle, createdBy } = req.body;
    console.log("Request body:", req.body);

    typeOfVehicle = typeOfVehicle.toUpperCase();

    // Find the vehicle type by ID and update it
    const updatedVehicleType = await VehicleType.findByPk(id);

    if (updatedVehicleType) {
      // Update vehicle type attributes
      updatedVehicleType.typeOfVehicle = typeOfVehicle;
      updatedVehicleType.updatedBy = createdBy;

      // Save the updated vehicle type
      await updatedVehicleType.save();

      const vehicleTypes = await VehicleType.findAll();

      // Respond with the updated vehicle type data
      res.json({
        vehicleType: updatedVehicleType,
        vehicleTypes,
      });
    } else {
      // If vehicle type with the specified ID was not found
      res.status(404).json({ message: `Vehicle type with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating vehicle type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Vehicle Type controller
async function deleteVehicleTypeController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting VehicleType with ID:", id);

    // Find the VehicleType by ID
    const vehicleTypeToDelete = await VehicleType.findByPk(id);

    if (vehicleTypeToDelete) {
      // Update the deletedBy field
      vehicleTypeToDelete.updatedBy = deletedBy;
      vehicleTypeToDelete.deletedBy = deletedBy;
      await vehicleTypeToDelete.save();

      // Soft delete the VehicleType (sets deletedAt timestamp)
      await vehicleTypeToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `VehicleType with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If VehicleType with the specified ID was not found
      res.status(404).json({ message: `VehicleType with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting VehicleType:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getVehicleTypesController,
  createVehicleTypeController,
  updateVehicleTypeController,
  deleteVehicleTypeController,
};
