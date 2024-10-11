import React from "react";
import { Box, Typography } from "@mui/material";
import { formatNumber } from "../../Functions";

const PlasticCreditsHeader = ({ row }) => {
  return (
    <Box>
      <Typography variant="h6" component="h4" sx={{ textAlign: "right" }}>
        {row?.certificateNumber}
      </Typography>
      <Typography
        variant="h2"
        align="center"
        mt={3}
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        {row?.typeOfCertificate === "PLASTIC CREDIT"
          ? "PLASTIC CREDIT CERTIFICATE"
          : "PLASTIC WASTE DIVERSION CERTIFICATE"}
      </Typography>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          variant="h2"
          id="table_company"
          sx={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "0px 0px 8px",
          }}
        >
          {row?.Client.clientName}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        Far East Fuel Corporation certificates that:
      </Typography>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        The Volume of plastic waste amounting to {formatNumber(row?.volume)} Kgs
        has been recovered and diverted on behalf of {row?.Client.clientName}{" "}
        and has been awarded with equivalent volume as{" "}
        {row?.typeOfCertificate === "PLASTIC CREDIT"
          ? "Plastic Credit"
          : "Plastic Waste Diversion"}
        s
      </Typography>
      <Typography
        sx={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontSize: "22px",
          margin: "16px 0 8px",
        }}
      >
        The{" "}
        {row?.typeOfCertificate === "PLASTIC CREDIT"
          ? "Plastic Credit"
          : "Plastic Waste Diversion"}
        s are designated by the following serial number on the
        <br />
        FEFC{" "}
        {row?.typeOfCertificate === "PLASTIC CREDIT"
          ? "Plastic Credit"
          : "Plastic Waste Diversion"}{" "}
        Registry: {row?.certificateNumber}
      </Typography>
    </Box>
  );
};

export default PlasticCreditsHeader;
