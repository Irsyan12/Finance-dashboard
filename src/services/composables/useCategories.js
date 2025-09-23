import { ref, computed } from "vue";
import { categoryService } from "../supabase";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

export const useCategories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Create category
  const createCategory = async (categoryData) => {
    try {
      loading.value = true;
      error.value = null;

      const newCategory = await categoryService.create({
        ...categoryData,
        user_id: user.value.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      categories.value.push(newCategory);

      return newCategory;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      loading.value = true;
      error.value = null;

      const data = await categoryService.getByUserId(user.value.id);
      categories.value = data;

      return data;
    } catch (err) {
      error.value = err.message;
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

      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
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
    getCategoriesByType,
    updateCategory,
    deleteCategory,
    getCategoryById,
    expenseCategories,
    incomeCategories,
  };
};
