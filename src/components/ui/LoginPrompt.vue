<template>
  <div
    class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-12 border border-white/10 text-center relative overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

    <!-- Floating Elements -->
    <div
      class="absolute top-4 right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-4 left-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-700"
    ></div>

    <div class="relative z-10">
      <!-- Icon -->
      <div
        class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30"
      >
        <svg
          class="w-10 h-10 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          ></path>
        </svg>
      </div>

      <!-- Title -->
      <h3 class="text-2xl font-bold text-white mb-3">
        Authentication Required
      </h3>

      <!-- Message -->
      <p class="text-gray-400 text-lg mb-6">
        {{
          message ||
          "Please log in to access this feature and view your financial data."
        }}
      </p>

      <!-- Login Button -->
      <router-link
        to="/login"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          ></path>
        </svg>
        Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
/* Grid Pattern Background */
.bg-grid-pattern {
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Smooth transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
