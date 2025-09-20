<script setup>
import AppLayout from "../components/AppLayout.vue";
import { ref, computed } from "vue";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const categories = ref([
  { id: 1, name: "Food & Dining", color: "#ef4444", type: "expense" },
  { id: 2, name: "Transportation", color: "#3b82f6", type: "expense" },
  { id: 3, name: "Shopping", color: "#8b5cf6", type: "expense" },
  { id: 4, name: "Entertainment", color: "#f59e0b", type: "expense" },
  { id: 5, name: "Bills & Utilities", color: "#10b981", type: "expense" },
  { id: 6, name: "Healthcare", color: "#06b6d4", type: "expense" },
  { id: 7, name: "Salary", color: "#22c55e", type: "income" },
  { id: 8, name: "Freelance", color: "#84cc16", type: "income" },
  { id: 9, name: "Investment", color: "#6366f1", type: "income" },
]);

const isAddingCategory = ref(false);
const editingCategory = ref(null);

const newCategory = ref({
  name: "",
  color: "#3b82f6",
  type: "expense",
});

const availableColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const startAddCategory = () => {
  isAddingCategory.value = true;
  newCategory.value = {
    name: "",
    color: "#3b82f6",
    type: "expense",
  };
};

const cancelAddCategory = () => {
  isAddingCategory.value = false;
  newCategory.value = {
    name: "",
    color: "#3b82f6",
    type: "expense",
  };
};

const saveNewCategory = () => {
  if (newCategory.value.name.trim()) {
    const id = Math.max(...categories.value.map((c) => c.id)) + 1;
    categories.value.push({
      id,
      ...newCategory.value,
    });
    cancelAddCategory();
  }
};

const startEditCategory = (category) => {
  editingCategory.value = { ...category };
};

const cancelEditCategory = () => {
  editingCategory.value = null;
};

const saveEditCategory = () => {
  if (editingCategory.value && editingCategory.value.name.trim()) {
    const index = categories.value.findIndex(
      (c) => c.id === editingCategory.value.id
    );
    if (index !== -1) {
      categories.value[index] = { ...editingCategory.value };
    }
    editingCategory.value = null;
  }
};

const deleteCategory = (categoryId) => {
  if (
    confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    )
  ) {
    categories.value = categories.value.filter((c) => c.id !== categoryId);
  }
};

const expenseCategories = computed(() =>
  categories.value.filter((c) => c.type === "expense")
);
const incomeCategories = computed(() =>
  categories.value.filter((c) => c.type === "income")
);
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Manage Categories</h1>
        <p class="text-gray-400">Organize your transaction categories</p>
      </div>

      <!-- Add New Category -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <div v-if="!isAddingCategory" class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-200">Categories</h3>
          <button
            @click="startAddCategory"
            class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <!-- Add Category Form -->
        <div v-if="isAddingCategory" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-200">Add New Category</h3>

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
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    'w-8 h-8 rounded-full border-2 transition-all',
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
              class="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckIcon class="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              @click="cancelAddCategory"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Expense Categories -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 class="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <TagIcon class="w-5 h-5 mr-2 text-red-400" />
          Expense Categories
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
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
                  class="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  <CheckIcon class="w-3 h-3" />
                  <span>Save</span>
                </button>
                <button
                  @click="cancelEditCategory"
                  class="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
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
                  class="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Income Categories -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 class="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <TagIcon class="w-5 h-5 mr-2 text-green-400" />
          Income Categories
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
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
                  class="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  <CheckIcon class="w-3 h-3" />
                  <span>Save</span>
                </button>
                <button
                  @click="cancelEditCategory"
                  class="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
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
                  class="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Statistics -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 class="text-lg font-semibold text-gray-200 mb-4">Category Usage</h3>
        <div class="space-y-3">
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <span class="text-gray-300">Food & Dining</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-700 rounded-full h-2">
                <div
                  class="bg-red-500 h-2 rounded-full"
                  style="width: 80%"
                ></div>
              </div>
              <span class="text-sm text-gray-400">24 transactions</span>
            </div>
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <span class="text-gray-300">Transportation</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  style="width: 60%"
                ></div>
              </div>
              <span class="text-sm text-gray-400">18 transactions</span>
            </div>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-300">Salary</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  style="width: 40%"
                ></div>
              </div>
              <span class="text-sm text-gray-400">12 transactions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
