import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Download } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import TransactionModal from "./TransactionModal";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TransactionsSection = () => {
  const { 
    transactions, 
    deleteTransaction, 
    userRole, 
    searchQuery, 
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    setSortBy,
    categories 
  } = useDashboard();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      const matchesType = filterType === "All" || t.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, searchQuery, filterCategory, filterType]);

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.amount,
      t.type
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `zorvyn_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20 md:pb-0"
    >
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search descriptions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-card border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-card border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button 
            onClick={exportToCSV}
            className="p-2.5 bg-card border rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shadow-sm"
            title="Export CSV"
          >
            <Download size={20} />
          </button>

          {userRole === 'admin' && (
            <button 
              onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-primary/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setSortBy('category')}
                >
                  Category
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-primary transition-colors text-right"
                  onClick={() => setSortBy('amount')}
                >
                  Amount
                </th>
                <th 
                  className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-primary transition-colors text-right"
                  onClick={() => setSortBy('date')}
                >
                  Date
                </th>
                {userRole === 'admin' && <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTransactions.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={userRole === 'admin' ? 5 : 4} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                        <div className="p-6 bg-secondary/50 rounded-full">
                          <Search size={40} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold">No items found</p>
                          <p className="text-xs max-w-[200px] mx-auto text-muted-foreground">Adjust your filters or try a different search term to see results.</p>
                        </div>
                        <button 
                          onClick={() => { setSearchQuery(""); setFilterCategory("All"); setFilterType("All"); }}
                          className="mt-2 text-xs font-bold text-primary hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={t.id} 
                      className="border-b last:border-0 hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-transparent",
                            t.type === 'income' 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-500/20" 
                              : "bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:border-rose-500/20"
                          )}>
                            {t.type === 'income' ? <Plus size={16} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold tracking-tight text-sm line-clamp-1">{t.description}</span>
                            <span className="text-[10px] text-muted-foreground md:hidden">{t.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary/50 text-muted-foreground uppercase tracking-widest border border-border/50">
                          {t.category}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 font-black text-right tracking-tight tabular-nums",
                        t.type === 'income' ? "text-emerald-600" : "text-foreground"
                      )}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground text-right font-bold whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                      </td>
                      {userRole === 'admin' && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }}
                              className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteTransaction(t.id)}
                              className="p-2 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} 
          editingTransaction={editingTransaction}
        />
      )}
    </motion.div>
  );
};

export default TransactionsSection;
