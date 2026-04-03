import React from "react";
import { LayoutDashboard, Receipt, TrendingUp, Shield, User, Sun, Moon, X } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ className, activeTab, setActiveTab, isMobile, onClose }) => {
  const { userRole, setUserRole, isDarkMode, setIsDarkMode } = useDashboard();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", id: "dashboard" },
    { icon: <Receipt size={20} />, label: "Transactions", id: "transactions" },
    { icon: <TrendingUp size={20} />, label: "Insights", id: "insights" },
  ];

  return (
    <aside className={cn("flex flex-col h-screen", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-2 font-bold text-2xl text-primary">
            <Shield size={28} />
            <span>Zorvyn</span>
          </div>
          {isMobile && (
            <button
               onClick={onClose}
               className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-6">
        {/* User Profile & Role Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 px-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">S Venu</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse",
                  userRole === 'admin' ? "bg-emerald-500" : "bg-blue-500"
                )} />
                {userRole} Mode
              </p>
            </div>
          </div>

          <div className="bg-secondary/40 p-1 rounded-2xl border border-border/50 flex">
            {['viewer', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={cn(
                  "flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize",
                  userRole === role 
                    ? "bg-card text-primary shadow-sm ring-1 ring-border/20" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="group flex items-center justify-between w-full p-4 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/40 transition-all"
        >
          <div className="flex items-center space-x-3 text-muted-foreground group-hover:text-foreground transition-colors">
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-sm font-semibold">{isDarkMode ? "Dark" : "Light"}</span>
          </div>
          <div className={cn(
            "w-8 h-4 rounded-full relative transition-colors",
            isDarkMode ? "bg-primary" : "bg-muted"
          )}>
            <div className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
              isDarkMode ? "left-4.5" : "left-0.5"
            )} />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
