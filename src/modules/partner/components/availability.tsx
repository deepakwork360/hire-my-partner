"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Clock, ChevronRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toastStore";
import { Partner } from "../types/partner.types";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface AvailabilityProps {
  partner?: Partner;
}

function PremiumTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select Time",
  hasError = false
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  hasError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2 w-full">
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
              <div className="max-h-60 overflow-y-auto p-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="space-y-1">
                  {times.map((t) => {
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
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Availability({ partner }: AvailabilityProps) {
  const router = useRouter();
  
  // Graceful fallback to Gigi Hadid if no partner is provided
  const activePartner = partner || {
    id: "1",
    name: "Gigi Hadid",
    pricing: {
      oneHour: 4999,
      twoHours: 9998,
      threeHours: 14997,
      fourHours: 19996,
      fiveHours: 24995,
      eightHours: 39992,
    }
  } as Partner;

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const hourlyRate = activePartner.pricing.oneHour;
  const minHours = 2;

  const calculateTotal = () => {
    return hourlyRate * minHours;
  };

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime) {
      setShowErrors(true);
      if (!selectedDate) {
        toast.error("Please select a booking date");
      } else {
        toast.error("Please select a booking time");
      }
      return;
    }

    // Redirect to checkout page with dynamic state
    router.push(`/checkout?partner=${activePartner.id}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`);
  };

  return (
    <section
      id="booking-section"
      className={`py-10 md:py-12 px-4 bg-bg-base border-b border-border-main ${outfit.className}`}
    >
      <div className="max-w-[1250px] w-full mx-auto">
        
        {/* Title */}
        <div className="flex flex-col items-center mb-12 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-4xl md:text-6xl font-bold text-text-main mb-2`}
          >
            Availability & Booking
          </motion.h2>
        </div>

        <div className="max-w-[950px] w-full mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-bg-card border border-border-main rounded-[36px] flex flex-col md:flex-row shadow-2xl z-10"
          >
            {/* Backdrop blur */}
            <div className="absolute inset-0 rounded-[36px] backdrop-blur-3xl z-0 pointer-events-none" />

            {/* Subtle glows */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Left Pane: Form */}
            <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-text-main flex items-center gap-2 border-b border-border-main/50 pb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  Select Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PremiumDatePicker
                    value={selectedDate}
                    onChange={(val) => {
                      setSelectedDate(val);
                      if (val) setShowErrors(false);
                    }}
                    label="Date"
                    placeholder="Select Date"
                    hasError={showErrors && !selectedDate}
                  />
                  <PremiumTimePicker
                    value={selectedTime}
                    onChange={(val) => {
                      setSelectedTime(val);
                      if (val) setShowErrors(false);
                    }}
                    label="Time"
                    placeholder="Select Time"
                    hasError={showErrors && !selectedTime}
                  />
                </div>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border-main/50">
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Verified Identity</h4>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                      All community profiles undergo comprehensive verification.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <HeartHandshake size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-main">Secure Trust Payments</h4>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                      Escrow system guarantees funds are released after completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pane: Summary */}
            <div className="w-full md:w-[360px] bg-bg-secondary/40 border-t md:border-t-0 md:border-l border-border-main p-6 md:p-10 relative z-10 flex flex-col justify-between gap-6 rounded-b-[36px] md:rounded-b-none md:rounded-r-[36px]">
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-text-main flex items-center gap-2 border-b border-border-main/50 pb-4">
                  <HeartHandshake className="w-5 h-5 text-primary" />
                  Booking Summary
                </h3>

                {/* Pricing Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-bg-card/60 border border-border-main rounded-2xl">
                    <p className="text-text-muted text-[8px] font-black uppercase tracking-widest mb-1">
                      Hourly Rate
                    </p>
                    <p className="text-text-main text-lg font-black">₹{hourlyRate}</p>
                  </div>
                  <div className="p-3 bg-bg-card/60 border border-border-main rounded-2xl">
                    <p className="text-text-muted text-[8px] font-black uppercase tracking-widest mb-1">
                      Min Booking
                    </p>
                    <p className="text-text-main text-lg font-black">{minHours} Hours</p>
                  </div>
                </div>

                {/* Live Summary */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                    <span>Base Rate ({minHours} hrs)</span>
                    <span className="text-text-main font-bold">₹{hourlyRate * minHours}</span>
                  </div>
                </div>

                {/* Date & Time selection display if selected */}
                {(selectedDate || selectedTime) && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-1.5">
                    <p className="text-primary text-[8px] font-black uppercase tracking-widest">
                      Selected Schedule
                    </p>
                    <div className="text-xs font-bold text-text-main flex flex-col gap-1.5">
                      {selectedDate && <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {selectedDate}</span>}
                      {selectedTime && <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {selectedTime}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Total & Action Button */}
              <div className="border-t border-border-main/50 pt-4 mt-auto">
                <div className="flex flex-col gap-0.5 mb-5 text-center">
                  <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">Total Investment</span>
                  <span className="text-text-main text-3xl font-black tracking-tighter">
                    ₹{calculateTotal()}
                  </span>
                </div>

                <button
                  onClick={handleBookingSubmit}
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <HeartHandshake size={18} />
                  Continue to Book
                </button>
                
                <p className="text-center text-text-muted text-[7px] font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                  <ShieldCheck size={9} />
                  Secure Transaction
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
