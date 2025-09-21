import { ref, computed } from "vue";
import {
  transactions as rawTransactions,
  categories as rawCategories,
  getTransactionsByType,
  getTotalByType,
  getExpensesByCategory,
  getIncomeByCategory,
  getRecentTransactions,
  getSummaryStats,
  formatCurrency,
} from "@/lib/data";

// Composable untuk data transaksi
export const useTransactions = () => {
  const transactions = ref(rawTransactions);
  const categories = ref(rawCategories);

  // Computed properties
  const totalIncome = computed(() => getTotalByType("income"));
  const totalExpenses = computed(() => getTotalByType("expense"));
  const balance = computed(() => totalIncome.value - totalExpenses.value);
  const savingsRate = computed(() => {
    if (totalIncome.value === 0) return 0;
    return ((balance.value / totalIncome.value) * 100).toFixed(1);
  });

  const expensesByCategory = computed(() => getExpensesByCategory());
  const incomeByCategory = computed(() => getIncomeByCategory());
  const recentTransactions = computed(() => getRecentTransactions(5));
  const summaryStats = computed(() => getSummaryStats());

  // Methods
  const addTransaction = (transaction) => {
    const newId = Math.max(...transactions.value.map((t) => t.id)) + 1;
    const newTransaction = {
      id: newId,
      created_at: new Date().toISOString(),
      ...transaction,
    };
    transactions.value.push(newTransaction);
  };

  const updateTransaction = (id, updatedData) => {
    const index = transactions.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...updatedData,
        updated_at: new Date().toISOString(),
      };
    }
  };

  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter((t) => t.id !== id);
  };

  const getTransactionById = (id) => {
    return transactions.value.find((t) => t.id === id);
  };

  return {
    // Data
    transactions,
    categories,

    // Computed
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    expensesByCategory,
    incomeByCategory,
    recentTransactions,
    summaryStats,

    // Methods
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    formatCurrency,
  };
};

// Composable untuk kategori
export const useCategories = () => {
  const categories = ref(rawCategories);

  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === "expense")
  );

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === "income")
  );

  const addCategory = (category) => {
    const newId = Math.max(...categories.value.map((c) => c.id)) + 1;
    const newCategory = {
      id: newId,
      created_at: new Date().toISOString(),
      ...category,
    };
    categories.value.push(newCategory);
  };

  const updateCategory = (id, updatedData) => {
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...updatedData,
        updated_at: new Date().toISOString(),
      };
    }
  };

  const deleteCategory = (id) => {
    categories.value = categories.value.filter((c) => c.id !== id);
  };

  const getCategoryById = (id) => {
    return categories.value.find((c) => c.id === id);
  };

  return {
    categories,
    expenseCategories,
    incomeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};
