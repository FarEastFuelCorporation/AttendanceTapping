// controllers/dispatchedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 2;

// Create Dispatched Transaction controller
async function createDispatchedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new transaction
    await DispatchedTransaction.create({
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperId: helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
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

// Get Dispatched Transactions controller
async function getDispatchedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(statusId);

    // Respond with the updated data
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

// Update Dispatched Transaction controller
async function updateDispatchedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating dispatched transaction with ID:", id);

    let {
      scheduledTransactionId,
      vehicleId,
      driverId,
      helperIds,
      isDispatched,
      dispatchedDate,
      dispatchedTime,
      remarks,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the dispatched transaction by UUID (id) and update it
    const updatedDispatchedTransaction = await DispatchedTransaction.findByPk(
      id
    );

    if (updatedDispatchedTransaction) {
      // Update dispatched transaction attributes
      updatedDispatchedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedDispatchedTransaction.vehicleId = vehicleId;
      updatedDispatchedTransaction.driverId = driverId;
      updatedDispatchedTransaction.helperId = helperIds;
      updatedDispatchedTransaction.isDispatched = isDispatched;
      updatedDispatchedTransaction.dispatchedDate = dispatchedDate;
      updatedDispatchedTransaction.dispatchedTime = dispatchedTime;
      updatedDispatchedTransaction.remarks = remarks;
      updatedDispatchedTransaction.updatedBy = createdBy;

      // Save the updated booked transaction
      await updatedDispatchedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If dispatched transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Dispatched Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating dispatched transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Dispatched Transaction controller
async function deleteDispatchedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const dispatchedTransactionToDelete = await DispatchedTransaction.findByPk(
      id
    );

    if (dispatchedTransactionToDelete) {
      // Update the deletedBy field
      dispatchedTransactionToDelete.updatedBy = deletedBy;
      dispatchedTransactionToDelete.deletedBy = deletedBy;
      await dispatchedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 2;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await dispatchedTransactionToDelete.destroy();

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
  createDispatchedTransactionController,
  getDispatchedTransactionsController,
  updateDispatchedTransactionController,
  deleteDispatchedTransactionController,
};
