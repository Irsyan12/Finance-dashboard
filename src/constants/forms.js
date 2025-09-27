/**
 * Default form values and configurations
 */

// Default new category form
export const DEFAULT_NEW_CATEGORY = {
  name: "",
  color: "#3b82f6",
  type: "expense",
};

// Default transaction form
export const DEFAULT_NEW_TRANSACTION = {
  amount: "",
  description: "",
  category: "",
  type: "expense",
  date: () => new Date().toISOString().split("T")[0], // Function to get current date
};

// Transaction type options
export const TRANSACTION_TYPE_OPTIONS = [
  {
    value: "expense",
    label: "Expense",
  },
  {
    value: "income",
    label: "Income",
  },
];

// Filter default values
export const DEFAULT_FILTERS = {
  type: "all",
  category: "all",
  dateRange: "all", // 'all', 'today', 'week', 'month', 'custom'
  customDateFrom: "",
  customDateTo: "",
  minAmount: "",
  maxAmount: "",
  searchText: "",
};

// Date range options for filters
export const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

// Helper function to get fresh default transaction
export const getDefaultTransaction = () => ({
  ...DEFAULT_NEW_TRANSACTION,
  date: DEFAULT_NEW_TRANSACTION.date(),
});

// Helper function to get fresh default category
export const getDefaultCategory = () => ({
  ...DEFAULT_NEW_CATEGORY,
});
