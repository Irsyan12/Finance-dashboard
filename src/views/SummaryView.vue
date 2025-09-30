<script setup>
import AppLayout from "../components/AppLayout.vue";
import { ref, computed, watch } from "vue";
import Header from "../components/View/Header.vue";
import { useTransactions } from "@/composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { watchUserAndFetchAll } from "@/constants/watchers";
import SummarySkeleton from "../components/ui/SummarySkeleton.vue";
import { formatRelativeDate } from "@/utils/helpers";
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import { formatCurrency } from "@/services/supabase/data";
import { useUserData } from "../composables/useData";

const { user, isLoggedIn } = useUserData();
const {
  categories,
  fetchCategories,
  loading: categoriesLoading,
} = useCategories();
const {
  transactions: userTransactions,
  fetchTransactions,
  recentTransactions,
  loading: transactionsLoading,
} = useTransactions();

// Fetch data when user is available
watchUserAndFetchAll(user, isLoggedIn, fetchCategories, fetchTransactions);

// Loading state
const isLoading = computed(() => {
  return categoriesLoading.value || transactionsLoading.value || !user.value;
});

const selectedPeriod = ref("all");

// Helper function to filter transactions by period
const filterTransactionsByPeriod = (transactions, period) => {
  if (!transactions || !transactions.length) return [];

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);

    switch (period) {
      case "all":
        return true;

      case "week": {
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        return transactionDate >= startOfWeek;
      }

      case "month": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactionDate >= startOfMonth;
      }

      case "quarter": {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const startOfQuarter = new Date(
          now.getFullYear(),
          currentQuarter * 3,
          1
        );
        return transactionDate >= startOfQuarter;
      }

      case "year": {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return transactionDate >= startOfYear;
      }

      default:
        return true;
    }
  });
};

// Filtered transactions based on selected period
const filteredTransactions = computed(() => {
  return filterTransactionsByPeriod(
    userTransactions.value,
    selectedPeriod.value
  );
});

// Helper function to get category by ID using real data
const getCategoryByIdFromRealData = (categoryId) => {
  return categories.value?.find((c) => c.id === categoryId);
};

// Computed values - Updated to use filtered transactions
const totalIncome = computed(() => {
  if (!filteredTransactions.value.length) return 0;
  return filteredTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const totalExpenses = computed(() => {
  if (!filteredTransactions.value.length) return 0;
  return filteredTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const balance = computed(() => totalIncome.value - totalExpenses.value);

const expensesByCategory = computed(() => {
  if (!filteredTransactions.value.length || !categories.value) return [];
  const categoryTotals = {};

  filteredTransactions.value
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const category = getCategoryByIdFromRealData(t.category_id);
      const categoryName = category?.name || "Unknown Category";


      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + (t.amount || 0);
    });
  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const incomeByCategory = computed(() => {
  if (!filteredTransactions.value.length || !categories.value) return [];
  const categoryTotals = {};

  filteredTransactions.value
    .filter((t) => t.type === "income")
    .forEach((t) => {
      const category = getCategoryByIdFromRealData(t.category_id);
      const categoryName = category?.name || "Unknown Category";

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) + (t.amount || 0);
    });
  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return ((balance.value / totalIncome.value) * 100).toFixed(1);
});

// Recent transactions from filtered data
const recentFilteredTransactions = computed(() => {
  return filteredTransactions.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

// Helper to get period display name
const getPeriodDisplayName = (period) => {
  const names = {
    all: "All Time",
    week: "This Week",
    month: "This Month",
    quarter: "This Quarter",
    year: "This Year",
  };
  return names[period] || period;
};
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <Header
          title="Financial Summary"
          :subtitle="`Overview of your finances - ${getPeriodDisplayName(
            selectedPeriod
          )}`"
        />

        <!-- Period Selector -->
        <div class="flex items-center space-x-2">
          <CalendarIcon class="w-5 h-5 text-gray-400" />
          <select
            v-model="selectedPeriod"
            class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-0 text-sm sm:text-base"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <!-- Loading Skeleton -->
      <SummarySkeleton v-if="isLoading" />
      <div v-else>
        <!-- Summary Cards -->
        <div v-if="isLoggedIn" class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Income -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Total Income</p>
                <p class="text-xl font-bold text-green-400">
                  {{ formatCurrency(totalIncome) }}
                </p>
              </div>
              <div class="p-3 bg-green-900/20 rounded-full">
                <ArrowUpIcon class="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <!-- Total Expenses -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Total Expenses</p>
                <p class="text-xl font-bold text-red-400">
                  {{ formatCurrency(totalExpenses) }}
                </p>
              </div>
              <div class="p-3 bg-red-900/20 rounded-full">
                <ArrowDownIcon class="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <!-- Net Balance -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Net Balance</p>
                <p
                  class="text-xl font-bold"
                  :class="balance >= 0 ? 'text-blue-400' : 'text-red-400'"
                >
                  <span>{{ formatCurrency(balance) }}</span>
                </p>
              </div>
              <div class="p-3 bg-blue-900/20 rounded-full">
                <CurrencyDollarIcon class="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <!-- Savings Rate -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-400 mb-1">Savings Rate</p>
                <p class="text-xl font-bold text-purple-400">
                  {{ savingsRate }}%
                </p>
              </div>
              <div class="p-3 bg-purple-900/20 rounded-full">
                <ChartBarIcon class="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Breakdowns -->
        <div
          v-if="isLoggedIn"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
        >
          <!-- Expenses by Category -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3 class="text-lg font-semibold text-gray-200 mb-4">
              Expenses by Category
            </h3>
            <div class="space-y-3">
              <div
                v-for="category in expensesByCategory"
                :key="category.name"
                class="flex items-center justify-between"
              >
                <span class="text-gray-300">{{ category.name }}</span>
                <div class="flex items-center space-x-3">
                  <div class="flex-1 bg-gray-700 rounded-full h-2 w-24">
                    <div
                      class="bg-red-400 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${(category.amount / totalExpenses) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-red-400 font-semibold md w-14 md:w-27 text-right"
                    >{{ formatCurrency(category.amount) }}</span
                  >
                </div>
              </div>
            </div>
            <div
              v-if="expensesByCategory.length === 0"
              class="text-center py-3 text-gray-500"
            >
              <p>No expenses recorded for this period.</p>
            </div>
          </div>

          <!-- Income by Category -->
          <div
            class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
          >
            <h3 class="text-lg font-semibold text-gray-200 mb-4">
              Income by Category
            </h3>
            <div class="space-y-3">
              <div
                v-for="category in incomeByCategory"
                :key="category.name"
                class="flex items-center justify-between"
              >
                <span class="text-gray-300">{{ category.name }}</span>
                <div class="flex items-center space-x-5">
                  <div class="flex-1 bg-gray-700 rounded-full h-2 w-24">
                    <div
                      class="bg-green-400 h-2 rounded-full transition-all duration-300"
                      :style="{
                        width: `${(category.amount / totalIncome) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-green-400 font-semibold w-14 md:w-27 text-right"
                  >
                    <span>{{ formatCurrency(category.amount) }}</span></span
                  >
                </div>
              </div>
              <div
              v-if="incomeByCategory.length === 0"
              class="text-center py-3 text-gray-500"
            >
              <p>No expenses recorded for this period.</p>
            </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div
          v-if="isLoggedIn"
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 mt-6"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-4">
            Recent Transactions ({{ getPeriodDisplayName(selectedPeriod) }})
          </h3>
          <div class="space-y-3">
            <div
              v-for="transaction in recentFilteredTransactions"
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
                      getCategoryByIdFromRealData(transaction.category_id)
                        ?.name || "Unknown Category"
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

            <!-- Empty state for no transactions -->
            <div
              v-if="recentFilteredTransactions.length === 0"
              class="text-center py-8 text-gray-500"
            >
              <p>
                No transactions found for
                {{ getPeriodDisplayName(selectedPeriod).toLowerCase() }}
              </p>
              <p class="text-sm mt-1">
                Try selecting a different period or add some transactions
              </p>
            </div>

            <router-link
              v-if="recentFilteredTransactions.length > 0"
              to="/history"
              class="text-blue-400 hover:text-blue-500"
            >
              See More
            </router-link>
          </div>
        </div>

        <!-- Insights -->
        <div
          v-if="isLoggedIn"
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 mt-6"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-4">
            Financial Insights ({{ getPeriodDisplayName(selectedPeriod) }})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
              <h4 class="font-medium text-blue-400 mb-2">
                Top Spending Category
              </h4>
              <p class="text-gray-300">
                {{ expensesByCategory[0]?.name || "No expenses" }} -
                {{ formatCurrency(expensesByCategory[0]?.amount || 0) }}
              </p>
            </div>
            <div class="p-4 bg-green-900/20 rounded-lg border border-green-800">
              <h4 class="font-medium text-green-400 mb-2">
                Primary Income Source
              </h4>
              <p class="text-gray-300">
                {{ incomeByCategory[0]?.name || "No income" }} -
                {{ formatCurrency(incomeByCategory[0]?.amount || 0) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isLoggedIn"
        class="bg-gray-900 rounded-lg p-8 mt-6 text-center border border-gray-800"
      >
        <div class="text-gray-400 text-lg">
          Please log in to view your transaction history.
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
