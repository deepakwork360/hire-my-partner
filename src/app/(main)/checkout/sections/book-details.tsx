"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import Image from "next/image";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toastStore";
import { partners } from "@/modules/partner/data/partners";
import { usePartner } from "@/modules/partner/hooks/usePartner";
import { Partner } from "@/modules/partner/types/partner.types";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";

import {
  Calendar,
  Clock,
  Star,
  MapPin,
  ChevronDown,
  CheckSquare,
  Square,
  ChevronRight,
  Sparkles,
  User,
  FileText,
  ChevronLeft,
  X,
} from "lucide-react";
import Link from "next/link";

const MotionLink = motion(Link);

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// ── Helpers & Static Data ──────────────────────────────────────────────────────────────

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

export const getFortyMinutesAheadTime = () => {
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

function PremiumTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select Time",
  hasError = false,
  selectedDate = "",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hasError?: boolean;
  selectedDate?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultTimeInfo = getFortyMinutesAheadTime();
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
      const defaultInfo = getFortyMinutesAheadTime();
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

    return (targetDate.getTime() - today.getTime()) >= 40 * 60 * 1000;
  };

  const handleApplyCustom = () => {
    const formattedCustom = `${customHour.padStart(2, '0')}:${customMinute.padStart(2, '0')} ${customAmpm}`;
    if (selectedDate) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (selectedDate === todayStr) {
        const targetDate = parseDateTime(selectedDate, formattedCustom);
        if (!targetDate || (targetDate.getTime() - today.getTime()) < 40 * 60 * 1000) {
          toast.error("Time must be at least 40 minutes in the future from now.");
          return;
        }
      }
    }
    onChange(formattedCustom);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2 w-full z-20">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full cursor-pointer h-14 pl-5 pr-12 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group/btn border bg-bg-base shadow-sm ${
            hasError
              ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5"
              : isOpen
              ? "border-primary/50 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
              : "border-border-main hover:border-primary/30"
          }`}
        >
          <Clock 
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
               {value || "Choose a time"}
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
              className="absolute z-[100] top-full mt-3 w-full bg-bg-secondary border border-border-main rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
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
                  className="w-full py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer text-center"
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

const durationOptions = ["2 hours", "3 hours", "4 hours", "5 hours", "8 hours", "10 hours", "12 hours", "24 hours",];

const addOnOptions = [
  { id: "photoshoot", label: "Casual Photoshoot", price: 1500 },
  { id: "playlist", label: "Personalized Playlist", price: 500 },
  { id: "travel", label: "Extra Travel Time", price: 2000 },
];

export default function BookDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partner") || "";
  const { partner: activePartner } = usePartner(partnerId);
  const partner = activePartner || partners[0];
  const initialDate = searchParams.get("date");
  const initialTime = searchParams.get("time");

  useEffect(() => {
    const rawPartnerId = searchParams.get("partner");
    if (!initialDate || !initialTime || !rawPartnerId) {
      if (rawPartnerId) {
        toast.error("Please select a booking schedule first.");
        router.replace(`/partners/${rawPartnerId}#booking-section`);
      } else {
        toast.error("Please choose a companion to book.");
        router.replace("/browse-partners");
      }
    }
  }, [initialDate, initialTime, searchParams, router]);

  if (!initialDate || !initialTime || !searchParams.get("partner")) {
    return (
      <div className="py-40 text-center text-red-500 font-bold animate-pulse">
        Redirecting to booking section...
      </div>
    );
  }

  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const hasInitialized = useRef(false);

  const initialDurationParam = searchParams.get("duration");
  const initialDuration = initialDurationParam 
    ? (initialDurationParam === "1" ? "1 hour" : `${initialDurationParam} hours`)
    : "2 hours";

  const dynamicDurationOptions = durationOptions.includes(initialDuration)
    ? durationOptions
    : [initialDuration, ...durationOptions];

  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => {
    const param = searchParams.get("addons");
    return param ? param.split(",").filter(Boolean) : [];
  });
  const [notes, setNotes] = useState("");
  const [showDurationMenu, setShowDurationMenu] = useState(false);

  useEffect(() => {
    setMinDate(new Date());
  }, []);

  // Sync custom inputs with initial params exactly once on load
  useEffect(() => {
    if (initialDate && initialTime && !hasInitialized.current) {
      setCustomDate(initialDate);
      setCustomTime(initialTime);
      hasInitialized.current = true;
    }
  }, [initialDate, initialTime]);

  const isTimeCorrect = () => {
    if (!customTime) return false;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (customDate === todayStr) {
      const targetDate = parseDateTime(customDate, customTime);
      if (!targetDate || (targetDate.getTime() - today.getTime()) < 40 * 60 * 1000) {
        return false;
      }
    }
    return true;
  };

  const isDateInvalid = showErrors && !customDate;
  const isTimeInvalid = showErrors && (!customTime || !isTimeCorrect());
  const isNotesInvalid = showErrors && !notes.trim();

  const selectedDateTime = customDate && customTime ? `${customDate} | ${customTime}` : "";

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectedAddOnLabels = addOnOptions
    .filter((a) => selectedAddOns.includes(a.id))
    .map((a) => a.label);

  const [dateLabel, timeRange] = selectedDateTime.split(" | ");


  const getBasePrice = (duration: string, p: Partner) => {
    const hours = parseInt(duration, 10) || 2;
    switch (hours) {
      case 2:
        return p.pricing.twoHours || (p.pricing.oneHour * 1.8);
      case 3:
        return p.pricing.threeHours || (p.pricing.oneHour * 2.5);
      case 4:
        return p.pricing.fourHours || (p.pricing.oneHour * 3.2);
      case 5:
        return p.pricing.fiveHours || (p.pricing.oneHour * 4.0);
      case 8:
        return p.pricing.eightHours || (p.pricing.oneHour * 6.0);
      default:
        return p.pricing.oneHour * hours;
    }
  };

  const basePrice = getBasePrice(selectedDuration, partner);
  const addOnsTotal = selectedAddOns.reduce((acc, addonId) => {
    const addon = addOnOptions.find((a) => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const subtotal = basePrice + addOnsTotal;
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAmount;

  const handleBookingSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!customDate) {
      toast.error("Please select a booking date.");
      return;
    }

    if (!customTime) {
      toast.error("Please select a booking time.");
      return;
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (customDate === todayStr) {
      const targetDate = parseDateTime(customDate, customTime);
      if (!targetDate || (targetDate.getTime() - today.getTime()) < 40 * 60 * 1000) {
        toast.error("Please select a time at least 40 minutes in the future.");
        return;
      }
    }

    if (!notes.trim()) {
      toast.error("Please enter a reason for booking.");
      return;
    }

    const url = `/booking-confirmation?partner=${partner.id}&date=${encodeURIComponent(selectedDateTime)}&duration=${encodeURIComponent(selectedDuration)}&addons=${encodeURIComponent(selectedAddOnLabels.join(","))}&amount=${totalAmount}`;
    router.push(url);
  };

  return (
    <section className={`bg-bg-base py-20 px-4 md:px-8 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Full-width centered header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-6xl text-primary tracking-wide mb-3`}
          >
            Booking Details Form
          </h2>
          <p className="text-text-muted text-sm">
            Fill in your preferences to complete your booking.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* LEFT: FORM */}
          <div className="w-full lg:w-[56%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-bg-card border border-border-main rounded-[32px] p-6 md:p-8 flex flex-col gap-8 shadow-2xl shadow-black/5"
            >
              {/* ── Booking Details ── */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Calendar size={15} className="text-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Booking Details
                  </span>
                </div>

                {/* Custom Date & Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <PremiumDatePicker
                    value={customDate}
                    onChange={(val) => {
                      setCustomDate(val);
                      if (val) {
                        if (!customTime) {
                          const defaultTime = getFortyMinutesAheadTime().formatted;
                          setCustomTime(defaultTime);
                        } else {
                          // Validate if today's date is selected and current customTime is invalid
                          const today = new Date();
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                          if (val === todayStr) {
                            const targetDate = parseDateTime(val, customTime);
                            if (!targetDate || (targetDate.getTime() - today.getTime()) < 40 * 60 * 1000) {
                              const defaultTime = getFortyMinutesAheadTime().formatted;
                              setCustomTime(defaultTime);
                              return;
                            }
                          }
                        }
                      }
                    }}
                    label="Date"
                    placeholder="Select Date"
                    minDate={minDate}
                    hasError={isDateInvalid}
                  />

                  <PremiumTimePicker
                    value={customTime}
                    onChange={(val) => {
                      setCustomTime(val);
                    }}
                    label="Time"
                    placeholder="Select Time"
                    selectedDate={customDate}
                    hasError={isTimeInvalid}
                  />
                </div>

                {/* Duration */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDurationMenu((p) => !p);
                    }}
                    className="w-full cursor-pointer h-14 px-5 bg-bg-secondary/50 border border-border-main rounded-2xl text-text-main text-sm font-medium flex items-center justify-between hover:border-primary/30 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Clock size={15} className="text-primary shrink-0" />
                      <span className="text-text-muted text-xs font-bold uppercase tracking-widest mr-2">
                        Duration:
                      </span>
                      {selectedDuration}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-primary transition-transform ${showDurationMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showDurationMenu && (
                    <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-bg-base/95 backdrop-blur-2xl border border-border-main rounded-2xl overflow-hidden shadow-2xl">
                      {dynamicDurationOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedDuration(opt);
                            setShowDurationMenu(false);
                          }}
                          className={`w-full cursor-pointer px-5 py-3.5 text-left text-sm font-medium flex items-center justify-between hover:bg-primary/5 transition-colors ${
                            selectedDuration === opt
                              ? "text-primary"
                              : "text-text-main"
                          }`}
                        >
                          {opt}
                          {selectedDuration === opt && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Add-ons ── */}
              {/* <div>
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={15} className="text-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Add-ons
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {addOnOptions.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`w-full h-14 px-5 cursor-pointer border rounded-2xl flex items-center gap-4 text-left transition-all group ${
                          isChecked
                            ? "bg-primary/10 border-primary/40"
                            : "bg-bg-secondary border-border-main hover:border-primary/30"
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare
                            size={18}
                            className="text-primary shrink-0"
                          />
                        ) : (
                          <Square
                            size={18}
                            className="text-text-muted group-hover:text-text-muted shrink-0 transition-colors"
                          />
                        )}
                        <span
                          className={`flex-1 text-sm font-medium transition-colors ${
                            isChecked ? "text-text-main" : "text-text-muted"
                          }`}
                        >
                          {addon.label}
                        </span>
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isChecked ? "text-primary/80" : "text-text-muted"
                          }`}
                        >
                          +₹{addon.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div> */}

              {/* ── Reason for Booking ── */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={15} className="text-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Reason for Booking
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. i want to have a time when i can talk to you and we can discuss about movies and web series "
                  className={`w-full bg-bg-secondary/50 border rounded-2xl p-5 text-text-main text-sm font-medium leading-relaxed placeholder:text-text-muted/40 focus:outline-none transition-all resize-none ${
                    isNotesInvalid
                      ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5"
                      : "border-border-main focus:border-primary/40"
                  }`}
                />
              </div>

              {/* ── CTA ── */}
              <motion.button
                onClick={handleBookingSubmit}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer h-16 rounded-2xl bg-linear-to-r from-primary-dark to-accent text-white font-black tracking-[0.3em] uppercase text-xs shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-3">
                  Send Booking Request{" "}
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </motion.button>
            </motion.div>
          </div>

          {/* RIGHT: PROFILE CARD */}
          <div className="w-full lg:w-[38%] flex justify-center lg:justify-start items-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-sm bg-bg-card border border-border-main rounded-[32px] overflow-hidden shadow-2xl shadow-black/10"
            >
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center pt-8 pb-5 px-6 border-b border-border-main gap-4">
                <div className="relative w-28 h-36 rounded-2xl overflow-hidden ring-2 ring-primary/30 shadow-[0_8px_30px_rgba(var(--primary-rgb),0.2)]">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-cover object-top"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3
                    className={`${rochester.className} text-3xl text-text-main tracking-wide mb-1`}
                  >
                    {partner.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-text-muted text-xs font-medium">
                      {partner.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={
                          s <= Math.round(partner.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-amber-400/30 fill-none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-text-main text-xs font-black">
                    {typeof partner.rating === "number" ? partner.rating.toFixed(1) : parseFloat(partner.rating || "0.0").toFixed(1)}
                  </span>
                  <span className="text-text-muted text-xs font-medium">
                    ({partner.reviews.length})
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="px-6 py-4 border-b border-border-main">
                <p className="text-text-muted text-xs leading-relaxed font-medium text-center">
                  {partner.bio.substring(0, 110)}...
                </p>
              </div>

              {/* Booking Info */}
              <div className="p-5 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Calendar size={11} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        Date
                      </span>
                    </div>
                    <p className="text-text-main text-xs font-bold leading-snug">
                      {dateLabel}
                    </p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock size={11} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        Time
                      </span>
                    </div>
                    <p className="text-text-main text-xs font-bold leading-snug">
                      {timeRange}
                    </p>
                  </div>
                  <div className="col-span-2 bg-bg-secondary rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock size={11} className="text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                        Duration
                      </span>
                    </div>
                    <p className="text-text-main text-xs font-bold">
                      {selectedDuration}
                    </p>
                  </div>
                </div>

                {/* Add-ons */}
                {/* <div className="border-b border-border-main pb-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={11} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                      Add-ons Selected
                    </span>
                  </div>
                  {selectedAddOnLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAddOnLabels.map((label) => (
                        <span
                          key={label}
                          className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary/90 text-[10px] font-bold"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs italic">
                      No add-ons selected
                    </p>
                  )}
                </div> */}

                {/* Invoice Breakdown */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <p className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">
                    Invoice Breakdown
                  </p>
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                    <span>Base Rate</span>
                    <span className="text-text-main">₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                      <span>Add-ons Total</span>
                      <span className="text-text-main">+₹{addOnsTotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                    <span>18% Tax</span>
                    <span className="text-text-main">₹{taxAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-px bg-border-main my-0.5" />
                  <div className="flex justify-between items-center text-xs font-black text-text-main">
                    <span>Total Cost</span>
                    <span className="text-primary text-sm font-black">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}




