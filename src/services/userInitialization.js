import { categoryService } from "./supabase/categories.js";

// Default categories template
export const DEFAULT_CATEGORIES = [
  // Expense Categories
  { name: "Food & Dining", type: "expense", color: "#ef4444" },
  { name: "Transportation", type: "expense", color: "#f97316" },
  { name: "Shopping", type: "expense", color: "#8b5cf6" },
  { name: "Entertainment", type: "expense", color: "#f59e0b" },
  { name: "Bills & Utilities", type: "expense", color: "#06b6d4" },
  { name: "Healthcare", type: "expense", color: "#84cc16" },
  { name: "Education", type: "expense", color: "#3b82f6" },
  { name: "Travel", type: "expense", color: "#ec4899" },
  { name: "Other", type: "expense", color: "#6b7280" },

  // Income Categories
  { name: "Salary", type: "income", color: "#10b981" },
  { name: "Freelancing", type: "income", color: "#22c55e" },
  { name: "Investment", type: "income", color: "#6366f1" },
  { name: "Business", type: "income", color: "#14b8a6" },
  { name: "Other Income", type: "income", color: "#059669" },
  { name: "Gift", type: "income", color: "#22c55e" },
];

/**
 * Create missing default categories for user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of all user categories after creation
 */
export const createMissingCategories = async (userId) => {
  try {
    // Get existing categories
    const existingCategories = await categoryService.getByUserId(userId);
    const existingNames = existingCategories.map((c) => c.name.toLowerCase());

    // Find missing categories
    const missingCategories = DEFAULT_CATEGORIES.filter(
      (category) => !existingNames.includes(category.name.toLowerCase())
    );

    if (missingCategories.length === 0) {
      return existingCategories;
    }

    // Create missing categories
    const categoriesToCreate = missingCategories.map((category) => ({
      ...category,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Try batch insert first
    try {
      await categoryService.createBatch(categoriesToCreate);
      // Return all categories
      const allCategories = await categoryService.getByUserId(userId);
      return allCategories;
    } catch (batchError) {
      // Fallback to individual creation
      for (const categoryData of categoriesToCreate) {
        try {
          await categoryService.create(categoryData);
        } catch (error) {
          console.error("Error creating category:", {
            error: error.message,
            errorCode: error.code,
            details: error.details,
            hint: error.hint,
            categoryData: categoryData,
          });
        }
      }
      const allCategories = await categoryService.getByUserId(userId);
      return allCategories;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Create default categories for a new user using batch insert
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of created categories
 */
export const createDefaultCategories = async (userId) => {
  try {
    const categoriesWithUserId = DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Try batch insert first
    try {
      const batchResult = await categoryService.createBatch(
        categoriesWithUserId
      );
      return batchResult;
    } catch (batchError) {
      // Fallback to individual inserts with detailed logging
      const createdCategories = [];
      const failedCategories = [];

      for (let i = 0; i < categoriesWithUserId.length; i++) {
        const categoryData = categoriesWithUserId[i];
        try {
          const category = await categoryService.create(categoryData);
          createdCategories.push(category);

          // Add small delay to prevent potential rate limiting
          if (i < categoriesWithUserId.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error("Error creating category:", {
            error: error.message,
            errorCode: error.code,
            details: error.details,
            hint: error.hint,
            categoryData: categoryData,
          });
          failedCategories.push({
            category: categoryData,
            error: error.message,
            errorCode: error.code,
            details: error.details,
          });
        }
      }

      if (failedCategories.length > 0) {
        console.warn("❌ Failed categories:", failedCategories);
        console.warn(
          `Failed: ${failedCategories.map((f) => f.category.name).join(", ")}`
        );
      }

      return createdCategories;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user has been initialized (has any categories)
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} True if user has been initialized
 */
export const checkUserHasCategories = async (userId) => {
  try {
    const categories = await categoryService.getByUserId(userId);
    // Simply check if user has any categories (means they've been initialized)
    const hasBeenInitialized = categories && categories.length > 0;
    return hasBeenInitialized;
  } catch (error) {
    return false;
  }
};

/**
 * Debug function to test database connection and table structure
 * @param {string} userId - The user ID for testing
 */
export const debugCategoryCreation = async (userId) => {
  try {
    const existingCategories = await categoryService.getByUserId(userId);

    // Test 2: Try creating a single test category
    const testCategory = {
      name: `Test Category ${Date.now()}`,
      type: "expense",
      color: "#000000",
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await categoryService.create(testCategory);

    // Test 3: Clean up test category
    if (created?.id) {
      try {
        await categoryService.delete(created.id);
      } catch (error) {
        console.warn("⚠️ Could not clean up test category:", error.message);
      }
    }

    return true;
  } catch (error) {
    console.error("Error initializing user categories:", {
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return false;
  }
};

export const initializeUserCategories = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Check if user has been initialized before
    const hasBeenInitialized = await checkUserHasCategories(userId);

    if (hasBeenInitialized) {
      return false; // No new initialization needed
    }

    // User is new, create all default categories
    const createdCategories = await createDefaultCategories(userId);

    const success = createdCategories && createdCategories.length > 0;

    if (success) {
      
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
