// OtherComponents/LoadingSpinner.js
import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const LoadingSpinner = ({ isLoading }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!isLoading) {
    return null; // Don't render anything if not loading
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        transition: "opacity 0.3s ease-in-out",
        opacity: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CircularProgress color="primary" size={64} />
        <Typography variant="h6" sx={{ mt: 2 }} color={colors.greenAccent[500]}>
          Loading...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
