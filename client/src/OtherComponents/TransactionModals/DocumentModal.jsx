import React from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";

const DocumentModal = ({
  open,
  onClose,
  attachmentFormData,
  handleAttachmentFileChange,
  fileName,
  handleAttachmentInputChange,
  handleAttachmentFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleAttachmentFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {attachmentFormData.id
            ? "Update Uploaded Attachment"
            : "Upload Attachment"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <TextField
          label="File Name"
          name="fileName"
          value={attachmentFormData.fileName}
          onChange={handleAttachmentInputChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <TextField
          label="Expiration Date"
          name="expirationDate"
          value={attachmentFormData.expirationDate}
          onChange={handleAttachmentInputChange}
          fullWidth
          type="date"
          required
          InputLabelProps={{
            shrink: true,
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <input
          type="file"
          className="form-control visually-hidden"
          accept="image/png, image/jpeg, application/pdf"
          onChange={handleAttachmentFileChange}
          id="attachment"
          name="attachment"
          style={{ display: "none" }}
        />
        <label htmlFor="attachment">
          <Typography>File: {fileName}</Typography>
          <Button
            variant="contained"
            component="span"
            sx={{ mt: 2, backgroundColor: colors.primary[500] }}
          >
            Upload Attachment
          </Button>
        </label>
        <TextField
          label="Created By"
          name="createdBy"
          value={attachmentFormData.createdBy}
          onChange={handleAttachmentInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAttachmentFormSubmit}
        >
          {attachmentFormData.id ? "Update" : "Upload"}
        </Button>
      </Box>
    </Modal>
  );
};

export default DocumentModal;
