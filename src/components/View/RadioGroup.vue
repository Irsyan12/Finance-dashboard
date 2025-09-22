<script setup>
// Menggunakan div dengan CSS untuk circle indicator instead of icon
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
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Emit untuk v-model binding
const emit = defineEmits(["update:modelValue"]);

// Handle radio change
const handleChange = (value) => {
  if (!props.disabled) {
    emit("update:modelValue", value);
  }
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

// Check if option is disabled
const isOptionDisabled = (option) => {
  if (typeof option === "object" && option.disabled !== undefined) {
    return option.disabled;
  }
  return props.disabled;
};
</script>

<template>
  <div
    role="radiogroup"
    :aria-labelledby="label ? 'radio-group-label' : undefined"
  >
    <label
      v-if="label"
      id="radio-group-label"
      class="block text-sm font-medium text-gray-200 mb-3"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'grid gap-3',
        direction === 'horizontal'
          ? 'grid-flow-col auto-cols-max'
          : 'grid-flow-row',
      ]"
    >
      <label
        v-for="(option, index) in options"
        :key="index"
        :class="[
          'flex items-center gap-2 cursor-pointer',
          isOptionDisabled(option)
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer',
        ]"
      >
        <!-- Radio Button -->
        <div class="relative">
          <input
            :value="getOptionValue(option)"
            :checked="modelValue === getOptionValue(option)"
            @change="handleChange(getOptionValue(option))"
            :name="name"
            :disabled="isOptionDisabled(option)"
            type="radio"
            class="sr-only"
          />
          <!-- Custom Radio Button -->
          <div
            :class="[
              'aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none',
              'border-gray-600 bg-gray-800',
              modelValue === getOptionValue(option)
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-600 bg-gray-800',
              !isOptionDisabled(option) && 'hover:border-gray-500',
              'focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500',
              isOptionDisabled(option) && 'cursor-not-allowed opacity-50',
            ]"
          >
            <!-- Radio Indicator -->
            <div
              v-if="modelValue === getOptionValue(option)"
              class="relative flex items-center justify-center h-full"
            >
              <div
                class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        <!-- Label -->
        <span
          :class="[
            'text-sm font-medium',
            isOptionDisabled(option) ? 'text-gray-500' : 'text-gray-300',
          ]"
        >
          {{ getOptionLabel(option) }}
        </span>
      </label>
    </div>
  </div>
</template>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
