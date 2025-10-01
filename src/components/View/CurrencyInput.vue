<script setup>
import { ref, nextTick, watch } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "Enter amount",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: "IDR", // IDR, USD, etc
  },
});

// Emit untuk v-model binding
const emit = defineEmits(["update:modelValue"]);

// Local state untuk formatted value
const displayValue = ref("");

// Format number to display
const formatNumber = (num) => {
  if (!num || num === 0) return "";
  return Number(num).toLocaleString("id-ID");
};

// Parse display value to number
const parseNumber = (str) => {
  return Number(str.replace(/\D/g, ""));
};

// Initialize display value
if (props.modelValue) {
  displayValue.value = formatNumber(props.modelValue);
}

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== null && newValue !== undefined && newValue !== "") {
      displayValue.value = formatNumber(newValue);
    } else {
      displayValue.value = "";
    }
  }
);

// Handle input change
const handleInput = async (event) => {
  const inputValue = event.target.value;

  // Remove all non-numeric characters
  const numericOnly = inputValue.replace(/\D/g, "");

  if (numericOnly) {
    const number = Number(numericOnly);
    const formatted = formatNumber(number);

    // Update display value
    displayValue.value = formatted;

    // Set cursor position after formatting
    await nextTick();
    setCursorPosition(event.target, formatted);

    // Emit the numeric value
    emit("update:modelValue", number);
  } else {
    displayValue.value = "";
    emit("update:modelValue", "");
  }
};

// Handle paste event
const handlePaste = (event) => {
  event.preventDefault();
  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  const numericOnly = pastedText.replace(/\D/g, "");

  if (numericOnly) {
    const number = Number(numericOnly);
    displayValue.value = formatNumber(number);
    emit("update:modelValue", number);
  } else {
    displayValue.value = "";
    emit("update:modelValue", "");
  }
};

// Set cursor position after formatting
const setCursorPosition = (element, formattedValue) => {
  // Simple cursor positioning - put at end
  const length = formattedValue.length;
  element.setSelectionRange(length, length);
};

// Handle keydown to prevent invalid characters
const handleKeydown = (event) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];

  const isNumber = /^[0-9]$/.test(event.key);
  const isAllowed = allowedKeys.includes(event.key);
  const isCtrlCmd = event.ctrlKey || event.metaKey;

  if (!isNumber && !isAllowed && !isCtrlCmd) {
    event.preventDefault();
  }
};
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      type="text"
      :value="displayValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      @paste="handlePaste"
      @keydown="handleKeydown"
      class="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
    />

    <!-- Currency indicator -->
    <div
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
    >
      {{ currency === "IDR" ? "Rp." : currency }}
    </div>
  </div>
</template>

<style scoped></style>
