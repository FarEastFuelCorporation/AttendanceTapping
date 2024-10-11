import React from "react";
import BookModal from "./TransactionModals/BookModal";
import ScheduleModal from "./TransactionModals/ScheduleModal";
import DispatchModal from "./TransactionModals/DispatchModal";
import ReceiveModal from "./TransactionModals/ReceiveModal";
import SortModal from "./TransactionModals/SortModal";
import TreatModal from "./TransactionModals/TreatModal";
import AttachmentModal from "./TransactionModals/AttachmentModal";
import CertifyModal from "./TransactionModals/CertifyModal";
import BillModal from "./TransactionModals/BillModal";
import BillingApprovalModal from "./TransactionModals/BillingApprovalModal";
import BillingDistributionModal from "./TransactionModals/BillingDistributionModal";
import CollectionModal from "./TransactionModals/CollectionModal";
import WarehouseModal from "./TransactionModals/WarehouseModal";

const Modal = ({
  user,
  error,
  handleAutocompleteChange,
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  handleFormSubmit,
  errorMessage,
  setErrorMessage,
  showErrorMessage,
  setShowErrorMessage,
  setIsDiscrepancy,
  isDiscrepancy,
  refs,
}) => {
  let ModalComponent;
  switch (user.userType) {
    case "GEN":
    case "TRP":
    case "IFM":
      ModalComponent = (
        <BookModal
          user={user}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 2:
      ModalComponent = (
        <ScheduleModal
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 3:
      ModalComponent = (
        <DispatchModal
          user={user}
          error={error}
          handleAutocompleteChange={handleAutocompleteChange}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 4:
      ModalComponent = (
        <ReceiveModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
      break;
    case 5:
      ModalComponent = (
        <SortModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
          setIsDiscrepancy={setIsDiscrepancy}
          isDiscrepancy={isDiscrepancy}
        />
      );
      break;
    case 6:
      ModalComponent = (
        <TreatModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
        />
      );
      break;
    case 7:
      ModalComponent = (
        <CertifyModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
        />
      );
      break;
    case 8:
      ModalComponent = (
        <BillModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
          refs={refs}
        />
      );
      break;
    case 9:
      ModalComponent = (
        <BillingApprovalModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
          refs={refs}
        />
      );
      break;
    case 10:
      ModalComponent = (
        <BillingDistributionModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
          refs={refs}
        />
      );
      break;
    case 11:
      ModalComponent = (
        <CollectionModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
          refs={refs}
        />
      );
      break;
    case 14:
      ModalComponent = (
        <WarehouseModal
          user={user}
          error={error}
          open={open}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          showErrorMessage={showErrorMessage}
          setShowErrorMessage={setShowErrorMessage}
          refs={refs}
        />
      );
      break;
    default:
      ModalComponent = (
        <BookModal
          user={user}
          open={open}
          onClose={onClose}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          errorMessage={errorMessage}
          showErrorMessage={showErrorMessage}
        />
      );
  }

  <AttachmentModal
    errorMessage={errorMessage}
    showErrorMessage={showErrorMessage}
  />;

  return <div>{ModalComponent}</div>;
};

export default Modal;
