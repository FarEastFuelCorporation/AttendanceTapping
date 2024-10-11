import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";

import { timestampDate, parseTimeString } from "../Functions";

const BillingDistributionTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billingDistributionTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .CertifiedTransaction[0].BilledTransaction[0].BillingApprovalTransaction
      .BillingDistributionTransaction;

  return (
    <Box>
      {row.statusId === 9 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <TwoWheelerIcon
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
              For Billing Distribution
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <TwoWheelerIcon
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
              Billing Distributed
            </Typography>
            <Typography variant="h5">
              {billingDistributionTransaction.createdAt
                ? timestampDate(billingDistributionTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Distributed Date:{" "}
            {billingDistributionTransaction.distributedDate
              ? format(
                  new Date(billingDistributionTransaction.distributedDate),
                  "MMMM dd, yyyy"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Distributed Time:{" "}
            {billingDistributionTransaction.distributedTime
              ? format(
                  parseTimeString(
                    billingDistributionTransaction.distributedTime
                  ),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {billingDistributionTransaction.remarks
              ? billingDistributionTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${billingDistributionTransaction.Employee.firstName || ""} ${
              billingDistributionTransaction.Employee.lastName || ""
            }`}
          </Typography>
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default BillingDistributionTransaction;
