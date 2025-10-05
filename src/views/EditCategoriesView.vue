<script setup>
import AppLayout from "../components/AppLayout.vue";
import LoginPrompt from "../components/ui/LoginPrompt.vue";
import { ref, computed, watch } from "vue";
import { transactions } from "@/services/supabase/data";
import { useUserData } from "../composables/useData";
import { useCategories } from "../composables/useCategories";
import { watchUserAndFetchCategories } from "@/constants/watchers";
import { DEFAULT_NEW_CATEGORY, getDefaultCategory } from "@/constants/forms";
import Header from "../components/View/Header.vue";
import { useToast } from "../composables/useToast";
import { useAlert } from "@/composables/useAlert";
import { availableColors } from "@/constants/colors";
import CategoriesSkeleton from "../components/ui/CategoriesSkeleton.vue";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const { toast } = useToast();
const { user, isLoggedIn } = useUserData();
const { confirm } = useAlert();
const {
  categories,
  createCategory: createCategoryAPI,
  updateCategory: updateCategoryAPI,
  deleteCategory: deleteCategoryAPI,
  loading: categoriesLoading,
  fetchCategories,
} = useCategories();

const isLoading = computed(() => {
  return categoriesLoading.value;
});

// Fetch categories when user is available
watchUserAndFetchCategories(user, isLoggedIn, fetchCategories);

const isAddingCategory = ref(false);
const editingCategory = ref(null);

const newCategory = ref(getDefaultCategory());

const startAddCategory = () => {
  isAddingCategory.value = true;
  newCategory.value = getDefaultCategory();
};

const cancelAddCategory = () => {
  isAddingCategory.value = false;
  newCategory.value = getDefaultCategory();
};

const saveNewCategory = async () => {
  if (newCategory.value.name.trim()) {
    try {
      await createCategoryAPI(newCategory.value);
      toast.success("Category created", {
        description: `Category "${newCategory.value.name}" has been added.`,
      });
      cancelAddCategory();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }
};

const startEditCategory = (category) => {
  editingCategory.value = { ...category };
};

const cancelEditCategory = () => {
  editingCategory.value = null;
};

const saveEditCategory = async () => {
  if (editingCategory.value && editingCategory.value.name.trim()) {
    try {
      await updateCategoryAPI(editingCategory.value.id, {
        name: editingCategory.value.name,
        color: editingCategory.value.color,
        type: editingCategory.value.type,
      });
      editingCategory.value = null;
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }
};

const deleteCategory = async (categoryId) => {
  const confirmed = await confirm(
    "Delete Category",
    "Are you sure you want to delete this category? This action cannot be undone."
  );

  if (confirmed) {
    try {
      await deleteCategoryAPI(categoryId);
      toast.success("Category deleted", {
        description: "The category has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category", {
        description: "An error occurred while deleting the category.",
      });
    }
  }
};

const expenseCategories = computed(() =>
  (categories.value || []).filter((c) => c.type === "expense")
);
const incomeCategories = computed(() =>
  (categories.value || []).filter((c) => c.type === "income")
);

// Get user transactions (using dummy data for now)
const userTransactions = computed(() => {
  if (!user.value?.id) return [];
  return transactions; // Use dummy data
});

// Calculate category usage statistics
const categoryUsageStats = computed(() => {
  // Safe checks
  if (!categories.value || !Array.isArray(categories.value)) return [];
  if (!userTransactions.value || !Array.isArray(userTransactions.value))
    return [];

  const usageMap = {};
  const totalTransactions = userTransactions.value.length;

  // Initialize all user categories with 0 count
  categories.value.forEach((category) => {
    usageMap[category.id] = {
      id: category.id,
      name: category.name,
      color: category.color,
      type: category.type,
      count: 0,
      percentage: 0,
    };
  });

  // Count transactions per category
  userTransactions.value.forEach((transaction) => {
    if (usageMap[transaction.category_id]) {
      usageMap[transaction.category_id].count++;
    }
  });

  // Calculate percentages and convert to array
  const statsArray = Object.values(usageMap).map((stat) => ({
    ...stat,
    percentage:
      totalTransactions > 0 ? (stat.count / totalTransactions) * 100 : 0,
  }));

  // Sort by count (most used first) and filter out unused categories
  return statsArray
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.count - a.count);
});
</script>

<template>
  <AppLayout>
    <LoginPrompt
      v-if="!isLoggedIn"
      message="Please log in to edit and manage your spending categories."
    />
    <div class="space-y-6">
      <!-- Header -->
      <div
        v-if="isLoggedIn"
        class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 flex-1"
      >
        <Header
          title="Manage Categories"
          subtitle="Organize your transaction categories"
        />
      </div>

      <!-- Loading Skeleton -->
      <div v-if="isLoading">
        <CategoriesSkeleton />
      </div>

      <!-- Main Content when not loading -->
      <div v-else>
        <!-- Add New Category -->
        <div
          v-if="isLoggedIn"
          class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800 mb-6"
        >
          <div
            v-if="!isAddingCategory"
            class="flex items-center justify-between"
          >
            <h3 class="text-lg font-semibold text-gray-200">Categories</h3>
            <button
              @click="startAddCategory"
              class="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <!-- Add Category Form -->
          <div v-if="isAddingCategory" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-200">
              Add New Category
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Category Name -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Category Name</label
                >
                <input
                  v-model="newCategory.name"
                  type="text"
                  placeholder="Enter category name"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Category Type -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Type</label
                >
                <select
                  v-model="newCategory.type"
                  class="w-full cursor-pointer px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <!-- Category Color -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2"
                  >Color</label
                >
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in availableColors"
                    :key="color"
                    @click="newCategory.color = color"
                    :style="{ backgroundColor: color }"
                    :class="[
                      'w-8 h-8 cursor-pointer rounded-full border-2 transition-all',
                      newCategory.color === color
                        ? 'border-white scale-110'
                        : 'border-gray-600',
                    ]"
                  ></button>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button
                @click="saveNewCategory"
                class="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon class="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                @click="cancelAddCategory"
                class="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon class="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Expense Categories ------------------------------------------------------- -->
          <div
            v-if="isLoggedIn"
            class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3
              class="text-lg font-semibold text-gray-200 mb-4 flex items-center"
            >
              <TagIcon class="w-5 h-5 mr-2 text-red-400" />
              Expense Categories
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-if="expenseCategories.length > 0"
                v-for="category in expenseCategories"
                :key="category.id"
                class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <!-- Edit Mode -->
                <div
                  v-if="editingCategory && editingCategory.id === category.id"
                  class="space-y-3"
                >
                  <input
                    v-model="editingCategory.name"
                    type="text"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="color in availableColors"
                      :key="color"
                      @click="editingCategory.color = color"
                      :style="{ backgroundColor: color }"
                      :class="[
                        'w-6 h-6 cursor-pointer rounded-full border transition-all',
                        editingCategory.color === color
                          ? 'border-white scale-110'
                          : 'border-gray-600',
                      ]"
                    ></button>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="saveEditCategory"
                      class="flex items-center cursor-pointer space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon class="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      @click="cancelEditCategory"
                      class="flex items-center cursor-pointer space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      <XMarkIcon class="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                <!-- Display Mode -->
                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      :style="{ backgroundColor: category.color }"
                      class="w-4 h-4 rounded-full"
                    ></div>
                    <span class="text-gray-200 font-medium">{{
                      category.name
                    }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="startEditCategory(category)"
                      class="p-1 cursor-pointer text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteCategory(category.id)"
                      class="p-1 cursor-pointer text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="expenseCategories.length === 0"
              class="text-gray-400 text-center"
            >
              No categories found. Please add a category.
            </div>
          </div>

          <!-- Income Categories -->
          <div
            v-if="isLoggedIn"
            class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3
              class="text-lg font-semibold text-gray-200 mb-4 flex items-center"
            >
              <TagIcon class="w-5 h-5 mr-2 text-green-400" />
              Income Categories
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-if="incomeCategories.length > 0"
                v-for="category in incomeCategories"
                :key="category.id"
                class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <!-- Edit Mode -->
                <div
                  v-if="editingCategory && editingCategory.id === category.id"
                  class="space-y-3"
                >
                  <input
                    v-model="editingCategory.name"
                    type="text"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="color in availableColors"
                      :key="color"
                      @click="editingCategory.color = color"
                      :style="{ backgroundColor: color }"
                      :class="[
                        'w-6 h-6 rounded-full border transition-all',
                        editingCategory.color === color
                          ? 'border-white scale-110'
                          : 'border-gray-600',
                      ]"
                    ></button>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="saveEditCategory"
                      class="flex cursor-pointer items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon class="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      @click="cancelEditCategory"
                      class="flex cursor-pointer items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      <XMarkIcon class="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                <!-- Display Mode -->
                <div v-else class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      :style="{ backgroundColor: category.color }"
                      class="w-4 h-4 rounded-full"
                    ></div>
                    <span class="text-gray-200 font-medium">{{
                      category.name
                    }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="startEditCategory(category)"
                      class="p-1 cursor-pointer text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteCategory(category.id)"
                      class="p-1 cursor-pointer text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="incomeCategories.length === 0"
              class="text-gray-400 text-center"
            >
              No categories found. Please add a category.
            </div>
          </div>

          <!-- Usage Statistics -->
          <div
            v-if="isLoggedIn"
            class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3 class="text-lg font-semibold text-gray-200 mb-4">
              Category Usage
            </h3>

            <div
              v-if="categoryUsageStats.length === 0"
              class="text-center py-8"
            >
              <p class="text-gray-400">
                No transaction data available for category usage statistics.
              </p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="stat in categoryUsageStats"
                :key="stat.id"
                class="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  <div
                    :style="{ backgroundColor: stat.color }"
                    class="w-3 h-3 rounded-full"
                  ></div>
                  <span class="text-gray-300">{{ stat.name }}</span>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      stat.type === 'income'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400',
                    ]"
                  >
                    {{ stat.type }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-700 rounded-full h-2">
                    <div
                      :style="{
                        backgroundColor: stat.color,
                        width: `${Math.max(stat.percentage, 5)}%`,
                      }"
                      class="h-2 rounded-full transition-all duration-300"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-400 w-20 text-right">
                    {{ stat.count }} transaction{{
                      stat.count === 1 ? "" : "s"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close main content wrapper -->
    </div>
  </AppLayout>
</template>

<style scoped></style>
