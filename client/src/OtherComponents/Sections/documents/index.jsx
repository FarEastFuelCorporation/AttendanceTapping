import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import DownloadIcon from "@mui/icons-material/Download";
import Header from "../../Header";
import { tokens } from "../../../theme";
import CustomDataGridStyles from "../../CustomDataGridStyles";
import SuccessMessage from "../../SuccessMessage";
import DocumentModal from "../../TransactionModals/DocumentModal";
import LoadingSpinner from "../../LoadingSpinner";
import {
  calculateRemainingDays,
  calculateRemainingTime,
  formatDateFull,
} from "../../Functions";

const Documents = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialAttachmentFormData = {
    id: "",
    fileName: "",
    expirationDate: "",
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

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/document`);

      // Map over the fetched data to add the attachmentCreatedBy field
      const mappedAttachmentData = response.data.documents.map(
        (attachment) => ({
          ...attachment,
          attachmentCreatedBy: `${attachment.Employee.firstName} ${attachment.Employee.lastName}`, // Concatenate names
          remainingDays: calculateRemainingDays(attachment.expirationDate), // Calculate remaining days and add to row
        })
      );

      setAttachmentData(mappedAttachmentData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCloseAttachmentModal = () => {
    setOpenAttachmentModal(false);
    clearAttachmentFormData();
  };

  const clearAttachmentFormData = () => {
    setAttachmentFormData(initialAttachmentFormData);
    setFileName("");
  };

  const handleOpenAttachmentModal = () => {
    setAttachmentFormData({
      id: "",
      fileName: "",
      expirationDate: "",
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

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Document?"
    );

    if (!isConfirmed) {
      return; // Abort the deletion if the user cancels
    }

    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/api/document/${id}`, {
        data: { deletedBy: user.id },
      });

      fetchData();
      setSuccessMessage("Document Deleted Successfully!");

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAttachmentFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    attachmentFormData.attachment = selectedFile;

    // Perform client-side validation
    const { fileName, attachment } = attachmentFormData;

    // Check if all required fields are filled
    if (!fileName || !attachment) {
      setErrorMessage("Please fill all required fields.");
      setShowErrorMessage(true);
      return;
    }

    const newFormData = new FormData();

    newFormData.append("fileName", attachmentFormData.fileName);
    newFormData.append("expirationDate", attachmentFormData.expirationDate);
    newFormData.append("attachment", attachmentFormData.attachment);
    newFormData.append("createdBy", attachmentFormData.createdBy);

    try {
      setLoading(true);
      if (attachmentFormData.id) {
        // Update attachment
        await axios.put(
          `${apiUrl}/api/document/${attachmentFormData.id}`,
          newFormData
        );

        setSuccessMessage("Document Updated Successfully!");
      } else {
        // Add new attachment
        await axios.post(`${apiUrl}/api/document`, newFormData);

        setSuccessMessage("Document Added Successfully!");
      }

      fetchData();
      setShowSuccessMessage(true);
      handleCloseAttachmentModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
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
      flex: 2,
      minWidth: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "expirationDate",
      headerName: "Expiration Date",
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        const formattedDate = formatDateFull(params.value);
        return (
          <div>
            {renderCellWithWrapText({ ...params, value: formattedDate })}
          </div>
        );
      },
    },
    {
      field: "remainingDays",
      headerName: "Days to Expire",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const { expirationDate } = params.row;

        // Return empty string if expirationDate is null
        if (expirationDate === null) {
          return <div></div>; // Return empty div for null
        }

        const { years, months, days, isExpired } =
          calculateRemainingTime(expirationDate);

        // Determine the display value
        let displayValue;
        if (isExpired) {
          displayValue = `${
            years > 0 ? years + " Year" + (years === 1 ? "" : "s") + ", " : ""
          }${
            months > 0
              ? months + " Month" + (months === 1 ? "" : "s") + ", "
              : ""
          }${days} Day${days === 1 ? "" : "s"} Expired`;
        } else if (years === 0 && months === 0 && days === 0) {
          displayValue = "Expires Today"; // Show if it expires today
        } else {
          displayValue = `${
            years > 0 ? years + " Year" + (years === 1 ? "" : "s") + ", " : ""
          }${
            months > 0
              ? months + " Month" + (months === 1 ? "" : "s") + ", "
              : ""
          }${days} Day${days === 1 ? "" : "s"} Remaining`; // Show years, months, and days remaining
        }

        return (
          <div>
            {renderCellWithWrapText({ ...params, value: displayValue })}
          </div>
        );
      },
      sortComparator: (v1, v2) => {
        const getDaysValue = (value) => {
          if (value === null) return 1000000; // Null should be last (highest value)

          return value;
        };

        const daysValue1 = getDaysValue(v1);
        const daysValue2 = getDaysValue(v2);

        return daysValue1 - daysValue2; // Sort based on the calculated values
      },
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
        return (
          <div>
            {renderCellWithWrapText({ ...params, value: formattedTimestamp })}
          </div>
        );
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
          onClick={async () => {
            try {
              const documentId = params.row.id; // Get the document ID

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/document/${documentId}`
              );

              const attachment = response.data.document.attachment; // Access the attachment data

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
            } catch (error) {
              console.error("Error fetching document file:", error);
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
          onClick={async () => {
            try {
              const documentId = params.row.id; // Get the document ID

              // Fetch the attachment from the API using the document ID
              const response = await axios.get(
                `${apiUrl}/api/document/${documentId}`
              );

              const attachment = response.data.document.attachment; // Access the attachment data
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
            } catch (error) {
              console.error("Error fetching document file:", error);
            }
          }}
        >
          <DownloadIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) =>
        params.row.createdBy === user.id ? ( // Check if createdBy matches user.id
          <IconButton
            color="warning"
            onClick={async () => {
              try {
                const documentId = params.row.id; // Get the document ID

                // Fetch the attachment from the API using the document ID
                const response = await axios.get(
                  `${apiUrl}/api/document/${documentId}`
                );

                const attachment = response.data.document.attachment; // Access the attachment data

                const typeToEdit = attachmentData.find(
                  (type) => type.id === params.row.id
                );

                if (typeToEdit) {
                  setFileName(typeToEdit.fileName);
                  setSelectedFile(attachment);
                  setAttachmentFormData({
                    id: typeToEdit.id,
                    fileName: typeToEdit.fileName,
                    expirationDate: typeToEdit.expirationDate
                      ? typeToEdit.expirationDate
                      : "",
                    attachment: typeToEdit.attachment,
                    createdBy: user.id,
                  });

                  setOpenAttachmentModal(true);
                } else {
                  console.error(
                    `Document with ID ${params.row.id} not found for editing.`
                  );
                }
              } catch (error) {}
            }}
          >
            <EditIcon />
          </IconButton>
        ) : null, // Return null if the condition is not met
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) =>
        params.row.createdBy === user.id ? ( // Check if createdBy matches user.id
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)} // Assuming you have a handleDeleteClick function
          >
            <DeleteIcon />
          </IconButton>
        ) : null, // Return null if the condition is not met
    },
  ];

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header title="Documents" subtitle="List of FEFC Documents" />
        <Box display="flex">
          <IconButton onClick={handleOpenAttachmentModal}>
            <PostAddIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>

      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <CustomDataGridStyles>
        <DataGrid
          rows={attachmentData ? attachmentData : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          getRowClassName={(params) => {
            const daysRemaining = calculateRemainingDays(
              params.row.expirationDate
            );

            if (daysRemaining !== null) {
              if (daysRemaining < 0) {
                return "blink-red"; // Expired
              } else if (daysRemaining <= 90) {
                return "blink-yellow"; // Near expired
              }
            }
            return ""; // Default class if no blinking is needed
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: "remainingDays", sort: "asc" }], // Default sorting by remaining days
            },
          }}
        />
      </CustomDataGridStyles>
      <DocumentModal
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

export default Documents;
