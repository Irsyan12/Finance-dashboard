import { ref, reactive } from "vue";

// Global alert state
const alertState = reactive({
  isOpen: false,
  title: "",
  description: "",
  confirmText: "OK",
  cancelText: "Cancel",
  variant: "default", // 'default', 'destructive', 'warning'
  showCancel: true,
  resolve: null, // Promise resolver
});

export const useAlert = () => {
  /**
   * Show alert dialog
   * @param {Object} options - Alert configuration
   * @param {string} options.title - Alert title
   * @param {string} options.description - Alert description
   * @param {string} [options.confirmText="OK"] - Confirm button text
   * @param {string} [options.cancelText="Cancel"] - Cancel button text
   * @param {string} [options.variant="default"] - Alert variant
   * @param {boolean} [options.showCancel=true] - Show cancel button
   * @returns {Promise<boolean>} - Promise that resolves to true if confirmed, false if cancelled
   */
  const alert = (options) => {
    return new Promise((resolve) => {
      alertState.isOpen = true;
      alertState.title = options.title || "";
      alertState.description = options.description || "";
      alertState.confirmText = options.confirmText || "OK";
      alertState.cancelText = options.cancelText || "Cancel";
      alertState.variant = options.variant || "default";
      alertState.showCancel = options.showCancel !== false;
      alertState.resolve = resolve;
    });
  };

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} description - Dialog description
   * @returns {Promise<boolean>} - Promise that resolves to true if confirmed, false if cancelled
   */
  const confirm = (title, description) => {
    return alert({
      title,
      description,
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "default",
      showCancel: true,
    });
  };

  /**
   * Show destructive confirmation dialog (for delete actions)
   * @param {string} title - Dialog title
   * @param {string} description - Dialog description
   * @returns {Promise<boolean>} - Promise that resolves to true if confirmed, false if cancelled
   */
  const confirmDelete = (title, description) => {
    return alert({
      title,
      description,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      showCancel: true,
    });
  };

  const confirmLogout = (title, description) => {
    return alert({
      title,
      description,
      confirmText: "Logout",
      cancelText: "Cancel",
      variant: "destructive",
      showCancel: true,
    });
  };

  /**
   * Show warning dialog
   * @param {string} title - Dialog title
   * @param {string} description - Dialog description
   * @returns {Promise<boolean>} - Promise that resolves to true when confirmed
   */
  const warn = (title, description) => {
    return alert({
      title,
      description,
      confirmText: "OK",
      variant: "warning",
      showCancel: false,
    });
  };

  /**
   * Show info dialog
   * @param {string} title - Dialog title
   * @param {string} description - Dialog description
   * @returns {Promise<boolean>} - Promise that resolves to true when confirmed
   */
  const info = (title, description) => {
    return alert({
      title,
      description,
      confirmText: "OK",
      variant: "default",
      showCancel: false,
    });
  };

  /**
   * Close alert dialog
   */
  const closeAlert = () => {
    alertState.isOpen = false;
    if (alertState.resolve) {
      alertState.resolve(false); // Default to false when closed without action
    }
    alertState.resolve = null;
  };

  /**
   * Handle confirm action
   */
  const handleConfirm = () => {
    const resolve = alertState.resolve;
    alertState.isOpen = false;
    alertState.resolve = null;

    if (resolve) {
      resolve(true);
    }
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    const resolve = alertState.resolve;
    alertState.isOpen = false;
    alertState.resolve = null;

    if (resolve) {
      resolve(false);
    }
  };

  return {
    // State
    alertState,

    // Methods
    alert,
    confirm,
    confirmDelete,
    confirmLogout,
    warn,
    info,
    closeAlert,
    handleConfirm,
    handleCancel,
  };
};
