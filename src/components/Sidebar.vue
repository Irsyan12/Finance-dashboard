<script setup>
import {
  PlusIcon,
  ChartBarIcon,
  TagIcon,
  ClockIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useAuth } from "../composables/useAuth";
import { ref, inject } from "vue";

const { logout } = useAuth();

// Try to get state from layout, fallback to local state
const sidebarCollapsed = inject("sidebarCollapsed", ref(false));
</script>

<template>
  <aside
    id="default-sidebar"
    :class="[
      'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 border-r border-gray-700 bg-gray-900',
      sidebarCollapsed ? 'w-18' : 'w-64',
      'transform', // Add transform for mobile
      // Mobile: hide by default, show when not collapsed
      'md:translate-x-0', // Always visible on desktop
      sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0', // Mobile behavior
    ]"
    aria-label="Sidebar"
  >
    <div class="h-full px-4 py-6 overflow-y-auto bg-gray-900">
      <!-- Navigation Menu -->
      <nav class="space-y-2">
        <router-link
          to="/addtransaction"
          class="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
          :class="sidebarCollapsed ? 'justify-center' : ''"
          :title="sidebarCollapsed ? 'Add Transaction' : ''"
        >
          <PlusIcon
            :class="[
              sidebarCollapsed ? 'w-14 h-5' : 'w-5 h-5',
              'text-gray-400 group-hover:text-white transition-colors',
            ]"
          />
          <span
            v-if="!sidebarCollapsed"
            class="ml-3 font-medium transition-opacity duration-300"
          >
            Add Transaction
          </span>
        </router-link>

        <router-link
          to="/history"
          class="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
          :class="sidebarCollapsed ? 'justify-center' : ''"
          :title="sidebarCollapsed ? 'Transaction History' : ''"
        >
          <ClockIcon :class="[
              sidebarCollapsed ? 'w-14 h-5' : 'w-5 h-5',
              'text-gray-400 group-hover:text-white transition-colors'
          ]"
          />
          <span
            v-if="!sidebarCollapsed"
            class="ml-3 font-medium transition-opacity duration-300"
          >
            Transaction History
          </span>
        </router-link>

        <router-link
          to="/summary"
          class="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
          :class="sidebarCollapsed ? 'justify-center' : ''"
          :title="sidebarCollapsed ? 'Summary' : ''"
        >
          <ChartBarIcon :class="[
              sidebarCollapsed ? 'w-14 h-5' : 'w-5 h-5',
              'text-gray-400 group-hover:text-white transition-colors'
          ]"
          />
          <span
            v-if="!sidebarCollapsed"
            class="ml-3 font-medium transition-opacity duration-300"
          >
            Summary
          </span>
        </router-link>

        <router-link
          to="/editcategories"
          class="flex items-center p-3 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors group"
          :class="sidebarCollapsed ? 'justify-center' : ''"
          :title="sidebarCollapsed ? 'Edit Categories' : ''"
        >
          <TagIcon :class="[
              sidebarCollapsed ? 'w-14 h-5' : 'w-5 h-5',
              'text-gray-400 group-hover:text-white transition-colors'
          ]"
          />
          <span
            v-if="!sidebarCollapsed"
            class="ml-3 font-medium transition-opacity duration-300"
          >
            Edit Categories
          </span>
        </router-link>
        
      </nav>

    </div>
  </aside>
</template>

<style scoped></style>
