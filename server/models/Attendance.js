// models/Attendance.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("TIME-IN", "TIME-OUT"),
      allowNull: false,
    },
    synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Make sure to include this if you're using the synced column
    },
  },
  {
    tableName: "Attendances", // Explicitly specify the table name
  }
);

module.exports = Attendance;
