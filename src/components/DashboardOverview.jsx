import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, DollarSign } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { motion } from "framer-motion";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const DashboardOverview = () => {
  const { totals, transactions, isLoading, activeTab } = useDashboard();

  // Preparation logic remains the same...
  const spendingByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const pieData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));

  const trendData = [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(t => ({
      date: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: t.amount,
      type: t.type,
      balance: 0
    }));
  
  let runningBalance = 0;
  const balanceTrendData = trendData.map(d => {
    runningBalance += (d.type === 'income' ? d.amount : -d.amount);
    return { ...d, balance: runningBalance };
  });

  const cards = [
    { label: "Total Balance", value: totals.balance, icon: <Wallet size={24} />, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/10" },
    { label: "Total Income", value: totals.income, icon: <ArrowUpRight size={24} />, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10" },
    { label: "Total Expenses", value: totals.expense, icon: <ArrowDownRight size={24} />, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/10" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) return null; // Wait for context loading

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            variants={itemVariants}
            key={i} 
            className="p-6 bg-card border rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <h2 className="text-2xl font-bold font-mono tracking-tight">${card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Trend Area Chart */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 p-6 bg-card border rounded-2xl shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Balance Trend</h3>
            <div className="flex items-center text-xs text-muted-foreground space-x-4">
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary mr-2" /> Recent Activity</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrendData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }} 
                  wrapperStyle={{ outline: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending Breakdown Pie Chart */}
        <motion.div 
          variants={itemVariants}
          className="p-6 bg-card border rounded-2xl shadow-sm space-y-6"
        >
          <h3 className="text-lg font-semibold">Spending Breakdown</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" className="outline-none cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pieData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
