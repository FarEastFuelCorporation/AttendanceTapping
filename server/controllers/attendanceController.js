// controllers/attendanceController.js

const Attendance = require("../models/Attendance");
const IdInformation = require("../models/IdInformation");
const Violation = require("../models/Violation");
const ViolationList = require("../models/ViolationList");

async function submitAttendance(req, res) {
  const employeeId = req.params.employeeId;

  try {
    // Check the previous attendance status of the employee
    const previousAttendance = await Attendance.findOne({
      where: { employee_id: employeeId },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    console.log("Previous attendance status results:", previousAttendance);

    let status = "TIME-IN"; // Default status

    if (previousAttendance && previousAttendance.status === "TIME-IN") {
      // If the last status was TIME-IN, set to TIME-OUT, else set to TIME-IN
      status = "TIME-OUT";
    }

    // Insert the attendance information into the attendance table
    const attendance = await Attendance.create({
      employee_id: employeeId,
      status: status,
    });

    // Retrieve employee data
    const employeeData = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    // Retrieve violation data for the employee if it exists
    const violations = await Violation.findAll({
      where: { employee_id: employeeId },
      include: [
        {
          model: ViolationList,
          as: "ViolationList", // Specify the alias used in the association
        },
      ],
    });

    // Assuming you have the profile picture Buffer in the `employeeData` object
    const profilePictureBuffer = employeeData.profile_picture;

    // Convert the Buffer to a Base64 data URL
    const profilePictureBase64 = profilePictureBuffer.toString("base64");

    // Add the Base64 data URL to the employeeData object
    const picture = `data:image/png;base64,${profilePictureBase64}`;

    // Render the view with attendance, employee data, violations, and updated safety man-hours
    res.json({
      attendance,
      employeeData,
      picture,
      violations,
    });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function attendance(req, res) {
  try {
    // Fetch attendance and employee data using Sequelize
    const results = await Attendance.findAll({
      include: [
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: [
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "designation",
            "birthday",
          ],
        },
      ],
    });

    // Filter employees based on the latest attendance status
    const filteredData = [];
    const employeeStatus = {};

    for (const row of results) {
      if (row.status === "TIME-IN") {
        // Store the latest TIME-IN event for each employee
        employeeStatus[row.employee_id] = row;
      } else if (row.status === "TIME-OUT" && employeeStatus[row.employee_id]) {
        // Remove the corresponding TIME-IN event for employees with TIME-OUT
        delete employeeStatus[row.employee_id];
      }
    }

    // Convert employeeStatus object back to an array
    for (const employeeId in employeeStatus) {
      filteredData.push(employeeStatus[employeeId]);
    }

    filteredData.sort((a, b) => {
      // Assuming your date and time columns are named 'date' and 'time', adjust the property names accordingly
      const dateTimeA = new Date(`${a.date}T${a.time}Z`);
      const dateTimeB = new Date(`${b.date}T${b.time}Z`);
      return dateTimeA - dateTimeB;
    });

    res.json({ filteredData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

module.exports = {
  attendance,
  submitAttendance,
};
