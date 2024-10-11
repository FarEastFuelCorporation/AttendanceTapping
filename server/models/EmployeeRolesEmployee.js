const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const EmployeeRole = require("./EmployeeRole");
const Employee = require("./Employee");

const EmployeeRolesEmployee = sequelize.define(
  "EmployeeRolesEmployee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    employeeRoleId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeRole,
        key: "employeeRoleId",
      },
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.STRING,
      references: {
        model: Employee,
        key: "employeeId",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = EmployeeRolesEmployee;
