// controllers/billingDistributionTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");
const transactionStatusId = 9;

// Create Billing Distribution Transaction controller
async function createBillingDistributionTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billingApprovalTransactionId,
      distributedDate,
      distributedTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Create BillingDistributionTransaction entry
    await BillingDistributionTransaction.create(
      {
        bookedTransactionId,
        billingApprovalTransactionId,
        distributedDate,
        distributedTime,
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

// Get Billing Distribution Transactions controller
async function getBillingDistributionTransactionsController(req, res) {
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

// Update Billing Distribution Transaction controller
async function updateBillingDistributionTransactionController(req, res) {
  const { id } = req.params; // Expecting the billingDistributionTransactionId from params
  console.log("Updating Billing Distribution Transaction with ID:", id);

  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      billingApprovalTransactionId,
      distributedDate,
      distributedTime,
      remarks,
      statusId,
      updatedBy,
    } = req.body;

    console.log("req.body", req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the billing distribution transaction by its ID
    const billingDistributionTransaction =
      await BillingDistributionTransaction.findByPk(id, { transaction });

    if (billingDistributionTransaction) {
      // Update the BillingDistributionTransaction fields
      billingDistributionTransaction.bookedTransactionId = bookedTransactionId;
      billingDistributionTransaction.billingApprovalTransactionId =
        billingApprovalTransactionId;
      billingDistributionTransaction.distributedDate = distributedDate;
      billingDistributionTransaction.distributedTime = distributedTime;
      billingDistributionTransaction.remarks = remarks;
      billingDistributionTransaction.updatedBy = updatedBy;

      await billingDistributionTransaction.save({ transaction });

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
      // If billing distribution transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Billing Distribution Transaction with ID ${billingDistributionTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Billing Distribution Transaction controller
async function deleteBillingDistributionTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting Billing Distribution transaction with ID:", id);

    // Find the billing approval transaction by UUID (id)
    const billingDistributionTransactionToDelete =
      await BillingDistributionTransaction.findByPk(id);

    if (billingDistributionTransactionToDelete) {
      // Update the deletedBy field
      billingDistributionTransactionToDelete.updatedBy = deletedBy;
      billingDistributionTransactionToDelete.deletedBy = deletedBy;
      await billingDistributionTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 9;

      await updatedBookedTransaction.save();

      // Soft delete the billing approval transaction (sets deletedAt timestamp)
      await billingDistributionTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If billing approval transaction with the specified ID was not found
      res.status(404).json({
        message: `Billing Distribution Transaction with ID ${id} not found`,
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting billing approval transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBillingDistributionTransactionController,
  getBillingDistributionTransactionsController,
  updateBillingDistributionTransactionController,
  deleteBillingDistributionTransactionController,
};
