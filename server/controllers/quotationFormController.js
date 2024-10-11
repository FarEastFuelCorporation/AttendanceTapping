// controllers/quotationFormController.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");

// Get Quotation controller
async function getQuotationFormController(req, res) {
  try {
    const id = req.params.id;

    console.log("quotation id", id);
    // Fetch all clients from the database
    const quotation = await Quotation.findOne({
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
        id,
      },
      order: [["quotationCode", "ASC"]],
    });

    console.log("quotationData", quotation);

    if (!quotation) {
      return res.status(404).send("Quotation not found");
    }

    res.json({ quotation });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getQuotationFormController,
};
