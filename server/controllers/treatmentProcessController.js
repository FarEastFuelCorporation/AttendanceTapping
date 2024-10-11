// controllers/treatmentProcessController.js

const TreatmentProcess = require("../models/TreatmentProcess");

// Create Treatment Process controller
async function createTreatmentProcessController(req, res) {
  try {
    // Extracting data from the request body
    let { treatmentProcess, createdBy } = req.body;

    treatmentProcess = treatmentProcess.toUpperCase();

    // Creating a new treatment processes
    await TreatmentProcess.create({
      treatmentProcess,
      createdBy,
    });

    const treatmentProcesses = await TreatmentProcess.findAll();

    // Respond with the updated treatment processes data
    res.status(201).json({ treatmentProcesses });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Treatment Process controller
async function getTreatmentProcessController(req, res) {
  try {
    // Fetch all treatment process from the database
    const treatmentProcesses = await TreatmentProcess.findAll();

    res.json({ treatmentProcesses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Treatment Process controller
async function updateTreatmentProcessController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating treatment process with ID:", id);

    let { treatmentProcess, createdBy } = req.body;

    treatmentProcess = treatmentProcess.toUpperCase();

    // Find the treatmentProcess by ID and update it
    const updatedTreatmentProcess = await TreatmentProcess.findByPk(id);

    if (updatedTreatmentProcess) {
      // Update treatment process attributes
      updatedTreatmentProcess.treatmentProcess = treatmentProcess;
      updatedTreatmentProcess.updatedBy = createdBy;

      // Save the updated treatment process
      await updatedTreatmentProcess.save();

      const treatmentProcesses = await TreatmentProcess.findAll();

      // Respond with the updated treatment process data
      res.json({
        treatmentProcess: updatedTreatmentProcess,
        treatmentProcesses,
      });
    } else {
      // If treatment process with the specified ID was not found
      res
        .status(404)
        .json({ message: `Treatment Process with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating treatment process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Treatment Process controller
async function deleteTreatmentProcessController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Treatment Process with ID:", id);

    // Find the Treatment Process by ID
    const treatmentProcessToDelete = await TreatmentProcess.findByPk(id);

    if (treatmentProcessToDelete) {
      // Update the deletedBy field
      treatmentProcessToDelete.updatedBy = deletedBy;
      treatmentProcessToDelete.deletedBy = deletedBy;
      await treatmentProcessToDelete.save();

      // Soft delete the TreatmentProcess (sets deletedAt timestamp)
      await treatmentProcessToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Treatment Process with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Treatment Process with the specified ID was not found
      res
        .status(404)
        .json({ message: `Treatment Process with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Treatment Process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTreatmentProcessController,
  createTreatmentProcessController,
  updateTreatmentProcessController,
  deleteTreatmentProcessController,
};
