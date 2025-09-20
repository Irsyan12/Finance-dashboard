<script setup>
import { useAuth } from '../composables/useAuth'
const { loginWithGoogle } = useAuth()
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <button 
      @click="loginWithGoogle"
      class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
    >
      Login dengan Google
    </button>
  </div>
</template>
