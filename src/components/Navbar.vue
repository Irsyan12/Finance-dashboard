<script setup>
import { useAuthStore } from "../stores/auth";
import { computed, ref, inject } from "vue";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

const auth = useAuthStore();
auth.fetchUser();
const userData = computed(() => auth.user?.user_metadata);

const isOpen = ref(false);

// Inject sidebar state dari parent
const sidebarCollapsed = inject("sidebarCollapsed", ref(false));
const toggleSidebarFromParent = inject("toggleSidebar", null);

const toggleSidebar = () => {
  if (toggleSidebarFromParent) {
    toggleSidebarFromParent();
  }
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 p-4 text-white flex justify-between items-center h-16"
  >
    <!-- Brand & Sidebar Toggle -->
    <div class="flex items-center gap-4">
      <a href="/" class="text-lg font-bold">Finance Dashboard</a>
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        title="Toggle Sidebar"
      >
        <ChevronLeftIcon v-if="!sidebarCollapsed" class="w-5 h-5" />
        <ChevronRightIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Medium screen navbar -->
    <div class="hidden md:flex items-center">
      <div v-if="auth.user" class="flex items-center gap-4">
        <span>Hello, {{ userData?.full_name }}</span>
        <button
          @click="auth.logout"
          class="flex items-center gap-2 px-4 py-2 bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer transition"
        >
          <ArrowRightEndOnRectangleIcon class="h-4 w-4" />
          Logout
        </button>
      </div>
      <div v-else>
        <a
          href="/login"
          class="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600 transition"
        >
          Login
        </a>
      </div>
    </div>

    <!-- Small screen (hamburger menu) -->
    <div class="md:hidden flex items-center">
      <button
        @click="isOpen = !isOpen"
        class="p-2 rounded hover:bg-gray-700 transition"
      >
        <Bars3Icon v-if="!isOpen" class="h-6 w-6" />
        <XMarkIcon v-else class="h-6 w-6" />
      </button>
    </div>
  </nav>

  <!-- Mobile dropdown menu -->
  <div
    v-if="isOpen"
    class="md:hidden bg-gray-800 border-b border-gray-700 text-white absolute right-0 top-16 rounded-b-xl w-60 p-4 space-y-4 shadow-lg"
  >
    <div v-if="auth.user" class="w-60 space-y-2">
      <span>{{ userData?.full_name }}</span>
      <button
        @click="auth.logout"
        class="flex items-center gap-2 px-4 py-2 mt-2 bg-red-500 rounded hover:bg-red-600 transition"
      >
        <ArrowRightEndOnRectangleIcon class="h-4 w-4" />
        Logout
      </button>
    </div>
    <div v-else>
      <a
        href="/login"
        class="px-4 py-2 bg-blue-700 rounded hover:bg-blue-600 transition block text-center"
      >
        Login
      </a>
    </div>
  </div>
</template>

<style scoped></style>
