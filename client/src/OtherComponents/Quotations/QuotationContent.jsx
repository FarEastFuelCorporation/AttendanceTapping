import React, { useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import QuotationTransportationTableHead from "./QuotationTransportationTableHead";
import QuotationWasteTableHead from "./QuotationWasteTableHead";

const QuotationContent = ({
  quotationData,
  pageHeight,
  headerHeight,
  footerHeight,
  setPagesContent,
  setIsDoneCalculation,
  heightsReady,
}) => {
  const wasteTableRef = useRef(null);
  const transportTableRef = useRef(null);

  const quotationWaste = quotationData?.QuotationWaste || [];
  const quotationTransportation = quotationData?.QuotationTransportation || [];

  const firstPageHeight = pageHeight - headerHeight;
  const nextPageHeight = pageHeight;

  // Helper function to calculate total height of rows and divide into pages
  const calculatePageContent = useCallback(() => {
    const pages = [];
    let currentPage = [];
    let currentPageHeight = 0;
    let availableHeight = firstPageHeight; // First page's available height (excludes header)
    console.log(currentPageHeight);
    // Helper function to check if an element can fit on the current page
    const canFitOnPage = (elementHeight) => {
      return availableHeight >= elementHeight; // Ensure it's greater than or equal
    };

    // Helper function to add a page to the pages array
    const addPage = () => {
      pages.push([...currentPage]);
      currentPage = [];
      currentPageHeight = 0;
      availableHeight = nextPageHeight; // Subsequent pages' available height
    };

    // Helper function to add an element to the current page or move to next page
    const addElementToPage = (element, elementHeight) => {
      if (canFitOnPage(elementHeight)) {
        if (element !== null) {
          currentPage.push(element); // Push the element only if it's not null
        }
        currentPageHeight += elementHeight;
        availableHeight -= elementHeight;
      } else {
        addPage(); // Save current page and start a new one
        if (element !== null) {
          currentPage.push(element);
        }
        currentPageHeight += elementHeight;
        availableHeight = nextPageHeight - elementHeight;
      }
    };

    // Get the height of the Typography elements
    const wasteDetailsHeadingHeight =
      wasteTableRef.current?.previousSibling?.offsetHeight || 30; // Assume 30px if not found
    const transportationDetailsHeadingHeight =
      transportTableRef.current?.previousSibling?.offsetHeight || 30; // Assume 30px if not found

    // Combine rows from both tables
    const wasteRows = wasteTableRef.current?.querySelectorAll("tr") || [];
    const transportRows =
      transportTableRef.current?.querySelectorAll("tr") || [];

    // Add WASTE DETAILS header
    addElementToPage(null, wasteDetailsHeadingHeight);

    // Add Waste rows
    wasteRows.forEach((row) => {
      const rowHeight = row.offsetHeight; // Measure the actual row height
      const cells = Array.from(row.children); // Get <td> elements from the <tr>
      const cellContents = cells.map((cell) => cell.textContent.trim()); // Extract content from each <td>
      addElementToPage(cellContents, rowHeight); // Push the contents of the row
    });

    // Add TRANSPORTATION DETAILS header
    addElementToPage(null, transportationDetailsHeadingHeight);

    // Add Transportation rows
    transportRows.forEach((row) => {
      const rowHeight = row.offsetHeight; // Measure the actual row height
      const cells = Array.from(row.children); // Get <td> elements from the <tr>
      const cellContents = cells.map((cell) => cell.textContent.trim()); // Extract content from each <td>
      addElementToPage(cellContents, rowHeight); // Push the contents of the row
    });

    // Add footer only on the last page
    if (canFitOnPage(footerHeight)) {
      // If footer fits on the current page
    } else {
      // If footer doesn't fit, move it to a new page
      addPage(); // Push the current page
      currentPage.push([]); // Start a new page with the footer
    }

    // Ensure the last page is added
    if (currentPage.length > 0) {
      addPage();
    }

    setPagesContent(pages); // Store the pages content in state
    setIsDoneCalculation(true); // Indicate that the calculation is done
  }, [
    firstPageHeight,
    footerHeight,
    nextPageHeight,
    setIsDoneCalculation,
    setPagesContent,
  ]);

  useEffect(() => {
    if (heightsReady) {
      if (wasteTableRef.current || transportTableRef.current) {
        calculatePageContent();
      }
    }
  }, [heightsReady, calculatePageContent]);

  // Helper function to generate styles for TableCell
  const getCellStyle = (isLastCell) => ({
    padding: "4px",
    border: "1px solid black",
    borderTop: "none",
    borderRight: isLastCell ? "1px solid black" : "none", // Use "1px solid black" for the last cell
    color: "black",
  });

  return (
    <Box>
      {/* Waste Details */}
      {quotationWaste.length !== 0 && (
        <Box className="account_details" mt={1}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            WASTE DETAILS
          </Typography>
          <Table ref={wasteTableRef}>
            <QuotationWasteTableHead />
            <TableBody id="table_data">
              {quotationWaste.map((waste, index) => (
                <TableRow key={index} sx={{ border: "black" }}>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.wasteName}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.quantity ? waste.quantity : 1}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.unit}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.unitPrice}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.unitPrice}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {waste.mode}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(true)}>
                    {waste.vatCalculation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
      {/* Transportation Details */}
      {quotationTransportation.length !== 0 && (
        <Box className="account_details" mt={1}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            TRANSPORTATION DETAILS
          </Typography>
          <Table ref={transportTableRef}>
            <QuotationTransportationTableHead />
            <TableBody id="table_data">
              {quotationTransportation.map((transportation, index) => (
                <TableRow key={index} sx={{ border: "black" }}>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.VehicleType.typeOfVehicle}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.haulingArea}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.quantity ? transportation.quantity : 1}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.unit}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.unitPrice}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.unitPrice}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(false)}>
                    {transportation.mode}
                  </TableCell>
                  <TableCell align="center" sx={getCellStyle(true)}>
                    {transportation.vatCalculation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default QuotationContent;
