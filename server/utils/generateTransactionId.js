// utils/generateTransactionId

const BookedTransaction = require("../models/BookedTransaction");

async function generateTransactionId() {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear().toString();

    // Find the latest transaction ID with the specified prefix
    const latestTransaction = await BookedTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.transactionId;
      const latestYear = latestTransactionId.substring(0, 4);
      if (latestYear === currentYear) {
        const latestIdNumber = parseInt(latestTransactionId.substring(4), 10);
        newIdNumber = latestIdNumber + 1;
      }
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(4, "0");
    const newTransactionId = `${currentYear}${newIdString}`;

    return newTransactionId;
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    throw error;
  }
}

module.exports = generateTransactionId;
