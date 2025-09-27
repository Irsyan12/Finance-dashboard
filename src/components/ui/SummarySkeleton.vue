<template>
  <div class="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-4">
    <div
      v-for="n in count"
      :key="n"
      class="bg-gray-900 rounded-lg p-4 border border-gray-800"
    >
      <div class="h-4 bg-slate-700 rounded w-24 mb-2"></div>
      <div class="h-8 bg-slate-600 rounded w-32"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 4,
  },
});
</script>
