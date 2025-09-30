import { ref, computed } from "vue";
import { categoryService } from "../services/supabase";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import { useDataCache } from "./useDataCache";

export const useCategories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getCachedData, setCachedData, clearCache } = useDataCache();

  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Create category (update cache)
  const createCategory = async (categoryData) => {
    try {
      loading.value = true;
      error.value = null;

      // Safe check for user
      if (!user.value || !user.value.id) {
        throw new Error("User not logged in");
      }

      const newCategory = await categoryService.create({
        ...categoryData,
        user_id: user.value.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      categories.value.push(newCategory);

      // Update cache
      setCachedData("categories", categories.value, user.value.id);

      toast.success("Category created successfully!");
      return newCategory;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to create category", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch categories with caching
  const fetchCategories = async (options = {}) => {
    if (!user.value?.id) {
      console.warn("No user available for fetching categories");
      return [];
    }

    try {
      // Check cache first
      const cachedCategories = getCachedData("categories", user.value.id);
      if (cachedCategories && !options.forceRefresh) {
        categories.value = cachedCategories;
        return cachedCategories;
      }

      loading.value = true;
      error.value = null;

      const data = await categoryService.getByUserId(user.value.id);
      categories.value = data || [];

      // Cache the data
      setCachedData("categories", data || [], user.value.id);

      return data || [];
    } catch (err) {
      error.value = err.message;
      categories.value = []; // Reset to empty array on error
      toast.error("Failed to fetch categories", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get categories by type
  const getCategoriesByType = async (type) => {
    try {
      const data = await categoryService.getByType(user.value.id, type);
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Update category
  const updateCategory = async (id, updates) => {
    try {
      loading.value = true;
      error.value = null;

      const updatedCategory = await categoryService.update(id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      const index = categories.value.findIndex((c) => c.id === id);
      if (index > -1) {
        categories.value[index] = updatedCategory;
      }

      // Update cache
      setCachedData("categories", categories.value, user.value.id);

      toast.success("Category updated successfully!");
      return updatedCategory;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      await categoryService.delete(id);

      categories.value = categories.value.filter((c) => c.id !== id);

      // Update cache
      setCachedData("categories", categories.value, user.value.id);

      toast.success("Category deleted successfully!");
      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Force refresh (bypass cache)
  const refreshCategories = () => {
    return fetchCategories({ forceRefresh: true });
  };

  // Clear cache manually
  const clearCategoryCache = () => {
    clearCache("categories");
  };

  // Get category by ID
  const getCategoryById = (id) => {
    return categories.value.find((c) => c.id === id);
  };

  // Computed properties
  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === "expense")
  );

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === "income")
  );

  return {
    categories,
    loading,
    error,
    createCategory,
    fetchCategories,
    refreshCategories,
    clearCategoryCache,
    getCategoriesByType,
    updateCategory,
    deleteCategory,
    getCategoryById,
    expenseCategories,
    incomeCategories,
  };
};
