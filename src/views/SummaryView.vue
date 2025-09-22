<script setup>
import AppLayout from "../components/AppLayout.vue";
import { ref, computed } from "vue";
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import Header from "../components/View/Header.vue";
import { formatCurrency } from "@/lib/data";
import { useTransactions, useCategories } from "@/composables/useFinance";
import { useUserData } from "../composables/useData";

const { user, isLoggedIn } = useUserData();
const { getTransactionByUserId } = useTransactions();
const { getCategoryById } = useCategories();

const transactions = ref([]);

// Load user transactions when user is available
const userTransactions = computed(() => {
  if (!user.value?.id) return [];
  return getTransactionByUserId(user.value.id);
});


const selectedPeriod = ref("month");

// Computed values
const totalIncome = computed(() => {
  return userTransactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpenses = computed(() => {
  return userTransactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
});

const balance = computed(() => totalIncome.value - totalExpenses.value);

const expensesByCategory = computed(() => {
  const categories = {};
  userTransactions.value
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const category = getCategoryById(t.category_id);
      const categoryName = category?.name || "Unknown Category";
      categories[categoryName] = (categories[categoryName] || 0) + t.amount;
    });
  return Object.entries(categories)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const incomeByCategory = computed(() => {
  const categories = {};
  userTransactions.value
    .filter((t) => t.type === "income")
    .forEach((t) => {
      const category = getCategoryById(t.category_id);
      const categoryName = category?.name || "Unknown Category";
      categories[categoryName] = (categories[categoryName] || 0) + t.amount;
    });
  return Object.entries(categories)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return ((balance.value / totalIncome.value) * 100).toFixed(1);
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <Header
          title="Financial Summary"
          subtitle="Overview of your finances"
        />

        <!-- Period Selector -->
        <div class="flex items-center space-x-2">
          <CalendarIcon class="w-5 h-5 text-gray-400" />
          <select
            v-model="selectedPeriod"
            class="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <div></div>
      <!-- Summary Cards -->
      <div v-if="isLoggedIn" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Income -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Income</p>
              <p class="text-2xl font-bold text-green-400">
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
              <p class="text-2xl font-bold text-red-400">
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
                class="text-2xl font-bold"
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
              <p class="text-2xl font-bold text-purple-400">
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
      <div v-if="isLoggedIn" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span class="text-red-400 font-semibold w-22 text-right">{{
                  formatCurrency(category.amount)
                }}</span>
              </div>
            </div>
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
              <div class="flex items-center space-x-3">
                <div class="flex-1 bg-gray-700 rounded-full h-2 w-24">
                  <div
                    class="bg-green-400 h-2 rounded-full transition-all duration-300"
                    :style="{
                      width: `${(category.amount / totalIncome) * 100}%`,
                    }"
                  ></div>
                </div>
                <span class="text-green-400 font-semibold w-22 text-right">
                  <span>{{ formatCurrency(category.amount) }}</span></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div
        v-if="isLoggedIn"
        class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
      >
        <h3 class="text-lg font-semibold text-gray-200 mb-4">
          Recent Transactions
        </h3>
        <div class="space-y-3">
          <div
            v-for="transaction in userTransactions.slice(0, 5)"
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
                    getCategoryById(transaction.category_id)?.name ||
                    "Unknown Category"
                  }}
                  • {{ transaction.date }}
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
      </div>

      <!-- Insights -->
      <div
        v-if="isLoggedIn"
        class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
      >
        <h3 class="text-lg font-semibold text-gray-200 mb-4">
          Financial Insights
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
            <h4 class="font-medium text-blue-400 mb-2">
              Top Spending Category
            </h4>
            <p class="text-gray-300">
              {{ expensesByCategory[0]?.name || "No expenses" }} -
              {{ formatCurrency(expensesByCategory[0]?.amount) || "0" }}
            </p>
          </div>
          <div class="p-4 bg-green-900/20 rounded-lg border border-green-800">
            <h4 class="font-medium text-green-400 mb-2">
              Primary Income Source
            </h4>
            <p class="text-gray-300">
              {{ incomeByCategory[0]?.name || "No income" }} -
              {{ formatCurrency(incomeByCategory[0]?.amount) || "0" }}
            </p>
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
