<script setup>
import AppLayout from "../components/AppLayout.vue";
import LoginPrompt from "../components/ui/LoginPrompt.vue";
import EditTransactionModal from "../components/modal/editTransactionModal.vue";
import { ref, computed } from "vue";
import { formatCurrency } from "@/services/supabase/data";
import { useUserData } from "../composables/useData";
import { useAlert } from "@/composables/useAlert";
import { useTransactions } from "@/composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { watchUserAndFetchAll } from "@/constants/watchers";
import { DEFAULT_FILTERS } from "@/constants/forms";
import Header from "../components/View/Header.vue";
import SummarySkeleton from "../components/ui/SummarySkeleton.vue";
import TransactionListSkeleton from "../components/ui/TransactionListSkeleton.vue";
import { formatRelativeDate } from "@/utils/helpers";
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
const {
  categories,
  fetchCategories,
  loading: transactionLoading,
} = useCategories();
const {
  transactions: userTransactions,
  fetchTransactions,
  deleteTransaction: deleteTransactionAPI,
  loading: transactionsLoading,
} = useTransactions();

// Fetch transactions and categories when user is available
watchUserAndFetchAll(user, isLoggedIn, fetchCategories, fetchTransactions);

// Filter states
const filters = ref({ ...DEFAULT_FILTERS });

const deleteTransactionAction = async (transactionId) => {
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
    try {
      await deleteTransactionAPI(transactionId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }
};

const showFilters = ref(false);

// Edit modal state
const showEditModal = ref(false);
const editingTransactionId = ref(null);

// Edit transaction function
const editTransaction = (transactionId) => {
  editingTransactionId.value = transactionId;
  showEditModal.value = true;
};

// Handle modal close
const closeEditModal = () => {
  showEditModal.value = false;
  editingTransactionId.value = null;
};

// Handle transaction updated
const handleTransactionUpdated = () => {
  // Refresh data di background tanpa menutup modal (modal akan close sendiri)
  fetchTransactions({ forceRefresh: true });
};

// Loading state
const isLoading = computed(() => {
  return transactionLoading.value || transactionsLoading.value;
});

// Get user's categories
const userCategories = computed(() => {
  if (!user.value?.id || !categories.value) return [];
  return categories.value;
});

// Helper function to get category by ID using real data
const getCategoryByIdFromRealData = (categoryId) => {
  const category = categories.value?.find((c) => c.id === categoryId);
  return category;
};

// Filter transactions
const filteredTransactions = computed(() => {
  let result = [...(userTransactions.value || [])];

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
    result = result.filter((t) => {
      const category = getCategoryByIdFromRealData(t.category_id);

      return (
        t.description?.toLowerCase().includes(searchLower) ||
        category?.name.toLowerCase().includes(searchLower)
      );
    });
  }

  // Sort by date (newest first)
  result.sort((a, b) => new Date(b.date) - new Date(a.date));

  return result;
});

// Clear all filters
const clearFilters = () => {
  filters.value = { ...DEFAULT_FILTERS };
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
      <div
        v-if="isLoggedIn"
        class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 flex-1"
      >
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <Header
            title="Transaction History"
            subtitle="Review and manage your past transactions"
          />

          <!-- Toggle Filters Button -->
          <button
            v-if="isLoading"
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
      </div>

      <!-- Filters Panel -->
      <div
        v-if="showFilters"
        class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800"
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
      <div v-if="isLoggedIn">
        <!-- Loading Skeleton for Summary -->
        <SummarySkeleton v-if="isLoading" :count="4" />

        <!-- Real Summary Statistics -->
        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Transactions -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-default"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Total Transactions
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    {{ summary.count }}
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30"
                >
                  <BanknotesIcon class="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- Total Income -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-default"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Total Income
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                  >
                    +{{ formatCurrency(summary.income) }}
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30"
                >
                  <svg
                    class="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Expense -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-default"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Total Expense
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    -{{ formatCurrency(summary.expense) }}
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-400/30"
                >
                  <svg
                    class="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Net Balance -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-default"
          >
            <!-- Card Background Glow -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                summary.balance >= 0
                  ? 'bg-gradient-to-br from-emerald-600/10 to-transparent'
                  : 'bg-gradient-to-br from-red-600/10 to-transparent',
              ]"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Net Balance
                  </p>
                  <p
                    :class="[
                      'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                      summary.balance >= 0
                        ? 'from-emerald-400 to-cyan-400'
                        : 'from-red-400 to-pink-400',
                    ]"
                  >
                    {{ summary.balance >= 0 ? "+" : ""
                    }}{{ formatCurrency(summary.balance) }}
                  </p>
                </div>
                <div
                  :class="[
                    'p-3 rounded-xl border',
                    summary.balance >= 0
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/30'
                      : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/30',
                  ]"
                >
                  <svg
                    :class="[
                      'w-6 h-6',
                      summary.balance >= 0
                        ? 'text-emerald-400'
                        : 'text-red-400',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction List -->
      <LoginPrompt
        v-if="!isLoggedIn"
        message="Please log in to view and manage your transaction history."
      />

      <!-- Loading Skeleton for Transactions -->
      <TransactionListSkeleton v-else-if="isLoading" :count="5" />

      <div
        v-else-if="filteredTransactions.length === 0"
        class="bg-white/5 rounded-lg p-8 text-center border border-gray-800"
      >
        <div class="text-gray-400 text-lg">
          No transactions found matching your filters.
        </div>
        <button
          @click="clearFilters"
          class="mt-4 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(transaction, index) in filteredTransactions"
          :key="transaction.id"
          class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
        >
          <!-- Background Glow Effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <div class="relative flex items-center justify-between">
            <!-- Left side - Transaction Info -->
            <div class="flex items-center space-x-4 flex-1 min-w-0">
              <!-- Category Color Indicator with Icon -->
              <div
                :style="{
                  backgroundColor:
                    getCategoryByIdFromRealData(transaction.category_id)
                      ?.color || '#6b7280',
                }"
                class="w-3 h-15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
              ></div>

              <!-- Transaction Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-white truncate pr-4">
                    {{ transaction.description || "No description" }}
                  </h3>

                  <!-- Action Buttons - Modern Floating Style -->
                  <div
                    class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                  >
                    <!-- Edit Button -->
                    <button
                      type="button"
                      @click="editTransaction(transaction.id)"
                      class="flex items-center justify-center w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 hover:scale-110"
                      title="Edit Transaction"
                    >
                      <PencilIcon class="w-4 h-4 text-blue-400" />
                    </button>

                    <!-- Delete Button -->
                    <button
                      type="button"
                      @click="deleteTransactionAction(transaction.id)"
                      class="flex items-center justify-center w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-200 hover:scale-110"
                      title="Delete Transaction"
                    >
                      <TrashIcon class="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div class="flex items-center space-x-4 text-sm text-gray-400">
                  <span class="flex items-center">
                    <CalendarDaysIcon class="w-4 h-4 mr-1.5" />
                    {{ formatRelativeDate(transaction.date) }}
                  </span>
                  <span class="flex items-center">
                    <TagIcon class="w-4 h-4 mr-1.5" />
                    {{
                      getCategoryByIdFromRealData(transaction.category_id)
                        ?.name || "Unknown Category"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right side - Amount -->
            <div class="text-right flex-shrink-0 ml-4">
              <div
                :class="[
                  'text-xl font-bold mb-1',
                  transaction.type === 'income'
                    ? 'text-green-400'
                    : 'text-red-400',
                ]"
              >
                {{ transaction.type === "income" ? "+" : "-" }}
                {{ formatCurrency(transaction.amount) }}
              </div>
              <div
                :class="[
                  'text-sm font-medium capitalize px-2 py-1 rounded-full',
                  transaction.type === 'income'
                    ? 'text-green-300 bg-green-500/10'
                    : 'text-red-300 bg-red-500/10',
                ]"
              >
                {{ transaction.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Transaction Modal -->
    <EditTransactionModal
      :is-open="showEditModal"
      :transaction-id="editingTransactionId"
      @close="closeEditModal"
      @updated="handleTransactionUpdated"
    />
  </AppLayout>
</template>
