// controllers/typeOfWasteController.js

const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");

// Create Type Of Waste controller
async function createTypeOfWasteController(req, res) {
  try {
    // Extracting data from the request body
    let {
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    } = req.body;

    wasteCode = wasteCode.toUpperCase();
    wasteDescription = wasteDescription.toUpperCase();

    // Creating a new type of waste
    await TypeOfWaste.create({
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    });

    const typeOfWastes = await TypeOfWaste.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["wasteCode", "ASC"]],
    });

    // Respond with the updated type of waste data
    res.status(201).json({ typeOfWastes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Type Of Waste controller
async function getTypeOfWastesController(req, res) {
  try {
    // Fetch all type of waste from the database
    const typeOfWastes = await TypeOfWaste.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["wasteCode", "ASC"]],
    });

    res.json({ typeOfWastes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Type Of Waste controller
async function updateTypeOfWasteController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating type of waste with ID:", id);

    let {
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    } = req.body;

    wasteCode = wasteCode.toUpperCase();
    wasteDescription = wasteDescription.toUpperCase();

    // Find the typeOfWaste by ID and update it
    const updatedTypeOfWaste = await TypeOfWaste.findByPk(id);

    if (updatedTypeOfWaste) {
      // Update type of waste attributes
      updatedTypeOfWaste.wasteCategory = wasteCategory;
      updatedTypeOfWaste.wasteCode = wasteCode;
      updatedTypeOfWaste.wasteDescription = wasteDescription;
      updatedTypeOfWaste.treatmentProcessId = treatmentProcessId;
      updatedTypeOfWaste.updatedBy = createdBy;

      // Save the updated type of waste
      await updatedTypeOfWaste.save();

      const typeOfWastes = await TypeOfWaste.findAll({
        include: {
          model: TreatmentProcess,
          as: "TreatmentProcess",
        },
        order: [["wasteCode", "ASC"]],
      });

      // Respond with the updated type of waste data
      res.json({
        typeOfWaste: updatedTypeOfWaste,
        typeOfWastes,
      });
    } else {
      // If type of waste with the specified ID was not found
      res
        .status(404)
        .json({ message: `Type Of Waste with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating type of waste:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Type Of Waste controller
async function deleteTypeOfWasteController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Type Of Waste with ID:", id);

    // Find the Vehicle by ID
    const typeOfWasteToDelete = await TypeOfWaste.findByPk(id);

    if (typeOfWasteToDelete) {
      // Update the deletedBy field
      typeOfWasteToDelete.updatedBy = deletedBy;
      typeOfWasteToDelete.deletedBy = deletedBy;
      await typeOfWasteToDelete.save();

      // Soft delete the TypeOfWaste (sets deletedAt timestamp)
      await typeOfWasteToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Type Of Waste with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Type Of Waste with the specified ID was not found
      res
        .status(404)
        .json({ message: `Type Of Waste with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Type Of Waste:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTypeOfWastesController,
  createTypeOfWasteController,
  updateTypeOfWasteController,
  deleteTypeOfWasteController,
};
