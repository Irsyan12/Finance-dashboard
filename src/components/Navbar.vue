<script setup>
import { useAuthStore } from "../stores/auth";
import { computed, ref } from "vue";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const auth = useAuthStore();
auth.fetchUser();
const userData = computed(() => auth.user?.user_metadata);

const isOpen = ref(false);
</script>

<template>
  <nav class="bg-gray-800 p-4 text-white flex justify-between items-center">
    <!-- Brand -->
    <div class="text-lg font-bold">Finance Dashboard</div>

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
    class="md:hidden bg-gray-700 text-white absolute right-0 top-15 rounded-xl w-60 p-4 space-y-4"
  >
    <div v-if="auth.user" class="w-60 space-y-2">
      <span>Hello, {{ userData?.full_name }}</span>
      <button
        @click="auth.logout"
        class="flex items-center gap-2 px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
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
