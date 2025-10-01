<script setup>
import { useAuthStore } from "../stores/auth";
import GoogleIcon from "../components/icons/GoogleIcon.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";

const { loginWithGoogle } = useAuthStore();
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
  >
    <!-- Main Container -->
    <div
      class="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
    >
      <!-- Left Side - Illustration & Branding -->
      <div
        class="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative overflow-hidden"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <!-- Floating Elements -->
        <div
          class="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-300"
        ></div>

        <!-- Content -->
        <div class="relative z-10 text-center space-y-8">
          <!-- Logo/Icon -->
          <div
            class="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>

          <!-- Headline -->
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-5xl font-bold text-white">
              Smart
              <span
                class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Finance
              </span>
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed">
              Take control of your financial future with our intelligent
              dashboard
            </p>
          </div>

          <!-- Feature List -->
          <div class="space-y-3 text-left max-w-sm">
            <div class="flex items-center space-x-3 text-gray-300">
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Real-time transaction tracking</span>
            </div>
            <div class="flex items-center space-x-3 text-gray-300">
              <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Advanced analytics & insights</span>
            </div>
            <div class="flex items-center space-x-3 text-gray-300">
              <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Secure cloud synchronization</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex flex-col justify-center p-8 lg:p-12 space-y-8">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div
            class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4"
          >
            <svg
              class="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Finance Dashboard</h1>
        </div>

        <!-- Welcome Section -->
        <div class="text-center lg:text-left space-y-2">
          <h2 class="text-3xl lg:text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p class="text-gray-400 text-lg">
            Sign in to access your financial dashboard
          </p>
        </div>

        <!-- Login Button -->
        <div class="space-y-6">
          <button
            @click="loginWithGoogle"
            class="group cursor-pointer relative w-full flex items-center justify-center gap-4 px-8 py-4 bg-white text-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50"
          >
            <!-- Google Icon -->
            <div class="flex-shrink-0">
              <GoogleIcon />
            </div>

            <!-- Button Text -->
            <span class="text-lg font-semibold">Continue with Google</span>

            <!-- Arrow Icon -->
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
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

/* Custom gradient text */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Button hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Mobile responsive adjustments */
@media (max-width: 1024px) {
  .bg-grid-pattern {
    display: none;
  }
}
</style>
