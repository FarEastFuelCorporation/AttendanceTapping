import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import QRCode from "qrcode.react";
import financeStaffSignature from "../../images/FLORES_FRANK.png";
import accountingManagerSignature from "../../images/CARDINEZ_DAISY.png";
import vicePresidentSignature from "../../images/DE_VERA_EXEQUIEL.png";
import SignatureComponent from "../SignatureComponent ";

const BillingStatementFooter = ({ row, qrCodeURL }) => {
  const today = new Date();
  const datePlusOneMonth = new Date();
  datePlusOneMonth.setMonth(today.getMonth() + 1);

  const [approved, setApproved] = useState(false);

  // Only set approved if row.approved changes

  const isApproved =
    row?.ScheduledTransaction?.[0]?.ReceivedTransaction?.[0]
      ?.SortedTransaction?.[0]?.CertifiedTransaction?.[0]
      ?.BilledTransaction?.[0]?.BillingApprovalTransaction?.approvedDate !==
    undefined;

  useEffect(() => {
    setApproved(isApproved);
  }, [isApproved]);

  return (
    <Box
      sx={{ position: "absolute", width: "calc(100% - 114px)", bottom: "38px" }}
    >
      {/* Footer */}
      <Typography mt={1} sx={{ fontSize: "10px", textAlign: "center" }}>
        Please examine your BILLING STATEMENT for any errors. If no error is
        reported to FEFC office Tel. No. (02) 8366-9072 within 7 days from
        statement date,
      </Typography>
      <Typography sx={{ fontSize: "10px", textAlign: "center" }}>
        the SOA will be considered conclusively correct and final.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "25% 22% 22% 19% 12%" }}>
        <Box sx={{ border: "1px solid black" }}>
          <Typography variant="h6" pl={2}>
            Prepared By:
          </Typography>
          <Box mt={3} position="relative">
            <SignatureComponent
              signature={financeStaffSignature}
              style={{ top: "-40px", left: "30px" }}
            />
            <Typography
              fontWeight="bold"
              textDecoration=""
              textAlign="center"
              sx={{ textDecoration: "underline" }}
            >
              FRANK FLORENCE FLORES
              {/* {quotationData.IdInformation.first_name}{" "}
              {quotationData.IdInformation.last_name} */}
            </Typography>
            <Typography textAlign="center">Finance Staff / AR</Typography>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid black", borderLeft: "none" }}>
          <Typography variant="h6" pl={2}>
            Checked By:
          </Typography>
          <Box mt={3} position="relative">
            {approved && (
              <SignatureComponent signature={accountingManagerSignature} />
            )}
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
            {approved && (
              <SignatureComponent signature={vicePresidentSignature} />
            )}
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
            Received By:
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

export default BillingStatementFooter;
