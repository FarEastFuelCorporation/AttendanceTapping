import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import QuotationForm from "./QuotationForm";
import LoadingSpinner from "../LoadingSpinner";

const QuotationDisplay = () => {
  const certificateRef = useRef();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/quotationForm/${id}`);
        if (response.data.quotation) {
          setSelectedQuotation(response.data.quotation);
          setShowQuotationForm(true);
        } else {
          console.warn("Quotation data is undefined.");
        }
      } catch (error) {
        console.error("Error fetching the quotation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [id, apiUrl]);

  useEffect(() => {
    if (isContentReady) {
      const timeout = setTimeout(() => {
        handleViewPDF(); // Call after a short delay to ensure rendering
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timeout); // Cleanup on unmount or when dependencies change
    }
  }, [isContentReady]);

  const handleViewPDF = () => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight],
    });

    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank");
        return;
      }

      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        if (pageIndex === 0) {
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        processPage(pageIndex + 1, pages);
      });
    };

    const pages = Array.from(input.children);
    processPage(0, pages);
  };

  return (
    <Box sx={{ marginTop: "100px" }}>
      <LoadingSpinner isLoading={loading} />
      {showQuotationForm ? (
        <Box>
          <QuotationForm
            ref={certificateRef}
            row={selectedQuotation}
            setIsContentReady={setIsContentReady}
          />
        </Box>
      ) : (
        <Typography variant="h6">No quotation data available</Typography>
      )}
    </Box>
  );
};

export default QuotationDisplay;
