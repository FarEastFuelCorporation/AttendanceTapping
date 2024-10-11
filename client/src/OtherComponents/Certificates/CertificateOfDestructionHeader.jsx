import React from "react";
import { Box, Typography } from "@mui/material";

const CertificateOfDestructionHeader = ({ row, certifiedTransaction }) => {
  return (
    <Box>
      <Typography
        variant="h2"
        align="center"
        sx={{
          fontSize: "2rem",
          fontFamily: "'Times New Roman', Times, serif",
          textAlign: "center",
          margin: 0,
        }}
      >
        C E R T I F I C A T I O N
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          mt: 2,
        }}
      >
        <Typography variant="h6" component="h4">
          C. No.{" "}
        </Typography>
        <Typography id="df_no" sx={{ fontWeight: "bold" }}>
          {certifiedTransaction.certificateNumber}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "justify", mt: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "15px",
            margin: 0,
          }}
        >
          Pursuant to the provisions of Republic Act 9003 also known as
          Ecological Solid Waste Management Act of 2000 we are issuing this
          certificate of destruction to:
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="h2"
          id="table_company"
          sx={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "18px",
            margin: "0px 0px 8px",
          }}
        >
          {row.Client.clientName}
        </Typography>
        <Typography
          id="table_company_address"
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontSize: "13px",
            margin: 0,
          }}
        >
          {row.Client.address}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "13px",
          margin: "16px 0 8px",
        }}
      >
        For the waste(s) processed/ treated as follows:
      </Typography>
    </Box>
  );
};

export default CertificateOfDestructionHeader;
