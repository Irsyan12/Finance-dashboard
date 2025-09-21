<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "button",
  },
  variant: {
    type: String,
    default: "primary", // 'primary', 'secondary', 'danger', 'success'
  },
  size: {
    type: String,
    default: "md", // 'sm', 'md', 'lg'
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [Object, Function, String],
    default: null,
  },
});

// Emit events
const emit = defineEmits(["click"]);

// Handle click
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};

// Computed classes
const buttonClasses = () => {
  const baseClasses =
    "flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  // Block class
  const blockClass = props.block ? "w-full" : "";

  return `${baseClasses} ${sizeClasses[props.size]} ${
    variantClasses[props.variant]
  } ${blockClass}`;
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses()"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <div
      v-if="loading"
      class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"
    ></div>

    <!-- Icon -->
    <component :is="icon" v-else-if="icon" class="w-4 h-4 mr-2" />

    <!-- Slot content -->
    <slot></slot>
  </button>
</template>

<style scoped></style>
