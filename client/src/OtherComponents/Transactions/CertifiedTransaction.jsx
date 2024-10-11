import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ApprovalIcon from "@mui/icons-material/Approval";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import CertificateOfDestruction from "../Certificates/CertificateOfDestruction";
import { timestampDate, parseTimeString } from "../Functions";

const CertifiedTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const certifiedTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .CertifiedTransaction[0];

  return (
    <Box>
      {row.statusId === 6 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <ApprovalIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[500]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              For Certification
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <ApprovalIcon
              sx={{
                fontSize: "30px",
                color: `${colors.grey[100]}`,
              }}
            />
          </CircleLogo>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography variant="h4" my={1} color={colors.greenAccent[400]}>
              Certified
            </Typography>
            <Typography variant="h5">
              {certifiedTransaction.createdAt
                ? timestampDate(certifiedTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Certificate Number:{" "}
            {certifiedTransaction.certificateNumber
              ? certifiedTransaction.certificateNumber
              : ""}
          </Typography>
          <Typography variant="h5">
            Type of Certificate:{" "}
            {certifiedTransaction.typeOfCertificate
              ? certifiedTransaction.typeOfCertificate
              : ""}
          </Typography>
          <Typography variant="h5">
            Certified Date:{" "}
            {certifiedTransaction.certifiedDate
              ? format(
                  new Date(certifiedTransaction.certifiedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Certified Time:{" "}
            {certifiedTransaction.certifiedTime
              ? format(
                  parseTimeString(certifiedTransaction.certifiedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>

          <Typography variant="h5">
            Remarks:{" "}
            {certifiedTransaction.remarks
              ? certifiedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${certifiedTransaction.Employee.firstName || ""} ${
              certifiedTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <CertificateOfDestruction row={row} />
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default CertifiedTransaction;
