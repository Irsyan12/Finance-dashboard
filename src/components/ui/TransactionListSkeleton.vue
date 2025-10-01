<template>
  <div class="animate-pulse space-y-3">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white/5 rounded-lg p-4 border border-gray-800"
    >
      <div class="flex items-center justify-between">
        <!-- Left side -->
        <div class="flex items-center space-x-4">
          <!-- Category color indicator -->
          <div class="w-3 h-12 bg-gray-700 rounded-full flex-shrink-0"></div>

          <!-- Transaction details -->
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="h-6 bg-gray-600 rounded w-48"></div>
              <div class="h-4 bg-gray-700 rounded w-4"></div>
              <div class="h-4 bg-slate-700 rounded w-4"></div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="h-4 bg-gray-700 rounded w-24"></div>
              <div class="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="text-right space-y-1">
          <div class="h-6 bg-gray-600 rounded w-24"></div>
          <div class="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 5,
  },
});
</script>
