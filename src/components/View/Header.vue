<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "Add Transaction",
  },
  subtitle: {
    type: String,
    default: "Record a new income or expense transaction",
  },
});
</script>

<template>
  <div class="">
    <h1 class="text-3xl font-bold text-white mb-2">{{ title }}</h1>
    <p class="text-gray-400">{{ subtitle }}</p>

  </div>

</template>

<style scoped></style>
