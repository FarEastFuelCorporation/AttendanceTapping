// utils/generateCertificateNumber

const CertifiedTransaction = require("../models/CertifiedTransaction");

async function generateCertificateNumber() {
  try {
    // Get the current year and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    // Find the latest transaction ID with the specified prefix
    const latestTransaction = await CertifiedTransaction.findOne({
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new transaction ID
    let newIdNumber = 1;
    if (latestTransaction) {
      const latestTransactionId = latestTransaction.transactionId;
      const latestYear = latestTransactionId.substring(3, 7);
      const latestMonth = latestTransactionId.substring(7, 9);
      if (latestYear === currentYear && latestMonth === currentMonth) {
        const latestIdNumber = parseInt(latestTransactionId.substring(9), 10);
        newIdNumber = latestIdNumber + 1;
      }
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(4, "0");
    const newTransactionId = `COD${currentYear}${currentMonth}${newIdString}`;

    return newTransactionId;
  } catch (error) {
    console.error("Error generating transaction ID:", error);
    throw error;
  }
}

module.exports = generateCertificateNumber;
