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
import PremiumTimePicker from "@/components/ui/PremiumTimePicker";
import PremiumDurationPicker from "@/components/ui/PremiumDurationPicker";
import { BookingService } from "@/modules/partner/services/booking.service";

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

const durationOptions = [0.01, 1, 2, 3, 4, 5, 8, 10, 12, 24];

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
    if (hasActiveRunningBooking()) {
      toast.error("You already have an active session running. You can only book one companion at a time.");
      router.replace("/my-booking");
      return;
    }
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
    ? (initialDurationParam === "1 minute" || initialDurationParam === "0.01" ? 0.01 : parseFloat(initialDurationParam) || 2)
    : 2;

  const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => {
    const param = searchParams.get("addons");
    return param ? param.split(",").filter(Boolean) : [];
  });
  const [notes, setNotes] = useState("");

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
      const isTestSession = selectedDuration === 0.01;
      const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
      if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
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


  const getBasePrice = (duration: number | string, p: Partner) => {
    const hours = duration === "1 minute" || duration === 0.01 ? 0.01 : (typeof duration === "string" ? parseFloat(duration) : duration) || 1;
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

  const [basePrice, setBasePrice] = useState<number>(0);
  const [addOnsTotal, setAddOnsTotal] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Define fallback values
  const fallbackBasePrice = getBasePrice(selectedDuration, partner);
  const fallbackAddOnsTotal = selectedAddOns.reduce((acc, addonId) => {
    const addon = addOnOptions.find((a) => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const fallbackSubtotal = fallbackBasePrice + fallbackAddOnsTotal;
  const fallbackTaxAmount = Math.round(fallbackSubtotal * 0.18);
  const fallbackTotalAmount = fallbackSubtotal + fallbackTaxAmount;

  // Sync pricing estimates dynamically from the backend with local fallback
  useEffect(() => {
    let active = true;
    const fetchEstimate = async () => {
      if (!partner.id) return;
      const durationHours = selectedDuration === 0.01 ? 0.01 : selectedDuration;

      let formattedStartTime = "";
      if (customDate && customTime) {
        const parsedStart = parseDateTime(customDate, customTime);
        if (parsedStart) {
          const pad = (n: number) => String(n).padStart(2, "0");
          formattedStartTime = `${parsedStart.getFullYear()}-${pad(parsedStart.getMonth() + 1)}-${pad(parsedStart.getDate())} ${pad(parsedStart.getHours())}:${pad(parsedStart.getMinutes())}:00`;
        }
      }

      if (!formattedStartTime) {
        const pad = (n: number) => String(n).padStart(2, "0");
        const dummyDate = new Date();
        formattedStartTime = `${dummyDate.getFullYear()}-${pad(dummyDate.getMonth() + 1)}-${pad(dummyDate.getDate())} 12:00:00`;
      }

      try {
        const res = await BookingService.getEstimate({
          partner_id: partner.id,
          start_time: formattedStartTime,
          booked_hours: durationHours,
          addons: selectedAddOns,
        });

        if (active) {
          if (res && res.status && res.data) {
            setBasePrice(res.data.base_amount);
            setAddOnsTotal(res.data.addons_amount);
            setTaxAmount(res.data.tax_amount);
            setTotalAmount(res.data.total_amount);
          } else {
            throw new Error("Invalid response format");
          }
        }
      } catch (err) {
        console.warn("Cost estimation API failed, using frontend fallback calculations:", err);
        if (active) {
          setBasePrice(fallbackBasePrice);
          setAddOnsTotal(fallbackAddOnsTotal);
          setTaxAmount(fallbackTaxAmount);
          setTotalAmount(fallbackTotalAmount);
        }
      }
    };

    fetchEstimate();

    return () => {
      active = false;
    };
  }, [
    partner.id,
    customDate,
    customTime,
    selectedDuration,
    selectedAddOns,
    fallbackBasePrice,
    fallbackAddOnsTotal,
    fallbackTaxAmount,
    fallbackTotalAmount,
  ]);

  const handleBookingSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (hasActiveRunningBooking()) {
      toast.error("You already have an active session running. You can only book one companion at a time and cannot book another companion until your current session ends.");
      return;
    }

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
      const isTestSession = selectedDuration === 0.01;
      const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
      if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
        toast.error(isTestSession ? "Please select a valid time." : "Please select a time at least 30 minutes in the future.");
        return;
      }
    }

    if (!notes.trim()) {
      toast.error("Please enter a reason for booking.");
      return;
    }

    const durationHours = selectedDuration === 0.01 ? 0.01 : (typeof selectedDuration === "number" ? selectedDuration : parseFloat(selectedDuration) || 1);

    let formattedStartTime = "";
    if (customDate && customTime) {
      const parsedStart = parseDateTime(customDate, customTime);
      if (parsedStart) {
        const pad = (n: number) => String(n).padStart(2, "0");
        formattedStartTime = `${parsedStart.getFullYear()}-${pad(parsedStart.getMonth() + 1)}-${pad(parsedStart.getDate())} ${pad(parsedStart.getHours())}:${pad(parsedStart.getMinutes())}:00`;
      }
    }

    try {
      toast.info("Sending booking request...");
      const res = await BookingService.createBooking({
        partner_id: partner.id,
        start_time: formattedStartTime,
        booked_hours: durationHours,
        addons: selectedAddOns,
        reason: notes.trim(),
        total_amount: totalAmount,
      });

      if (res && res.status) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("booking_in_progress", "true");
        }
        const serverBookingId = res.data?.id || `BK-2026-${String(partner.id).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
        toast.success("Booking request sent successfully!");

        const url = `/booking-confirmation?partner=${partner.id}&bookingId=${serverBookingId}&date=${encodeURIComponent(selectedDateTime)}&duration=${selectedDuration}&addons=${encodeURIComponent(selectedAddOnLabels.join(","))}&amount=${totalAmount}&reason=${encodeURIComponent(notes)}`;
        router.push(url);
      } else {
        throw new Error("Invalid response status");
      }
    } catch (err: any) {
      console.warn("POST /bookings API failed, falling back to local simulation:", err);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("booking_in_progress", "true");
      }
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BK-2026-${String(partner.id).padStart(2, "0")}-${randomSuffix}`;
      const url = `/booking-confirmation?partner=${partner.id}&bookingId=${bookingId}&date=${encodeURIComponent(selectedDateTime)}&duration=${selectedDuration}&addons=${encodeURIComponent(selectedAddOnLabels.join(","))}&amount=${totalAmount}&reason=${encodeURIComponent(notes)}`;
      router.push(url);
    }
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
            Booking <span className="text-accent">Details Form</span>
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
                          const defaultTime = getThirtyMinutesAheadTime().formatted;
                          setCustomTime(defaultTime);
                        } else {
                          // Validate if today's date is selected and current customTime is invalid
                          const today = new Date();
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                          if (val === todayStr) {
                            const targetDate = parseDateTime(val, customTime);
                            const isTestSession = selectedDuration === 0.01;
                            const buffer = isTestSession ? -5 * 60 * 1000 : 30 * 60 * 1000;
                            if (!targetDate || (targetDate.getTime() - today.getTime()) < buffer) {
                              const defaultTime = getThirtyMinutesAheadTime().formatted;
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
                    isTestSession={selectedDuration === 0.01}
                  />
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <PremiumDurationPicker
                    value={selectedDuration}
                    onChange={(val) => setSelectedDuration(val)}
                    label="Duration"
                  />
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
                      {selectedDuration === 0.01 ? "1 Minute" : `${selectedDuration} ${selectedDuration === 1 ? "Hour" : "Hours"}`}
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




