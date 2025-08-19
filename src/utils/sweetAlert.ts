import Swal from "sweetalert2";

// Common SweetAlert2 configurations
export const sweetAlertConfig = {
  // Delete confirmation
  confirmDelete: (itemName: string) => ({
    title: "Delete Item?",
    text: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    icon: "warning" as const,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    focusCancel: true,
  }),

  // Trip creation confirmation
  confirmCreateTrip: () => ({
    title: "Create Trip?",
    text: "Are you sure you want to create this trip?",
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, create it!",
    cancelButtonText: "Cancel",
  }),

  // Trip update confirmation
  confirmUpdateTrip: () => ({
    title: "Update Trip?",
    text: "Are you sure you want to update this trip?",
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, update it!",
    cancelButtonText: "Cancel",
  }),

  // Cancel changes confirmation
  confirmCancelChanges: () => ({
    title: "Cancel Changes?",
    text: "Are you sure you want to cancel? All changes will be lost.",
    icon: "warning" as const,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, cancel",
    cancelButtonText: "Continue editing",
  }),

  // Success messages
  success: (message: string) => ({
    title: "Success!",
    text: message,
    icon: "success" as const,
    timer: 2000,
    showConfirmButton: false,
  }),

  // Error messages
  error: (message: string) => ({
    title: "Error!",
    text: message,
    icon: "error" as const,
    confirmButtonColor: "#ef4444",
  }),

  // Loading
  loading: (title: string = "Processing...") => ({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  }),
};

// Helper functions
export const showDeleteConfirmation = async (itemName: string) => {
  return await Swal.fire(sweetAlertConfig.confirmDelete(itemName));
};

export const showCreateTripConfirmation = async () => {
  return await Swal.fire(sweetAlertConfig.confirmCreateTrip());
};

export const showUpdateTripConfirmation = async () => {
  return await Swal.fire(sweetAlertConfig.confirmUpdateTrip());
};

export const showCancelChangesConfirmation = async () => {
  return await Swal.fire(sweetAlertConfig.confirmCancelChanges());
};

export const showSuccess = (message: string) => {
  return Swal.fire(sweetAlertConfig.success(message));
};

export const showError = (message: string) => {
  return Swal.fire(sweetAlertConfig.error(message));
};

export const showLoading = (title?: string) => {
  return Swal.fire(sweetAlertConfig.loading(title));
};

export const closeLoading = () => {
  Swal.close();
};
