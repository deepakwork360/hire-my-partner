"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Calendar, Filter, FileText, X, CheckCircle2, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";

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
        className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-10 flex flex-col gap-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="absolute -left-10 top-0 w-1 h-full bg-linear-to-b from-primary-dark to-accent rounded-full blur-[2px] opacity-70 hidden md:block" />
          <div className="flex flex-col gap-3">
             <h2 className={`${rochester.className} text-4xl text-white tracking-wide flex items-center gap-4`}>
                Earnings Overview
                <div className="h-px flex-1 bg-linear-to-r from-primary/50 to-transparent min-w-[100px]" />
             </h2>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Review your daily breakdown and income history
             </p>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="h-12 px-6 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 relative overflow-hidden"
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
        <div className="flex flex-col lg:flex-row items-center gap-6 p-5 bg-black/40 rounded-[24px] border border-white/10 shadow-inner">
           <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
              {/* Start Date */}
              <div className="relative flex-1 group w-full">
                  <Calendar size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none transition-transform group-hover:scale-110" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => {setStartDate(e.target.value); setFilterApplied(false);}}
                    className={`w-full h-14 pl-14 pr-10 bg-white/[0.02] border border-white/10 rounded-2xl text-slate-200 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all cursor-pointer relative z-10 [color-scheme:dark] ${
                      !startDate ? "text-transparent" : "text-slate-200"
                    }`}
                  />
                  {!startDate && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none z-0">
                      Start Date
                    </span>
                  )}
              </div>

              <span className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] px-2">To</span>

              {/* End Date */}
              <div className="relative flex-1 group w-full">
                  <Calendar size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary z-20 pointer-events-none transition-transform group-hover:scale-110" />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => {setEndDate(e.target.value); setFilterApplied(false);}}
                    className={`w-full h-14 pl-14 pr-10 bg-white/[0.02] border border-white/10 rounded-2xl text-slate-200 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all cursor-pointer relative z-10 [color-scheme:dark] ${
                      !endDate ? "text-transparent" : "text-slate-200"
                    }`}
                  />
                  {!endDate && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none z-0">
                      End Date
                    </span>
                  )}
              </div>
           </div>

           <button 
             onClick={() => setFilterApplied(true)}
             disabled={!startDate && !endDate}
             className={`w-full lg:w-auto h-14 px-10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 shrink-0 ${
               (!startDate && !endDate) 
               ? "bg-white/5 border border-white/5 text-slate-700 cursor-not-allowed" 
               : "bg-linear-to-r from-primary-dark to-accent shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] active:scale-95 hover:shadow-primary/50"
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
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total Earned in Period</p>
                   <p className="text-white text-xl font-black">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
                   <CheckCircle2 size={12} className="text-emerald-500" />
                   <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">{items.length} Matches</span>
                </div>
                <button 
                  onClick={resetFilters}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  title="Clear Filters"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Container */}
        <div className="relative overflow-x-auto rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <table className="w-full text-left">
              <thead className="bg-linear-to-r from-primary-dark via-primary to-accent text-white shadow-lg">
                 <tr>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest border-r border-white/10">Date</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest border-r border-white/10">Time</th>
                    <th className="px-6 xl:px-8 py-5 xl:py-7 text-[11px] xl:text-[12px] font-black uppercase tracking-widest text-right">Amount Earned</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 <AnimatePresence mode="popLayout">
                    {items.map((row, idx) => (
                       <motion.tr 
                          key={row.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-white/[0.04] transition-colors group"
                       >
                          <td className="px-6 xl:px-8 py-5 xl:py-7 border-r border-white/5">
                             <div className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-primary/10 to-accent/5 border border-primary/10 text-slate-300 text-xs xl:text-sm font-medium">
                                {row.date}
                             </div>
                          </td>
                          <td className="px-6 xl:px-8 py-5 xl:py-7 border-r border-white/5">
                             <div className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-primary/5 to-white/5 border border-white/10 text-slate-500 text-xs xl:text-sm font-medium italic">
                                {row.time}
                             </div>
                          </td>
                          <td className="px-6 xl:px-8 py-5 xl:py-7 text-right">
                             <span className="text-white text-base xl:text-lg font-black group-hover:text-primary transition-colors">₹{row.amount.toLocaleString()}</span>
                          </td>
                       </motion.tr>
                    ))}
                 </AnimatePresence>
              </tbody>
           </table>
           
           {items.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center gap-3">
                <Filter size={32} className="text-slate-700" />
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No earnings found for this range</p>
                <button onClick={resetFilters} className="text-primary text-[10px] font-black uppercase underline underline-offset-4">Reset Filters</button>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}
