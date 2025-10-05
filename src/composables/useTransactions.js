import { ref, computed } from "vue";
import { transactionService } from "../services/supabase";
import { useUserData } from "./useData";
import { useToast } from "./useToast";
import { formatCurrency } from "../services/supabase/data";
import { useDataCache } from "./useDataCache";

export const useTransactions = () => {
  const { user } = useUserData();
  const { toast } = useToast();
  const { getCachedData, setCachedData, clearCache } = useDataCache();

  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Create transaction (invalidate cache)
  const createTransaction = async (transactionData) => {
    try {
      loading.value = true;
      error.value = null;

      const newTransaction = await transactionService.create({
        ...transactionData,
        user_id: user.value.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Add to local state
      transactions.value.unshift(newTransaction);

      // Update cache
      setCachedData("transactions", transactions.value, user.value.id);

      toast.success("Transaction added successfully!", {
        description: `${
          transactionData.type === "income" ? "+" : "-"
        }${formatCurrency(transactionData.amount)}`,
      });

      return newTransaction;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to add transaction", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch transactions with caching
  const fetchTransactions = async (options = {}) => {
    if (!user.value?.id) return;

    try {
      // Check cache first
      const cachedTransactions = getCachedData("transactions", user.value.id);
      if (cachedTransactions && !options.forceRefresh) {
        transactions.value = cachedTransactions;
        return cachedTransactions;
      }

      loading.value = true;
      error.value = null;

      const data = await transactionService.getByUserId(user.value.id, options);
      transactions.value = data;

      // Cache the data
      setCachedData("transactions", data, user.value.id);

      return data;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to fetch transactions", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // recent transactions
  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 5);
  });

  // Update transaction
  const updateTransaction = async (id, updates) => {
    try {
      loading.value = true;
      error.value = null;

      const updatedTransaction = await transactionService.update(id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      const index = transactions.value.findIndex((t) => t.id === id);
      if (index > -1) {
        transactions.value[index] = updatedTransaction;
      }

      // Update cache
      setCachedData("transactions", transactions.value, user.value.id);

      // Remove toast from here to prevent duplicate with modal toast
      // toast.success("Transaction updated successfully!");

      return updatedTransaction;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to update transaction", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get transaction by ID
  const getTransactionById = async (id) => {
    try {
      // First try to find in local state
      const localTransaction = transactions.value.find((t) => t.id === id);
      if (localTransaction) {
        return localTransaction;
      }

      // If not found locally, fetch from server
      loading.value = true;
      const transaction = await transactionService.getById(id);
      return transaction;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to fetch transaction", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      await transactionService.delete(id);

      transactions.value = transactions.value.filter((t) => t.id !== id);

      // Update cache
      setCachedData("transactions", transactions.value, user.value.id);

      toast.success("Transaction deleted successfully!");

      return true;
    } catch (err) {
      error.value = err.message;
      toast.error("Failed to delete transaction", {
        description: err.message,
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Force refresh (bypass cache)
  const refreshTransactions = () => {
    return fetchTransactions({ forceRefresh: true });
  };

  // Clear cache manually
  const clearTransactionCache = () => {
    clearCache("transactions");
  };

  // Computed properties
  const totalIncome = computed(() =>
    transactions.value
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpenses = computed(() =>
    transactions.value
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = computed(() => totalIncome.value - totalExpenses.value);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    fetchTransactions,
    refreshTransactions,
    clearTransactionCache,
    recentTransactions,
    updateTransaction,
    getTransactionById,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
  };
};
