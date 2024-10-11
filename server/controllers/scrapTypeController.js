// controllers/scrapTypeController.js

const ScrapType = require("../models/ScrapType");

// Create Scrap Type controller
async function createScrapTypeController(req, res) {
  try {
    // Extracting data from the request body
    let { typeOfScrap, createdBy } = req.body;

    typeOfScrap = typeOfScrap.toUpperCase();

    // Creating a new scrap type
    await ScrapType.create({
      typeOfScrap,
      createdBy,
    });

    const scrapTypes = await ScrapType.findAll();

    // Respond with the updated scrap type data
    res.status(201).json({ scrapTypes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Scrap Types controller
async function getScrapTypesController(req, res) {
  try {
    // Fetch all scrapTypes from the database
    const scrapTypes = await ScrapType.findAll({
      order: [["typeOfScrap", "ASC"]],
    });

    res.json({ scrapTypes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Scrap Type controller
async function updateScrapTypeController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating scrap type with ID:", id);

    let { typeOfScrap, createdBy } = req.body;
    console.log("Request body:", req.body);

    typeOfScrap = typeOfScrap.toUpperCase();

    // Find the scrap type by ID and update it
    const updatedScrapType = await ScrapType.findByPk(id);

    if (updatedScrapType) {
      // Update scrap type attributes
      updatedScrapType.typeOfScrap = typeOfScrap;
      updatedScrapType.updatedBy = createdBy;

      // Save the updated scrap type
      await updatedScrapType.save();

      const scrapTypes = await ScrapType.findAll();

      // Respond with the updated scrap type data
      res.json({
        scrapType: updatedScrapType,
        scrapTypes,
      });
    } else {
      // If scrap type with the specified ID was not found
      res.status(404).json({ message: `Scrap type with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating scrap type:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Scrap Type controller
async function deleteScrapTypeController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting ScrapType with ID:", id);

    // Find the ScrapType by ID
    const scrapTypeToDelete = await ScrapType.findByPk(id);

    if (scrapTypeToDelete) {
      // Update the deletedBy field
      scrapTypeToDelete.updatedBy = deletedBy;
      scrapTypeToDelete.deletedBy = deletedBy;
      await scrapTypeToDelete.save();

      // Soft delete the ScrapType (sets deletedAt timestamp)
      await scrapTypeToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `ScrapType with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If ScrapType with the specified ID was not found
      res.status(404).json({ message: `ScrapType with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting ScrapType:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getScrapTypesController,
  createScrapTypeController,
  updateScrapTypeController,
  deleteScrapTypeController,
};
