<script setup>
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emit untuk v-model binding
const emit = defineEmits(["update:modelValue"]);

// Handle input change
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="handleInput"
    :required="required"
    :disabled="disabled"
    class="no-spinner w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
  />
</template>
