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
  PlusIcon,
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
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
  >
    <AppLayout>
      <!-- Main Dashboard Content -->
      <div class="space-y-8">
        <!-- Welcome Section -->
        <div
          class="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <!-- Floating Elements -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"
          ></div>
          <div
            class="absolute bottom-4 left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-500"
          ></div>

          <div class="relative z-10">
            <div v-if="isLoggedIn">
              <h1 class="text-4xl font-bold text-white mb-3">
                Welcome back,
                <span
                  class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  {{ userData?.full_name }}!
                </span>
              </h1>
              <p class="text-xl text-gray-300">
                Here's what's happening with your finances today.
              </p>
            </div>
            <div v-else>
              <h1 class="text-3xl font-bold text-white">
                Please log in to access your dashboard.
              </h1>
            </div>
          </div>
        </div>

        <!-- Dashboard Content Grid -->
        <div
          v-if="isLoggedIn && !isLoading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <!-- Total Balance Card -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-200">
                  Total Balance
                </h3>
                <div
                  class="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/20"
                >
                  <CurrencyDollarIcon class="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p
                class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3"
              >
                {{ formatCurrency(balance) }}
              </p>
              <div class="flex items-center">
                <ArrowTrendingUpIcon
                  v-if="parseFloat(balanceChange) > 0"
                  class="w-5 h-5 text-green-400 mr-2"
                />
                <ArrowTrendingDownIcon
                  v-else-if="parseFloat(balanceChange) < 0"
                  class="w-5 h-5 text-red-400 mr-2"
                />
                <p class="text-sm text-gray-400">
                  {{ formatPercentageChange(balanceChange) }} from last month
                </p>
              </div>
            </div>
          </div>

          <!-- Monthly Expenses Card -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-200">
                  Monthly Expenses
                </h3>
                <div
                  class="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-400/20"
                >
                  <ArrowDownIcon class="w-6 h-6 text-red-400" />
                </div>
              </div>
              <p
                class="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-3"
              >
                {{ formatCurrency(monthlyExpenses) }}
              </p>
              <div class="flex items-center">
                <ArrowTrendingUpIcon
                  v-if="parseFloat(expenseChange) > 0"
                  class="w-5 h-5 text-red-400 mr-2"
                />
                <ArrowTrendingDownIcon
                  v-else-if="parseFloat(expenseChange) < 0"
                  class="w-5 h-5 text-green-400 mr-2"
                />
                <p class="text-sm text-gray-400">
                  {{ formatPercentageChange(expenseChange) }} from last month
                </p>
              </div>
            </div>
          </div>

          <!-- Monthly Income Card -->
          <div
            class="group bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            <!-- Card Background Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-200">
                  Monthly Income
                </h3>
                <div
                  class="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/20"
                >
                  <ArrowUpIcon class="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p
                class="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3"
              >
                {{ formatCurrency(monthlyIncome) }}
              </p>
              <div class="flex items-center">
                <ArrowTrendingUpIcon
                  v-if="parseFloat(incomeChange) > 0"
                  class="w-5 h-5 text-green-400 mr-2"
                />
                <ArrowTrendingDownIcon
                  v-else-if="parseFloat(incomeChange) < 0"
                  class="w-5 h-5 text-red-400 mr-2"
                />
                <p class="text-sm text-gray-400">
                  {{ formatPercentageChange(incomeChange) }} from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton for Dashboard Cards -->
        <div
          v-if="isLoggedIn && isLoading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 animate-pulse"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="h-5 bg-gray-600/50 rounded w-32"></div>
              <div class="w-12 h-12 bg-gray-600/50 rounded-xl"></div>
            </div>
            <div class="h-10 bg-gray-600/50 rounded w-40 mb-4"></div>
            <div class="h-4 bg-gray-600/50 rounded w-28"></div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div
          v-if="isLoggedIn && !isLoading"
          class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div class="relative z-10">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-200">
                Recent Transactions
              </h3>
              <router-link
                to="/history"
                class="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-400/30"
              >
                View All
              </router-link>
            </div>

            <!-- Transactions List -->
            <div v-if="recentTransactions.length > 0" class="space-y-4">
              <div
                v-for="transaction in recentTransactions"
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
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div
                class="w-20 h-20 mx-auto mb-6 bg-gray-600/20 rounded-2xl flex items-center justify-center"
              >
                <ChartBarIcon class="w-10 h-10 text-gray-500" />
              </div>
              <h4 class="text-xl font-semibold text-gray-300 mb-2">
                No transactions yet
              </h4>
              <p class="text-gray-400 mb-6">
                Start by adding your first transaction
              </p>
              <router-link
                to="/addtransaction"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Add Transaction
              </router-link>
            </div>
          </div>
        </div>

        <!-- Loading Skeleton for Recent Transactions -->
        <div
          v-if="isLoggedIn && isLoading"
          class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 animate-pulse"
        >
          <div class="h-6 bg-gray-600/50 rounded w-40 mb-6"></div>
          <div class="space-y-4">
            <div
              v-for="i in 3"
              :key="i"
              class="flex justify-between items-center p-4 bg-white/5 rounded-xl"
            >
              <div class="flex items-center space-x-4">
                <div class="w-11 h-11 bg-gray-600/50 rounded-xl"></div>
                <div>
                  <div class="h-5 bg-gray-600/50 rounded w-32 mb-2"></div>
                  <div class="h-4 bg-gray-600/50 rounded w-24"></div>
                </div>
              </div>
              <div class="h-6 bg-gray-600/50 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
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
