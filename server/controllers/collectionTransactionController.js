// controllers/collectionTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const CollectedTransaction = require("../models/CollectedTransaction");
const transactionStatusId = 10;

// Create Collected Transaction controller
async function createCollectedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billingDistributionTransactionId,
      collectedDate,
      collectedTime,
      collectedAmount,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Create CollectedTransaction entry
    await CollectedTransaction.create(
      {
        bookedTransactionId,
        billingDistributionTransactionId,
        collectedDate,
        collectedTime,
        collectedAmount,
        remarks,
        createdBy,
      },
      { transaction }
    );

    // Update the status of the booked transaction
    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      { transaction }
    );

    if (updatedBookedTransaction) {
      updatedBookedTransaction.statusId = statusId;
      await updatedBookedTransaction.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      // Fetch updated transaction data
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Booked Transaction with ID ${bookedTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Collected Transactions controller
async function getCollectedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId);

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

// Update Collected Transaction controller
async function updateCollectedTransactionController(req, res) {
  const id = req.params.id; // Expecting the BilledTransaction ID to update
  console.log("Updating collected transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billingDistributionTransactionId,
      collectedDate,
      collectedTime,
      collectedAmount,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the collected transaction by its billingDistributionTransactionId
    const collectedTransaction = await CollectedTransaction.findByPk(id, {
      transaction,
    });

    if (collectedTransaction) {
      // Update the CollectedTransaction fields
      collectedTransaction.collectedDate = collectedDate;
      collectedTransaction.collectedTime = collectedTime;
      collectedTransaction.collectedAmount = collectedAmount;
      collectedTransaction.remarks = remarks;
      collectedTransaction.updatedBy = updatedBy;

      await collectedTransaction.save({ transaction });

      // Update the status of the booked transaction
      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId,
        { transaction }
      );

      if (updatedBookedTransaction) {
        updatedBookedTransaction.statusId = statusId;
        await updatedBookedTransaction.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        // Fetch updated transaction data
        const data = await fetchData(statusId);

        // Respond with the updated data
        res.status(200).json({
          pendingTransactions: data.pending,
          inProgressTransactions: data.inProgress,
          finishedTransactions: data.finished,
        });
      } else {
        // If booked transaction with the specified ID was not found
        await transaction.rollback();
        res.status(404).json({
          message: `Booked Transaction with ID ${bookedTransactionId} not found`,
        });
      }
    } else {
      // If billed transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Collected Transaction with ID ${billingDistributionTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Collected Transaction controller
async function deleteCollectedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting Collected transaction with ID:", id);

    // Find the collected transaction by UUID (id)
    const collectedTransactionToDelete = await CollectedTransaction.findByPk(
      id
    );

    if (collectedTransactionToDelete) {
      // Update the deletedBy field
      collectedTransactionToDelete.updatedBy = deletedBy;
      collectedTransactionToDelete.deletedBy = deletedBy;
      await collectedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 10;

      await updatedBookedTransaction.save();

      // Soft delete the collected transaction (sets deletedAt timestamp)
      await collectedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If collected transaction with the specified ID was not found
      res.status(404).json({
        message: `Collected Transaction with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting collected transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createCollectedTransactionController,
  getCollectedTransactionsController,
  updateCollectedTransactionController,
  deleteCollectedTransactionController,
};
