import React, { useState } from "react";
import LandingPage from "../OtherComponents/LandingPage";
import EmployeeLogin from "./Employee/EmployeeLogin";
import ClientLogin from "./Client/ClientLogin";

const Login = ({ onLogin }) => {
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(true);

  const toggleLoginForm = () => {
    setShowEmployeeLogin(!showEmployeeLogin);
  };

  return (
    <div className="login-page">
      <LandingPage />
      <div className="login-container">
        {showEmployeeLogin ? (
          <EmployeeLogin onLogin={onLogin} />
        ) : (
          <ClientLogin onLogin={onLogin} />
        )}
        <br />
        <button className="button-switch" onClick={toggleLoginForm}>
          {showEmployeeLogin
            ? "Switch to Client Login"
            : "Switch to Employee Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
