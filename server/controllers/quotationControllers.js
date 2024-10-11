// controllers/quotationControllers.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");

// Create Quotation controller
async function createQuotationController(req, res) {
  let {
    quotationCode,
    validity,
    clientId,
    termsCharge,
    termsBuying,
    scopeOfWork,
    remarks,
    createdBy,
    quotationWastes, // This should be an array of quotation wastes
    quotationTransportation, // This should be an array of quotation transportation
  } = req.body;

  termsCharge = termsCharge.toUpperCase();
  termsBuying = termsBuying.toUpperCase();
  scopeOfWork = scopeOfWork.toUpperCase();
  remarks = remarks.toUpperCase();

  try {
    // Create the quotation record
    const quotation = await Quotation.create({
      quotationCode,
      validity,
      clientId,
      termsCharge,
      termsBuying,
      scopeOfWork,
      remarks,
      createdBy,
    });

    // Create the quotation wastes associated with this quotation
    await Promise.all(
      quotationWastes.map(async (waste) => {
        let {
          wasteId,
          wasteName,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
        } = waste;

        wasteName = wasteName.toUpperCase();

        return await QuotationWaste.create({
          quotationId: quotation.id,
          wasteId,
          wasteName,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          createdBy,
        });
      })
    );

    // Create the quotation transportation associated with this quotation
    await Promise.all(
      quotationTransportation.map(async (transportation) => {
        let {
          vehicleTypeId,
          haulingArea,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
        } = transportation;

        haulingArea = haulingArea.toUpperCase();

        return await QuotationTransportation.create({
          quotationId: quotation.id,
          vehicleTypeId,
          haulingArea,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          createdBy,
        });
      })
    );

    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
      where: {
        status: "active", // Replace 'status' with your actual column name
      },
      order: [["quotationCode", "ASC"]],
    });

    // Respond with updated quotation and its wastes
    res.status(201).json({ quotations });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ error: "Failed to create quotation" });
  }
}

// Get Quotations controller
async function getQuotationsController(req, res) {
  try {
    // Fetch all clients from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteCode"],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
          include: [
            {
              model: VehicleType,
              as: "VehicleType",
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
        },
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: ["first_name", "last_name", "signature"],
        },
      ],
      where: {
        status: "active",
      },
      order: [["quotationCode", "ASC"]],
    });

    res.json({ quotations });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Quotation controller
async function getQuotationController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all clients from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteCode"],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
          include: [
            {
              model: VehicleType,
              as: "VehicleType",
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
        },
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: ["first_name", "last_name", "signature"],
        },
      ],
      where: {
        status: "active",
        clientId: id,
      },
      order: [["quotationCode", "ASC"]],
    });

    res.json({ quotations });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Quotation controller
async function updateQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating quotation with ID:", id);

    let {
      quotationCode,
      validity,
      clientId,
      termsCharge,
      termsBuying,
      scopeOfWork,
      remarks,
      createdBy,
      quotationWastes, // This should be an array of quotation wastes
      quotationTransportation, // This should be an array of quotation transportation
    } = req.body;

    termsCharge = termsCharge.toUpperCase();
    termsBuying = termsBuying.toUpperCase();
    scopeOfWork = scopeOfWork.toUpperCase();
    remarks = remarks.toUpperCase();

    // Find the quotation by ID and update it
    const updatedQuotation = await Quotation.findByPk(id);
    let revisionNumber = updatedQuotation.revisionNumber;

    revisionNumber = (parseInt(revisionNumber) + 1).toString().padStart(2, "0");

    if (updatedQuotation) {
      // Update quotation attributes
      updatedQuotation.status = "inactive";

      // Save the updated quotation
      await updatedQuotation.save();

      // Create the quotation record
      const quotation = await Quotation.create({
        quotationCode,
        revisionNumber,
        validity,
        clientId,
        termsCharge,
        termsBuying,
        scopeOfWork,
        remarks,
        createdBy,
      });

      // Create the quotation wastes associated with this quotation
      await Promise.all(
        quotationWastes.map(async (waste) => {
          let {
            wasteId,
            wasteName,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
          } = waste;

          wasteName = wasteName.toUpperCase();

          return await QuotationWaste.create({
            quotationId: quotation.id,
            wasteId,
            wasteName,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
            createdBy,
          });
        })
      );

      // Create the quotation transportation associated with this quotation
      await Promise.all(
        quotationTransportation.map(async (transportation) => {
          let {
            vehicleTypeId,
            haulingArea,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
          } = transportation;

          haulingArea = haulingArea.toUpperCase();

          return await QuotationTransportation.create({
            quotationId: quotation.id,
            vehicleTypeId,
            haulingArea,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
            createdBy,
          });
        })
      );

      const quotations = await Quotation.findAll({
        include: [
          {
            model: QuotationWaste,
            as: "QuotationWaste",
          },
          {
            model: QuotationTransportation,
            as: "QuotationTransportation",
          },
          {
            model: Client,
            as: "Client",
          },
        ],
        where: {
          status: "active", // Replace 'status' with your actual column name
        },
        order: [["quotationCode", "ASC"]],
      });

      // Respond with the updated quotation and its wastes
      res.json({
        quotations,
      });
    } else {
      // If quotation with the specified ID was not found
      res.status(404).json({ message: `Quotation with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Quotation controller
async function deleteQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Soft deleting quotation with ID:", id);

    // Find the client by UUID (id)
    const quotationToDelete = await Quotation.findByPk(id);

    if (quotationToDelete) {
      // Soft delete the client (sets deletedAt timestamp)
      await quotationToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Quotation with ID ${quotationToDelete.quotationCode} soft-deleted successfully`,
      });
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getQuotationsController,
  getQuotationController,
  createQuotationController,
  updateQuotationController,
  deleteQuotationController,
};
