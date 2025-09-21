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
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  optionValue: {
    type: String,
    default: null, // If null, use the option itself as value
  },
  optionLabel: {
    type: String,
    default: null, // If null, use the option itself as label
  },
});

// Emit untuk v-model binding
const emit = defineEmits(["update:modelValue"]);

// Handle select change
const handleChange = (event) => {
  emit("update:modelValue", event.target.value);
};

// Get option value
const getOptionValue = (option) => {
  if (props.optionValue && typeof option === "object") {
    return option[props.optionValue];
  }
  return option;
};

// Get option label
const getOptionLabel = (option) => {
  if (props.optionLabel && typeof option === "object") {
    return option[props.optionLabel];
  }
  return option;
};
</script>

<template>
  <select
    :id="id"
    :value="modelValue"
    @change="handleChange"
    :required="required"
    :disabled="disabled"
    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="getOptionValue(option)"
    >
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<style scoped></style>
