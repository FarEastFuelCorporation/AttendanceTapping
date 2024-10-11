// models/Client.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

// Path to the default image
const DEFAULT_IMAGE_PATH = path.join(
  __dirname,
  "../../public/assets/unknown.png"
);

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureOfBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [
          ["GENERATOR", "TRANSPORTER", "INTEGRATED FACILITIES MANAGEMENT"],
        ],
      },
    },
    billerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientPicture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
    hooks: {
      beforeCreate: async (client, options) => {
        // Set default clientPicture if not provided
        if (!client.clientPicture) {
          try {
            const defaultImage = fs.readFileSync(DEFAULT_IMAGE_PATH);
            client.clientPicture = defaultImage;
          } catch (error) {
            console.error("Error reading default image:", error);
          }
        }
      },
    },
  }
);

module.exports = Client;
