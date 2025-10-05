<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/vue/24/outline";
import { useToast } from "../../composables/useToast";
import { useTransactions } from "../../composables/useTransactions";
import { useCategories } from "../../composables/useCategories";
import Calendar from "../ui/Calendar.vue";
import CurrencyInput from "../View/CurrencyInput.vue";
import LabelInput from "../View/LabelInput.vue";
import InputForm from "../View/InputForm.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  transactionId: {
    type: [String, Number],
    default: null,
  },
});

const emit = defineEmits(["close", "updated"]);

// Composables
const { toast } = useToast();
const { updateTransaction: updateTransactionAPI, getTransactionById } =
  useTransactions();
const { categories, fetchCategories } = useCategories();

// State
const loading = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const form = ref(null);
const validationErrors = ref({});
const shouldClose = ref(false); // Tambahkan flag untuk mengontrol penutupan modal

// Form validation
const isFormValid = computed(() => {
  if (!form.value) return false;

  return (
    form.value.type &&
    form.value.amount &&
    parseFloat(form.value.amount) > 0 &&
    form.value.description &&
    form.value.category_id &&
    form.value.date &&
    Object.keys(validationErrors.value).length === 0
  );
});

// Filtered categories based on transaction type
const filteredCategories = computed(() => {
  if (!categories.value || !form.value) return [];

  return categories.value.filter(
    (category) => category.type === form.value.type
  );
});

// Validate amount
const validateAmount = () => {
  // Guard clause: return early if form is null or being reset
  if (!form.value) {
    return;
  }

  validationErrors.value = {};

  if (!form.value.amount) {
    validationErrors.value.amount = "Amount is required";
    return;
  }

  const amount = parseFloat(form.value.amount);

  if (isNaN(amount) || !isFinite(amount)) {
    validationErrors.value.amount = "Please enter a valid number";
    return;
  }

  if (amount <= 0) {
    validationErrors.value.amount = "Amount must be greater than zero";
    return;
  }

  const decimalPlaces = (amount.toString().split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    validationErrors.value.amount = "Maximum 2 decimal places allowed";
    return;
  }
};

// Watch for amount changes to validate
watch(() => form.value?.amount, validateAmount);

// Watch for transaction type changes to reset category
watch(
  () => form.value?.type,
  (newType, oldType) => {
    if (form.value && newType !== oldType && oldType !== undefined) {
      // Only reset if type actually changed after initial load
      form.value.category_id = "";
    }
  }
);

// Load transaction data
const loadTransaction = async () => {
  if (!props.transactionId) return;

  try {
    loading.value = true;
    error.value = null;

    // Get transaction by ID
    const transaction = await getTransactionById(props.transactionId);

    if (transaction) {
      form.value = {
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category_id: transaction.category_id,
        date: transaction.date,
      };
    } else {
      throw new Error("Transaction not found");
    }
  } catch (err) {
    error.value = err.message || "Failed to load transaction";
    console.error("Error loading transaction:", err);
  } finally {
    loading.value = false;
  }
};

// Update transaction
const updateTransaction = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  shouldClose.value = false;

  try {
    // Validate amount one more time
    validateAmount();
    if (Object.keys(validationErrors.value).length > 0) {
      return;
    }

    const updates = {
      type: form.value.type,
      amount: parseFloat(form.value.amount),
      description: form.value.description,
      category_id: form.value.category_id,
      date: form.value.date,
    };

    const result = await updateTransactionAPI(props.transactionId, updates);

    toast.success("Transaction updated successfully", {
      description: "Your changes have been saved",
    });

    emit("updated");

    // Use nextTick to ensure all reactive updates complete before closing
    await nextTick();
    shouldClose.value = true;
  } catch (err) {
    toast.error("Failed to update transaction", {
      description: err.message || "Please try again later",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Close modal
const closeModal = () => {
  form.value = null;
  error.value = null;
  validationErrors.value = {};
  isSubmitting.value = false;
  shouldClose.value = false;
  emit("close");
};

// Watch for shouldClose flag
watch(shouldClose, async (newValue) => {
  if (newValue && !isSubmitting.value) {
    // Wait for next tick to ensure all reactive updates are complete
    await nextTick();
    closeModal();
  }
});

// Watch for modal open/close
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.transactionId) {
      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Ensure categories are loaded
      if (!categories.value || categories.value.length === 0) {
        await fetchCategories();
      }
      await loadTransaction();
    } else {
      // Reset semua state termasuk isSubmitting
      document.body.style.overflow = "";
      if (form.value !== null) {
        form.value = null;
        error.value = null;
        validationErrors.value = {};
      }
      isSubmitting.value = false;
    }
  }
);
</script>
<template>
  <!-- Modal using Teleport to body -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      :key="`modal-${transactionId}`"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Modal Content -->
      <div
        @click.stop
        class="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden transform transition-all duration-300"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- Background Glow -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-80"
        ></div>

        <div class="relative z-10">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div
                class="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30"
              >
                <PencilIcon class="w-5 h-5 text-blue-400" />
              </div>
              <h2 class="text-xl font-semibold text-white">Edit Transaction</h2>
            </div>
            <button
              @click="closeModal"
              class="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"
            ></div>
            <p class="text-gray-400 mt-2">Loading transaction...</p>
          </div>

          <!-- Edit Form -->
          <form
            v-else-if="form"
            @submit.prevent="updateTransaction"
            class="space-y-4"
          >
            <!-- Transaction Type -->
            <div>
              <LabelInput
                for="transactionType"
                label="Transaction Type"
                LabelIcon="ArrowsUpDownIcon"
              />
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.type = 'income'"
                  :class="[
                    'px-4 py-2 rounded-lg border transition-all duration-200 font-medium',
                    form.type === 'income'
                      ? 'bg-green-500/20 border-green-400/50 text-green-300'
                      : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/30',
                  ]"
                >
                  Income
                </button>
                <button
                  type="button"
                  @click="form.type = 'expense'"
                  :class="[
                    'px-4 py-2 rounded-lg border transition-all duration-200 font-medium',
                    form.type === 'expense'
                      ? 'bg-red-500/20 border-red-400/50 text-red-300'
                      : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/30',
                  ]"
                >
                  Expense
                </button>
              </div>
            </div>

            <!-- Amount -->
            <div>
              <LabelInput
                for="amount"
                label="Amount (Rp)"
                LabelIcon="BanknotesIcon"
              />
              <CurrencyInput
                id="amount"
                v-model="form.amount"
                required
                placeholder="Enter amount"
              />
              <!-- Validation Error -->
              <div
                v-if="validationErrors.amount"
                class="mt-1 text-sm text-red-400 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ validationErrors.amount }}
              </div>
            </div>

            <!-- Description -->
            <div>
              <LabelInput
                for="description"
                label="Description"
                LabelIcon="DocumentTextIcon"
              />
              <InputForm
                id="description"
                v-model="form.description"
                type="text"
                placeholder="Enter description"
                required
              />
            </div>

            <!-- Category -->
            <div>
              <LabelInput for="category" label="Category" LabelIcon="TagIcon" />
              <select
                v-model="form.category_id"
                required
                class="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="" disabled>Select a category</option>
                <option
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :value="category.id"
                  class="bg-gray-800 text-white"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Date -->
            <div>
              <LabelInput for="date" label="Date" LabelIcon="CalendarIcon" />
              <Calendar
                v-model="form.date"
                placeholder="Select transaction date"
                format="yyyy-MM-dd"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 pt-4">
              <button
                type="submit"
                :disabled="isSubmitting || !isFormValid"
                class="flex-1 cursor-pointer px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <CheckIcon v-else class="w-4 h-4" />
                <span>{{
                  isSubmitting ? "Updating..." : "Update Transaction"
                }}</span>
              </button>

              <button
                type="button"
                @click="closeModal"
                class="px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <XMarkIcon class="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-8">
            <div
              class="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <p class="text-red-400 mb-4">{{ error }}</p>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Custom scrollbar for select dropdown */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Remove default arrow */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Input focus styles */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
