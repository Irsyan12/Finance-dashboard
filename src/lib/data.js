// Data transaksi untuk Finance Dashboard
// Format mata uang: Rupiah (Rp)

export const categories = [
  // Expense Categories
  { id: 1, name: "Food & Dining", type: "expense", color: "#ef4444" },
  { id: 2, name: "Transportation", type: "expense", color: "#f97316" },
  { id: 3, name: "Shopping", type: "expense", color: "#8b5cf6" },
  { id: 4, name: "Entertainment", type: "expense", color: "#f59e0b" },
  { id: 5, name: "Bills & Utilities", type: "expense", color: "#06b6d4" },
  { id: 6, name: "Healthcare", type: "expense", color: "#84cc16" },
  { id: 7, name: "Education", type: "expense", color: "#3b82f6" },
  { id: 8, name: "Travel", type: "expense", color: "#ec4899" },
  { id: 9, name: "Other", type: "expense", color: "#6b7280" },

  // Income Categories
  { id: 10, name: "Salary", type: "income", color: "#10b981" },
  { id: 11, name: "Freelancing", type: "income", color: "#22c55e" },
  { id: 12, name: "Investment", type: "income", color: "#6366f1" },
  { id: 13, name: "Business", type: "income", color: "#14b8a6" },
  { id: 14, name: "Other Income", type: "income", color: "#059669" },
];

export const transactions = [
  // Income Transactions
  {
    id: 1,
    type: "income",
    amount: 5500000,
    category_id: 10,
    category: "Salary",
    description: "Gaji Bulanan September",
    date: "2024-09-01",
    created_at: "2024-09-01T08:00:00Z",
  },
  {
    id: 2,
    type: "income",
    amount: 1200000,
    category_id: 11,
    category: "Freelancing",
    description: "Proyek Website Client",
    date: "2024-09-15",
    created_at: "2024-09-15T14:30:00Z",
  },
  {
    id: 3,
    type: "income",
    amount: 750000,
    category_id: 12,
    category: "Investment",
    description: "Dividen Saham BBCA",
    date: "2024-09-10",
    created_at: "2024-09-10T09:15:00Z",
  },
  {
    id: 4,
    type: "income",
    amount: 350000,
    category_id: 11,
    category: "Freelancing",
    description: "Konsultasi IT",
    date: "2024-09-20",
    created_at: "2024-09-20T16:45:00Z",
  },

  // Expense Transactions
  {
    id: 5,
    type: "expense",
    amount: 450000,
    category_id: 1,
    category: "Food & Dining",
    description: "Belanja Groceries Bulanan",
    date: "2024-09-21",
    created_at: "2024-09-21T10:30:00Z",
  },
  {
    id: 6,
    type: "expense",
    amount: 25000,
    category_id: 1,
    category: "Food & Dining",
    description: "Kopi & Snack",
    date: "2024-09-21",
    created_at: "2024-09-21T14:15:00Z",
  },
  {
    id: 7,
    type: "expense",
    amount: 150000,
    category_id: 2,
    category: "Transportation",
    description: "Isi Bensin Motor",
    date: "2024-09-20",
    created_at: "2024-09-20T07:45:00Z",
  },
  {
    id: 8,
    type: "expense",
    amount: 75000,
    category_id: 2,
    category: "Transportation",
    description: "Ojek Online",
    date: "2024-09-19",
    created_at: "2024-09-19T18:20:00Z",
  },
  {
    id: 9,
    type: "expense",
    amount: 850000,
    category_id: 5,
    category: "Bills & Utilities",
    description: "Tagihan Listrik",
    date: "2024-09-18",
    created_at: "2024-09-18T11:00:00Z",
  },
  {
    id: 10,
    type: "expense",
    amount: 120000,
    category_id: 5,
    category: "Bills & Utilities",
    description: "Internet & WiFi",
    date: "2024-09-17",
    created_at: "2024-09-17T09:30:00Z",
  },
  {
    id: 11,
    type: "expense",
    amount: 200000,
    category_id: 4,
    category: "Entertainment",
    description: "Nonton Bioskop",
    date: "2024-09-16",
    created_at: "2024-09-16T19:45:00Z",
  },
  {
    id: 12,
    type: "expense",
    amount: 320000,
    category_id: 3,
    category: "Shopping",
    description: "Beli Baju & Sepatu",
    date: "2024-09-15",
    created_at: "2024-09-15T13:20:00Z",
  },
  {
    id: 13,
    type: "expense",
    amount: 180000,
    category_id: 6,
    category: "Healthcare",
    description: "Konsultasi Dokter",
    date: "2024-09-14",
    created_at: "2024-09-14T15:30:00Z",
  },
  {
    id: 14,
    type: "expense",
    amount: 45000,
    category_id: 1,
    category: "Food & Dining",
    description: "Makan Siang Restoran",
    date: "2024-09-13",
    created_at: "2024-09-13T12:15:00Z",
  },
  {
    id: 15,
    type: "expense",
    amount: 95000,
    category_id: 2,
    category: "Transportation",
    description: "Parkir & Tol",
    date: "2024-09-12",
    created_at: "2024-09-12T08:45:00Z",
  },
  {
    id: 16,
    type: "expense",
    amount: 500000,
    category_id: 7,
    category: "Education",
    description: "Kursus Online Programming",
    date: "2024-09-11",
    created_at: "2024-09-11T20:00:00Z",
  },
  {
    id: 17,
    type: "expense",
    amount: 65000,
    category_id: 1,
    category: "Food & Dining",
    description: "Delivery Food",
    date: "2024-09-10",
    created_at: "2024-09-10T19:30:00Z",
  },
  {
    id: 18,
    type: "expense",
    amount: 250000,
    category_id: 4,
    category: "Entertainment",
    description: "Game Online & Spotify",
    date: "2024-09-09",
    created_at: "2024-09-09T21:15:00Z",
  },
  {
    id: 19,
    type: "expense",
    amount: 35000,
    category_id: 1,
    category: "Food & Dining",
    description: "Bubble Tea",
    date: "2024-09-08",
    created_at: "2024-09-08T16:00:00Z",
  },
  {
    id: 20,
    type: "expense",
    amount: 425000,
    category_id: 3,
    category: "Shopping",
    description: "Skincare & Kosmetik",
    date: "2024-09-07",
    created_at: "2024-09-07T14:45:00Z",
  },
];

// Helper functions untuk analisis data
export const getTransactionsByType = (type) => {
  return transactions.filter((t) => t.type === type);
};

export const getTransactionsByCategory = (categoryName) => {
  return transactions.filter((t) => t.category === categoryName);
};

export const getTotalByType = (type) => {
  return getTransactionsByType(type).reduce((sum, t) => sum + t.amount, 0);
};

export const getExpensesByCategory = () => {
  const expenses = getTransactionsByType("expense");
  const categoryTotals = {};

  expenses.forEach((t) => {
    if (categoryTotals[t.category]) {
      categoryTotals[t.category] += t.amount;
    } else {
      categoryTotals[t.category] = t.amount;
    }
  });

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getIncomeByCategory = () => {
  const income = getTransactionsByType("income");
  const categoryTotals = {};

  income.forEach((t) => {
    if (categoryTotals[t.category]) {
      categoryTotals[t.category] += t.amount;
    } else {
      categoryTotals[t.category] = t.amount;
    }
  });

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getRecentTransactions = (limit = 5) => {
  return [...transactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
};

export const getSummaryStats = () => {
  const totalIncome = getTotalByType("income");
  const totalExpenses = getTotalByType("expense");
  const balance = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    transactionCount: transactions.length,
  };
};

// Format currency untuk display
export const formatCurrency = (amount) => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

// Get category by ID
export const getCategoryById = (id) => {
  return categories.find((c) => c.id === id);
};

// Get category color
export const getCategoryColor = (categoryName) => {
  const category = categories.find((c) => c.name === categoryName);
  return category ? category.color : "#6b7280";
};
