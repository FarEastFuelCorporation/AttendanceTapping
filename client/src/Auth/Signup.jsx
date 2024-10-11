import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import EmployeeSignup from "./Employee/EmployeeSignup";
import ClientSignup from "./Client/ClientSignup";

const Signup = ({ onLogin }) => {
  const [showEmployeeSignup, setShowEmployeeSignup] = useState(true);

  const toggleSignupForm = () => {
    setShowEmployeeSignup(!showEmployeeSignup);
  };

  return (
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        {showEmployeeSignup ? (
          <EmployeeSignup onLogin={onLogin} />
        ) : (
          <ClientSignup onLogin={onLogin} />
        )}
        <br />
        <button className="button-switch" onClick={toggleSignupForm}>
          {showEmployeeSignup
            ? "Switch to Client Sign Up"
            : "Switch to Employee Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
