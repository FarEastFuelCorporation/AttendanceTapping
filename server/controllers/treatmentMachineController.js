// controllers/treatmentMachineController.js

const TreatmentMachine = require("../models/TreatmentMachine");
const TreatmentProcess = require("../models/TreatmentProcess");

// Create Treatment Machine controller
async function createTreatmentMachineController(req, res) {
  try {
    // Extracting data from the request body
    let { treatmentProcessId, machineName, createdBy } = req.body;

    machineName = machineName.toUpperCase();

    // Creating a new vehicle
    await TreatmentMachine.create({
      treatmentProcessId,
      machineName,
      createdBy,
    });

    const treatmentMachines = await TreatmentMachine.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["machineName", "ASC"]],
    });

    // Respond with the updated vehicle data
    res.status(201).json({ treatmentMachines });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Treatment Machines controller
async function getTreatmentMachinesController(req, res) {
  try {
    // Fetch all vehicles from the database
    const treatmentMachines = await TreatmentMachine.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["machineName", "ASC"]],
    });

    res.json({ treatmentMachines });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update TreatmentMachine controller
async function updateTreatmentMachineController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Treatment Machine with ID:", id);

    let { treatmentProcessId, machineName, createdBy } = req.body;

    machineName = machineName.toUpperCase();

    // Find the vehicle by ID and update it
    const updatedTreatmentMachine = await TreatmentMachine.findByPk(id);

    if (updatedTreatmentMachine) {
      // Update vehicle attributes
      updatedTreatmentMachine.treatmentProcessId = treatmentProcessId;
      updatedTreatmentMachine.machineName = machineName;
      updatedTreatmentMachine.updatedBy = createdBy;

      // Save the updated vehicle
      await updatedTreatmentMachine.save();

      const treatmentMachines = await TreatmentMachine.findAll({
        include: {
          model: TreatmentProcess,
          as: "TreatmentProcess",
        },
        order: [["machineName", "ASC"]],
      });

      // Respond with the updated Treatment Machines data
      res.status(201).json({ treatmentMachines });
    } else {
      // If Treatment Machine with the specified ID was not found
      res
        .status(404)
        .json({ message: `TreatmentMachine with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating Treatment Machines:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete TreatmentMachine controller
async function deleteTreatmentMachineController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting TreatmentMachine with ID:", id);

    // Find the TreatmentMachine by ID
    const treatmentMachineToDelete = await TreatmentMachine.findByPk(id);

    if (treatmentMachineToDelete) {
      // Update the deletedBy field
      treatmentMachineToDelete.updatedBy = deletedBy;
      treatmentMachineToDelete.deletedBy = deletedBy;
      await treatmentMachineToDelete.save();

      // Soft delete the TreatmentProcess (sets deletedAt timestamp)
      await treatmentMachineToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `TreatmentMachine with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If TreatmentMachine with the specified ID was not found
      res
        .status(404)
        .json({ message: `TreatmentMachine with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting TreatmentMachine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTreatmentMachineController,
  getTreatmentMachinesController,
  updateTreatmentMachineController,
  deleteTreatmentMachineController,
};
