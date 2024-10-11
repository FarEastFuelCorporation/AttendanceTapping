import React from "react";
import { Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import accountingManagerSignature from "../../images/CARDINEZ_DAISY.png";
import vicePresidentSignature from "../../images/DE_VERA_EXEQUIEL.png";
import SignatureComponent from "../SignatureComponent ";

const QuotationFooter = ({ quotationData, qrCodeURL }) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);

  return (
    <Box>
      {/* Remarks */}
      <Box id="remarks_container" display="flex" gap="5px" mt={1}>
        <Typography variant="h6" fontWeight="bold">
          REMARKS:
        </Typography>
        <Typography fontSize="12px">{quotationData.remarks}</Typography>
      </Box>

      {/* Footer Details */}
      <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2} mt={1}>
        <Box border="1px solid black">
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            QUOTATION VALIDITY:
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="40px"
            borderTop="1px solid black"
          >
            <Typography variant="h6" fontWeight="bold" id="validity_input">
              30 DAYS
            </Typography>
          </Box>
        </Box>

        <Box border="1px solid black">
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            TERMS OF PAYMENT
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            borderTop="1px solid black"
          >
            <Box display="flex" flexDirection="column" px={1}>
              CHARGE:
              <Typography
                variant="h6"
                fontWeight="bold"
                id="charge_input"
                textAlign="center"
              >
                {parseInt(quotationData.termsCharge)
                  ? `${parseInt(quotationData.termsCharge)} Days`
                  : quotationData.termsCharge}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              borderLeft="1px solid black"
              px={1}
            >
              BUYING:
              <Typography
                variant="h6"
                fontWeight="bold"
                id="buying_input"
                textAlign="center"
              >
                {" "}
                {parseInt(quotationData.termsBuying)
                  ? `${parseInt(quotationData.termsBuying)} Days`
                  : quotationData.termsBuying === 0
                  ? "N/A"
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Requirements */}
      <Box mt={1} borderBottom="2px solid black">
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          REQUIREMENTS
        </Typography>
      </Box>
      <Box p={1}>
        <Typography>
          1. Memorandum of Agreement, VAT Exemption Certificate (if applicable)
        </Typography>
        <Typography>2. Copy of BIR Form 2303 and 2307</Typography>
      </Box>

      {/* Footer */}
      <Box
        mt={1}
        sx={{ display: "grid", gridTemplateColumns: "25% 22% 22% 19% 12%" }}
      >
        <Box sx={{ border: "1px solid black" }}>
          <Typography variant="h6" pl={2}>
            Prepared By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent
              signature={quotationData.IdInformation.signature}
              style={{ top: "-40px", left: "30px" }}
            />
            <Typography
              fontWeight="bold"
              textDecoration=""
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              {quotationData.IdInformation.first_name}{" "}
              {quotationData.IdInformation.last_name}
            </Typography>
            <Typography textAlign="center">Marketing Staff / CSR</Typography>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Checked By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent signature={accountingManagerSignature} />
            <Typography
              fontWeight="bold"
              id="noted_user"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              DAISY CARDINEZ
            </Typography>
          </Box>
          <Typography textAlign="center">Accounting Manager</Typography>
        </Box>
        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Checked By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent signature={vicePresidentSignature} />
            <Typography
              fontWeight="bold"
              id="noted_user"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              EXEQUIEL DE VERA
            </Typography>
          </Box>
          <Typography textAlign="center">Vice President</Typography>
        </Box>
        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Conforme By:
          </Typography>
          <Box mt={2}>
            <Typography
              fontWeight="bold"
              id="noted_user"
              textDecoration="underline"
              textAlign="center"
            ></Typography>
          </Box>
          <Typography textAlign="center"></Typography>
        </Box>
        <Box
          sx={{
            border: "1px solid black",
            borderLeft: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <QRCode value={qrCodeURL} size={80} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: "10px" }}>
        Note: This is a computer generated quotation. To verify the authenticity
        of this file, kindly scan the generated QR Code using your QR Code
        scanner / reader
      </Typography>
    </Box>
  );
};

export default QuotationFooter;
