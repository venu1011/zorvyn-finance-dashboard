import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import TransactionsSection from "./components/TransactionsSection";
import InsightsSection from "./components/InsightsSection";
import { useDashboard } from "./context/DashboardContext";

function App() {
  const { userRole, activeTab, setActiveTab } = useDashboard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, message: "" });
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setToast({ show: true, message: `Access Level: ${userRole.toUpperCase()}` });
    const timer = setTimeout(() => setToast({ show: false, message: "" }), 3000);
    return () => clearTimeout(timer);
  }, [userRole]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardOverview />;
      case "transactions": return <TransactionsSection />;
      case "insights": return <InsightsSection />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-4 left-1/2 z-[100] bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center space-x-2 border border-primary-foreground/20"
          >
            <Shield size={18} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
        {/* Desktop Sidebar */}
        <Sidebar 
          className="w-64 border-r bg-card hidden md:flex" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-b z-40 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                   <Shield size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1">Zorvyn</span>
              <span className="text-base font-black capitalize leading-none">{activeTab}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 hover:bg-secondary rounded-xl border border-transparent hover:border-border transition-all active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <Sidebar 
              className="relative w-3/4 max-w-xs h-full bg-card shadow-2xl animate-in slide-in-from-left duration-300" 
              activeTab={activeTab} 
              setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
              onClose={() => setIsMobileMenuOpen(false)}
              isMobile
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-24 pb-8 md:py-8 space-y-8">
          <header className="hidden md:flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
          </header>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
    </div>
  );
}

export default App;
