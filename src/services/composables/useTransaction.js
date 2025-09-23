import { ref, computed } from "vue";
import { transactionService } from "../supabase";
import { useUserData } from "./useData";
import { useToast } from "./useToast";
import { formatCurrency } from "../supabase/data";

export const useTransactions = () => {
  const { user } = useUserData();
  const { toast } = useToast();
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Create transaction
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

      transactions.value.unshift(newTransaction);

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

  // Fetch transactions
  const fetchTransactions = async (options = {}) => {
    try {
      loading.value = true;
      error.value = null;

      const data = await transactionService.getByUserId(user.value.id, options);
      transactions.value = data;

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

      toast.success("Transaction updated successfully!");

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

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      await transactionService.delete(id);

      transactions.value = transactions.value.filter((t) => t.id !== id);

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
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
  };
};
