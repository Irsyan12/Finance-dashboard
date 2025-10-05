<script setup>
import AppLayout from "../components/AppLayout.vue";
import LoginPrompt from "../components/ui/LoginPrompt.vue";
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
  return categoriesLoading.value || transactionsLoading.value;
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
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
  >
    <AppLayout class="space-y-8">
      <!-- Header -->
      <div
        v-if="isLoggedIn"
        class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
      >
        <div
          class="bg-white/5 backdrop-blur-xl mb-6 rounded-2xl shadow-2xl p-6 border border-white/10 flex-1"
        >
          <Header
            title="Financial Summary"
            :subtitle="`Overview of your finances - ${getPeriodDisplayName(
              selectedPeriod
            )}`"
          />
        </div>

        <!-- Period Selector -->
        <div class="flex items-center space-x-2" v-if="isLoading">
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
            class="group bg-white/5 cursor-default backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
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
            class="group bg-white/5 cursor-default backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Total Expenses
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    {{ formatCurrency(totalExpenses) }}
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-400/30"
                >
                  <ArrowDownIcon class="w-6 h-6 text-red-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- Net Balance -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Net Balance
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                    :class="
                      balance >= 0
                        ? 'from-blue-400 to-cyan-400'
                        : 'from-red-400 to-pink-400'
                    "
                  >
                    {{ formatCurrency(balance) }}
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30"
                >
                  <CurrencyDollarIcon class="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- Savings Rate -->
          <div
            class="group cursor-default bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-400 mb-2 font-medium">
                    Savings Rate
                  </p>
                  <p
                    class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    {{ savingsRate }}%
                  </p>
                </div>
                <div
                  class="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30"
                >
                  <ChartBarIcon class="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Breakdowns -->
        <div
          v-if="isLoggedIn"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          <!-- Expenses by Category -->
          <div
            class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden"
          >
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div class="relative z-10">
              <h3 class="text-xl font-semibold text-gray-200 mb-6">
                Expenses by Category
              </h3>
              <div class="space-y-4">
                <div
                  v-for="category in expensesByCategory"
                  :key="category.name"
                  class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <span class="text-gray-300 font-medium">{{
                    category.name
                  }}</span>
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 bg-gray-600/30 rounded-full h-2 w-32">
                      <div
                        class="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                        :style="{
                          width: `${(category.amount / totalExpenses) * 100}%`,
                        }"
                      ></div>
                    </div>
                    <span
                      class="text-red-400 font-bold min-w-[80px] text-right"
                    >
                      {{ formatCurrency(category.amount) }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="expensesByCategory.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <p>No expenses recorded for this period.</p>
              </div>
            </div>
          </div>

          <!-- Income by Category -->
          <div
            class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden"
          >
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div class="relative z-10">
              <h3 class="text-xl font-semibold text-gray-200 mb-6">
                Income by Category
              </h3>
              <div class="space-y-4">
                <div
                  v-for="category in incomeByCategory"
                  :key="category.name"
                  class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <span class="text-gray-300 font-medium">{{
                    category.name
                  }}</span>
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 bg-gray-600/30 rounded-full h-2 w-32">
                      <div
                        class="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                        :style="{
                          width: `${(category.amount / totalIncome) * 100}%`,
                        }"
                      ></div>
                    </div>
                    <span
                      class="text-green-400 font-bold min-w-[80px] text-right"
                    >
                      {{ formatCurrency(category.amount) }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="incomeByCategory.length === 0"
                class="text-center py-8 text-gray-400"
              >
                <p>No income recorded for this period.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div
          v-if="isLoggedIn"
          class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden mt-8"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div class="relative z-10">
            <h3 class="text-xl font-semibold text-gray-200 mb-6">
              Recent Transactions ({{ getPeriodDisplayName(selectedPeriod) }})
            </h3>
            <div class="space-y-4">
              <div
                v-for="transaction in recentFilteredTransactions"
                :key="transaction.id"
                class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div class="flex items-center space-x-4">
                  <div
                    :class="[
                      'p-3 rounded-xl border',
                      transaction.type === 'income'
                        ? 'bg-green-500/20 border-green-400/30'
                        : 'bg-red-500/20 border-red-400/30',
                    ]"
                  >
                    <ArrowUpIcon
                      v-if="transaction.type === 'income'"
                      class="w-5 h-5 text-green-400"
                    />
                    <ArrowDownIcon v-else class="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p class="font-semibold text-gray-200 text-lg">
                      {{ transaction.description }}
                    </p>
                    <p class="text-sm text-gray-400">
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
                    'font-bold text-xl',
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
                class="text-center py-12"
              >
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-gray-600/20 rounded-2xl flex items-center justify-center"
                >
                  <ChartBarIcon class="w-8 h-8 text-gray-500" />
                </div>
                <p class="text-gray-400 text-lg mb-2">
                  No transactions found for
                  {{ getPeriodDisplayName(selectedPeriod).toLowerCase() }}
                </p>
                <p class="text-gray-500 text-sm">
                  Try selecting a different period or add some transactions
                </p>
              </div>

              <router-link
                v-if="recentFilteredTransactions.length > 0"
                to="/history"
                class="inline-flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-400/30 mt-4"
              >
                See More
              </router-link>
            </div>
          </div>
        </div>

        <!-- Insights -->
        <div
          v-if="isLoggedIn"
          class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden mt-8"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div class="relative z-10">
            <h3 class="text-xl font-semibold text-gray-200 mb-6">
              Financial Insights ({{ getPeriodDisplayName(selectedPeriod) }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                class="p-6 bg-blue-500/10 rounded-xl border border-blue-400/30"
              >
                <h4 class="font-semibold text-blue-400 mb-3">
                  Top Spending Category
                </h4>
                <p class="text-gray-300 text-lg">
                  {{ expensesByCategory[0]?.name || "No expenses" }}
                </p>
                <p class="text-blue-400 font-bold text-xl mt-1">
                  {{ formatCurrency(expensesByCategory[0]?.amount || 0) }}
                </p>
              </div>
              <div
                class="p-6 bg-green-500/10 rounded-xl border border-green-400/30"
              >
                <h4 class="font-semibold text-green-400 mb-3">
                  Primary Income Source
                </h4>
                <p class="text-gray-300 text-lg">
                  {{ incomeByCategory[0]?.name || "No income" }}
                </p>
                <p class="text-green-400 font-bold text-xl mt-1">
                  {{ formatCurrency(incomeByCategory[0]?.amount || 0) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginPrompt
        v-if="!isLoggedIn"
        message="Please log in to view your financial summary and spending analytics."
      />
    </AppLayout>
  </div>
</template>

<style scoped>
/* Grid Pattern Background */
.bg-grid-pattern {
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
