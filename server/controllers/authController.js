// controllers/authController.js

const Client = require("../models/Client");
const ClientUser = require("../models/ClientUser");
const Employee = require("../models/Employee");
const EmployeeRolesEmployee = require("../models/EmployeeRolesEmployee");
const IdInformation = require("../models/IdInformation");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Create Employee Signup controller
async function createEmployeeSignupController(req, res) {
  try {
    const { employeeId, employeeUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingEmployee = await Employee.findOne({ where: { employeeId } });

    if (!existingEmployee) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingUser = await User.findOne({ where: { employeeId } });

    if (existingUser) {
      // Employee is already registered, send an error response
      return res.status(400).json({ error: "Employee is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await User.create({
      employeeId,
      employeeUsername,
      password: hashedPassword,
    });

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    if (employeeRoles.length === 0) {
      return res.status(400).json({ error: "No roles found for the employee" });
    }

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

    // Set session data
    req.session.user = {
      id: newUser.employeeId,
      userType: employeeRoles[0].employeeRoleId,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: newUser.employeeId,
        userType: employeeRoles[0].employeeRoleId,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Employee Login controller
async function createEmployeeLoginController(req, res) {
  const { employeeUsername, password } = req.body;
  console.log("pass");
  try {
    // Find the user with the provided employee ID
    const user = await User.findOne({ where: { employeeUsername } });
    const employeeId = user.employeeId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Find the user's roles from the EmployeeRolesEmployee table
    const employeeRoles = await EmployeeRolesEmployee.findAll({
      where: { employeeId },
    });

    const employeeDetails = await Employee.findOne({
      where: { employeeId },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "affix",
        "department",
        "designation",
      ],
    });

    const employeePicture = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: ["profile_picture"],
    });

    // Set session data
    req.session.user = {
      id: user.employeeId,
      userType: employeeRoles[0].employeeRoleId,
      employeeDetails: employeeDetails,
      employeePicture: employeePicture,
    };

    console.log(req.session.user);

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: user.employeeId,
        userType: employeeRoles[0].employeeRoleId,
        employeeDetails: employeeDetails,
        employeePicture: employeePicture,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Client Signup controller
async function createClientSignupController(req, res) {
  try {
    const { clientId, clientUsername, password } = req.body;

    // Check if the employeeId is in the Employee table
    const existingClient = await Client.findOne({ where: { clientId } });

    if (!existingClient) {
      // Employee ID is not valid, send an error response
      return res.status(400).json({ error: "Invalid Client ID" });
    }

    // Check if the employeeId is already registered in the User table
    const existingClientUser = await ClientUser.findOne({
      where: { clientId },
    });

    if (existingClientUser) {
      // Employee is already registered, send an error response
      return res.status(400).json({ error: "Client is already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await ClientUser.create({
      clientId,
      clientUsername,
      password: hashedPassword,
    });

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: newUser.clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: newUser.employeeId,
        userType: clientRole,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Create Client Login controller
async function createClientLoginController(req, res) {
  const { clientUsername, password } = req.body;

  try {
    // Find the user with the provided employee ID
    const user = await ClientUser.findOne({ where: { clientUsername } });
    const clientId = user.clientId;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid employee ID or password" });
    }

    const clientDetails = await Client.findOne({
      where: { clientId },
    });

    const clientRole = clientId.substring(0, 3);

    // Set session data
    req.session.user = {
      id: user.clientId,
      userType: clientRole,
      clientDetails: clientDetails,
    };

    // Respond with redirect URL and session details
    res.status(200).json({
      user: {
        id: user.clientId,
        userType: clientRole,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createEmployeeSignupController,
  createEmployeeLoginController,
  createClientSignupController,
  createClientLoginController,
};
