import React, { useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

import letterhead from "../../images/letterhead.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateOfDestructionHeader from "./CertificateOfDestructionHeader";
import {
  CertificateOfDestructionFooter1,
  CertificateOfDestructionFooter2,
} from "./CertificateOfDestructionFooter";

const modifyApiUrlPort = (url) => {
  const portPattern = /:(3001)$/;
  return url.replace(portPattern, ":3000");
};

const CertificateOfDestruction = ({ row, verify = null }) => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const apiUrl = modifyApiUrlPort(REACT_APP_API_URL);
  const certificateRef = useRef();

  const certifiedTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .CertifiedTransaction[0];

  const sortedWasteTransaction =
    row.ScheduledTransaction[0].ReceivedTransaction[0].SortedTransaction[0]
      .SortedWasteTransaction;

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pageWidth, pageHeight], // Page size in px
      });

      // Add the captured image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      // Save the generated PDF
      pdf.save(
        `${certifiedTransaction.certificateNumber}-${row.Client.clientName}.pdf`
      );
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const qrCodeURL = `${apiUrl}/certificate/${certifiedTransaction.id}`;

  const headerCellStyles = (isLastCell) => ({
    fontWeight: "bold",
    fontSize: "14px",
    padding: "2px",
    border: "1px solid black",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: "center",
  });

  const bodyCellStyles = (isLastCell) => ({
    fontSize: "12px",
    padding: "2px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none",
    color: "black",
    textAlign: "center",
  });

  const generatePDFContent = () => (
    <Box
      ref={certificateRef}
      sx={{
        position: "absolute",
        left: verify ? "0" : "-9999px",
        padding: "123px 38px 38px 76px",
        minHeight: "1056px", // Ensure at least one page height
        width: "816px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "816px",
          height: "1056px",
          zIndex: 0,
          backgroundImage: `url(${letterhead})`,
          backgroundSize: "cover",
          pointerEvents: "none", // Ensure the background image is not clickable
        }}
      />
      <Box sx={{ zIndex: 1, position: "relative" }}>
        <CertificateOfDestructionHeader
          row={row}
          certifiedTransaction={certifiedTransaction}
        />
        <TableContainer
          component={Paper}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            "& .MuiTableContainer-root": {
              backgroundColor: "white",
              color: "black !important",
            },
            fontFamily: "Times New Roman",
            backgroundColor: "white",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ border: "black" }}>
                <TableCell sx={headerCellStyles(false)}>Date Hauled</TableCell>
                <TableCell sx={headerCellStyles(false)}>
                  Class and Description of Waste
                </TableCell>
                <TableCell sx={headerCellStyles(false)}>Waste Code</TableCell>
                <TableCell sx={headerCellStyles(false)}>Quantity</TableCell>
                <TableCell sx={headerCellStyles(false)}>
                  Destruction Process
                </TableCell>
                <TableCell sx={headerCellStyles(true)}>
                  Date of Completion
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWasteTransaction.map((waste, index) => (
                <TableRow key={index} sx={{ border: "black" }}>
                  <TableCell sx={bodyCellStyles(false)}>
                    {formatDate(row.haulingDate)}
                  </TableCell>
                  <TableCell sx={bodyCellStyles(false)}>
                    {waste.wasteName}
                  </TableCell>
                  <TableCell sx={bodyCellStyles(false)}>
                    {row.QuotationWaste.TypeOfWaste.wasteCode}
                  </TableCell>
                  <TableCell sx={bodyCellStyles(false)}>
                    {`${formatNumber(waste.weight)} ${row.QuotationWaste.unit}`}
                  </TableCell>
                  <TableCell sx={bodyCellStyles(false)}>
                    {
                      waste.TreatedWasteTransaction[0].TreatmentMachine
                        .TreatmentProcess.treatmentProcess
                    }
                  </TableCell>
                  <TableCell sx={bodyCellStyles(true)}>
                    {waste.TreatedWasteTransaction.reduce(
                      (latest, transaction) => {
                        const treatedDate = new Date(transaction.treatedDate);
                        return treatedDate > new Date(latest)
                          ? formatDate(transaction.treatedDate)
                          : formatDate(latest);
                      },
                      new Date(0)
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CertificateOfDestructionFooter1
          row={row}
          sortedWasteTransaction={sortedWasteTransaction}
        />
        <CertificateOfDestructionFooter2 qrCodeURL={qrCodeURL} />
      </Box>
    </Box>
  );

  return (
    <Box>
      {verify ? (
        ""
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadPDF}
        >
          Download Certificate
        </Button>
      )}

      {generatePDFContent()}
    </Box>
  );
};

export default CertificateOfDestruction;
