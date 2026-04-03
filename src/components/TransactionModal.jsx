import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, Calendar, Hash, Tag, Type } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { CATEGORIES } from "../data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const TransactionModal = ({ isOpen, onClose, editingTransaction }) => {
  const { addTransaction, updateTransaction } = useDashboard();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Salary",
    type: "income",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({ 
        ...editingTransaction, 
        amount: editingTransaction.amount.toString() 
      });
    } else {
      setFormData({ 
        description: "", 
        amount: "", 
        category: "Salary", 
        type: "income", 
        date: new Date().toISOString().split('T')[0] 
      });
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    const data = { ...formData, amount: parseFloat(formData.amount) };
    if (editingTransaction) updateTransaction(editingTransaction.id, data);
    else addTransaction(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card border rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-8 border-b bg-secondary/10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight">
              {editingTransaction ? "Edit Transaction" : "New Transaction"}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">Enter the details of your financial activity</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Type size={14} />
              <label className="text-[10px] font-black uppercase tracking-widest">Description</label>
            </div>
            <input
              required
              autoFocus
              type="text"
              className="w-full bg-secondary/30 border border-border/50 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:outline-none transition-all font-medium text-sm"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Hash size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest">Amount ($)</label>
              </div>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-secondary/30 border border-border/50 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-mono font-bold text-sm"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Tag size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest">Type</label>
              </div>
              <select
                className="w-full bg-secondary/30 border border-border/50 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer font-bold text-sm"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Tag size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest">Category</label>
              </div>
              <select
                className="w-full bg-secondary/30 border border-border/50 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer font-bold text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar size={14} />
                <label className="text-[10px] font-black uppercase tracking-widest">Date</label>
              </div>
              <input
                required
                type="date"
                className="w-full bg-secondary/30 border border-border/50 px-4 py-3 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-bold text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-secondary rounded-2xl transition-all text-muted-foreground active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all"
            >
              <Save size={16} />
              <span>{editingTransaction ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionModal;
