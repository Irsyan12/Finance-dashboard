<script setup>
import Navbar from "../components/Navbar.vue";
import { ref } from "vue";
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();
auth.fetchUser();
const userData = computed(() => auth.user?.user_metadata);



</script>

<template>
  <Navbar />
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div v-if="auth.user">
      <h1 class="text-2xl font-bold">Welcome, {{ userData?.full_name }}</h1>
    </div>
    <div v-else>
      <h1 class="text-2xl font-bold">
        Please log in to access your dashboard.
      </h1>
    </div>
  </div>
  <div class="items-center justify-center flex mb-4 bg-gray-100">
    <button
      class="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition items-center"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>
<style scoped></style>
