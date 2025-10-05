import { supabase } from "./supabase";

export const transactionService = {
  // Create new transaction
  async create(transaction) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction]).select(`
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `);

    if (error) throw error;
    return data[0];
  },

  // Get transactions by user
  async getByUserId(userId, options = {}) {
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Add filters if provided
    if (options.type) {
      query = query.eq("type", options.type);
    }
    if (options.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get transaction by ID
  async getById(id) {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update transaction
  async update(id, updates) {
    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id).select(`
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `);

    if (error) throw error;
    return data[0];
  },

  // Delete transaction
  async delete(id) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Get summary stats
  async getSummary(userId, dateRange = null) {
    let query = supabase
      .from("transactions")
      .select("type, amount")
      .eq("user_id", userId);

    if (dateRange) {
      query = query.gte("date", dateRange.from).lte("date", dateRange.to);
    }

    const { data, error } = await query;
    if (error) throw error;

    const summary = data.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );

    summary.balance = summary.totalIncome - summary.totalExpenses;
    summary.savingsRate =
      summary.totalIncome > 0
        ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
        : 0;

    return summary;
  },
};
