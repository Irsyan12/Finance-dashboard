<script setup>
import { ref, inject } from "vue";
import {
  ArrowRightEndOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import { useUserData } from "../composables/useData";
import { useAuthStore } from "../stores/auth";
import { useAlert } from "../composables/useAlert";

// Gunakan composable untuk user data
const { userData, isLoggedIn } = useUserData();
const { confirmLogout } = useAlert();

// Gunakan auth store untuk logout action
const auth = useAuthStore();

const isOpen = ref(false);

// Inject sidebar state dari parent
const sidebarCollapsed = inject("sidebarCollapsed", ref(false));
const toggleSidebarFromParent = inject("toggleSidebar", null);

const toggleSidebar = () => {
  if (toggleSidebarFromParent) {
    toggleSidebarFromParent();
  }
};

const handleLogout = async () => {
  const confirmed = await confirmLogout(
    "Logout",
    `Are you sure you want to logout?`
  );

  if (confirmed) {
    try {
      await auth.logout();
      isOpen.value = false; // Close mobile menu after logout
      // go to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 p-4 text-white flex justify-between items-center h-16"
  >
    <!-- Brand & Sidebar Toggle -->
    <div class="flex items-center gap-4">
      <button
        @click="toggleSidebar"
        class="p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
        title="Toggle Sidebar"
      >
        <ChevronLeftIcon v-if="!sidebarCollapsed" class="w-5 h-5" />
        <ChevronRightIcon v-else class="w-5 h-5" />
      </button>
      <router-link to="/" class="text-lg font-bold"
        >Finance Dashboard</router-link
      >
    </div>

    <!-- Medium screen navbar -->
    <div class="hidden md:flex items-center">
      <div v-if="isLoggedIn" class="flex items-center gap-4">
        <span>Hello, {{ userData?.full_name }}</span>
        <span
          class="w-8 h-8 flex select-none items-center justify-center rounded-full bg-blue-900 text-white"
        >
          {{
            userData?.full_name
              ? userData.full_name.charAt(0).toUpperCase()
              : ""
          }}
        </span>
        <button
          @click="handleLogout"
          class="flex items-center gap-2 px-2 py-2 bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer transition"
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
      <button @click="isOpen = !isOpen">
        <span
          class="w-8 h-8 flex select-none items-center justify-center rounded-full bg-blue-900 text-white"
        >
          {{
            userData?.full_name
              ? userData.full_name.charAt(0).toUpperCase()
              : ""
          }}
        </span>
      </button>
    </div>

    <!-- Mobile dropdown menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="md:hidden bg-gray-800 border-b border-gray-700 text-white absolute top-16 right-0 rounded-b-xl w-60 p-4 space-y-4 shadow-lg"
      >
        <div v-if="isLoggedIn" class="w-60 space-y-2">
          <span>{{ userData?.full_name }}</span>
          <button
            @click="handleLogout"
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
    </transition>
  </nav>
</template>
