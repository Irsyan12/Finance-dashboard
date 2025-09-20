<script setup>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { ref, provide } from "vue";

// State untuk sidebar collapse
const sidebarCollapsed = ref(false);

// Provide state ke child components
provide("sidebarCollapsed", sidebarCollapsed);
provide("toggleSidebar", () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
});
</script>

<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content Area -->
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main
        :class="[
          'flex-1 transition-all duration-300 pt-16', // pt-16 untuk offset navbar
          'ml-0', // No margin on mobile
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64', // Desktop margin sesuai sidebar
        ]"
      >
        <div class="p-4 md:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth transitions */
main {
  min-height: calc(100vh - 4rem); /* 100vh minus navbar height */
}
</style>
