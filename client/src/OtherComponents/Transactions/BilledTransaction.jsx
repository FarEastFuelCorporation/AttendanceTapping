import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { CircleLogo } from "../CustomAccordionStyles";
import { format } from "date-fns";
import { tokens } from "../../theme";
import BillingStatementForm from "../BillingStatement/BillingStatementForm";
import { timestampDate, parseTimeString } from "../Functions";

const BilledTransaction = ({ row, user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const billedTransaction =
    row.ScheduledTransaction[0]?.ReceivedTransaction[0]?.SortedTransaction[0]
      ?.CertifiedTransaction[0]?.BilledTransaction[0];

  return (
    <Box>
      {row.statusId === 5 ? (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo pending={true}>
            <ReceiptIcon
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
              For Billing
            </Typography>
          </Box>
          <Typography variant="h5">Pending</Typography>
          <br />
          <hr />
        </Box>
      ) : (
        <Box sx={{ my: 3, position: "relative" }}>
          <CircleLogo>
            <ReceiptIcon
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
              Billed
            </Typography>
            <Typography variant="h5">
              {billedTransaction?.createdAt
                ? timestampDate(billedTransaction.createdAt)
                : ""}
            </Typography>
          </Box>
          <Typography variant="h5">
            Billed Date:{" "}
            {billedTransaction?.billedDate
              ? format(new Date(billedTransaction.billedDate), "MMMM dd, yyyy")
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Billed Time:{" "}
            {billedTransaction?.billedTime
              ? format(
                  parseTimeString(billedTransaction.billedTime),
                  "hh:mm aa"
                )
              : "Pending"}
          </Typography>
          <Typography variant="h5">
            Remarks:{" "}
            {billedTransaction?.remarks
              ? billedTransaction.remarks
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Service Invoice Number:{" "}
            {billedTransaction?.serviceInvoiceNumber
              ? billedTransaction.serviceInvoiceNumber
              : "NO REMARKS"}
          </Typography>
          <Typography variant="h5">
            Submitted By:{" "}
            {`${billedTransaction?.Employee?.firstName || ""} ${
              billedTransaction?.Employee?.lastName || ""
            }`}
          </Typography>
          {row.statusId === 8 && <BillingStatementForm row={row} />}
          <br />
          <hr />
        </Box>
      )}
    </Box>
  );
};

export default BilledTransaction;
