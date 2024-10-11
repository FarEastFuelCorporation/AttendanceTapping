// controllers/sortedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");
const { fetchData } = require("../utils/getBookedTransactions");
const statusId = 4;

// Create Sorted Transaction controller
async function createSortedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      discrepancyWeight,
      sortedWastes,
      sortedScraps,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    console.log(req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Creating a new sorted transaction
    const newSortedTransaction = await SortedTransaction.create(
      {
        receivedTransactionId,
        sortedDate,
        sortedTime,
        totalSortedWeight,
        discrepancyWeight,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );

    // Adding sorted wastes to SortedWasteTransaction table
    if (sortedWastes && sortedWastes.length > 0) {
      const sortedWastePromises = sortedWastes.map((waste) => {
        let wasteName = waste.wasteName;

        if (wasteName) {
          wasteName = wasteName.toUpperCase();
        }

        return SortedWasteTransaction.create(
          {
            sortedTransactionId: newSortedTransaction.id,
            quotationWasteId: waste.quotationWasteId,
            wasteName: wasteName,
            weight: waste.weight,
            clientWeight: waste.clientWeight,
            formNo: waste.formNo,
          },
          { transaction: transaction }
        );
      });

      await Promise.all(sortedWastePromises);
    }

    // Adding sorted scraps to SortedScrapTransaction table
    if (sortedScraps && sortedScraps.length > 0) {
      const sortedScrapPromises = sortedScraps.map((scrap) => {
        return SortedScrapTransaction.create(
          {
            sortedTransactionId: newSortedTransaction.id,
            scrapTypeId: scrap.scrapTypeId,
            weight: scrap.weight,
          },
          { transaction: transaction }
        );
      });

      await Promise.all(sortedScrapPromises);
    }

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId
    );

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.statusId = statusId;

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // Commit the transaction
      await transaction.commit();

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

// Get Sorted Transactions controller
async function getSortedTransactionsController(req, res) {
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

// Update Sorted Transaction controller
async function updateSortedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    console.log("Updating Sorted transaction with ID:", id);

    let {
      receivedTransactionId,
      sortedDate,
      sortedTime,
      totalSortedWeight,
      discrepancyWeight,
      sortedWastes,
      sortedScraps,
      remarks,
      createdBy,
    } = req.body;

    console.log(req.body);

    if (remarks) {
      remarks = remarks.toUpperCase();
    }

    // Find the sorted transaction by ID and update it
    const updatedSortedTransaction = await SortedTransaction.findByPk(id);

    if (updatedSortedTransaction) {
      // Update sorted transaction attributes
      updatedSortedTransaction.receivedTransactionId = receivedTransactionId;
      updatedSortedTransaction.sortedDate = sortedDate;
      updatedSortedTransaction.sortedTime = sortedTime;
      updatedSortedTransaction.totalSortedWeight = totalSortedWeight;
      updatedSortedTransaction.discrepancyWeight = discrepancyWeight;
      updatedSortedTransaction.remarks = remarks;
      updatedSortedTransaction.updatedBy = createdBy;

      // Save the updated sorted transaction
      await updatedSortedTransaction.save({ transaction });

      // Fetch existing sorted wastes and scraps from the database
      const existingSortedWastes = await SortedWasteTransaction.findAll({
        where: { sortedTransactionId: id },
        transaction,
      });

      const existingSortedScraps = await SortedScrapTransaction.findAll({
        where: { sortedTransactionId: id },
        transaction,
      });

      // Extract existing sorted waste and scrap IDs
      const existingWasteIds = existingSortedWastes.map((waste) => waste.id);
      const existingScrapIds = existingSortedScraps.map((scrap) => scrap.id);

      // Extract updated sorted waste and scrap IDs from the request body
      const updatedWasteIds = sortedWastes.map((waste) => waste.id);
      const updatedScrapIds = sortedScraps.map((scrap) => scrap.id);

      // Identify wastes and scraps to delete (those not present in the updated data)
      const wastesToDelete = existingSortedWastes.filter(
        (waste) => !updatedWasteIds.includes(waste.id)
      );

      const scrapsToDelete = existingSortedScraps.filter(
        (scrap) => !updatedScrapIds.includes(scrap.id)
      );

      // Identify wastes and scraps to update and create
      const sortedWastePromises = sortedWastes.map(async (waste) => {
        if (waste.id && existingWasteIds.includes(waste.id)) {
          // Update existing waste
          await SortedWasteTransaction.update(
            {
              quotationWasteId: waste.quotationWasteId,
              wasteName: waste.wasteName ? waste.wasteName.toUpperCase() : null,
              weight: waste.weight,
              clientWeight: waste.clientWeight,
              formNo: waste.formNo,
            },
            { where: { id: waste.id }, transaction }
          );
        } else {
          // Create new waste
          await SortedWasteTransaction.create(
            {
              sortedTransactionId: id,
              quotationWasteId: waste.quotationWasteId,
              wasteName: waste.wasteName ? waste.wasteName.toUpperCase() : null,
              weight: waste.weight,
              clientWeight: waste.clientWeight,
              formNo: waste.formNo,
            },
            { transaction }
          );
        }
      });

      const sortedScrapPromises = sortedScraps.map(async (scrap) => {
        if (scrap.id && existingScrapIds.includes(scrap.id)) {
          // Update existing scrap
          await SortedScrapTransaction.update(
            {
              scrapTypeId: scrap.scrapTypeId,
              weight: scrap.weight,
            },
            { where: { id: scrap.id }, transaction }
          );
        } else {
          // Create new scrap
          await SortedScrapTransaction.create(
            {
              sortedTransactionId: id,
              scrapTypeId: scrap.scrapTypeId,
              weight: scrap.weight,
            },
            { transaction }
          );
        }
      });

      // Delete wastes and scraps that are no longer present
      const deleteWastePromises = wastesToDelete.map((waste) =>
        SortedWasteTransaction.destroy({ where: { id: waste.id }, transaction })
      );

      const deleteScrapPromises = scrapsToDelete.map((scrap) =>
        SortedScrapTransaction.destroy({ where: { id: scrap.id }, transaction })
      );

      // Wait for all promises to resolve
      await Promise.all([
        ...sortedWastePromises,
        ...sortedScrapPromises,
        ...deleteWastePromises,
        ...deleteScrapPromises,
      ]);

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Sorted Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating sorted transaction:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Sorted Transaction controller
async function deleteSortedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting sorted transaction with ID:", id);

    // Find the sorted transaction by UUID (id)
    const sortedTransactionToDelete = await SortedTransaction.findByPk(id);

    if (sortedTransactionToDelete) {
      // Update the deletedBy field
      sortedTransactionToDelete.updatedBy = deletedBy;
      sortedTransactionToDelete.deletedBy = deletedBy;
      await sortedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = 4;

      await updatedBookedTransaction.save();

      // Soft delete the sorted transaction (sets deletedAt timestamp)
      await sortedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(statusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If sorted transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Sorted Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting sorted transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createSortedTransactionController,
  getSortedTransactionsController,
  updateSortedTransactionController,
  deleteSortedTransactionController,
};
