"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Calendar, Filter, FileText, X, CheckCircle2, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

// ── Mock Data ─────────────────────────────────────────────────────────────────

const rawEarningsData = [
  { id: 1, date: "Saturday, June 21, 2025", rawDate: "2025-06-21", time: "6:45 PM", amount: 1400 },
  { id: 2, date: "Wednesday, June 18, 2025", rawDate: "2025-06-18", time: "4:15 PM", amount: 1300 },
  { id: 3, date: "Sunday, June 15, 2025", rawDate: "2025-06-15", time: "3:00 PM", amount: 900 },
  { id: 4, date: "Thursday, June 12, 2025", rawDate: "2025-06-12", time: "7:30 PM", amount: 1200 },
  { id: 5, date: "Thursday, June 12, 2025", rawDate: "2025-06-12", time: "1:10 PM", amount: 750 },
  { id: 6, date: "Tuesday, June 10, 2025", rawDate: "2025-06-10", time: "8:00 PM", amount: 2000 },
  { id: 7, date: "Monday, June 09, 2025", rawDate: "2025-06-09", time: "5:30 PM", amount: 1100 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Overview() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { items, totalAmount } = useMemo(() => {
    // 1. Filter logic using string comparison (reliable for YYYY-MM-DD)
    const filtered = rawEarningsData.filter(item => {
      if (!filterApplied || (!startDate && !endDate)) return true;
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;
      return true;
    });

    // 2. Sorting logic (Date descending)
    const sorted = [...filtered].sort((a, b) => b.rawDate.localeCompare(a.rawDate));

    // 3. Aggregate logic
    const total = sorted.reduce((sum, item) => sum + item.amount, 0);

    return { items: sorted, totalAmount: total };
  }, [startDate, endDate, filterApplied]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilterApplied(false);
  };

  return (
    <div className={`${outfit.className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-bg-card border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col gap-8 shadow-xl shadow-black/5"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="absolute -left-10 top-0 w-1 h-full bg-linear-to-b from-primary-dark to-accent rounded-full blur-[2px] opacity-70 hidden md:block" />
          <div className="flex flex-col gap-3">
             <h2 className={`${rochester.className} text-4xl text-text-main tracking-wide flex items-center gap-4`}>
                Earnings Overview
                <div className="h-px flex-1 bg-linear-to-r from-primary/50 to-transparent min-w-[100px]" />
             </h2>
             <p className="text-text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Review your daily breakdown and income history
             </p>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="h-12 px-6 bg-bg-secondary border border-border-main rounded-xl text-text-main text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-bg-secondary/80 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
          >
             {isExporting ? (
               <>
                 <div className="w-3 h-3 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                 Generating PDF...
               </>
             ) : (
               <>
                 <FileText size={14} />
                 Export as PDF
               </>
             )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-center gap-6 p-5 bg-bg-secondary rounded-[24px] border border-border-main shadow-inner">
           <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
              <PremiumDatePicker
                value={startDate}
                onChange={(val) => { setStartDate(val); setFilterApplied(false); }}
                placeholder="Start Date"
                className="flex-1"
              />

              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] px-2">To</span>

              <PremiumDatePicker
                value={endDate}
                onChange={(val) => { setEndDate(val); setFilterApplied(false); }}
                placeholder="End Date"
                className="flex-1"
              />
           </div>

           <button 
             onClick={() => setFilterApplied(true)}
             disabled={!startDate && !endDate}
             className={`w-full lg:w-auto h-14 px-10 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shrink-0 ${
               (!startDate && !endDate) 
               ? "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed" 
               : "bg-linear-to-r from-primary-dark to-accent text-white shadow-xl shadow-primary/20 active:scale-95 hover:shadow-primary/40"
             }`}
           >
             <Filter size={14} />
             Apply Filter
           </button>
        </div>

        {/* Results Summary Bar */}
        <AnimatePresence>
          {filterApplied && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary/5 border border-primary/10 rounded-2xl gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-primary" />
                </div>
                <div>
                   <p className="text-text-muted text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total Earned in Period</p>
                   <p className="text-text-main text-xl font-black">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
                   <CheckCircle2 size={12} className="text-emerald-500" />
                   <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">{items.length} Matches</span>
                </div>
                <button 
                  onClick={resetFilters}
                  className="w-10 h-10 rounded-full bg-bg-card hover:bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted hover:text-text-main transition-all"
                  title="Clear Filters"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Container */}
        <div className="relative overflow-x-auto rounded-2xl border border-border-main shadow-xl shadow-black/5">
           <table className="w-full text-left">
              <thead className="bg-linear-to-r from-primary-dark via-primary to-accent text-white shadow-lg">
                 <tr>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest border-r border-border-main">Date</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest border-r border-border-main">Time</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest text-right">Amount Earned</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                 <AnimatePresence mode="popLayout">
                    {items.map((row, idx) => (
                       <motion.tr 
                          key={row.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-primary/5 transition-colors group"
                       >
                          <td className="px-6 xl:px-8 py-5 xl:py-7 border-r border-border-main">
                             <div className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-accent/5 border border-primary/10 text-text-main text-xs xl:text-sm font-medium">
                                {row.date}
                             </div>
                          </td>
                          <td className="px-6 xl:px-8 py-5 xl:py-7 border-r border-border-main">
                             <div className="inline-block px-4 py-1.5 rounded-full bg-bg-card border border-border-main text-text-muted text-xs xl:text-sm font-medium italic">
                                {row.time}
                             </div>
                          </td>
                          <td className="px-6 xl:px-8 py-5 xl:py-7 text-right">
                             <span className="text-text-main text-base xl:text-lg font-black group-hover:text-primary transition-colors">₹{row.amount.toLocaleString()}</span>
                          </td>
                       </motion.tr>
                    ))}
                 </AnimatePresence>
              </tbody>
           </table>
           
           {items.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center gap-3">
                <Filter size={32} className="text-text-muted" />
                <p className="text-text-muted text-xs font-bold uppercase tracking-widest">No earnings found for this range</p>
                <button onClick={resetFilters} className="text-primary text-[10px] font-black uppercase underline underline-offset-4 decoration-primary/30">Reset Filters</button>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}
