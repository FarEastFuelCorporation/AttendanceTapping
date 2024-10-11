const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const EmployeeRecord = sequelize.define(
  "EmployeeRecord",
  {
    id: {
      type: DataTypes.CHAR(36),
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    employeeStatus: {
      type: DataTypes.ENUM,
      values: ["ACTIVE", "INACTIVE"],
      defaultValue: "ACTIVE",
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    middleName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    husbandSurname: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    affix: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    civilStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthPlace: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bloodType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ethnicOrigin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    citizenship: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    religion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    municipality: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    barangay: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    otherProvince: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    otherMunicipality: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    otherBarangay: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    otherAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    landlineNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emailAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dateHire: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
    designation: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    immediateHeadId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tinId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    philhealthId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sssId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pagibigId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersReligion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fathersMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mothersName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mothersReligion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mothersAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mothersMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spouseName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    spouseReligion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    spouseAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    spouseMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    educationalAttainment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    schoolName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    course: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    year: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referenceMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyMobileNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    signature: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  }
);

module.exports = EmployeeRecord;
