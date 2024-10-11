// controllers/scheduledTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 1;

// Create Scheduled Transaction controller
async function createScheduledTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new transaction
    await ScheduledTransaction.create({
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      createdBy,
    });

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Scheduled Transactions controller
async function getScheduledTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId);

    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Scheduled Transaction controller
async function updateScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating scheduled transaction with ID:", id);

    let {
      bookedTransactionId,
      logisticsId,
      scheduledDate,
      scheduledTime,
      remarks,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the scheduled transaction by UUID (id) and update it
    const updatedScheduledTransaction = await ScheduledTransaction.findByPk(id);

    if (updatedScheduledTransaction) {
      // Update scheduled transaction attributes
      updatedScheduledTransaction.bookedTransactionId = bookedTransactionId;
      updatedScheduledTransaction.logisticsId = logisticsId;
      updatedScheduledTransaction.scheduledDate = scheduledDate;
      updatedScheduledTransaction.scheduledTime = scheduledTime;
      updatedScheduledTransaction.remarks = remarks;
      updatedScheduledTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedScheduledTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Scheduled Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Scheduled Transaction controller
async function deleteScheduledTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const scheduledTransactionToDelete = await ScheduledTransaction.findByPk(
      id
    );

    if (scheduledTransactionToDelete) {
      // Update the deletedBy field
      scheduledTransactionToDelete.updatedBy = deletedBy;
      scheduledTransactionToDelete.deletedBy = deletedBy;
      await scheduledTransactionToDelete.save();

      console.log(scheduledTransactionToDelete.bookedTransactionId);

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        scheduledTransactionToDelete.bookedTransactionId
      );
      updatedBookedTransaction.statusId = 1;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await scheduledTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If scheduled transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Scheduled Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting scheduled transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createScheduledTransactionController,
  getScheduledTransactionsController,
  updateScheduledTransactionController,
  deleteScheduledTransactionController,
};
