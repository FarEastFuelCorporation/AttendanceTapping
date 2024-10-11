// controllers/logisticsController.js

const Logistics = require("../models/Logistics");

// Create Logistics controller
async function createLogisticsController(req, res) {
  try {
    // Extracting data from the request body
    let { logisticsName, address, contactNumber, createdBy } = req.body;

    logisticsName = logisticsName.toUpperCase();
    address = address.toUpperCase();

    // Creating a new logistics
    await Logistics.create({
      logisticsName,
      address,
      contactNumber,
      createdBy,
    });

    const logistics = await Logistics.findAll({
      order: [["logisticsName", "ASC"]],
    });

    // Respond with the updated logistics data
    res.status(201).json({ logistics });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Logistics controller
async function getLogisticsController(req, res) {
  try {
    // Fetch all logistics from the database
    const logistics = await Logistics.findAll({
      order: [["logisticsName", "ASC"]],
    });

    res.json({ logistics });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Logistics controller
async function updateLogisticsController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating logistics with ID:", id);

    let { logisticsName, address, contactNumber, createdBy } = req.body;

    logisticsName = logisticsName.toUpperCase();
    address = address.toUpperCase();

    // Find the logistics by ID and update it
    const updatedLogistics = await Logistics.findByPk(id);

    if (updatedLogistics) {
      // Update logistics attributes
      updatedLogistics.logisticsName = logisticsName;
      updatedLogistics.address = address;
      updatedLogistics.contactNumber = contactNumber;
      updatedLogistics.updatedBy = createdBy;

      // Save the updated logistics
      await updatedLogistics.save();

      const logistics = await Logistics.findAll({
        order: [["logisticsName", "ASC"]],
      });
      // Respond with the updated logistics data
      res.json({ logistics });
    } else {
      // If logistics with the specified ID was not found
      res.status(404).json({ message: ` Logistics with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating logistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Logistics controller
async function deleteLogisticsController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Logistics with ID:", id);

    // Find the Logistics by ID
    const logisticsToDelete = await Logistics.findByPk(id);

    if (logisticsToDelete) {
      // Update the deletedBy field
      logisticsToDelete.updatedBy = deletedBy;
      logisticsToDelete.deletedBy = deletedBy;
      await logisticsToDelete.save();

      // Soft delete the Logistics (sets deletedAt timestamp)
      await logisticsToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Logistics with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Logistics with the specified ID was not found
      res.status(404).json({ message: `Logistics with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Logistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getLogisticsController,
  createLogisticsController,
  updateLogisticsController,
  deleteLogisticsController,
};
