<script setup>
import AppLayout from "../components/AppLayout.vue";
import Header from "../components/View/Header.vue";
import LabelInput from "../components/View/LabelInput.vue";
import InputForm from "../components/View/InputForm.vue";
import CurrencyInput from "../components/View/CurrencyInput.vue";
import SelectForm from "../components/View/SelectForm.vue";
import RadioGroup from "../components/View/RadioGroup.vue";
import ButtonForm from "../components/View/ButtonForm.vue";
import { ref, watch, computed } from "vue";
import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { useUserData } from "../composables/useData";
import { useToast } from "../composables/useToast";
import { useTransactions } from "../composables/useTransactions";
import { useCategories } from "../composables/useCategories";
import { watchUserAndFetchAll } from "@/constants/watchers";
import { formatCurrency } from "@/services/supabase/data";
import {
  TRANSACTION_TYPE_OPTIONS,
  getDefaultTransaction,
} from "@/constants/forms";
import {
  getCategoryByIdFromRealData,
  formatRelativeDate,
  parseNumericAmount,
} from "@/utils/helpers";

const { user, isLoggedIn } = useUserData();
const { toast } = useToast();
const { categories, fetchCategories } = useCategories();
const {
  createTransaction,
  transactions: userTransactions,
  fetchTransactions,
  recentTransactions,
  loading: transactionsLoading,
} = useTransactions();

// Fetch categories when user is available
watchUserAndFetchAll(user, isLoggedIn, fetchCategories, fetchTransactions);

const form = ref(getDefaultTransaction());

// Transaction type options
const transactionTypes = ref(TRANSACTION_TYPE_OPTIONS);

// Filtered categories based on transaction type
const filteredCategories = computed(() => {
  if (!categories.value || !Array.isArray(categories.value)) {
    return [];
  }

  const filtered = categories.value.filter(
    (category) => category.type === form.value.type
  );

  return filtered;
});

// Watch transaction type change to reset category
watch(
  () => form.value.type,
  () => {
    form.value.category = ""; // Reset category when type changes
  }
);

const isSubmitting = ref(false);

const submitTransaction = async () => {
  try {
    isSubmitting.value = true;
    const numericAmount = parseNumericAmount(form.value.amount);

    // Validate category_id
    if (!form.value.category || form.value.category === "") {
      toast.error("Please select a category", {
        description: "Category is required to create a transaction",
      });
      return;
    }

    // Ensure category is a valid UUID or ID
    const categoryId = form.value.category;
    if (
      !categoryId ||
      (typeof categoryId === "string" && categoryId.trim() === "")
    ) {
      toast.error("Please select a valid category", {
        description: "Selected category is invalid",
      });
      return;
    }

    // Verify that the selected category exists in our list
    const selectedCategory = filteredCategories.value.find(
      (cat) => cat.id === categoryId
    );
    if (!selectedCategory) {
      toast.error("Selected category not found", {
        description: "Please select another category",
      });
      return;
    }

    // Prepare transaction data for database
    const transactionData = {
      type: form.value.type,
      amount: numericAmount,
      description: form.value.description,
      category_id: categoryId, // Use the categoryId directly (UUID or integer)
      date: form.value.date,
    };

    // Save to database using useTransactions
    await createTransaction(transactionData);

    // Reset form after successful creation
    form.value = getDefaultTransaction();
  } catch (error) {
    toast.error("Failed to add transaction", {
      description: "Please try again later",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const clearForm = () => {
  form.value = getDefaultTransaction();
};
</script>

<template>
  <AppLayout>
    <!-- Header -->
    <div
      class="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 flex-1"
    >
      <Header
        title="Add Transaction"
        subtitle="Record a new income or expense transaction"
      />
    </div>

    <!-- Form Card -->
    <div
      v-if="isLoggedIn"
      class="bg-white/5 rounded-lg shadow-lg mt-6 p-6 border border-gray-800"
    >
      <form @submit.prevent="submitTransaction" class="space-y-6">
        <!-- Transaction Type -->
        <RadioGroup
          v-model="form.type"
          :options="transactionTypes"
          name="transactionType"
          label="Transaction Type"
          direction="horizontal"
        />

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
            placeholder="Enter amount"
            currency="IDR"
            required
          />
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
          <SelectForm
            id="category"
            v-model="form.category"
            :options="filteredCategories"
            :optionValue="'id'"
            :optionLabel="'name'"
            placeholder="Select a category"
            required
          />
        </div>

        <!-- Date -->
        <div>
          <LabelInput for="date" label="Date" LabelIcon="CalendarIcon" />
          <InputForm id="date" v-model="form.date" type="date" required />
        </div>

        <!-- Actions -->
        <div class="flex space-x-4 pt-4">
          <ButtonForm
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            :icon="isSubmitting ? null : PlusIcon"
            block
          >
            {{ isSubmitting ? "Adding..." : "Add Transaction" }}
          </ButtonForm>

          <ButtonForm
            type="button"
            variant="secondary"
            :icon="XMarkIcon"
            @click="clearForm"
          >
            Clear
          </ButtonForm>
        </div>
      </form>
    </div>

    <!-- Recent Transactions Preview -->
    <div
      v-if="isLoggedIn"
      class="mt-8 bg-white/5 rounded-lg shadow-lg p-6 border border-gray-800"
    >
      <h3 class="text-lg font-semibold text-gray-200 mb-4">
        Recent Transactions
      </h3>

      <!-- Loading State -->
      <div v-if="transactionsLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div
            class="flex justify-between items-center py-2 border-b border-gray-800"
          >
            <div class="space-y-2">
              <div class="h-4 bg-gray-700 rounded w-32"></div>
              <div class="h-3 bg-gray-700 rounded w-48"></div>
            </div>
            <div class="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Data -->
      <div
        v-else-if="recentTransactions && recentTransactions.length > 0"
        class="space-y-3"
      >
        <div
          v-for="transaction in recentTransactions.slice(0, 3)"
          :key="transaction.id"
          class="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0"
        >
          <div>
            <p class="font-medium text-gray-200">
              {{ transaction.description }}
            </p>
            <p class="text-sm text-gray-500">
              {{ formatRelativeDate(transaction.date) }} •
              {{
                getCategoryByIdFromRealData(transaction.category_id, categories)
              }}
            </p>
          </div>
          <span
            :class="[
              'font-semibold',
              transaction.type === 'expense'
                ? 'text-red-400'
                : 'text-green-400',
            ]"
          >
            {{ transaction.type === "expense" ? "-" : "+" }}
            {{ formatCurrency(transaction.amount, transaction.type) }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 text-gray-500">
        <p>No transactions yet</p>
        <p class="text-sm mt-1">Add your first transaction above</p>
      </div>
    </div>

    <div
      v-if="!isLoggedIn"
      class="bg-white/5 rounded-lg p-8 mt-6 text-center border border-gray-800"
    >
      <div class="text-gray-400 text-lg">
        Please log in to view your transaction history.
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
