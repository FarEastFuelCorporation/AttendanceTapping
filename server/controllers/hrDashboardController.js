const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");

// Dashboard controller
async function getEmployeeRecords(req, res) {
  try {
    // Fetch all employees and their IdInformation records
    const employeeRecords = await Employee.findAll({});
    const employeeIdRecords = await IdInformation.findAll({});

    // Create a map of IdInformation records for quick lookup by employee_id
    const idInformationMap = employeeIdRecords.reduce((map, idInfo) => {
      map[idInfo.employee_id] = idInfo;
      return map;
    }, {});

    // Calculate various employee counts
    const regularEmployeeCount = employeeRecords.filter(
      (emp) => emp.employeeType === "REGULAR"
    ).length;
    const probationaryEmployeeCount = 20; // Assuming this is a fixed value, adjust as needed
    const projectBasedEmployeeCount = employeeRecords.filter(
      (emp) => emp.employeeType === "PROJECT BASED"
    ).length;
    const totalEmployee =
      regularEmployeeCount +
      probationaryEmployeeCount +
      projectBasedEmployeeCount;

    // Calculate expired contract employees excluding 1970 and sort by date_expire
    const currentDate = new Date();
    const expiredContractEmployees = employeeRecords
      .filter((emp) => {
        const idInfo = idInformationMap[emp.employeeId];
        if (idInfo && idInfo.date_expire) {
          const expirationDate = new Date(idInfo.date_expire);
          // Exclude dates in 1970
          return (
            expirationDate < currentDate &&
            expirationDate.getFullYear() !== 1970
          );
        }
        return false;
      })
      .map((emp) => {
        const idInfo = idInformationMap[emp.employeeId];
        return {
          ...emp.dataValues,
          date_expire: idInfo ? idInfo.date_expire : null,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date_expire);
        const dateB = new Date(b.date_expire);
        return dateA - dateB; // Sort by date_expire ascending (oldest to newest)
      });

    const expiredContractEmployeeCount = expiredContractEmployees.length;

    // Calculate employee count per department
    const departmentCounts = {};
    employeeRecords.forEach((emp) => {
      const department = emp.dataValues.department;
      if (department) {
        if (!departmentCounts[department]) {
          departmentCounts[department] = 0;
        }
        departmentCounts[department]++;
      }
    });

    // Include date_hire from IdInformation
    const employeeRecordsWithDateHire = employeeRecords.map((emp) => {
      const idInfo = idInformationMap[emp.employeeId];
      return {
        ...emp.dataValues,
        date_hire: idInfo ? idInfo.date_hire : null,
      };
    });

    res.json({
      employeeRecords: employeeRecordsWithDateHire,
      regularEmployeeCount,
      probationaryEmployeeCount,
      projectBasedEmployeeCount,
      totalEmployee,
      expiredContractEmployeeCount,
      expiredContractEmployees,
      departmentCounts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getEmployeeRecords,
};
