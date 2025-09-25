<script setup>
import AppLayout from "../components/AppLayout.vue";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { useUserData } from "../composables/useData";

const { userData, isLoggedIn } = useUserData();

const auth = useAuthStore();
auth.fetchUser();
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
        v-if="isLoggedIn"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <!-- Card 1 -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-2">
            Total Balance
          </h3>
          <p class="text-3xl font-bold text-green-400">
            Rp. <span>12.450.000</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            <span>+2.5%</span> from last month
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-2">
            Monthly Expenses
          </h3>
          <p class="text-3xl font-bold text-red-400">
            Rp. <span>3.240.000</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            <span>-5.2%</span> from last month
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
        >
          <h3 class="text-lg font-semibold text-gray-200 mb-2">
            Monthly Income
          </h3>
          <p class="text-3xl font-bold text-blue-400">
            Rp. <span>8.500.000</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">Same as last month</p>
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
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <div>
              <p class="font-medium text-gray-200">Grocery Shopping</p>
              <p class="text-sm text-gray-500">Today, 2:30 PM</p>
            </div>
            <span class="text-red-400 font-semibold"
              >- Rp. <span>125.500</span></span
            >
          </div>
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <div>
              <p class="font-medium text-gray-200">Salary Deposit</p>
              <p class="text-sm text-gray-500">Yesterday, 9:00 AM</p>
            </div>
            <span class="text-green-400 font-semibold"
              >+ Rp. <span>4.200.000</span></span
            >
          </div>
          <div class="flex justify-between items-center py-2">
            <div>
              <p class="font-medium text-gray-200">Coffee Shop</p>
              <p class="text-sm text-gray-500">2 days ago, 8:15 AM</p>
            </div>
            <span class="text-red-400 font-semibold"
              >- Rp. <span>45.000</span></span
            >
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Additional styling if needed */
</style>
