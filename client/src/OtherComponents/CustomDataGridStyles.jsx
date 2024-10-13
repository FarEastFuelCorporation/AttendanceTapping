import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const CustomDataGridStyles = ({ children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      m="40px 0 0 0"
      height="75vh"
      width="100%"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
          width: "100%",
          color: colors.grey[100],
        },
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.blueAccent[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[400],
          overflowY: "auto", // Ensure scrolling works
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.blueAccent[700],
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.grey[100]} !important`,
        },
        "& .MuiDataGrid-columnHeader": {
          whiteSpace: "normal",
          wordWrap: "break-word",
          lineHeight: "1.2 !important", // Adjust line height as needed
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          whiteSpace: "normal",
          wordWrap: "break-word",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default CustomDataGridStyles;
