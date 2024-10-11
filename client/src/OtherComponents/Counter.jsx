import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { formatNumber } from "./Functions";

const Counter = ({ content, label }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        paddingX: "20px",
        maxWidth: "300px", // Set a max width for the counter box
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: "10px",
          textAlign: "center",
          color: colors.primary.main,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          height: "80px", // Slightly taller for better aesthetics
          width: "100%", // Use full width
          border: `3px solid ${colors.grey[100]}`, // Change the color for better visibility
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white, // White background for the counter
          paddingX: "10px",
        }}
      >
        <Typography
          sx={{ fontWeight: "bold", fontSize: "24px", color: colors.grey[100] }}
        >
          {formatNumber(content)} Kg
        </Typography>
      </Box>
    </Box>
  );
};

export default Counter;
