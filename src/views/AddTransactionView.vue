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
import { getCategoryByType } from "../lib/data";
import { useUserData } from "../composables/useData";

const { user, isLoggedIn } = useUserData();

const form = ref({
  amount: "",
  description: "",
  category: "",
  type: "expense", // 'expense' or 'income'
  date: new Date().toISOString().split("T")[0],
});

// Transaction type options
const transactionTypes = ref([
  {
    value: "expense",
    label: "Expense",
    color: "text-red-500 focus:ring-red-500",
  },
  {
    value: "income",
    label: "Income",
    color: "text-green-500 focus:ring-green-500",
  },
]);

// Categories berdasarkan transaction type (reactive)
const categories = computed(() => {
  return getCategoryByType(form.value.type, user.value.id);
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
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Transaction submitted:", {
    ...form.value,
    category_id: form.value.category, // category berisi ID
  });

  form.value = {
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  };

  isSubmitting.value = false;
  alert("Transaction added successfully!");
};

const clearForm = () => {
  form.value = {
    amount: "",
    description: "",
    category: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  };
};
</script>

<template>
  <AppLayout>
    <!-- Header -->
    <Header
      title="Add Transaction"
      subtitle="Record a new income or expense transaction"
    />

    <!-- Form Card -->
    <div
      v-if="isLoggedIn"
      class="bg-gray-900 rounded-lg shadow-lg mt-6 p-6 border border-gray-800"
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
            :options="categories"
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
      class="mt-8 bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800"
    >
      <h3 class="text-lg font-semibold text-gray-200 mb-4">
        Recent Transactions
      </h3>
      <div class="space-y-3">
        <div
          class="flex justify-between items-center py-2 border-b border-gray-800"
        >
          <div>
            <p class="font-medium text-gray-200">Grocery Shopping</p>
            <p class="text-sm text-gray-500">Today, 2:30 PM • Food & Dining</p>
          </div>
          <span class="text-red-400 font-semibold">-Rp 125.500</span>
        </div>
        <div
          class="flex justify-between items-center py-2 border-b border-gray-800"
        >
          <div>
            <p class="font-medium text-gray-200">Salary Deposit</p>
            <p class="text-sm text-gray-500">Yesterday, 9:00 AM • Income</p>
          </div>
          <span class="text-green-400 font-semibold">+Rp 4.200.000</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <div>
            <p class="font-medium text-gray-200">Coffee Shop</p>
            <p class="text-sm text-gray-500">
              2 days ago, 8:15 AM • Food & Dining
            </p>
          </div>
          <span class="text-red-400 font-semibold">-Rp 4.500</span>
        </div>
      </div>
    </div>

    <div
      v-if="!isLoggedIn"
      class="bg-gray-900 rounded-lg p-8 mt-6 text-center border border-gray-800"
    >
      <div class="text-gray-400 text-lg">
        Please log in to view your transaction history.
      </div>
    </div>
  </AppLayout>
</template>

<style scoped></style>
