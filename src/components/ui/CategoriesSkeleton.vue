<template>
  <div class="animate-pulse space-y-6">
    <!-- Add Category Section Skeleton -->
    <div class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800">
      <div class="flex items-center justify-between">
        <div class="h-6 bg-gray-700 rounded w-24"></div>
        <div class="h-10 bg-gray-700 rounded w-32"></div>
      </div>
    </div>

    <!-- Categories Section Skeleton -->
    <div class="bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800">
      <div class="flex items-center mb-4">
        <div class="h-4 bg-gray-700 rounded w-4 mr-2"></div>
        <div class="h-6 bg-gray-700 rounded w-36"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="n in count"
          :key="n"
          class="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-gray-600 rounded-full"></div>
              <div class="h-4 bg-gray-600 rounded w-24"></div>
            </div>
            <div class="flex space-x-2">
              <div class="h-6 w-6 bg-gray-700 rounded"></div>
              <div class="h-6 w-6 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 6,
  },
});
</script>
