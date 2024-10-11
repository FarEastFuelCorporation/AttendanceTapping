// controllers/vehicleMaintenanceController.js

const Employee = require("../models/Employee");
const Vehicle = require("../models/Vehicle");
const VehicleMaintenanceRequest = require("../models/VehicleMaintenanceRequest");
const VehicleType = require("../models/VehicleType");

// Create Vehicle controller
async function createVehicleController(req, res) {
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

// Get Vehicles controller
async function getVehiclesController(req, res) {
  try {
    // Fetch all vehicles from the database
    const vehicles = await Vehicle.findAll({
      include: {
        model: VehicleType,
        as: "VehicleType",
      },
    });

    res.json({ vehicles });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Vehicle controller
async function updateVehicleController(req, res) {
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

// Delete Vehicle controller
async function deleteVehicleController(req, res) {
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

// Get Vehicle Maintenance Requests controller
async function getVehicleMaintenanceRequestsController(req, res) {
  try {
    // Fetch all vehicle maintenance requests from the database
    const vehicleMaintenanceRequests = await VehicleMaintenanceRequest.findAll({
      include: [
        {
          model: Vehicle,
          as: "Vehicle",
        },
        {
          model: Employee,
          as: "Employee",
        },
      ],
    });

    res.json({ vehicleMaintenanceRequests });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Vehicle Maintenance Request controller
async function createVehicleMaintenanceRequestController(req, res) {
  try {
    // Extracting data from the request body
    let { plateNumber, requestDetails, createdBy } = req.body;

    requestDetails = requestDetails.toUpperCase();

    // Creating a new vehicle maintenance request
    await VehicleMaintenanceRequest.create({
      plateNumber,
      requestDetails,
      createdBy,
    });

    const vehicleMaintenanceRequests = await VehicleMaintenanceRequest.findAll({
      include: [
        {
          model: Vehicle,
          as: "Vehicle",
        },
        {
          model: Employee,
          as: "Employee",
        },
      ],
    });

    // Respond with the updated vehicle maintenance request data
    res.status(201).json({ vehicleMaintenanceRequests });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Vehicle Maintenance Request controller
async function updateVehicleMaintenanceRequestController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating vehicle maintenance request with ID:", id);

    let { plateNumber, requestDetails, createdBy } = req.body;
    console.log("Request body:", req.body);

    requestDetails = requestDetails.toUpperCase();

    // Find the vehicle maintenance request by ID and update it
    const updatedVehicleMaintenanceRequest =
      await VehicleMaintenanceRequest.findByPk(id);

    if (updatedVehicleMaintenanceRequest) {
      // Update vehicle maintenance request attributes
      updatedVehicleMaintenanceRequest.plateNumber = plateNumber;
      updatedVehicleMaintenanceRequest.requestDetails = requestDetails;
      updatedVehicleMaintenanceRequest.updatedBy = createdBy;

      // Save the updated vehicle maintenance request
      await updatedVehicleMaintenanceRequest.save();

      const vehicleMaintenanceRequests =
        await VehicleMaintenanceRequest.findAll({
          include: [
            {
              model: Vehicle,
              as: "Vehicle",
            },
            {
              model: Employee,
              as: "Employee",
            },
          ],
        });

      // Respond with the updated vehicle maintenance request data
      res.json({
        VehicleMaintenanceRequest: updatedVehicleMaintenanceRequest,
        vehicleMaintenanceRequests,
      });
    } else {
      // If vehicle maintenance request with the specified ID was not found
      res.status(404).json({
        message: `Vehicle maintenance request with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating vehicle maintenance request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Vehicle Maintenance Request controller
async function deleteVehicleMaintenanceRequestController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting VehicleMaintenanceRequest with ID:", id);

    // Find the VehicleMaintenanceRequest by ID
    const vehicleMaintenanceRequestToDelete =
      await VehicleMaintenanceRequest.findByPk(id);

    if (vehicleMaintenanceRequestToDelete) {
      // Update the deletedBy field
      vehicleMaintenanceRequestToDelete.updatedBy = deletedBy;
      vehicleMaintenanceRequestToDelete.deletedBy = deletedBy;
      await vehicleMaintenanceRequestToDelete.save();

      // Soft delete the VehicleMaintenanceRequest (sets deletedAt timestamp)
      await vehicleMaintenanceRequestToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `VehicleMaintenanceRequest with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If VehicleType with the specified ID was not found
      res
        .status(404)
        .json({ message: `VehicleMaintenanceRequest with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting VehicleMaintenanceRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getVehiclesController,
  createVehicleController,
  updateVehicleController,
  deleteVehicleController,
  getVehicleMaintenanceRequestsController,
  createVehicleMaintenanceRequestController,
  updateVehicleMaintenanceRequestController,
  deleteVehicleMaintenanceRequestController,
};
