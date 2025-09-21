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

// Sample data
const transactions = ref([
  {
    id: 1,
    type: "income",
    amount: 4200000,
    category: "Salary",
    date: "2024-01-01",
    description: "Monthly Salary",
  },
  {
    id: 2,
    type: "expense",
    amount: 125500,
    category: "Food & Dining",
    date: "2024-01-02",
    description: "Grocery Shopping",
  },
  {
    id: 3,
    type: "expense",
    amount: 4500,
    category: "Food & Dining",
    date: "2024-01-02",
    description: "Coffee Shop",
  },
  {
    id: 4,
    type: "expense",
    amount: 800000,
    category: "Bills & Utilities",
    date: "2024-01-03",
    description: "Electricity Bill",
  },
  {
    id: 5,
    type: "income",
    amount: 200000,
    category: "Freelancing",
    date: "2024-01-03",
    description: "Web Design Project",
  },
  {
    id: 6,
    type: "expense",
    amount: 60000,
    category: "Transportation",
    date: "2024-01-04",
    description: "Gas",
  },
  {
    id: 7,
    type: "expense",
    amount: 25000,
    category: "Entertainment",
    date: "2024-01-05",
    description: "Movie Tickets",
  },
]);

const selectedPeriod = ref("month");

// Computed values
const totalIncome = computed(() => {
  return transactions.value
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpenses = computed(() => {
  return transactions.value
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
});

const balance = computed(() => totalIncome.value - totalExpenses.value);

const expensesByCategory = computed(() => {
  const categories = {};
  transactions.value
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
  return Object.entries(categories)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
});

const incomeByCategory = computed(() => {
  const categories = {};
  transactions.value
    .filter((t) => t.type === "income")
    .forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
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
        <Header title="Financial Summary" subtitle="Overview of your finances" />

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

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Income -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total Income</p>
              <p class="text-2xl font-bold text-green-400">
                Rp {{ totalIncome.toLocaleString("id-ID") }}
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
                Rp {{ totalExpenses.toLocaleString("id-ID") }}
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
                Rp. <span>{{ balance.toLocaleString("id-ID") }}</span>
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span class="text-red-400 font-semibold w-22 text-right"
                  >Rp.
                  <span>{{
                    category.amount.toLocaleString("id-ID")
                  }}</span></span
                >
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
                <span class="text-green-400 font-semibold w-22 text-right"
                  >Rp.
                  <span>{{
                    category.amount.toLocaleString("id-ID")
                  }}</span></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 class="text-lg font-semibold text-gray-200 mb-4">
          Recent Transactions
        </h3>
        <div class="space-y-3">
          <div
            v-for="transaction in transactions.slice(0, 5)"
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
                  {{ transaction.category }} • {{ transaction.date }}
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
              {{ transaction.type === "income" ? "+" : "-" }}Rp
              {{ transaction.amount.toLocaleString("id-ID") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
        <h3 class="text-lg font-semibold text-gray-200 mb-4">
          Financial Insights
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
            <h4 class="font-medium text-blue-400 mb-2">
              Top Spending Category
            </h4>
            <p class="text-gray-300">
              {{ expensesByCategory[0]?.name || "No expenses" }} - Rp
              {{ expensesByCategory[0]?.amount.toLocaleString("id-ID") || "0" }}
            </p>
          </div>
          <div class="p-4 bg-green-900/20 rounded-lg border border-green-800">
            <h4 class="font-medium text-green-400 mb-2">
              Primary Income Source
            </h4>
            <p class="text-gray-300">
              {{ incomeByCategory[0]?.name || "No income" }} - Rp
              {{ incomeByCategory[0]?.amount.toLocaleString("id-ID") || "0" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
