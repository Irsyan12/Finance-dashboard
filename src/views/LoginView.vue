<script setup>
import { useAuthStore } from "../stores/auth";
const { loginWithGoogle } = useAuthStore();
</script>

<template>
  <div
    class="h-screen flex flex-col space-y-3 items-center justify-center bg-gray-900"
  >
    <h2 class="mb-12">
      <span
        class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
      >
        Finance Dashboard
      </span>
    </h2>
    <div class="text-white text-lg">Login to your account</div>

    <button
      @click="loginWithGoogle"
      class="px-6 py-3 bg-blue-800 text-white rounded-lg shadow-md hover:cursor-pointer hover:bg-blue-900 hover:shadow-2xl transition"
    >
      <img
        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
        alt=""
        class="w-8 h-8 inline mr-2"
      />Login dengan Google
    </button>
  </div>
</template>

<style scoped></style>
