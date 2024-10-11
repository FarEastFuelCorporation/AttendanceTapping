// models/employee.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path accordingly

const Employee = sequelize.define(
  "Employee",
  {
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    affix: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    birthPlace: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    mobileNo: {
      type: DataTypes.TEXT,
    },
    emailAddress: {
      type: DataTypes.TEXT,
    },
    nationality: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    permanentAddress: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    otherAddress: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    motherMaidenName: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    educationalAttainment: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    course: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    yearGraduate: {
      type: DataTypes.TEXT,
    },
    tinNo: {
      type: DataTypes.TEXT,
    },
    sssGsisNo: {
      type: DataTypes.TEXT,
    },
    philhealthNo: {
      type: DataTypes.TEXT,
    },
    pagIbigNo: {
      type: DataTypes.TEXT,
    },
    driversLicenseNo: {
      type: DataTypes.TEXT,
    },
    nbiNo: {
      type: DataTypes.TEXT,
    },
    policeClearanceNo: {
      type: DataTypes.TEXT,
    },
    cedulaNo: {
      type: DataTypes.TEXT,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
    },
    employeeType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payrollType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salaryType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    department: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    designation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dailyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dayAllowance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nightAllowance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timeIn: {
      type: DataTypes.TEXT,
    },
    timeOut: {
      type: DataTypes.TEXT,
    },
    dateOfResignation: {
      type: DataTypes.DATEONLY,
    },
    reasonOfResignation: {
      type: DataTypes.TEXT, // Changed to TEXT
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: true, // Adjust based on your requirements
    },
    submittedBy: {
      type: DataTypes.TEXT,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Employee;
