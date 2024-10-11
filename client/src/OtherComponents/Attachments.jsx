import React, { useState, useEffect } from "react";
import { Box, useTheme, IconButton, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { tokens } from "../theme";
import AttachmentModal from "./TransactionModals/AttachmentModal";
import LoadingSpinner from "./LoadingSpinner";

const Attachments = ({
  row,
  user,
  setSuccessMessage,
  setShowSuccessMessage,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialAttachmentFormData = {
    id: "",
    bookedTransactionId: "",
    fileName: "",
    attachment: "",
    createdBy: user.id,
  };

  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [attachmentFormData, setAttachmentFormData] = useState(
    initialAttachmentFormData
  );
  const [attachmentData, setAttachmentData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (row && row.Attachment) {
      const mappedAttachmentData = row.Attachment.map((attachment) => ({
        ...attachment,
        attachmentCreatedBy: `${attachment.Employee.firstName} ${attachment.Employee.lastName}`, // Concatenate names
      }));
      setAttachmentData(mappedAttachmentData); // Update state with mapped data
    } else {
      setAttachmentData([]); // Clear attachment data if no attachments
    }
  }, [row]);

  const handleCloseAttachmentModal = () => {
    setOpenAttachmentModal(false);
    clearAttachmentFormData();
  };

  const clearAttachmentFormData = () => {
    setAttachmentFormData(initialAttachmentFormData);
    setFileName("");
  };

  const handleOpenAttachmentModal = (row) => {
    setAttachmentFormData({
      id: "",
      bookedTransactionId: row.id,
      fileName: "",
      attachment: "",
      createdBy: user.id,
    });
    setOpenAttachmentModal(true);
  };

  const handleAttachmentFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleAttachmentInputChange = (e) => {
    const { name, value } = e.target;
    setAttachmentFormData({ ...attachmentFormData, [name]: value });
  };

  const handleAttachmentFormSubmit = async (e) => {
    e.preventDefault();

    attachmentFormData.attachment = selectedFile;

    // Perform client-side validation
    const { fileName, attachment } = attachmentFormData;

    // Check if all required fields are filled
    if (!fileName || !attachment) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    try {
      setLoading(true);
      let response;

      if (!attachmentFormData.id) {
        const newFormData = new FormData();
        newFormData.append(
          "bookedTransactionId",
          attachmentFormData.bookedTransactionId
        );
        newFormData.append("fileName", attachmentFormData.fileName);
        newFormData.append("attachment", attachmentFormData.attachment);
        newFormData.append("createdBy", attachmentFormData.createdBy);

        // Add new attachment
        response = await axios.post(`${apiUrl}/api/attachment`, newFormData);

        const newAttachmentData = response.data.newAttachment;

        // Process the new attachment to include attachmentCreatedBy
        const processedNewAttachment = {
          ...newAttachmentData,
          attachmentCreatedBy: `${newAttachmentData.Employee.firstName} ${newAttachmentData.Employee.lastName}`,
        };

        // Update the attachmentData with the new processed attachment
        setAttachmentData((prevAttachmentData) => [
          ...prevAttachmentData,
          processedNewAttachment,
        ]);

        // setSuccessMessage("Attachment Added Successfully!");
      }

      // setShowSuccessMessage(true);
      handleCloseAttachmentModal();
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
      field: "fileName",
      headerName: "File Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "attachmentCreatedBy",
      headerName: "Uploaded By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const timestamp = new Date(params.value);
        const formattedTimestamp = timestamp.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        return <div>{formattedTimestamp}</div>;
      },
    },
    {
      field: "view",
      headerName: "View File",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.greenAccent[400], fontSize: "large" }}
          onClick={() => {
            const attachment = params.row.attachment; // Access the longblob data

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array

              // Determine the MIME type based on the file's magic number (first few bytes)
              let mimeType = "application/octet-stream"; // Default MIME type
              const magicNumbers = byteArray.slice(0, 4).join(",");

              // Common magic numbers
              if (magicNumbers.startsWith("255,216,255")) {
                mimeType = "image/jpeg";
              } else if (magicNumbers.startsWith("137,80,78,71")) {
                mimeType = "image/png";
              } else if (magicNumbers.startsWith("37,80,68,70")) {
                mimeType = "application/pdf";
              }
              // Add more magic numbers as necessary

              const blob = new Blob([byteArray], { type: mimeType });
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob
              window.open(url, "_blank"); // Open the URL in a new tab
            }
          }}
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
      width: 100,
      renderCell: (params) => (
        <IconButton
          sx={{ color: colors.blueAccent[400], fontSize: "large" }}
          onClick={() => {
            const attachment = params.row.attachment; // Access the longblob data
            const fileName = params.row.fileName; // Access the file name

            if (attachment) {
              const byteArray = new Uint8Array(attachment.data); // Convert binary data to a byte array

              // Determine the MIME type based on the file's magic number (first few bytes)
              let mimeType = "application/octet-stream"; // Default MIME type
              const magicNumbers = byteArray.slice(0, 4).join(",");
              // Common magic numbers
              if (magicNumbers.startsWith("255,216,255")) {
                mimeType = "image/jpeg";
              } else if (magicNumbers.startsWith("137,80,78,71")) {
                mimeType = "image/png";
              } else if (magicNumbers.startsWith("37,80,68,70")) {
                mimeType = "application/pdf";
              }
              // Add more magic numbers as necessary

              const blob = new Blob([byteArray], { type: mimeType });
              const url = URL.createObjectURL(blob); // Create an object URL from the Blob

              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", fileName); // Use the file name for the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        boxShadow: "none",
        borderBottom: `1px solid ${colors.grey[200]}`,
        "&:before": {
          display: "none",
        },
      }}
    >
      <LoadingSpinner isLoading={loading} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mx: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            handleOpenAttachmentModal(row);
          }}
          sx={{
            my: 2,
            backgroundColor: `${colors.greenAccent[700]}`,
            color: `${colors.grey[100]}`,
          }}
        >
          Upload File
        </Button>
      </Box>
      <DataGrid
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-overlayWrapper": {
            minHeight: "52px",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal !important",
            wordWrap: "break-word !important",
            lineHeight: "1.2 !important",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-toolbarContainer": {
            display: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
        }}
        rows={attachmentData || []}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
        localeText={{ noRowsLabel: "No Files Uploaded" }}
        initialState={{
          sortModel: [{ field: "createdAt", sort: "asc" }],
        }}
      />
      <br />
      <AttachmentModal
        user={user}
        open={openAttachmentModal}
        onClose={handleCloseAttachmentModal}
        attachmentFormData={attachmentFormData}
        setAttachmentFormData={setAttachmentFormData}
        handleAttachmentFileChange={handleAttachmentFileChange}
        fileName={fileName}
        handleAttachmentInputChange={handleAttachmentInputChange}
        handleAttachmentFormSubmit={handleAttachmentFormSubmit}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        showErrorMessage={showErrorMessage}
        setShowErrorMessage={setShowErrorMessage}
      />
    </Box>
  );
};

export default Attachments;
