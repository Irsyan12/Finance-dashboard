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

  // Ambil hanya angka
  let numericOnly = inputValue.replace(/\D/g, "");

  // Hapus nol di depan
  numericOnly = numericOnly.replace(/^0+(?!$)/, "");

  // Jika hasil akhirnya kosong (berarti cuma nol)
  if (!numericOnly || numericOnly === "0") {
    displayValue.value = "";
    emit("update:modelValue", "");
    return;
  }

  const number = Number(numericOnly);
  const formatted = formatNumber(number);

  displayValue.value = formatted;

  await nextTick();
  setCursorPosition(event.target, formatted);

  emit("update:modelValue", number);
};

// Handle paste event
const handlePaste = (event) => {
  event.preventDefault();
  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  let numericOnly = pastedText.replace(/\D/g, "");

  // Hapus nol di depan
  numericOnly = numericOnly.replace(/^0+(?!$)/, "");

  // Jika hasil akhirnya kosong (berarti cuma nol)
  if (!numericOnly || numericOnly === "0") {
    displayValue.value = "";
    emit("update:modelValue", "");
    return;
  }

  const number = Number(numericOnly);
  displayValue.value = formatNumber(number);
  emit("update:modelValue", number);
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
    return;
  }

  // ✅ Cegah mengetik "0" di awal input
  if (event.key === "0") {
    const input = event.target;
    const selectionStart = input.selectionStart;
    const currentValue = input.value;

    // Kalau input masih kosong atau semua karakter masih nol -> blokir 0
    const numericOnly = currentValue.replace(/\D/g, "");
    const caretAtStart = selectionStart === 0;

    if (numericOnly === "" || caretAtStart || /^0+$/.test(numericOnly)) {
      event.preventDefault();
    }
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

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.05) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: #ffffff !important;
}
</style>
