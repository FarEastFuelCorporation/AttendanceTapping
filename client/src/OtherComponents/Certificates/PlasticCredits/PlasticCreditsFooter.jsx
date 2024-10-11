import React from "react";
import { Box, Typography } from "@mui/material";
import { formatDateWithSuffix, formatNumber } from "../../Functions";
import QRCode from "qrcode.react";
import pco_signature from "../../../images/pco_signature.png";
import pm_signature from "../../../images/pm_signature.png";

export const PlasticCreditsFooter1 = ({ row }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", mt: 2 }}>
        <Typography
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontSize: "20px",
          }}
        >
          Granted this
        </Typography>
        <Typography
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontWeight: "bold",
            marginLeft: "5px",
            fontSize: "20px",
          }}
        >
          {formatDateWithSuffix(row?.issuedDate).day}
        </Typography>
        <Typography
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontSize: "8px",
            marginRight: "3px",
            fontWeight: "bold",
          }}
          id="certification2"
        >
          {formatDateWithSuffix(row?.issuedDate).suffix}
        </Typography>
        <Typography
          sx={{
            fontFamily:
              "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            fontWeight: "bold",
            marginLeft: "2px",
            fontSize: "20px",
          }}
        >
          {formatDateWithSuffix(row?.issuedDate).dateString}
        </Typography>
      </Box>
    </Box>
  );
};

export const PlasticCreditsFooter2 = ({ row, qrCodeURL }) => {
  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "700px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          textAlign: "center",
          marginTop: 15,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            <u>LAWRENCE R. ANTONIO</u>
          </Typography>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "20px",
              mt: -1,
            }}
          >
            Pollution Control Officer
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "13px",
            }}
          >
            COA No. 2023-RIII-5575
          </Typography>
          <Box
            component="img"
            src={pco_signature}
            alt="PCO Signature"
            sx={{
              position: "absolute",
              top: "-70px",
              left: "110px",
              width: "150px",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "20px", paddingRight: "50px" }}
          >
            <u>CRIS DURAN</u>
          </Typography>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "20px",
              paddingRight: "50px",
              mt: -1,
            }}
          >
            Managing Head
          </Typography>
          <Box
            component="img"
            src={pm_signature}
            alt="PM Signature"
            sx={{
              position: "absolute",
              top: "-70px",
              left: "430px",
              width: "150px",
            }}
          />
        </Box>
      </Box>
      <Box mt={5} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Box>
            <Typography
              sx={{
                fontFamily:
                  "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                fontSize: "18px",
              }}
            >
              Name of Organization
              <br />
              {row?.Client.clientName}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography
              sx={{
                fontFamily:
                  "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                fontSize: "18px",
              }}
            >
              Volume of Plastic Waste
              <br />
              {formatNumber(row?.volume)} Kgs.
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
              fontSize: "18px",
              m: 0,
            }}
          >
            Project Information
            <br />
            Plastic Type: Flexible
            <br />
            Procedure: Pyrolysis
            <br />
            By-Product: Alternative Fuel
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <QRCode value={qrCodeURL} size={100} />
        </Box>
      </Box>

      <Box mt={2}>
        <Typography sx={{ fontSize: "10.5px" }}>
          Note: This is a computer generated certificate. To verify the
          authenticity of this file, kindly scan the generated QR Code using
          your QR Code scanner / reader
        </Typography>
      </Box>
    </Box>
  );
};
