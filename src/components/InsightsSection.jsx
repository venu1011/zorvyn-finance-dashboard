import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Target, Info } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { motion } from "framer-motion";

const InsightsSection = () => {
  const { transactions, totals, isLoading } = useDashboard();

  const insights = useMemo(() => {
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});
    
    let highestCategory = { name: 'None', amount: 0 };
    Object.entries(categorySpending).forEach(([name, amount]) => {
      if (amount > highestCategory.amount) highestCategory = { name, amount };
    });

    const savingsRate = totals.income > 0 ? ((totals.income - totals.expense) / totals.income) * 100 : 0;
    const largestExpense = [...transactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    return { highestCategory, savingsRate, largestExpense };
  }, [transactions, totals]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  if (isLoading) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold">Smart Insights</h3>
        <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded tracking-tighter">Analysis Tool</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Comparison Card */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
             <DollarSign size={100} />
          </div>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Income vs Expenses</p>
              <div className="p-2 bg-primary/10 text-primary rounded-lg uppercase text-[10px] font-bold">Direct Breakdown</div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Income</span>
                  <span className="font-bold text-emerald-600">${totals.income.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                    className="bg-emerald-500 h-full rounded-full" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Expenses</span>
                  <span className="font-bold text-rose-600">${totals.expense.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totals.expense / totals.income) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="bg-rose-500 h-full rounded-full" 
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Your expenses are <span className="font-bold text-foreground">{totals.income > 0 ? ((totals.expense / totals.income) * 100).toFixed(0) : 0}%</span> of your total income.
            </p>
          </div>
        </motion.div>

        {/* Highest Category Card */}
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-rose-500"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl dark:bg-rose-900/10">
              <TrendingUp size={24} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Spending</p>
              <h4 className="text-2xl font-bold tracking-tight">{insights.highestCategory.name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You've spent <span className="font-bold text-foreground">${insights.highestCategory.amount.toLocaleString()}</span> on {insights.highestCategory.name} this period.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Savings Rate Card */}
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-500"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-900/10">
              <Target size={24} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Savings Rate</p>
              <h4 className="text-2xl font-bold tracking-tight">{Math.max(0, insights.savingsRate).toFixed(1)}%</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insights.savingsRate > 20 
                  ? "Excellent! You're saving more than 20% of your income." 
                  : "Keep it up! Try to aim for a 20% savings rate."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tip / Observation */}
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-secondary/30 border border-dashed rounded-2xl space-y-4"
        >
          <div className="flex items-center space-x-2 text-primary">
            <Info size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Financial Tip</span>
          </div>
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "Avoid impulse purchases by waiting 24 hours before buying non-essentials. Your largest expense this month was <span className="font-bold text-foreground">'{insights.largestExpense?.description || 'N/A'}'</span>."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InsightsSection;
