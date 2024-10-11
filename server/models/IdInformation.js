// models/IdInformation.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const IdInformation = sequelize.define(
  "IdInformation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type_of_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sss_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pag_ibig_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    philhealth_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tin_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_person_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_person_address2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_expire: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    signature: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Set to true if your table has createdAt and updatedAt columns
  }
);

module.exports = IdInformation;
