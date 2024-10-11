// components/Quotations.js

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PageviewIcon from "@mui/icons-material/Pageview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "../../Header";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import QuotationFormModal from "../../Modals/QuotationFormModal";
import QuotationForm from "../../Quotations/QuotationForm";
import LoadingSpinner from "../../LoadingSpinner";

const Quotations = ({ user }) => {
  const certificateRef = useRef();
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);

  const initialFormData = {
    id: "",
    clientId: "",
    quotationCode: "",
    validity: "",
    termsCharge: "",
    termsBuying: "",
    scopeOfWork: "",
    remarks: "",
    createdBy: user.id,
    quotationWastes: [
      {
        id: null,
        quotationId: null,
        wasteId: "",
        wasteName: "",
        mode: "",
        unit: "",
        unitPrice: 0,
        vatCalculation: "",
        hasFixedRate: false,
        fixedWeight: 0,
        fixedPrice: 0,
      },
    ],
    quotationTransportation: [
      {
        id: null,
        quotationId: null,
        vehicleTypeId: "",
        haulingArea: "",
        mode: "",
        unit: "",
        unitPrice: 0,
        vatCalculation: "",
        hasFixedRate: false,
        fixedWeight: 0,
        fixedPrice: 0,
      },
    ],
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [quotationsData, setQuotationsData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [isDownloadContentReady, setDownloadIsContentReady] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (
        user.userType === "GEN" ||
        user.userType === "TRP" ||
        user.userType === "IFM"
      ) {
        response = await axios.get(`${apiUrl}/api/quotation/${user.id}`);
      } else {
        response = await axios.get(`${apiUrl}/api/quotation`);
      }

      const flattenedData = response.data.quotations.map((item) => ({
        ...item,
        clientPicture: item.Client ? item.Client.clientPicture : null,
        clientName: item.Client ? item.Client.clientName : null,
        quotationWastes: item.QuotationWaste ? item.QuotationWaste : [],
        quotationTransportation: item.QuotationTransportation
          ? item.QuotationTransportation
          : [],
        validity: item.validity
          ? new Date(item.validity).toISOString().split("T")[0]
          : null, // Convert timestamp to yyyy-mm-dd format
      }));

      setQuotationsData(flattenedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quotationsData:", error);
    }
  }, [apiUrl, user.id, user.userType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialFormData);
    setSuccessMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewClick = (row) => {
    setLoading(true);
    const quotationToView = quotationsData.find(
      (quotation) => quotation.id === row.QuotationWaste[0].quotationId
    );

    setSelectedQuotation(quotationToView); // Set the selected quotation

    setIsDownload(false);
    // Set the flag to show the form
    setShowQuotationForm(true);

    setLoading(false);
  };

  const handleViewPDF = () => {
    const input = certificateRef.current;

    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, generate the PDF
        const pdfOutput = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfOutput);
        window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  useEffect(() => {
    if (isContentReady) {
      handleViewPDF();
    }
  }, [isContentReady]);

  const handleDownloadClick = (row) => {
    const quotationToDownload = quotationsData.find(
      (quotation) => quotation.id === row.QuotationWaste[0].quotationId
    );
    setSelectedQuotation(quotationToDownload); // Set the selected quotation
    // Use a timeout to allow the component to render before downloading

    setIsDownload(true);
    // Set the flag to show the form
    setShowQuotationForm(true);

    if (showQuotationForm) {
      handleDownloadPDF(quotationToDownload);
    }
  };

  const handleDownloadPDF = (quotationData) => {
    const input = certificateRef.current;
    const pageHeight = 1056;
    const pageWidth = 816;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pageWidth, pageHeight], // Page size in px
    });

    // Function to process and add each page
    const processPage = (pageIndex, pages) => {
      if (pageIndex >= pages.length) {
        // All pages are processed, save the PDF
        pdf.save(
          `${quotationData.quotationCode}-${quotationData.revisionNumber}-${quotationData.Client.clientName}.pdf`
        );
        return;
      }

      // Capture the content of the current page using html2canvas
      html2canvas(pages[pageIndex], { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (pageIndex === 0) {
          // Add the first page
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        } else {
          // Add subsequent pages
          pdf.addPage([pageWidth, pageHeight]);
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        }

        // Process the next page
        processPage(pageIndex + 1, pages);
      });
    };

    // Break the content into multiple pages if needed
    const pages = Array.from(input.children); // Assuming each page is a child of input
    processPage(0, pages); // Start processing pages from the first one
  };

  useEffect(() => {
    if (isDownloadContentReady) {
      handleDownloadPDF(selectedQuotation);
    }
  }, [isDownloadContentReady, selectedQuotation]);

  const handleEditClick = (id) => {
    const quotationToEdit = quotationsData.find(
      (quotation) => quotation.id === id
    );
    if (quotationToEdit) {
      setFormData({
        id: quotationToEdit.id,
        clientId: quotationToEdit.clientId,
        quotationCode: quotationToEdit.quotationCode,
        validity: quotationToEdit.validity,
        termsCharge: quotationToEdit.termsCharge,
        termsBuying: quotationToEdit.termsBuying,
        scopeOfWork: quotationToEdit.scopeOfWork,
        remarks: quotationToEdit.remarks,
        createdBy: user.id,
        quotationWastes: quotationToEdit.quotationWastes
          ? quotationToEdit.quotationWastes
          : [], // Ensure quotationWastes is an array
        quotationTransportation: quotationToEdit.quotationTransportation
          ? quotationToEdit.quotationTransportation
          : [], // Ensure quotationWastes is an array
      });
      handleOpenModal();
    } else {
      console.error(`Quotation with ID ${id} not found for editing.`);
    }
  };

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Quotation?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/quotation/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Quotation Deleted Successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (formData.id) {
        // Update existing quotation
        await axios.put(`${apiUrl}/api/quotation/${formData.id}`, formData);

        setSuccessMessage("Quotation Updated Successfully!");
      } else {
        // Add new quotation
        await axios.post(`${apiUrl}/api/quotation`, formData);

        setSuccessMessage("Quotation Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "quotationCode",
      headerName: "Quotation Code",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "revisionNumber",
      headerName: "Revision Number",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "clientPicture",
      headerName: "Logo",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 50,
      renderCell: (params) => {
        // Check if params.value is valid
        if (params.value && params.value.data && params.value.type) {
          try {
            // Convert Buffer to Uint8Array
            const uint8Array = new Uint8Array(params.value.data);
            // Create Blob from Uint8Array
            const blob = new Blob([uint8Array], { type: params.value.type });
            // Create object URL from Blob
            const imageUrl = URL.createObjectURL(blob);

            return (
              <img
                src={imageUrl}
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          } catch (error) {
            console.error("Error creating image URL:", error);
            return (
              <img
                src="/assets/unknown.png"
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          }
        } else {
          return (
            <img
              src="/assets/unknown.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          );
        }
      },
    },
    {
      field: "clientName",
      headerName: "Client Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "termsCharge",
      headerName: "Terms (Charge)",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "termsBuying",
      headerName: "Terms (Buying)",
      headerAlign: "center",
      align: "center",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "scopeOfWork",
      headerName: "Scope Of Work",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 180,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "validity",
      headerName: "Validity",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      valueFormatter: (params) => {
        if (!params.value) return ""; // Handle empty or null values
        return format(new Date(params.value), "MMMM dd yyyy");
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleViewClick(params.row)}
        >
          <PageviewIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "download",
      headerName: "Download",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDownloadClick(params.row)}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
  ];

  if (user.userType === 2) {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="warning"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 60,
        renderCell: (params) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      }
    );
  }

  return (
    <Box p="20px" width="100% !important">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Quotations" subtitle="List of Quotations" />
        {user.userType === 2 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles>
        <DataGrid
          rows={quotationsData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          initialState={{
            sorting: {
              sortModel: [{ field: "quotationCode", sort: "asc" }],
            },
          }}
        />
      </CustomDataGridStyles>
      <QuotationFormModal
        user={user.id}
        open={openModal}
        handleCloseModal={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      {showQuotationForm && (
        <Box sx={{ position: "absolute", left: "-9999px", zIndex: 9999 }}>
          <QuotationForm
            ref={certificateRef}
            row={selectedQuotation}
            setIsContentReady={
              isDownload ? setDownloadIsContentReady : setIsContentReady
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default Quotations;
