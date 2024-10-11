// utils/generateClientId

const Client = require("../models/Client");
const { Op } = require("sequelize");

async function generateClientId(clientType) {
  try {
    // Define the prefix based on the client type
    let prefix;
    switch (clientType) {
      case "GENERATOR":
        prefix = "GEN";
        break;
      case "TRANSPORTER":
        prefix = "TRP";
        break;
      case "INTEGRATED FACILITIES MANAGEMENT":
        prefix = "IFM";
        break;
      default:
        throw new Error("Invalid client type");
    }

    // Find the latest client ID with the specified prefix, including soft-deleted records
    const latestClient = await Client.findOne({
      where: {
        clientId: {
          [Op.like]: `${prefix}-%`,
        },
      },
      order: [["createdAt", "DESC"]],
      paranoid: false, // Include soft-deleted records
    });

    // Generate the new client ID
    let newIdNumber = 1;
    if (latestClient) {
      const latestClientId = latestClient.clientId;
      const latestIdNumber = parseInt(latestClientId.split("-")[1], 10);
      newIdNumber = latestIdNumber + 1;
    }

    // Pad the ID number with leading zeros
    const newIdString = newIdNumber.toString().padStart(3, "0");
    const newClientId = `${prefix}-${newIdString}`;

    return newClientId;
  } catch (error) {
    console.error("Error generating client ID:", error);
    throw error;
  }
}

module.exports = generateClientId;
