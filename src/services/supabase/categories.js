import { supabase } from "./supabase";

export const categoryService = {
  // Get categories by user
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name");

    if (error) throw error;
    return data;
  },

  // Get categories by type
  async getByType(userId, type) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type)
      .order("name");

    if (error) throw error;
    return data;
  },

  // Create category
  async create(category) {
    const { data, error } = await supabase
      .from("categories")
      .insert([category])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Create multiple categories in batch
  async createBatch(categories) {
    const { data, error } = await supabase
      .from("categories")
      .insert(categories)
      .select();

    if (error) throw error;
    return data;
  },

  // Update category
  async update(id, updates) {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete category
  async delete(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};
