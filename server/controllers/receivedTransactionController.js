// controllers/receivedTransactionController.js

const BookedTransaction = require("../models/BookedTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 2;

// Create Received Transaction controller
async function createReceivedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new transaction
    await ReceivedTransaction.create({
      bookedTransactionId,
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
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

// Get Received Transactions controller
async function getReceivedTransactionsController(req, res) {
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

// Update Received Transaction controller
async function updateReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating Received transaction with ID:", id);

    let {
      scheduledTransactionId,
      dispatchedTransactionId,
      receivedDate,
      receivedTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      manifestWeight,
      clientWeight,
      grossWeight,
      tareWeight,
      netWeight,
      remarks,
      createdBy,
    } = req.body;

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the booked transaction by UUID (id) and update it
    const updatedReceivedTransaction = await ReceivedTransaction.findByPk(id);

    if (updatedReceivedTransaction) {
      // Update booked transaction attributes
      updatedReceivedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedReceivedTransaction.scheduledTransactionId =
        scheduledTransactionId;
      updatedReceivedTransaction.dispatchedTransactionId =
        dispatchedTransactionId;
      updatedReceivedTransaction.receivedDate = receivedDate;
      updatedReceivedTransaction.receivedTime = receivedTime;
      updatedReceivedTransaction.pttNo = pttNo;
      updatedReceivedTransaction.manifestNo = manifestNo;
      updatedReceivedTransaction.pullOutFormNo = pullOutFormNo;
      updatedReceivedTransaction.manifestWeight = manifestWeight;
      updatedReceivedTransaction.clientWeight = clientWeight;
      updatedReceivedTransaction.grossWeight = grossWeight;
      updatedReceivedTransaction.tareWeight = tareWeight;
      updatedReceivedTransaction.netWeight = netWeight;
      updatedReceivedTransaction.remarks = remarks;
      updatedReceivedTransaction.updatedBy = createdBy;

      // Save the updated received transaction
      await updatedReceivedTransaction.save();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If received transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Received Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating received transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Received Transaction controller
async function deleteReceivedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log("Soft deleting scheduled transaction with ID:", id);

    // Find the scheduled transaction by UUID (id)
    const receivedTransactionToDelete = await ReceivedTransaction.findByPk(id);

    if (receivedTransactionToDelete) {
      // Update the deletedBy field
      receivedTransactionToDelete.updatedBy = deletedBy;
      receivedTransactionToDelete.deletedBy = deletedBy;
      await receivedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 3;

      await updatedBookedTransaction.save();

      // Soft delete the scheduled transaction (sets deletedAt timestamp)
      await receivedTransactionToDelete.destroy();

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
  createReceivedTransactionController,
  getReceivedTransactionsController,
  updateReceivedTransactionController,
  deleteReceivedTransactionController,
};
