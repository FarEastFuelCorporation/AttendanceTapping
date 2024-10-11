// controllers/plasticTransactionController.js

const Client = require("../models/Client");
const PlasticTransaction = require("../models/PlasticTransaction");
const generatePlasticCreditNumber = require("../utils/generatePlasticCreditNumber");
const generatePlasticWasteDiversionNumber = require("../utils/generatePlasticWasteDiversionNumber");

// Create Plastic Transaction controller
async function createPlasticTransactionController(req, res) {
  try {
    // Extracting data from the request body
    const {
      clientId,
      issuedDate,
      issuedTime,
      typeOfCertificate,
      volume,
      remarks,
      createdBy,
    } = req.body;

    let certificateNumber;

    if (typeOfCertificate === "PLASTIC CREDIT") {
      // Generate the plastic credit number (properly await the result)
      certificateNumber = await generatePlasticCreditNumber(volume);
    } else if (typeOfCertificate === "PLASTIC WASTE DIVERSION") {
      certificateNumber = await generatePlasticWasteDiversionNumber(volume);
    }

    // Creating a new scrap type
    await PlasticTransaction.create({
      clientId,
      certificateNumber,
      issuedDate,
      issuedTime,
      typeOfCertificate,
      volume,
      remarks,
      createdBy,
    });

    const plasticTransactions = await PlasticTransaction.findAll({
      include: {
        model: Client,
        as: "Client",
      },
    });

    // Respond with the updated scrap type data
    res.status(201).json({ plasticTransactions });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Plastic Transactions controller
async function getPlasticTransactionsController(req, res) {
  try {
    // Fetch all plasticTransactions from the database
    const plasticTransactions = await PlasticTransaction.findAll({
      include: {
        model: Client,
        as: "Client",
      },
      order: [["certificateNumber", "ASC"]],
    });

    res.json({ plasticTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Plastic Transaction controller
async function updatePlasticTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating scrap type with ID:", id);

    let { typeOfScrap, createdBy } = req.body;
    console.log("Request body:", req.body);

    typeOfScrap = typeOfScrap.toUpperCase();

    // Find the scrap type by ID and update it
    const updatedPlasticTransaction = await PlasticTransaction.findByPk(id);

    if (updatedPlasticTransaction) {
      // Update scrap type attributes
      updatedPlasticTransaction.typeOfScrap = typeOfScrap;
      updatedPlasticTransaction.updatedBy = createdBy;

      // Save the updated scrap type
      await updatedPlasticTransaction.save();

      const plasticTransactions = await PlasticTransaction.findAll();

      // Respond with the updated scrap type data
      res.json({
        scrapType: updatedPlasticTransaction,
        plasticTransactions,
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

// Delete Plastic Transaction controller
async function deletePlasticTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting PlasticTransaction with ID:", id);

    // Find the PlasticTransaction by ID
    const scrapTypeToDelete = await PlasticTransaction.findByPk(id);

    if (scrapTypeToDelete) {
      // Update the deletedBy field
      scrapTypeToDelete.updatedBy = deletedBy;
      scrapTypeToDelete.deletedBy = deletedBy;
      await scrapTypeToDelete.save();

      // Soft delete the PlasticTransaction (sets deletedAt timestamp)
      await scrapTypeToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `PlasticTransaction with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If PlasticTransaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `PlasticTransaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting PlasticTransaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getPlasticTransactionsController,
  createPlasticTransactionController,
  updatePlasticTransactionController,
  deletePlasticTransactionController,
};
