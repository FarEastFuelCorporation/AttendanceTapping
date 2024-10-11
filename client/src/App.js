import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "font-awesome/css/font-awesome.min.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./OtherComponents/Navbar";
import LandingPage from "./OtherComponents/LandingPage";
import Attendance from "./OtherComponents/Sections/attendance";

const App = () => {
  const [theme, colorMode] = useMode();

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
