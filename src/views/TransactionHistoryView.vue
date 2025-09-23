<script setup>
import AppLayout from "../components/AppLayout.vue";
import { ref, computed, onMounted } from "vue";
import {
  transactions,
  categoriesData,
  formatCurrency,
  getCategoryById,
} from "@/services/supabase/data";
import { useUserData } from "../services/composables/useData";
import { useAlert } from "@/services/composables/useAlert";
import Header from "../components/View/Header.vue";
import {
  FunnelIcon,
  XMarkIcon,
  CalendarDaysIcon,
  TagIcon,
  BanknotesIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const { userData, user, isLoggedIn } = useUserData();
const { confirmDelete } = useAlert();

// Filter states
const filters = ref({
  type: "all",
  category: "all",
  dateRange: "all", // 'all', 'today', 'week', 'month', 'custom'
  customDateFrom: "",
  customDateTo: "",
  minAmount: "",
  maxAmount: "",
  searchText: "",
});

const deleteTransaction = async (transactionId) => {
  const transaction = filteredTransactions.value.find(
    (t) => t.id === transactionId
  );

  const confirmed = await confirmDelete(
    "Delete Transaction",
    `Are you sure you want to delete this transaction: '${
      transaction?.description || "No description"
    }'? This action cannot be undone.`
  );

  if (confirmed) {
    console.log("Deleting transaction with ID:", transactionId);
    // TODO: Implement actual delete logic here
  }
};

const showFilters = ref(false);

// Get user's transactions
const userTransactions = computed(() => {
  if (!user.value?.id) return [];
  return transactions.filter((t) => t.user_id === user.value.id);
});

// Get user's categories
const userCategories = computed(() => {
  if (!user.value?.id) return [];
  return categoriesData.filter((c) => c.user_id === user.value.id);
});

// Filter transactions
const filteredTransactions = computed(() => {
  let result = [...userTransactions.value];

  // Filter by type
  if (filters.value.type !== "all") {
    result = result.filter((t) => t.type === filters.value.type);
  }

  // Filter by category
  if (filters.value.category !== "all") {
    result = result.filter(
      (t) => t.category_id === parseInt(filters.value.category)
    );
  }

  // Filter by date range
  if (filters.value.dateRange !== "all") {
    const today = new Date();
    const transactionDate = (t) => new Date(t.date);

    switch (filters.value.dateRange) {
      case "today":
        result = result.filter((t) => {
          const tDate = transactionDate(t);
          return tDate.toDateString() === today.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        result = result.filter((t) => transactionDate(t) >= weekAgo);
        break;
      case "month":
        const monthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        result = result.filter((t) => transactionDate(t) >= monthAgo);
        break;
      case "custom":
        if (filters.value.customDateFrom) {
          result = result.filter(
            (t) => transactionDate(t) >= new Date(filters.value.customDateFrom)
          );
        }
        if (filters.value.customDateTo) {
          result = result.filter(
            (t) => transactionDate(t) <= new Date(filters.value.customDateTo)
          );
        }
        break;
    }
  }

  // Filter by amount range
  if (filters.value.minAmount) {
    result = result.filter(
      (t) => t.amount >= parseInt(filters.value.minAmount)
    );
  }
  if (filters.value.maxAmount) {
    result = result.filter(
      (t) => t.amount <= parseInt(filters.value.maxAmount)
    );
  }

  // Filter by search text
  if (filters.value.searchText) {
    const searchLower = filters.value.searchText.toLowerCase();
    result = result.filter(
      (t) =>
        t.description?.toLowerCase().includes(searchLower) ||
        getCategoryById(t.category_id)?.name.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date (newest first)
  result.sort((a, b) => new Date(b.date) - new Date(a.date));

  return result;
});

// Clear all filters
const clearFilters = () => {
  filters.value = {
    type: "all",
    category: "all",
    dateRange: "all",
    customDateFrom: "",
    customDateTo: "",
    minAmount: "",
    maxAmount: "",
    searchText: "",
  };
};

// Summary statistics
const summary = computed(() => {
  const income = filteredTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
    count: filteredTransactions.value.length,
  };
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <Header
          title="Transaction History"
          subtitle="Review and manage your past transactions"
        />

        <!-- Toggle Filters Button -->
        <button
          @click="showFilters = !showFilters"
          class="w-32 ms-auto mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FunnelIcon class="w-4 h-4" />
          <span>Filters</span>
          <ChevronDownIcon
            :class="[
              'w-4 h-4 transition-transform',
              showFilters ? 'rotate-180' : '',
            ]"
          />
        </button>
      </div>

      <!-- Filters Panel -->
      <div
        v-if="showFilters"
        class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-200">
            Filter Transactions
          </h3>
          <div class="flex gap-2">
            <button
              @click="clearFilters"
              class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
            <button
              @click="showFilters = false"
              class="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="lg:col-span-3">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <MagnifyingGlassIcon class="w-4 h-4 inline mr-1" />
              Search
            </label>
            <input
              v-model="filters.searchText"
              type="text"
              placeholder="Search by description or category..."
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Transaction Type -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <BanknotesIcon class="w-4 h-4 inline mr-1" />
              Transaction Type
            </label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <TagIcon class="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option
                v-for="category in userCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }} ({{ category.type }})
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <CalendarDaysIcon class="w-4 h-4 inline mr-1" />
              Date Range
            </label>
            <select
              v-model="filters.dateRange"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <!-- Custom Date Range -->
          <div v-if="filters.dateRange === 'custom'" class="lg:col-span-2">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs text-gray-400 mb-1">From</label>
                <input
                  v-model="filters.customDateFrom"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">To</label>
                <input
                  v-model="filters.customDateTo"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Amount Range -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Amount Range (Rp)</label
            >
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs text-gray-400 mb-1">Minimum</label>
                <input
                  v-model="filters.minAmount"
                  type="number"
                  placeholder="0"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-400 mb-1">Maximum</label>
                <input
                  v-model="filters.maxAmount"
                  type="number"
                  placeholder="No limit"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div v-if="isLoggedIn" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div class="text-sm text-gray-400 mb-1">Total Transactions</div>
          <div class="text-2xl font-bold text-white">{{ summary.count }}</div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div class="text-sm text-gray-400 mb-1">Total Income</div>
          <div class="text-2xl font-bold text-green-400">
            +{{ formatCurrency(summary.income) }}
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div class="text-sm text-gray-400 mb-1">Total Expense</div>
          <div class="text-2xl font-bold text-red-400">
            -{{ formatCurrency(summary.expense) }}
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div class="text-sm text-gray-400 mb-1">Net Balance</div>
          <div
            :class="[
              'text-2xl font-bold',
              summary.balance >= 0 ? 'text-green-400' : 'text-red-400',
            ]"
          >
            {{ summary.balance >= 0 ? "+" : ""
            }}{{ formatCurrency(summary.balance) }}
          </div>
        </div>
      </div>

      <!-- Transaction List -->
      <div
        v-if="!isLoggedIn"
        class="bg-gray-900 rounded-lg p-8 text-center border border-gray-800"
      >
        <div class="text-gray-400 text-lg">
          Please log in to view your transaction history.
        </div>
      </div>

      <div
        v-else-if="filteredTransactions.length === 0"
        class="bg-gray-900 rounded-lg p-8 text-center border border-gray-800"
      >
        <div class="text-gray-400 text-lg">
          No transactions found matching your filters.
        </div>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(transaction, index) in filteredTransactions"
          :key="transaction.id"
          class="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
        >
          <div class="flex items-center justify-between">
            <!-- Left side - Transaction Info -->
            <div class="flex items-center space-x-4">
              <!-- Category Color Indicator -->
              <div
                :style="{
                  backgroundColor:
                    getCategoryById(transaction.category_id)?.color ||
                    '#6b7280',
                }"
                class="w-3 h-12 rounded-full flex-shrink-0"
              ></div>

              <!-- Transaction Details -->
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-lg font-semibold text-gray-200 mb-1">
                    {{ transaction.description || "No description" }}
                  </h3>
                  <PencilIcon
                    class="w-4 h-4 inline mr-3 text-gray-300 cursor-pointer hover:text-gray-400"
                  />
                  <button @click="deleteTransaction(transaction.id)">
                    <TrashIcon
                      class="w-4 h-4 inline text-red-500 hover:text-red-700 cursor-pointer"
                    />
                  </button>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                  <span class="flex items-center">
                    <CalendarDaysIcon class="w-4 h-4 mr-1" />
                    {{
                      new Date(transaction.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }}
                  </span>
                  <span class="flex items-center">
                    <TagIcon class="w-4 h-4 mr-1" />
                    {{
                      getCategoryById(transaction.category_id)?.name ||
                      "Unknown Category"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right side - Amount -->
            <div class="text-right">
              <div
                :class="[
                  'text-xl font-bold',
                  transaction.type === 'income'
                    ? 'text-green-400'
                    : 'text-red-400',
                ]"
              >
                {{ transaction.type === "income" ? "+" : "-" }}
                {{ formatCurrency(transaction.amount) }}
              </div>
              <div class="text-sm text-gray-400 capitalize">
                {{ transaction.type }}
              </div>
            </div>
          </div>

          <!-- Separator line (except for last item) -->
          <div
            v-if="index < filteredTransactions.length - 1"
            class="mt-4 border-b border-gray-800"
          ></div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
