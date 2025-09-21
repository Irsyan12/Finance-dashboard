<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  direction: {
    type: String,
    default: "horizontal", // 'horizontal' or 'vertical'
  },
});

// Emit untuk v-model binding
const emit = defineEmits(["update:modelValue"]);

// Handle radio change
const handleChange = (value) => {
  emit("update:modelValue", value);
};

// Get option value
const getOptionValue = (option) => {
  if (typeof option === "object") {
    return option.value;
  }
  return option;
};

// Get option label
const getOptionLabel = (option) => {
  if (typeof option === "object") {
    return option.label;
  }
  return option;
};

// Get option color class
const getOptionColorClass = (option) => {
  if (typeof option === "object" && option.color) {
    return option.color;
  }
  return "text-blue-500 focus:ring-blue-500";
};
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-200 mb-3">
      {{ label }}
    </label>
    <div
      :class="[
        'flex',
        direction === 'horizontal' ? 'space-x-4' : 'space-y-2 flex-col',
      ]"
    >
      <label
        v-for="(option, index) in options"
        :key="index"
        class="flex items-center cursor-pointer"
      >
        <input
          :value="getOptionValue(option)"
          :checked="modelValue === getOptionValue(option)"
          @change="handleChange(getOptionValue(option))"
          :name="name"
          type="radio"
          :class="[
            'bg-gray-800 border-gray-600 focus:ring-2',
            getOptionColorClass(option),
          ]"
        />
        <span class="ml-2 text-gray-300">{{ getOptionLabel(option) }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped></style>
