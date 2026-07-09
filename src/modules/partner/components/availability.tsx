"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Clock, ChevronRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toastStore";
import { Partner } from "../types/partner.types";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import PremiumTimePicker from "@/components/ui/PremiumTimePicker";
import PremiumDurationPicker from "@/components/ui/PremiumDurationPicker";
import { useAuthStore } from "@/modules/auth/store";

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

function parseBookingEndDateTime(dateStr: string, timeRangeStr: string): Date | null {
  try {
    const start = parseBookingStartDateTime(dateStr, timeRangeStr);
    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const endTimeStr = parts.length === 2 ? parts[1].trim() : parts[0].trim();
    
    let targetDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      targetDateStr = dateStr.split(" - ")[1].trim();
    }
    
    let year = 0, month = 0, day = 0;
    if (targetDateStr.includes("-")) {
      const dParts = targetDateStr.split("-");
      year = parseInt(dParts[0], 10);
      month = parseInt(dParts[1], 10) - 1;
      day = parseInt(dParts[2], 10);
    } else {
      const parsedDate = new Date(targetDateStr);
      if (isNaN(parsedDate.getTime())) return null;
      year = parsedDate.getFullYear();
      month = parsedDate.getMonth();
      day = parsedDate.getDate();
    }

    const timeMatch = endTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)/i);
    let res: Date | null = null;
    if (!timeMatch) {
      const timeMatch24 = endTimeStr.match(/(\d+)[:.](\d+)/);
      if (timeMatch24) {
        const hours = parseInt(timeMatch24[1], 10);
        const minutes = parseInt(timeMatch24[2], 10);
        res = new Date(year, month, day, hours, minutes, 0, 0);
      }
    } else {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      res = new Date(year, month, day, hours, minutes, 0, 0);
    }

    if (res && !isNaN(res.getTime())) {
      if (start && res.getTime() < start.getTime()) {
        res.setDate(res.getDate() + 1);
      }
      return res;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function parseBookingStartDateTime(dateStr: string, timeRangeStr: string): Date | null {
  try {
    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const startTimeStr = parts[0].trim();
    
    let targetDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      targetDateStr = dateStr.split(" - ")[0].trim();
    }
    
    let year = 0, month = 0, day = 0;
    if (targetDateStr.includes("-")) {
      const dParts = targetDateStr.split("-");
      year = parseInt(dParts[0], 10);
      month = parseInt(dParts[1], 10) - 1;
      day = parseInt(dParts[2], 10);
    } else {
      const parsedDate = new Date(targetDateStr);
      if (isNaN(parsedDate.getTime())) return null;
      year = parsedDate.getFullYear();
      month = parsedDate.getMonth();
      day = parsedDate.getDate();
    }
    
    const timeMatch = startTimeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      const timeMatch24 = startTimeStr.match(/(\d+)[:.](\d+)/);
      if (timeMatch24) {
        const hours = parseInt(timeMatch24[1], 10);
        const minutes = parseInt(timeMatch24[2], 10);
        const res = new Date(year, month, day, hours, minutes, 0, 0);
        return isNaN(res.getTime()) ? null : res;
      }
      return null;
    }
    
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    const res = new Date(year, month, day, hours, minutes, 0, 0);
    return isNaN(res.getTime()) ? null : res;
  } catch (e) {
    return null;
  }
}

function hasActiveRunningBooking(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const localBookings = localStorage.getItem("hire_my_partner_bookings");
    if (!localBookings) return false;
    const bookings = JSON.parse(localBookings);
    const now = Date.now();
    for (const b of bookings) {
      if (b.status === "Confirmed") {
        const start = parseBookingStartDateTime(b.date, b.time);
        const end = parseBookingEndDateTime(b.date, b.time);
        if (start && end) {
          const isRunning = start.getTime() <= now && now < end.getTime();
          if (isRunning) {
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return false;
}

export const getThirtyMinutesAheadTime = () => {
  const date = new Date(Date.now() + 40 * 60 * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');
  const strMinutes = String(minutes).padStart(2, '0');
  return {
    formatted: `${strHours}:${strMinutes} ${ampm}`,
    hour: strHours,
    minute: strMinutes,
    ampm
  };
};

export const getImmediateTime = () => {
  const date = new Date(Date.now() + 2 * 60 * 1000);
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



export default function Availability({ partner }: AvailabilityProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  
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
  const [selectedDuration, setSelectedDuration] = useState<number>(2);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setMinDate(new Date());
  }, []);

  // Reset/adjust time if it becomes invalid when switching date to today
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (selectedDate === todayStr) {
        const isTestSession = selectedDuration === 0.01;
        const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
        const defaultTime = isTestSession ? getImmediateTime().formatted : getThirtyMinutesAheadTime().formatted;

        if (selectedTime) {
          const targetDate = parseDateTime(selectedDate, selectedTime);
          if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
            setSelectedTime(defaultTime);
            toast.info(isTestSession ? "Time adjusted for testing session." : "Time adjusted: Applied the default booking time for today.");
          }
        } else {
          setSelectedTime(defaultTime);
        }
      }
    }
  }, [selectedDate, selectedTime, selectedDuration]);

  // Load pending booking if it exists for this partner
  useEffect(() => {
    try {
      const pendingStr = localStorage.getItem("pending_booking");
      if (pendingStr) {
        const pending = JSON.parse(pendingStr);
        if (pending && pending.partnerId === activePartner.id) {
          if (pending.date) setSelectedDate(pending.date);
          if (pending.time) setSelectedTime(pending.time);
          if (pending.duration) setSelectedDuration(pending.duration);
          
          // Clear it so it doesn't trigger again next time
          localStorage.removeItem("pending_booking");
          toast.success("Restored your selected booking schedule!");
        }
      }
    } catch (e) {
      console.error("Failed to load pending booking state", e);
    }
  }, [activePartner.id]);

  // Scroll to booking-section if hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#booking-section") {
      const timer = setTimeout(() => {
        const element = document.getElementById("booking-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const getDurationPrice = (duration: number) => {
    switch (duration) {
      case 2: return activePartner.pricing.twoHours || (activePartner.pricing.oneHour * 1.8);
      case 3: return activePartner.pricing.threeHours || (activePartner.pricing.oneHour * 2.5);
      case 4: return activePartner.pricing.fourHours || (activePartner.pricing.oneHour * 3.2);
      case 5: return activePartner.pricing.fiveHours || (activePartner.pricing.oneHour * 4.0);
      case 8: return activePartner.pricing.eightHours || (activePartner.pricing.oneHour * 6.0);
      default: return activePartner.pricing.oneHour * duration;
    }
  };

  const hourlyRate = activePartner.pricing.oneHour;
  const minHours = 1;

  const calculateTotal = () => {
    return getDurationPrice(selectedDuration);
  };

  const handleBookingSubmit = () => {
    if (hasActiveRunningBooking()) {
      toast.error("You already have an active session running. You can only book one companion at a time and cannot book another companion until your current session ends.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login first to book a companion.");
      
      try {
        localStorage.setItem("pending_booking", JSON.stringify({
          partnerId: activePartner.id,
          date: selectedDate,
          time: selectedTime,
          duration: selectedDuration
        }));
      } catch (e) {
        console.error("Failed to store pending booking state", e);
      }

      let redirectUrl = window.location.pathname + window.location.search;
      if (!redirectUrl.includes("#booking-section")) {
        redirectUrl += "#booking-section";
      }
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (!user?.gender || !user?.age || !user?.address || !user?.city || !user?.country) {
      toast.error("Please complete your profile details (Gender, Age, Country, City, and Address) in the Account Center to book.");
      if (typeof window !== "undefined") {
        const redirectUrl = window.location.pathname + window.location.search + "#booking-section";
        localStorage.setItem("redirect_after_profile_update", redirectUrl);
      }
      window.dispatchEvent(new CustomEvent("open_account_center", { detail: { section: "personal-info" } }));
      return;
    }

    if (!selectedDate || !selectedTime) {
      setShowErrors(true);
      if (!selectedDate) {
        toast.error("Please select a booking date");
      } else {
        toast.error("Please select a booking time");
      }
      return;
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (selectedDate === todayStr) {
      const targetDate = parseDateTime(selectedDate, selectedTime);
      const isTestSession = selectedDuration === 0.01;
      const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
      if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
        toast.error(isTestSession ? "Please select a valid time." : "Please select a time at least 30 minutes in the future from now.");
        return;
      }
    }

    // Redirect to checkout page with dynamic state
    router.push(`/checkout?partner=${activePartner.id}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&duration=${selectedDuration}`);
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
                <div className="grid grid-cols-1 gap-5">

                  <PremiumDatePicker
                    value={selectedDate}
                    onChange={(val) => {
                      setSelectedDate(val);
                      if (val) {
                        setShowErrors(false);
                        const today = new Date();
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        const isTestSession = selectedDuration === 0.01;
                        const defaultTime = isTestSession ? getImmediateTime().formatted : getThirtyMinutesAheadTime().formatted;
                        if (val === todayStr) {
                          setSelectedTime(defaultTime);
                        } else if (!selectedTime) {
                          setSelectedTime(defaultTime);
                        }
                      }
                    }}
                    label="Date"
                    placeholder="Select Date"
                    hasError={showErrors && !selectedDate}
                    minDate={minDate}
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
                    selectedDate={selectedDate}
                    isTestSession={selectedDuration === 0.01}
                  />
                  <PremiumDurationPicker
                    value={selectedDuration}
                    onChange={(val) => setSelectedDuration(val)}
                    label="Duration"
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
                    <p className="text-text-main text-lg font-black">{minHours} {minHours === 1 ? "Hour" : "Hours"}</p>
                  </div>
                </div>

                {/* Live Summary */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                    <span>Base Rate ({selectedDuration === 0.01 ? "1 min" : `${selectedDuration} hrs`})</span>
                    <span className="text-text-main font-bold">₹{calculateTotal()}</span>
                  </div>
                </div>

                {/* Date & Time selection display if selected */}
                {(selectedDate || selectedTime || selectedDuration) && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-1.5">
                    <p className="text-primary text-[8px] font-black uppercase tracking-widest">
                      Selected Schedule
                    </p>
                    <div className="text-xs font-bold text-text-main flex flex-col gap-1.5">
                      {selectedDate && <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {selectedDate}</span>}
                      {selectedTime && <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {selectedTime}</span>}
                      {selectedDuration && <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> Duration: {selectedDuration === 0.01 ? "1 Minute" : `${selectedDuration} ${selectedDuration === 1 ? "Hour" : "Hours"}`}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Total & Action Button */}
              <div className="border-t border-border-main/50 pt-4 mt-auto">
                <div className="flex flex-col gap-0.5 mb-5 text-center">
                  <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">Total Amount</span>
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
