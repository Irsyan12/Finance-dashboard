<script setup>
import AppLayout from "../components/AppLayout.vue";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useUserData } from "../composables/useData";
import { useTransactions } from "../composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { watchUserAndFetchAll } from "@/constants/watchers";
import { formatCurrency } from "@/services/supabase/data";
import {
  formatRelativeDate,
  getCategoryByIdFromRealData,
} from "@/utils/helpers";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/vue/24/outline";

const { userData, isLoggedIn, user } = useUserData();
const {
  transactions,
  fetchTransactions,
  balance,
  loading: transactionsLoading,
} = useTransactions();
const {
  categories,
  fetchCategories,
  loading: categoriesLoading,
} = useCategories();

const auth = useAuthStore();
auth.fetchUser();

// Fetch data when user is available
watchUserAndFetchAll(user, isLoggedIn, fetchCategories, fetchTransactions);

// Loading state
const isLoading = computed(() => {
  return categoriesLoading.value || transactionsLoading.value || !user.value;
});

// Get current month transactions for comparison
const currentMonthTransactions = computed(() => {
  if (!transactions.value?.length) return [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return transactions.value.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startOfMonth;
  });
});

// Get previous month transactions for comparison
const previousMonthTransactions = computed(() => {
  if (!transactions.value?.length) return [];

  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return transactions.value.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate >= startOfPrevMonth && transactionDate <= endOfPrevMonth
    );
  });
});

// Monthly calculations
const monthlyIncome = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const monthlyExpenses = computed(() => {
  return currentMonthTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const previousMonthIncome = computed(() => {
  return previousMonthTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const previousMonthExpenses = computed(() => {
  return previousMonthTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

// Percentage changes
const incomeChange = computed(() => {
  if (previousMonthIncome.value === 0) return monthlyIncome.value > 0 ? 100 : 0;
  return (
    ((monthlyIncome.value - previousMonthIncome.value) /
      previousMonthIncome.value) *
    100
  ).toFixed(1);
});

const expenseChange = computed(() => {
  if (previousMonthExpenses.value === 0)
    return monthlyExpenses.value > 0 ? 100 : 0;
  return (
    ((monthlyExpenses.value - previousMonthExpenses.value) /
      previousMonthExpenses.value) *
    100
  ).toFixed(1);
});

const balanceChange = computed(() => {
  const currentBalance = monthlyIncome.value - monthlyExpenses.value;
  const previousBalance =
    previousMonthIncome.value - previousMonthExpenses.value;

  if (previousBalance === 0) return currentBalance > 0 ? 100 : 0;
  return (
    ((currentBalance - previousBalance) / Math.abs(previousBalance)) *
    100
  ).toFixed(1);
});

// Recent transactions (last 5)
const recentTransactions = computed(() => {
  if (!transactions.value?.length) return [];

  return transactions.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// Helper to format percentage change
const formatPercentageChange = (change) => {
  const num = parseFloat(change);
  if (num > 0) return `+${change}%`;
  if (num < 0) return `${change}%`;
  return "Same as last month";
};
</script>

<template>
  <AppLayout>
    <!-- Main Dashboard Content -->
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <div v-if="isLoggedIn">
          <h1 class="text-3xl font-bold text-white mb-2">
            Welcome back, {{ userData?.full_name }}!
          </h1>
          <p class="text-gray-400">
            Here's what's happening with your finances today.
          </p>
        </div>
        <div v-else>
          <h1 class="text-2xl font-bold text-white">
            Please log in to access your dashboard.
          </h1>
        </div>
      </div>

      <!-- Dashboard Content Grid -->
      <div
        v-if="isLoggedIn && !isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <!-- Total Balance Card -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-200">Total Balance</h3>
            <div class="p-2 bg-blue-900/20 rounded-full">
              <CurrencyDollarIcon class="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-blue-400">
            {{ formatCurrency(balance) }}
          </p>
          <div class="flex items-center mt-2">
            <ArrowTrendingUpIcon
              v-if="parseFloat(balanceChange) > 0"
              class="w-4 h-4 text-green-400 mr-1"
            />
            <ArrowTrendingDownIcon
              v-else-if="parseFloat(balanceChange) < 0"
              class="w-4 h-4 text-red-400 mr-1"
            />
            <p class="text-sm text-gray-500">
              {{ formatPercentageChange(balanceChange) }} from last month
            </p>
          </div>
        </div>

        <!-- Monthly Expenses Card -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-200">
              Monthly Expenses
            </h3>
            <div class="p-2 bg-red-900/20 rounded-full">
              <ArrowDownIcon class="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-red-400">
            {{ formatCurrency(monthlyExpenses) }}
          </p>
          <div class="flex items-center mt-2">
            <ArrowTrendingUpIcon
              v-if="parseFloat(expenseChange) > 0"
              class="w-4 h-4 text-red-400 mr-1"
            />
            <ArrowTrendingDownIcon
              v-else-if="parseFloat(expenseChange) < 0"
              class="w-4 h-4 text-green-400 mr-1"
            />
            <p class="text-sm text-gray-500">
              {{ formatPercentageChange(expenseChange) }} from last month
            </p>
          </div>
        </div>

        <!-- Monthly Income Card -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-200">Monthly Income</h3>
            <div class="p-2 bg-green-900/20 rounded-full">
              <ArrowUpIcon class="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-green-400">
            {{ formatCurrency(monthlyIncome) }}
          </p>
          <div class="flex items-center mt-2">
            <ArrowTrendingUpIcon
              v-if="parseFloat(incomeChange) > 0"
              class="w-4 h-4 text-green-400 mr-1"
            />
            <ArrowTrendingDownIcon
              v-else-if="parseFloat(incomeChange) < 0"
              class="w-4 h-4 text-red-400 mr-1"
            />
            <p class="text-sm text-gray-500">
              {{ formatPercentageChange(incomeChange) }} from last month
            </p>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton for Dashboard Cards -->
      <div
        v-if="isLoggedIn && isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 animate-pulse"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="h-4 bg-gray-700 rounded w-32"></div>
            <div class="w-9 h-9 bg-gray-700 rounded-full"></div>
          </div>
          <div class="h-8 bg-gray-700 rounded w-40 mb-2"></div>
          <div class="h-3 bg-gray-700 rounded w-28"></div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div
        v-if="isLoggedIn && !isLoading"
        class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-200">
            Recent Transactions
          </h3>
          <router-link
            to="/history"
            class="text-blue-400 hover:text-blue-500 text-sm"
          >
            View All
          </router-link>
        </div>

        <!-- Transactions List -->
        <div v-if="recentTransactions.length > 0" class="space-y-3">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'p-2 rounded-full',
                  transaction.type === 'income'
                    ? 'bg-green-900/20'
                    : 'bg-red-900/20',
                ]"
              >
                <ArrowUpIcon
                  v-if="transaction.type === 'income'"
                  class="w-4 h-4 text-green-400"
                />
                <ArrowDownIcon v-else class="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p class="font-medium text-gray-200">
                  {{ transaction.description }}
                </p>
                <p class="text-sm text-gray-500">
                  {{
                    getCategoryByIdFromRealData(
                      transaction.category_id,
                      categories
                    ) || "Unknown Category"
                  }}
                  • {{ formatRelativeDate(transaction.date) }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'font-semibold',
                transaction.type === 'income'
                  ? 'text-green-400'
                  : 'text-red-400',
              ]"
            >
              {{ transaction.type === "income" ? "+" : "-"
              }}{{ formatCurrency(transaction.amount) }}
            </span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 text-gray-500">
          <ChartBarIcon class="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p class="text-lg mb-1">No transactions yet</p>
          <p class="text-sm">Start by adding your first transaction</p>
          <router-link
            to="/addtransaction"
            class="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Transaction
          </router-link>
        </div>
      </div>

      <!-- Loading Skeleton for Recent Transactions -->
      <div
        v-if="isLoggedIn && isLoading"
        class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 animate-pulse"
      >
        <div class="h-5 bg-gray-700 rounded w-40 mb-4"></div>
        <div class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="flex justify-between items-center py-3"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div>
                <div class="h-4 bg-gray-700 rounded w-32 mb-1"></div>
                <div class="h-3 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
            <div class="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Additional styling if needed */
</style>
