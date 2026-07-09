"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { Outfit } from "next/font/google";
import { toast } from "@/components/ui/toastStore";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface PremiumTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hasError?: boolean;
  selectedDate?: string;
  isTestSession?: boolean;
}

function parseDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  let hours = 0;
  let minutes = 0;

  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);

  if (match12) {
    hours = parseInt(match12[1], 10);
    minutes = parseInt(match12[2], 10);
    const ampm = match12[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  } else if (match24) {
    hours = parseInt(match24[1], 10);
    minutes = parseInt(match24[2], 10);
  } else {
    return null;
  }

  return new Date(year, month - 1, day, hours, minutes);
}

export const getThirtyMinutesAheadTime = () => {
  const date = new Date(Date.now() + 40 * 60 * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');
  const strMinutes = String(minutes).padStart(2, '0');
  return {
    formatted: `${strHours}:${strMinutes} ${ampm}`,
    hour: strHours,
    minute: strMinutes,
    ampm
  };
};

export default function PremiumTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select Time",
  hasError = false,
  selectedDate = "",
  isTestSession = false,
}: PremiumTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultTimeInfo = getThirtyMinutesAheadTime();
  const [customHour, setCustomHour] = useState(defaultTimeInfo.hour);
  const [customMinute, setCustomMinute] = useState(defaultTimeInfo.minute);
  const [customAmpm, setCustomAmpm] = useState(defaultTimeInfo.ampm);

  useEffect(() => {
    if (value) {
      const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        setCustomHour(match[1]);
        setCustomMinute(match[2]);
        setCustomAmpm(match[3].toUpperCase());
      }
    } else {
      const defaultInfo = getThirtyMinutesAheadTime();
      setCustomHour(defaultInfo.hour);
      setCustomMinute(defaultInfo.minute);
      setCustomAmpm(defaultInfo.ampm);
    }
  }, [value]);

  const times = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHourChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    setCustomHour(digits);
  };

  const handleMinuteChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    setCustomMinute(digits);
  };

  const handleHourBlur = () => {
    if (!customHour) {
      setCustomHour("12");
      return;
    }
    let num = parseInt(customHour, 10);
    if (isNaN(num) || num < 1 || num > 12) {
      num = 12;
    }
    setCustomHour(String(num).padStart(2, '0'));
  };

  const handleMinuteBlur = () => {
    if (!customMinute) {
      setCustomMinute("00");
      return;
    }
    let num = parseInt(customMinute, 10);
    if (isNaN(num) || num < 0 || num > 59) {
      num = 0;
    }
    setCustomMinute(String(num).padStart(2, '0'));
  };

  const isTimeValid = (timeStr: string) => {
    if (!selectedDate) return true;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (selectedDate !== todayStr) return true;

    const targetDate = parseDateTime(selectedDate, timeStr);
    if (!targetDate) return false;

    const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
    return (targetDate.getTime() - today.getTime()) >= buffer;
  };

  const handleApplyCustom = () => {
    const formattedCustom = `${customHour.padStart(2, '0')}:${customMinute.padStart(2, '0')} ${customAmpm}`;
    if (selectedDate) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (selectedDate === todayStr) {
        const targetDate = parseDateTime(selectedDate, formattedCustom);
        const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
        if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
          toast.error(isTestSession ? "Time cannot be in the past." : "Time must be at least 30 minutes in the future from now.");
          return;
        }
      }
    }
    onChange(formattedCustom);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col gap-2 w-full ${outfit.className} ${isOpen ? "z-[9999]" : "z-auto"}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full cursor-pointer min-h-[58px] py-4 pl-5 pr-12 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group/btn border border-solid shadow-sm select-none outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-4 ${
            hasError
              ? "bg-red-500/5 border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
              : isOpen
              ? "bg-bg-base border-primary/60 ring-primary/20"
              : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus:border-primary/60 focus:ring-primary/20"
          }`}
        >
          <Clock 
            size={18} 
            className={`transition-colors duration-300 ${isOpen || value ? "text-primary" : "text-text-muted group-hover/btn:text-primary"}`} 
          />
          
          <div className="flex flex-col">
            {value && (
              <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 text-primary/60">
                {placeholder}
              </span>
            )}
            <span className={`text-xs font-bold ${value ? "text-text-main" : "text-text-muted"}`}>
              {value || placeholder}
            </span>
          </div>

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
              className="absolute z-[100] top-full mt-3 w-full bg-bg-secondary border border-border-main rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Custom exact time section */}
              <div className="p-4 border-b border-border-main/50 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted">
                  Custom Exact Time
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="HH"
                    value={customHour}
                    onChange={(e) => handleHourChange(e.target.value)}
                    onBlur={handleHourBlur}
                    onFocus={(e) => e.target.select()}
                    className="w-14 text-center h-10 bg-bg-base border border-border-main rounded-xl text-xs font-bold text-text-main focus:outline-none focus:border-primary/50"
                  />
                  <span className="text-text-muted font-bold">:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={customMinute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    onBlur={handleMinuteBlur}
                    onFocus={(e) => e.target.select()}
                    className="w-14 text-center h-10 bg-bg-base border border-border-main rounded-xl text-xs font-bold text-text-main focus:outline-none focus:border-primary/50"
                  />
                  <div className="flex bg-bg-base border border-border-main rounded-xl p-0.5 shrink-0 ml-auto">
                    <button
                      type="button"
                      onClick={() => setCustomAmpm("AM")}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                        customAmpm === "AM"
                          ? "bg-primary text-white"
                          : "text-text-muted hover:text-text-main"
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomAmpm("PM")}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer ${
                        customAmpm === "PM"
                          ? "bg-primary text-white"
                          : "text-text-muted hover:text-text-main"
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer text-center"
                >
                  Set Custom Time
                </button>
              </div>

              {/* Suggestions list */}
              <div className="max-h-60 overflow-y-auto p-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-text-muted mb-2 px-1">
                  Suggested Slots
                </p>
                <div className="space-y-1">
                  {times.filter(isTimeValid).length > 0 ? (
                    times.filter(isTimeValid).map((t) => {
                      const isSelected = value === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            onChange(t);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-primary text-white" 
                              : "text-text-muted hover:bg-bg-card hover:text-text-main"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-[11px] font-medium text-text-muted text-center py-4">
                      No slots available for today. Please set a custom time above.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
