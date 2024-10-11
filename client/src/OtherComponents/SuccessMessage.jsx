import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const SuccessMessage = ({ message, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
      onClose(); // Trigger onClose callback after timeout
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <Box
      sx={{
        position: "absolute",
        width: "calc(100% - 40px)",
        backgroundColor: "#8bc34a", // Light green color
        color: colors.grey[100],
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        opacity: showMessage ? 1 : 0, // Fade out transition effect
        transition: "opacity 0.3s ease", // Adjust timing and easing as needed
      }}
    >
      <Typography variant="body1" sx={{ textAlign: "center" }}>
        {message}
      </Typography>
    </Box>
  );
};

export default SuccessMessage;
