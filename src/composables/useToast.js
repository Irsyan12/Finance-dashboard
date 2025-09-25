import { toast } from "@/services/toast";

export const useToast = () => {
  return {
    toast: {
      success: (message, options) => toast.success(message, options),
      error: (message, options) => toast.error(message, options),
      info: (message, options) => toast.info(message, options),
      warning: (message, options) => toast.warning(message, options),
    },
  };
};
