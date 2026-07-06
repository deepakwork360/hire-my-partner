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
  hasError?: boolean;
  isValid?: boolean;
  minDate?: Date;
}

export default function PremiumDatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  label,
  className = "",
  hasError = false,
  isValid = false,
  minDate,
}: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [panelMode, setPanelMode] = useState<"days" | "month" | "year">("days");
  const containerRef = useRef<HTMLDivElement>(null);
  const yearGridRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected year into view in year selection list
  useEffect(() => {
    if (panelMode === "year" && yearGridRef.current) {
      const activeYearElement = document.getElementById("active-year-btn");
      if (activeYearElement) {
        const container = yearGridRef.current;
        const offsetTop = activeYearElement.offsetTop;
        const containerHeight = container.clientHeight;
        const elementHeight = activeYearElement.clientHeight;
        
        container.scrollTop = offsetTop - (containerHeight / 2) + (elementHeight / 2);
      }
    }
  }, [panelMode]);

  // Reset back to days view when datepicker closes
  useEffect(() => {
    if (!isOpen) {
      setPanelMode("days");
    }
  }, [isOpen]);

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

  const canGoPrev = useMemo(() => {
    if (!minDate) return true;
    const prevMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const minYear = minDate.getFullYear();
    const minMonth = minDate.getMonth();
    
    if (prevMonthDate.getFullYear() < minYear) return false;
    if (prevMonthDate.getFullYear() === minYear && prevMonthDate.getMonth() < minMonth) return false;
    return true;
  }, [viewDate, minDate]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canGoPrev) return;
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

      const cellDate = new Date(year, month, day);
      let isDisabled = false;
      if (minDate) {
        const compareCell = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();
        const compareMin = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
        isDisabled = compareCell < compareMin;
      }

      days.push(
        <motion.button
          key={day}
          type="button"
          whileHover={isDisabled ? undefined : { scale: 1.1 }}
          whileTap={isDisabled ? undefined : { scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) {
              handleDateSelect(day);
            }
          }}
          disabled={isDisabled}
          className={`h-9 w-9 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center relative ${
            isDisabled
              ? "text-text-muted/30 cursor-not-allowed"
              : isSelected 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-10 cursor-pointer" 
                : isToday
                  ? "text-primary border border-primary/30 cursor-pointer"
                  : "text-text-muted hover:bg-bg-card hover:text-text-main cursor-pointer"
          }`}
        >
          {day}
          {isToday && !isSelected && !isDisabled && (
            <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </motion.button>
      );
    }

    return days;
  };

  const renderMonthPanel = () => {
    return (
      <div className="grid grid-cols-3 gap-3 py-4">
        {monthNames.map((name, idx) => {
          const isSelected = viewDate.getMonth() === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                setPanelMode("days");
              }}
              className={`py-3 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                  : "text-text-muted hover:bg-bg-card hover:text-text-main"
              }`}
            >
              {name.substring(0, 3)}
            </button>
          );
        })}
      </div>
    );
  };

  const renderYearPanel = () => {
    const currentYear = new Date().getFullYear();
    let years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    if (minDate) {
      const minYear = minDate.getFullYear();
      years = years.filter(yr => yr >= minYear);
    }
    return (
      <div ref={yearGridRef} className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto custom-scrollbar py-3 px-1">
        {years.map((yr) => {
          const isSelected = viewDate.getFullYear() === yr;
          return (
            <button
              key={yr}
              id={isSelected ? "active-year-btn" : undefined}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewDate(new Date(yr, viewDate.getMonth(), 1));
                setPanelMode("days");
              }}
              className={`py-2 text-center text-[10px] font-bold rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                  : "text-text-muted hover:bg-bg-card hover:text-text-main"
              }`}
            >
              {yr}
            </button>
          );
        })}
      </div>
    );
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
          className={`w-full cursor-pointer min-h-[58px] py-4 pl-5 pr-36 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group/btn border border-solid shadow-sm select-none outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-4 ${
            hasError
              ? "bg-red-500/5 border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
              : isValid
              ? "bg-emerald-500/5 border-emerald-500 focus:ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
              : isOpen
              ? "bg-bg-base border-primary/60 ring-primary/20"
              : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus:border-primary/60 focus:ring-primary/20"
          }`}
        >
          <CalendarIcon 
            size={18} 
            className={`transition-colors duration-300 ${isOpen || value ? "text-primary" : "text-text-muted group-hover/btn:text-primary"}`} 
          />
          
          <span className={`text-sm font-medium tracking-wide ${value ? "text-text-main" : "text-text-muted"}`}>
            {value ? selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : placeholder}
          </span>

          {value && isOpen && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-12 p-1 hover:bg-bg-card rounded-full transition-colors z-20 cursor-pointer"
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
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev || panelMode !== "days"}
                  className={`p-2 rounded-xl text-text-muted transition-all ${
                    canGoPrev && panelMode === "days"
                      ? "hover:bg-bg-card hover:text-text-main cursor-pointer" 
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="text-center flex flex-col items-center select-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPanelMode(panelMode === "month" ? "days" : "month");
                    }}
                    className={`text-xs font-black uppercase tracking-widest text-text-main hover:text-primary transition-colors cursor-pointer px-2 py-0.5 rounded-lg hover:bg-bg-card ${panelMode === "month" ? "text-primary bg-bg-card" : ""}`}
                  >
                    {monthNames[viewDate.getMonth()]}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPanelMode(panelMode === "year" ? "days" : "year");
                    }}
                    className={`text-[10px] font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer mt-0.5 px-2 py-0.5 rounded-lg hover:bg-bg-card ${panelMode === "year" ? "text-primary bg-bg-card" : ""}`}
                  >
                    {viewDate.getFullYear()}
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={handleNextMonth}
                  disabled={panelMode !== "days"}
                  className={`p-2 rounded-xl text-text-muted transition-all ${
                    panelMode === "days"
                      ? "hover:bg-bg-card hover:text-text-main cursor-pointer" 
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Dynamic Content Panel */}
              {panelMode === "days" && (
                <>
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
                </>
              )}

              {panelMode === "month" && renderMonthPanel()}
              {panelMode === "year" && renderYearPanel()}

              {/* Footer Decoration */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
