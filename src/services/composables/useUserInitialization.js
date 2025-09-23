import { ref } from "vue";
import {
  initializeUserCategories,
  debugCategoryCreation,
} from "../userInitialization";
import { useToast } from "./useToast";

export const useUserInitialization = () => {
  const { toast } = useToast();
  const isInitializing = ref(false);
  const initializationComplete = ref(false);

  /**
   * Initialize new user data (categories, etc.)
   * @param {string} userId - The user ID
   */
  const initializeNewUser = async (userId) => {
    if (!userId || isInitializing.value) return;

    try {
      isInitializing.value = true;

      // Initialize default categories
      const categoriesCreated = await initializeUserCategories(userId);

      if (categoriesCreated) {
        toast.success("Welcome! Your account has been set up successfully", {
          description: "Default categories have been created for you",
        });
      } else {
      }

      initializationComplete.value = true;
    } catch (error) {
      console.error("Error initializing new user:", error);
      toast.warning("Account setup incomplete", {
        description:
          "Some features may not work properly. Please refresh the page.",
      });
    } finally {
      isInitializing.value = false;
    }
  };

  /**
   * Debug function to test category creation
   * @param {string} userId - The user ID for testing
   */
  const debugUserInitialization = async (userId) => {
    if (!userId) return false;

    try {
      const result = await debugCategoryCreation(userId);
      if (result) {
        toast.success("Database connection test successful");
      } else {
        toast.error("Database connection test failed");
      }
      return result;
    } catch (error) {
      console.error("Debug test error:", error);
      toast.error("Debug test failed", {
        description: error.message,
      });
      return false;
    }
  };

  /**
   * Force retry initialization for current user (untuk debugging)
   */
  const forceRetryInitialization = async () => {
    const { user } = await import("./useData.js");
    const currentUser =
      user.value ||
      (await import("../supabase/supabase.js")).supabase.auth.getUser();

    if (!currentUser || !currentUser.id) {
      toast.error("No user logged in");
      return false;
    }

    const userId = currentUser.id || currentUser.user?.id;

    try {
      const result = await initializeNewUser(userId);
      return result;
    } catch (error) {
      console.error("Force retry failed:", error);
      toast.error("Force retry failed", {
        description: error.message,
      });
      return false;
    }
  };

  // Make functions available globally for debugging
  if (typeof window !== "undefined") {
    window.forceRetryInitialization = forceRetryInitialization;
    window.debugUserInit = debugUserInitialization;
  }

  return {
    isInitializing,
    initializationComplete,
    initializeNewUser,
    debugUserInitialization,
    forceRetryInitialization,
  };
};
