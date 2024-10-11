// utils/associations.js

const Attendance = require("../models/Attendance");
const AttendanceLocal = require("../modelsLocal/AttendanceLocal");
const IdInformation = require("../models/IdInformation");
const IdInformationLocal = require("../modelsLocal/IdInformationLocal");
const Violation = require("../modelsLocal/ViolationLocal");
const ViolationLocal = require("../modelsLocal/ViolationLocal");
const ViolationList = require("../models/ViolationList");
const ViolationListLocal = require("../modelsLocal/ViolationListLocal");

// Define associations
IdInformation.hasMany(Attendance, {
  as: "Attendance",
  foreignKey: "employee_id",
  sourceKey: "employee_id",
});
Attendance.belongsTo(IdInformation, {
  as: "IdInformation",
  foreignKey: "employee_id",
  targetKey: "employee_id",
});

IdInformationLocal.hasMany(AttendanceLocal, {
  as: "AttendanceLocal",
  foreignKey: "employee_id",
  sourceKey: "employee_id",
});
AttendanceLocal.belongsTo(IdInformationLocal, {
  as: "IdInformationLocal",
  foreignKey: "employee_id",
  targetKey: "employee_id",
});

ViolationList.hasMany(Violation, {
  as: "Violation",
  foreignKey: "violation_id",
  sourceKey: "violation_id",
});
Violation.belongsTo(ViolationList, {
  as: "ViolationList",
  foreignKey: "violation_id",
  targetKey: "violation_id",
});

ViolationListLocal.hasMany(ViolationLocal, {
  as: "ViolationLocal",
  foreignKey: "violation_id",
  sourceKey: "violation_id",
});
ViolationLocal.belongsTo(ViolationListLocal, {
  as: "ViolationListLocal",
  foreignKey: "violation_id",
  targetKey: "violation_id",
});

// Export the associations
module.exports = {
  Attendance,
  AttendanceLocal,
  IdInformation,
  IdInformationLocal,
  Violation,
  ViolationList,
  ViolationLocal,
  ViolationListLocal,
};
