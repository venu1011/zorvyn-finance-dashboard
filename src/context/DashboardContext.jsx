import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { INITIAL_TRANSACTIONS } from "../data/mockData";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("dashboard_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("user_role") || "admin";
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All"); // All, income, expense
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, amount-desc, amount-asc
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Mock API Load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("user_role", userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addTransaction = (transaction) => {
    if (userRole !== "admin") return;
    setTransactions(prev => {
      const updated = [{ ...transaction, id: Date.now() }, ...prev];
      localStorage.setItem("dashboard_transactions", JSON.stringify(updated));
      return updated;
    });
  };

  const updateTransaction = (id, updatedData) => {
    if (userRole !== "admin") return;
    setTransactions(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updatedData } : t);
      localStorage.setItem("dashboard_transactions", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTransaction = (id) => {
    if (userRole !== "admin") return;
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem("dashboard_transactions", JSON.stringify(updated));
      return updated;
    });
  };

  const exportTransactions = () => {
    const csvRows = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...transactions.map(t => [t.date, t.description, t.category, t.type, t.amount])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === "income") acc.income += curr.amount;
      else acc.expense += curr.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      const matchesType = filterType === "All" || t.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, filterCategory, sortBy]);

  const value = {
    transactions,
    filteredTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    userRole,
    setUserRole,
    isDarkMode,
    setIsDarkMode,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    exportTransactions,
    isLoading,
    totals
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};
