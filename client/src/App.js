import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "font-awesome/css/font-awesome.min.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import Navbar from "./OtherComponents/Navbar";
import LandingPage from "./OtherComponents/LandingPage";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Dashboard from "./OtherComponents/Dashboard";
import LoadingSpinner from "./OtherComponents/LoadingSpinner";
import Certificate from "./OtherComponents/Certificates/Certificate";
import QuotationDisplay from "./OtherComponents/Quotations/QuotationDisplay";
import BillingVerify from "./OtherComponents/BillingStatement/BillingVerify";
import VerifyPlasticCredit from "./OtherComponents/Certificates/PlasticCredits/VerifyPlasticCredit";
import VerifyPlasticWasteDiversion from "./OtherComponents/Certificates/PlasticCredits/VerifyPlasticWasteDiversion";
import Attendance from "./OtherComponents/Sections/attendance";

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null); // State to hold user information
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const location = useLocation();




  if (loading) {
    return <LoadingSpinner theme={theme} />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
