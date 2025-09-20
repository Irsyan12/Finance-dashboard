<script setup>
import AppLayout from "../components/AppLayout.vue";
import { ref } from "vue";
import {
  PlusIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const form = ref({
  amount: "",
  description: "",
  category: "",
  type: "expense", // 'expense' or 'income'
  date: new Date().toISOString().split("T")[0],
});

const categories = ref([
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
]);

const isSubmitting = ref(false);

const submitTransaction = async () => {
  isSubmitting.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Transaction submitted:", form.value);

  // Reset form
  form.value = {
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  };

  isSubmitting.value = false;

  // Show success message (you can add a toast notification here)
  alert("Transaction added successfully!");
};

const clearForm = () => {
  form.value = {
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  };
};
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Add Transaction</h1>
        <p class="text-gray-400">Record a new income or expense transaction</p>
      </div>

      <!-- Form Card -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <form @submit.prevent="submitTransaction" class="space-y-6">
          <!-- Transaction Type -->
          <div>
            <label class="block text-sm font-medium text-gray-200 mb-3">
              Transaction Type
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.type"
                  type="radio"
                  value="expense"
                  class="text-red-500 bg-gray-800 border-gray-600 focus:ring-red-500 focus:ring-2"
                />
                <span class="ml-2 text-gray-300">Expense</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.type"
                  type="radio"
                  value="income"
                  class="text-green-500 bg-gray-800 border-gray-600 focus:ring-green-500 focus:ring-2"
                />
                <span class="ml-2 text-gray-300">Income</span>
              </label>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label
              for="amount"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              <CurrencyDollarIcon class="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <input
              id="amount"
              v-model="form.amount"
              type="number"
              step="0.01"
              required
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              Description
            </label>
            <input
              id="description"
              v-model="form.description"
              type="text"
              required
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          </div>

          <!-- Category -->
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              <TagIcon class="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Select a category</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label
              for="date"
              class="block text-sm font-medium text-gray-200 mb-2"
            >
              <CalendarIcon class="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              id="date"
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Actions -->
          <div class="flex space-x-4 pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon v-if="!isSubmitting" class="w-4 h-4 mr-2" />
              <div
                v-if="isSubmitting"
                class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              {{ isSubmitting ? "Adding..." : "Add Transaction" }}
            </button>

            <button
              type="button"
              @click="clearForm"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              <XMarkIcon class="w-4 h-4 mr-2 inline" />
              Clear
            </button>
          </div>
        </form>
      </div>

      <!-- Recent Transactions Preview -->
      <div
        class="mt-8 bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
      >
        <h3 class="text-lg font-semibold text-gray-200 mb-4">
          Recent Transactions
        </h3>
        <div class="space-y-3">
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <div>
              <p class="font-medium text-gray-200">Grocery Shopping</p>
              <p class="text-sm text-gray-500">
                Today, 2:30 PM • Food & Dining
              </p>
            </div>
            <span class="text-red-400 font-semibold">-$125.50</span>
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <div>
              <p class="font-medium text-gray-200">Salary Deposit</p>
              <p class="text-sm text-gray-500">Yesterday, 9:00 AM • Income</p>
            </div>
            <span class="text-green-400 font-semibold">+$4,200.00</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="font-medium text-gray-200">Coffee Shop</p>
              <p class="text-sm text-gray-500">
                2 days ago, 8:15 AM • Food & Dining
              </p>
            </div>
            <span class="text-red-400 font-semibold">-$4.50</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
