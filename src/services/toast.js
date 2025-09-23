import { reactive } from "vue";

// Global toast state
const toasts = reactive([]);
let toastId = 0;

const addToast = (type, message, options = {}) => {
  const id = ++toastId;
  const newToast = {
    id,
    type,
    message,
    description: options.description || "",
    duration: options.duration || 4000,
    visible: false,
  };

  toasts.push(newToast);

  // Show toast immediately
  setTimeout(() => {
    const toastIndex = toasts.findIndex((t) => t.id === id);
    if (toastIndex > -1) {
      toasts[toastIndex].visible = true;
    }
  }, 10);

  // Auto remove
  if (newToast.duration > 0) {
    setTimeout(() => removeToast(id), newToast.duration);
  }

  return id;
};

const removeToast = (id) => {
  const toastIndex = toasts.findIndex((t) => t.id === id);
  if (toastIndex > -1) {
    toasts[toastIndex].visible = false;
    setTimeout(() => {
      const currentIndex = toasts.findIndex((t) => t.id === id);
      if (currentIndex > -1) {
        toasts.splice(currentIndex, 1);
      }
    }, 300);
  }
};

// Export toast API
export const toast = {
  success: (message, options = {}) => addToast("success", message, options),
  error: (message, options = {}) => addToast("error", message, options),
  info: (message, options = {}) => addToast("info", message, options),
  warning: (message, options = {}) => addToast("warning", message, options),
};

// Export toasts for component
export { toasts, removeToast };
