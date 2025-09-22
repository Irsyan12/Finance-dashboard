// Data transaksi untuk Finance Dashboard
// Format mata uang: Rupiah (Rp)

export const categoriesData = [
  // Expense Categories
  {
    id: 1,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Food & Dining",
    type: "expense",
    color: "#ef4444",
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Transportation",
    type: "expense",
    color: "#f97316",
  },
  {
    id: 3,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Shopping",
    type: "expense",
    color: "#8b5cf6",
  },
  {
    id: 4,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Entertainment",
    type: "expense",
    color: "#f59e0b",
  },
  {
    id: 5,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Bills & Utilities",
    type: "expense",
    color: "#06b6d4",
  },
  {
    id: 6,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Healthcare",
    type: "expense",
    color: "#84cc16",
  },
  {
    id: 7,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Education",
    type: "expense",
    color: "#3b82f6",
  },
  {
    id: 8,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Travel",
    type: "expense",
    color: "#ec4899",
  },
  {
    id: 9,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Other",
    type: "expense",
    color: "#6b7280",
  },

  // Income Categories
  {
    id: 10,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Salary",
    type: "income",
    color: "#10b981",
  },
  {
    id: 11,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Freelancing",
    type: "income",
    color: "#22c55e",
  },
  {
    id: 12,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Investment",
    type: "income",
    color: "#6366f1",
  },
  {
    id: 13,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Business",
    type: "income",
    color: "#14b8a6",
  },
  {
    id: 14,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    name: "Other Income",
    type: "income",
    color: "#059669",
  },
  {
    id: 15,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    name: "Gift",
    type: "income",
    color: "#22c55e",
  },
];

export const transactions = [
  // Income Transactions
  {
    id: 1,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "income",
    amount: 5500000,
    category_id: 10,
    description: "Monthly salary from company",
    date: "2024-09-01",
    created_at: "2024-09-01T08:00:00Z",
  },
  {
    id: 2,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "income",
    amount: 1200000,
    category_id: 11,
    description: "Web development project",
    date: "2024-09-15",
    created_at: "2024-09-15T14:30:00Z",
  },
  {
    id: 3,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "income",
    amount: 750000,
    category_id: 12,
    description: "Stock dividend payment",
    date: "2024-09-10",
    created_at: "2024-09-10T09:15:00Z",
  },
  {
    id: 4,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "income",
    amount: 350000,
    category_id: 11,
    description: "Logo design freelance",
    date: "2024-09-20",
    created_at: "2024-09-20T16:45:00Z",
  },

  // Expense Transactions
  {
    id: 5,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 450000,
    category_id: 1,
    description: "Groceries at Supermart",
    date: "2024-09-21",
    created_at: "2024-09-21T10:30:00Z",
  },
  {
    id: 6,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 25000,
    category_id: 1,
    description: "Lunch at Cafe",
    date: "2024-09-21",
    created_at: "2024-09-21T14:15:00Z",
  },
  {
    id: 7,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 150000,
    category_id: 2,
    description: "Ojek online to office",
    date: "2024-09-20",
    created_at: "2024-09-20T07:45:00Z",
  },
  {
    id: 8,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 75000,
    category_id: 2,
    description: "Bus fare to mall",
    date: "2024-09-19",
    created_at: "2024-09-19T18:20:00Z",
  },
  {
    id: 9,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 850000,
    category_id: 5,
    description: "Monthly electricity bill",
    date: "2024-09-18",
    created_at: "2024-09-18T11:00:00Z",
  },
  {
    id: 10,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 120000,
    category_id: 5,
    description: "Internet bill payment",
    date: "2024-09-17",
    created_at: "2024-09-17T09:30:00Z",
  },
  {
    id: 11,
    user_id: "50eaed3b-b7c3-4b04-a500-e78f84d09e0d",
    type: "expense",
    amount: 200000,
    category_id: 4,
    description: "Movie tickets at cinema",
    date: "2024-09-16",
    created_at: "2024-09-16T19:45:00Z",
  },
  {
    id: 12,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 320000,
    category_id: 3,
    description: "New shirt and pants",
    date: "2024-09-15",
    created_at: "2024-09-15T13:20:00Z",
  },
  {
    id: 13,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 180000,
    category_id: 6,
    description: "Doctor consultation",
    date: "2024-09-14",
    created_at: "2024-09-14T15:30:00Z",
  },
  {
    id: 14,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 45000,
    category_id: 1,
    description: "Coffee and snacks",
    date: "2024-09-13",
    created_at: "2024-09-13T12:15:00Z",
  },
  {
    id: 15,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 95000,
    category_id: 2,
    description: "Taxi to airport",
    date: "2024-09-12",
    created_at: "2024-09-12T08:45:00Z",
  },
  {
    id: 16,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 500000,
    category_id: 7,
    description: "Online course subscription",
    date: "2024-09-11",
    created_at: "2024-09-11T20:00:00Z",
  },
  {
    id: 17,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 65000,
    category_id: 1,
    description: "Breakfast at restaurant",
    date: "2024-09-10",
    created_at: "2024-09-10T19:30:00Z",
  },
  {
    id: 18,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 250000,
    category_id: 4,
    description: "Concert tickets",
    date: "2024-09-09",
    created_at: "2024-09-09T21:15:00Z",
  },
  {
    id: 19,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 35000,
    category_id: 1,
    description: "Ice cream and drinks",
    date: "2024-09-08",
    created_at: "2024-09-08T16:00:00Z",
  },
  {
    id: 20,
    user_id: "eb4ef3ce-a2cb-460a-9816-a92e771911f4",
    type: "expense",
    amount: 425000,
    category_id: 3,
    description: "New shoes and accessories",
    date: "2024-09-07",
    created_at: "2024-09-07T14:45:00Z",
  },
];

// Helper functions untuk analisis data
export const getTransactionsByType = (type) => {
  return transactions.filter((t) => t.type === type);
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
  return `Rp. ${amount.toLocaleString("id-ID")}`;
};

export const getCategoryByUser = (userId) => {
  return categoriesData.filter((c) => c.user_id === userId);
};

export const getCategoryByType = (type, userId) => {
  return categoriesData.filter((c) => c.type === type && c.user_id === userId);
};
