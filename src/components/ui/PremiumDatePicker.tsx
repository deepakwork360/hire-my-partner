"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface PremiumDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function PremiumDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  label,
  className = "",
}: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or use today
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${d}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    // Padding for start offset
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = selectedDate?.getDate() === day && 
                         selectedDate?.getMonth() === month && 
                         selectedDate?.getFullYear() === year;
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === month && 
                      new Date().getFullYear() === year;

      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDateSelect(day);
          }}
          className={`h-9 w-9 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center relative ${
            isSelected 
            ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-10" 
            : isToday
              ? "text-primary border border-primary/30"
              : "text-text-muted hover:bg-bg-card hover:text-text-main"
          }`}
        >
          {day}
          {isToday && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 ${outfit.className} ${className} ${isOpen ? "z-10000" : "z-auto"}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-14 pl-5 pr-12 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group/btn border border-border-main bg-bg-base shadow-sm ${
            isOpen ? "border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" : "hover:border-primary/30"
          }`}
        >
          <CalendarIcon 
            size={18} 
            className={`transition-colors duration-300 ${isOpen || value ? "text-primary" : "text-text-muted group-hover/btn:text-primary"}`} 
          />
          
          <div className="flex flex-col">
              {value && (
                <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 text-primary/60`}>
                  {placeholder}
                </span>
              )}
             <span className={`text-xs font-bold ${value ? "text-text-main" : "text-text-muted"}`}>
               {value ? selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Choose a date"}
             </span>
          </div>

          {value && isOpen && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-12 p-1 hover:bg-bg-card rounded-full transition-colors z-20"
            >
              <X size={14} className="text-text-muted" />
            </div>
          )}

          <ChevronRight 
            size={16} 
            className={`absolute right-5 transition-transform duration-500 text-text-muted ${isOpen ? "rotate-90 text-primary" : ""}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-100 top-full mt-3 w-72 bg-bg-secondary border border-border-main rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl p-5 overflow-hidden"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-bg-card rounded-xl text-text-muted hover:text-text-main transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="text-center">
                   <p className="text-xs font-black uppercase tracking-widest text-text-main">
                     {monthNames[viewDate.getMonth()]}
                   </p>
                   <p className="text-[10px] font-bold text-primary/60">
                     {viewDate.getFullYear()}
                   </p>
                </div>

                <button 
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-bg-card rounded-xl text-text-muted hover:text-text-main transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-[8px] font-black uppercase text-text-muted/60">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>

              {/* Footer Decoration */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
