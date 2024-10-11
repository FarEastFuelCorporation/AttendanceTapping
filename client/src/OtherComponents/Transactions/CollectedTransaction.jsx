import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

import { timestampDate, parseTimeString, formatNumber } from "../Functions";

const CollectedTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingDistributionTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .CertifiedTransaction[0].BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction;

  const collectedTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .CertifiedTransaction[0].BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction.CollectedTransaction;

  // Assuming distributedDate is in a valid Date format (either Date object or string)
  const distributedDate = new Date(
    billingDistributionTransaction.distributedDate
  );

  // Add the terms to the distributedDate
  const terms = parseInt(row.QuotationWaste.Quotation.termsCharge);

  // Create a new Date instance for dueDate by adding terms to distributedDate
  const dueDate = new Date(distributedDate);
  dueDate.setDate(dueDate.getDate() + terms);

  return (
    <Box>
      {row.statusId === 10 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <PaidIcon
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
              For Collection
            </Typography>
          </Box>
          <Typography variant="h5">
            Terms: {terms ? `${terms} Days` : "Pending"}
          </Typography>
          <Typography variant="h5">
            Due Date:{" "}
            {dueDate ? format(new Date(dueDate), "MMMM dd, yyyy") : "Pending"}
          </Typography>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <PaidIcon
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
              Collected
            </Typography>
            <Typography variant="h5">
              {collectedTransaction.createdAt
                ? timestampDate(collectedTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Collected Date:{" "}
            {collectedTransaction.collectedDate
              ? format(
                  new Date(collectedTransaction.collectedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Collected Time:{" "}
            {collectedTransaction.collectedTime
              ? format(
                  parseTimeString(collectedTransaction.collectedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Collected Amount:{" "}
            {collectedTransaction.collectedAmount
              ? formatNumber(collectedTransaction.collectedAmount)
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {collectedTransaction.remarks
              ? collectedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${collectedTransaction.Employee.firstName || ""} ${
              collectedTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default CollectedTransaction;
