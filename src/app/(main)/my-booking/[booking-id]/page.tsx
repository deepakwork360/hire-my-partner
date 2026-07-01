"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../../home-page/sections/Footer";
import { partners } from "@/modules/partner/data/partners";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Coins, 
  Gift, 
  MessageCircle, 
  Map, 
  Compass, 
  Activity, 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Radio,
  X
} from "lucide-react";
import { toast } from "@/components/ui/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/modules/auth/store";
import Banner2 from "@/components/banner2/banner2";

interface BookingData {
  id: string | number;
  image: string;
  name: string;
  age: number;
  location: string;
  rating: string | number;
  date: string;
  time: string;
  price: string;
  status: "Pending" | "Confirmed" | "Completed" | "Declined";
  bio?: string;
  reason?: string;
}

const journeyTimeline = [
  {
    location: "Connaught Place",
    label: "Meeting Point",
    arrival: "7:05 PM",
    departure: "8:10 PM",
    timeSpent: "1h 05m",
    distance: "Starting Point",
  },
  {
    location: "Cafe Delhi Heights",
    label: "Stop #2",
    arrival: "8:15 PM",
    departure: "9:20 PM",
    timeSpent: "1h 05m",
    distance: "2.1 KM",
  },
  {
    location: "India Gate",
    label: "Stop #3",
    arrival: "9:35 PM",
    departure: "10:10 PM",
    timeSpent: "35m",
    distance: "3.4 KM",
  },
];

const findPartnerByNameOrId = (nameOrId: string | number): any => {
  if (!nameOrId) return null;
  const target = String(nameOrId).toLowerCase();

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("approved_partners");
      if (saved) {
        const localList: any[] = JSON.parse(saved);
        const found = localList.find((p) => 
          String(p.id).toLowerCase() === target ||
          p.name.toLowerCase() === target
        );
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return partners.find((p) => 
    String(p.id).toLowerCase() === target ||
    p.name.toLowerCase() === target
  ) || null;
};

// ── Time & Date Parsers ──────────────────────────────────────────────────────

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

// Extends a booking time and returns the updated { date: string, time: string }
function extendBookingDateTime(
  dateStr: string,
  timeRangeStr: string,
  hoursToAdd: number
): { date: string; time: string } {
  try {
    const start = parseBookingStartDateTime(dateStr, timeRangeStr);
    const end = parseBookingEndDateTime(dateStr, timeRangeStr);
    if (!start || !end) return { date: dateStr, time: timeRangeStr };

    const parts = timeRangeStr.split(/\s*[-–]\s*/);
    const startTimeStr = parts[0].trim();
    const endTimeStr = parts[1].trim();

    // Check if AM/PM was used in the original end time
    const useAmpm = /[a-z]/i.test(endTimeStr);

    // Calculate new end date by adding hours
    const addedMs = Math.round(hoursToAdd * 60 * 60 * 1000);
    const newEnd = new Date(end.getTime() + addedMs);

    // Format new time string
    const hours = newEnd.getHours();
    const minutes = newEnd.getMinutes();
    let newEndTimeStr = "";
    if (useAmpm) {
      const ampm = hours >= 12 ? "PM" : "AM";
      let h12 = hours % 12;
      h12 = h12 ? h12 : 12;
      newEndTimeStr = `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
    } else {
      newEndTimeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    const newTime = `${startTimeStr} - ${newEndTimeStr}`;

    // Get the start base date string
    let startDateStr = dateStr;
    if (dateStr.includes(" - ")) {
      startDateStr = dateStr.split(" - ")[0].trim();
    }

    // Format start and end date strings to compare
    const formatSingleDate = (d: Date, template: string) => {
      if (template.includes("-")) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      }
      return d.toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formattedStart = formatSingleDate(start, startDateStr);
    const formattedEnd = formatSingleDate(newEnd, startDateStr);

    let newDate = startDateStr;
    if (formattedStart !== formattedEnd) {
      newDate = `${formattedStart} - ${formattedEnd}`;
    } else {
      newDate = formattedStart;
    }

    return { date: newDate, time: newTime };
  } catch (e) {
    return { date: dateStr, time: timeRangeStr };
  }
}

const getGiftsAndTipsForPartner = (partnerId: string | number) => {
  if (typeof window === "undefined") return [];
  try {
    const existing = localStorage.getItem("hire_my_partner_partner_earnings");
    const earningsList = existing ? JSON.parse(existing) : [];
    return earningsList.filter((txn: any) => String(txn.partnerId) === String(partnerId));
  } catch (e) {
    console.error(e);
    return [];
  }
};

const getLoggedPartnerId = (user: any) => {
  if (!user) return partners[0].id;
  try {
    const approvedStr = localStorage.getItem("approved_partners");
    if (approvedStr) {
      const list = JSON.parse(approvedStr);
      const found = list.find((p: any) => 
        (p.id && String(p.id).toLowerCase() === String(user.id).toLowerCase()) ||
        (p.name && p.name.toLowerCase() === user.name.toLowerCase())
      );
      if (found) return found.id;
    }
  } catch (e) {
    console.error(e);
  }
  const nameLower = user.name?.toLowerCase();
  const matched = partners.find(p => 
    p.name.toLowerCase() === nameLower ||
    String(p.id).toLowerCase() === String(user.id).toLowerCase()
  );
  return matched ? matched.id : partners[0].id;
};

export default function BookingDetailsPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ "booking-id": string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const router = useRouter();
  const { "booking-id": bookingId } = use(params);
  const resolvedSearchParams = use(searchParams);
  const isHiredMe = resolvedSearchParams.role === "partner";
  const { user } = useAuthStore();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tracking" | "timeline" | "payments" | "extensions" | "tips-gifts" | "chat-history">("overview");
  const [extensions, setExtensions] = useState<any[]>([]);
  const [tipsGifts, setTipsGifts] = useState<any[]>([]);
  const [isExtending, setIsExtending] = useState(false);
  const [extendHours, setExtendHours] = useState(1);

  const totalExtended = extensions.reduce((sum: number, ext: any) => sum + (ext.hours || 0), 0);
  const maxAllowedExtension = Math.max(0, 24 - totalExtended);

  useEffect(() => {
    if (extendHours > maxAllowedExtension && maxAllowedExtension > 0) {
      setExtendHours(maxAllowedExtension);
    }
  }, [maxAllowedExtension]);

  // Load booking and associated records
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Get from regular bookings
    let foundBooking: BookingData | null = null;
    const localBookings = localStorage.getItem("hire_my_partner_bookings");
    if (localBookings) {
      const list: BookingData[] = JSON.parse(localBookings);
      const matched = list.find(b => String(b.id) === String(bookingId));
      if (matched) foundBooking = matched;
    }

    // 2. Get from client requests if not found
    if (!foundBooking) {
      const localRequests = localStorage.getItem("hire_my_partner_requests");
      if (localRequests) {
        const list: BookingData[] = JSON.parse(localRequests);
        const matched = list.find(b => String(b.id) === String(bookingId));
        if (matched) foundBooking = matched;
      }
    }

    if (!foundBooking) {
      toast.error("Booking not found");
      router.push("/my-booking");
      return;
    }

    if (foundBooking.status === "Pending") {
      const startDate = parseBookingStartDateTime(foundBooking.date, foundBooking.time);
      if (startDate && startDate.getTime() < Date.now()) {
        foundBooking = { ...foundBooking, status: "Declined" };
        
        // Save back to both lists to keep synced!
        const localB = localStorage.getItem("hire_my_partner_bookings");
        if (localB) {
          const list = JSON.parse(localB).map((b: any) => String(b.id) === String(bookingId) ? { ...b, status: "Declined" as const } : b);
          localStorage.setItem("hire_my_partner_bookings", JSON.stringify(list));
        }
        const localR = localStorage.getItem("hire_my_partner_requests");
        if (localR) {
          const list = JSON.parse(localR).map((r: any) => String(r.id) === String(bookingId) ? { ...r, status: "Declined" as const } : r);
          localStorage.setItem("hire_my_partner_requests", JSON.stringify(list));
        }
        window.dispatchEvent(new Event("bookings_updated"));
      }
    }

    setBooking(foundBooking);

    // 3. Load extensions for this booking
    const savedExtensions = localStorage.getItem(`booking_extensions_${bookingId}`);
    if (savedExtensions) {
      setExtensions(JSON.parse(savedExtensions));
    } else {
      // Mock past extensions if booking is completed or confirmed
      if (foundBooking.status === "Completed") {
        const mockExt = [
          { id: "EXT-1", hours: 1, amount: 2500, status: "Approved", date: foundBooking.date }
        ];
        setExtensions(mockExt);
        localStorage.setItem(`booking_extensions_${bookingId}`, JSON.stringify(mockExt));
      }
    }

    // 4. Load tips and gifts
    let partnerId;
    if (isHiredMe) {
      partnerId = getLoggedPartnerId(user);
    } else {
      const p = findPartnerByNameOrId(foundBooking.name);
      partnerId = p?.id || foundBooking.id;
    }
    
    let earnings = getGiftsAndTipsForPartner(partnerId);
    // Filter transactions sent by the user for this booking name, or by matching bookingId, or if sent by "You"
    earnings = earnings.filter((txn: any) => 
      (txn.bookingId && String(txn.bookingId) === String(bookingId)) ||
      (txn.sender && (
        txn.sender.toLowerCase() === foundBooking?.name.toLowerCase() ||
        txn.sender.toLowerCase() === "you"
      ))
    );

    if (earnings.length === 0 && foundBooking.name === "Arjun Kapoor") {
      earnings = [
        {
          id: "TXN-MOCK-1",
          type: "tip",
          sender: "Arjun Kapoor",
          amount: 1500,
          date: "Sunday, May 20, 2026",
          message: "Excellent session, thank you so much!",
        },
        {
          id: "TXN-MOCK-2",
          type: "gift",
          sender: "Arjun Kapoor",
          amount: 2500,
          giftTitle: "Luxury Bouquet",
          date: "Sunday, May 20, 2026",
          message: "A token of appreciation.",
        }
      ];
    }
    setTipsGifts(earnings);

  }, [bookingId, router, isHiredMe, user]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  const p = findPartnerByNameOrId(booking.name);
  const totalPaid = parseInt(booking.price.replace(/[^\d]/g, ""), 10) || 0;
  const basePrice = Math.round(totalPaid / 1.18);
  const gstAmount = totalPaid - basePrice;

  const start = parseBookingStartDateTime(booking.date, booking.time);
  const end = parseBookingEndDateTime(booking.date, booking.time);
  let isTest = false;
  if (start && end) {
    const durMins = (end.getTime() - start.getTime()) / (60 * 1000);
    isTest = durMins <= 5;
  }

  // Extension action handler
  const handleRequestExtension = () => {
    if (extendHours > maxAllowedExtension) {
      toast.error("Extension limit reached.");
      return;
    }
    setIsExtending(true);
    const extPrice = extendHours * (p?.pricing?.oneHour || 2500);
    const newExt = {
      id: `EXT-${Date.now()}`,
      hours: extendHours,
      amount: extPrice,
      status: "Approved",
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })
    };

    const updatedExts = [...extensions, newExt];
    setExtensions(updatedExts);
    localStorage.setItem(`booking_extensions_${bookingId}`, JSON.stringify(updatedExts));

    let updatedTime = booking.time;
    let updatedDate = booking.date;

    const localBookings = localStorage.getItem("hire_my_partner_bookings");
    if (localBookings) {
      const list: BookingData[] = JSON.parse(localBookings);
      const updatedList = list.map(b => {
        if (String(b.id) === String(bookingId)) {
          const start = parseBookingStartDateTime(b.date, b.time);
          const end = parseBookingEndDateTime(b.date, b.time);
          let isTest = false;
          if (start && end) {
            const durMins = (end.getTime() - start.getTime()) / (60 * 1000);
            isTest = durMins <= 5;
          }
          const unitsToAdd = isTest ? extendHours / 60 : extendHours;
          const { date: newDate, time: newTime } = extendBookingDateTime(b.date, b.time, unitsToAdd);
          updatedTime = newTime;
          updatedDate = newDate;

          const updatedPrice = `₹${(totalPaid + extPrice).toLocaleString("en-IN")}`;
          return { ...b, price: updatedPrice, time: newTime, date: newDate };
        }
        return b;
      });
      localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updatedList));
    }

    const localRequests = localStorage.getItem("hire_my_partner_requests");
    if (localRequests) {
      const list: BookingData[] = JSON.parse(localRequests);
      const updatedList = list.map(b => {
        if (String(b.id) === String(bookingId)) {
          const start = parseBookingStartDateTime(b.date, b.time);
          const end = parseBookingEndDateTime(b.date, b.time);
          let isTest = false;
          if (start && end) {
            const durMins = (end.getTime() - start.getTime()) / (60 * 1000);
            isTest = durMins <= 5;
          }
          const unitsToAdd = isTest ? extendHours / 60 : extendHours;
          const { date: newDate, time: newTime } = extendBookingDateTime(b.date, b.time, unitsToAdd);
          updatedTime = newTime;
          updatedDate = newDate;

          const updatedPrice = `₹${(totalPaid + extPrice).toLocaleString("en-IN")}`;
          return { ...b, price: updatedPrice, time: newTime, date: newDate };
        }
        return b;
      });
      localStorage.setItem("hire_my_partner_requests", JSON.stringify(updatedList));
    }

    window.dispatchEvent(new Event("bookings_updated"));
    
    const updatedPrice = `₹${(totalPaid + extPrice).toLocaleString("en-IN")}`;
    setBooking(prev => prev ? { ...prev, price: updatedPrice, time: updatedTime, date: updatedDate } : null);
    
    // Check if it's a test session to display correct minutes/hours toast
    let isTest = false;
    const start = parseBookingStartDateTime(booking.date, booking.time);
    const end = parseBookingEndDateTime(booking.date, booking.time);
    if (start && end) {
      const durMins = (end.getTime() - start.getTime()) / (60 * 1000);
      isTest = durMins <= 5;
    }
    
    toast.success(isTest ? `Extension of +${extendHours} minute(s) has been approved!` : `Extension of +${extendHours} hour(s) has been approved!`);
    setIsExtending(false);
  };

  return (
    <div className="bg-bg-base min-h-screen relative flex">
      <SideDashboard activeItem="booking" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Banner */}
        <div className="bg-bg-base">
          <Banner2
            title={`Booking #${booking.id}`}
            subtitle="Session receipt, live milestones, tracking logs, and active coordination details."
            backgroundImage="/home/my-bookings.png"
            bgPosition="50% 30%"
          />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 md:py-16 flex-1 flex flex-col gap-8">
          {/* Back Link */}
          <Link href="/my-booking" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-xs font-black uppercase tracking-wider mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Bookings
          </Link>

          {/* Top Header Card */}
          <div className="bg-bg-secondary border border-border-main rounded-[36px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border-main shrink-0">
                <Image
                  src={booking.image}
                  alt={booking.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  {isHiredMe ? "Client Details" : "Companion Details"}
                </span>
                <h2 className="text-2xl font-black text-text-main mt-1">{booking.name}</h2>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-text-muted text-xs font-bold flex items-center gap-1">
                    <MapPin size={13} className="text-primary" /> {booking.location}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border-main" />
                  <span className="text-text-muted text-xs font-bold flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" /> {booking.rating} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-text-muted">Status</span>
              <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                booking.status === "Declined"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                  : booking.status === "Completed"
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    : booking.status === "Pending"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              }`}>
                {booking.status}
              </span>
            </div>
          </div>

        {/* Tab switcher */}
        <div className="flex overflow-x-auto md:flex-wrap gap-2 border-b border-border-main pb-4 mb-8 scrollbar-none snap-x snap-mandatory">
          {[
            { id: "overview", label: "Booking Overview", icon: FileText },
            { id: "tracking", label: "GPS Tracking", icon: Map },
            { id: "timeline", label: "Timeline", icon: Compass },
            { id: "payments", label: "Payment History", icon: CreditCard },
            { id: "extensions", label: "Extensions", icon: PlusCircle },
            { id: "tips-gifts", label: "Tips & Gifts", icon: Coins },
            { id: "chat-history", label: "Chat History", icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border shrink-0 snap-start ${
                  active
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                    : "bg-bg-secondary border-border-main text-text-muted hover:text-text-main"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* 1. Overview */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Companion info */}
                    {((!isHiredMe && booking.bio) || booking.reason) && (
                      <div className="bg-bg-secondary border border-border-main rounded-3xl p-6">
                        <h3 className="text-lg font-black text-text-main mb-4 uppercase tracking-wider text-xs text-primary">Booking Bio & Request</h3>
                        <div className="space-y-4">
                          {!isHiredMe && booking.bio && (
                            <div>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Partner Bio</span>
                              <p className="text-text-main text-sm mt-1 leading-relaxed">{booking.bio}</p>
                            </div>
                          )}
                          {booking.reason && (
                            <div>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Booking Reason</span>
                              <p className="text-text-main text-sm mt-1 leading-relaxed">{booking.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Schedule */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Date</span>
                          <p className="text-text-main text-base font-bold mt-0.5">{booking.date}</p>
                        </div>
                      </div>
                      <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Time Slot</span>
                          <p className="text-text-main text-base font-bold mt-0.5">{booking.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing Overview */}
                  <div className="space-y-6">
                    <div className="bg-bg-secondary border border-border-main rounded-3xl p-6">
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-4">Payment Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm text-text-muted">
                          <span>Base Price (excl. GST)</span>
                          <span className="font-bold">₹{basePrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-text-muted">
                          <span>GST (18%)</span>
                          <span className="font-bold">₹{gstAmount.toLocaleString("en-IN")}</span>
                        </div>
                        
                        {extensions.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border-main/50">
                             <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">Extension Fees</span>
                            {extensions.map((ext) => (
                              <div key={ext.id} className="flex justify-between items-center text-xs text-text-muted">
                                <span>+{ext.hours} {isTest ? "Minute(s)" : "Hour(s)"} extension</span>
                                <span>₹{ext.amount.toLocaleString("en-IN")}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="h-px bg-border-main my-3" />
                        <div className="flex justify-between items-center text-base font-black text-text-main">
                          <span>Total Amount Paid</span>
                          <span className="text-primary text-lg">₹{totalPaid.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              )}

              {/* 2. GPS Tracking */}
              {activeTab === "tracking" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Live Tracking map mock */}
                    <div className="flex-1 bg-bg-base border border-border-main rounded-2xl p-4 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
                      {/* Neon Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                      
                      <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Live Tracking
                        </div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-bg-secondary px-3 py-1 rounded-full border border-border-main">
                          2.4 KM Remaining
                        </span>
                      </div>

                      {/* Stylized SVG Map Graphic */}
                      <div className="my-auto py-12 flex justify-center items-center relative z-10">
                        <svg className="w-full max-w-md h-40" viewBox="0 0 400 160">
                          {/* Route Path line */}
                          <path
                            d="M 50 130 C 120 130, 160 30, 240 30 C 310 30, 310 110, 350 110"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 50 130 C 120 130, 160 30, 240 30"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="stroke-primary"
                          />

                          {/* Companion Marker */}
                          <g transform="translate(240, 30)">
                            <circle r="12" fill="rgb(var(--primary-rgb))" className="animate-ping opacity-40" />
                            <circle r="8" fill="rgb(var(--primary-rgb))" />
                            <circle r="4" fill="white" />
                          </g>

                          {/* User Marker */}
                          <g transform="translate(50, 130)">
                            <circle r="6" fill="#10b981" />
                          </g>
                          
                          {/* Destination Marker */}
                          <g transform="translate(350, 110)">
                            <circle r="6" fill="#6b7280" />
                          </g>
                        </svg>
                      </div>

                      <div className="flex justify-between items-center text-text-muted text-[10px] font-black uppercase tracking-wider border-t border-border-main/50 pt-4 z-10">
                        <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> Start Point: Bandra</span>
                        <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" strokeWidth={3} /> Speed: 24 km/h</span>
                        <span>ETA: 8 Mins</span>
                      </div>
                    </div>

                    {/* GPS Tracking Logs */}
                    <div className="w-full lg:w-80 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary">Status Timeline</h3>
                      <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-main">
                        <div className="flex items-start gap-4 relative">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs shrink-0 z-10 bg-bg-secondary">
                            3
                          </div>
                          <div>
                            <p className="text-xs font-black text-text-main">Companion in transit</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Departed towards meeting spot.</p>
                            <span className="text-[9px] text-text-muted/60 block mt-1">19:05 PM</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 relative">
                          <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted text-xs shrink-0 z-10">
                            2
                          </div>
                          <div>
                            <p className="text-xs font-black text-text-muted">Meeting Location Locked</p>
                            <p className="text-[10px] text-text-muted/70 mt-0.5">Coordinates resolved via GPS.</p>
                            <span className="text-[9px] text-text-muted/60 block mt-1">18:45 PM</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 relative">
                          <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted text-xs shrink-0 z-10">
                            1
                          </div>
                          <div>
                            <p className="text-xs font-black text-text-muted">GPS Sharing initiated</p>
                            <p className="text-[10px] text-text-muted/70 mt-0.5">Approved by Companion.</p>
                            <span className="text-[9px] text-text-muted/60 block mt-1">18:30 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Tracking */}
<div className="mt-6 bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-primary">
        <Radio className="text-red-600 animate-pulse  " /> Live Tracking Details
      </h3>
      <p className="text-xs text-text-muted mt-1">
        Complete route history and travel checkpoints
      </p>
    </div>

    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase">
      Active Route
    </div>
  </div>

  {/* Summary Cards */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] text-text-muted uppercase">Distance</p>
      <p className="text-lg font-black text-text-main mt-1">12.4 KM</p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] text-text-muted uppercase">Duration</p>
      <p className="text-lg font-black text-text-main mt-1">32 Min</p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] text-text-muted uppercase">Checkpoints</p>
      <p className="text-lg font-black text-text-main mt-1">7</p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] text-text-muted uppercase">Avg Speed</p>
      <p className="text-lg font-black text-text-main mt-1">24 km/h</p>
    </div>
  </div>

  {/* Route Timeline */}
  <div>
    <h4 className="text-xs font-black uppercase tracking-wider text-text-main mb-4">
      Route Checkpoints
    </h4>

    <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-main">
      {[
        {
          area: "Bandra West",
          status: "Journey Started",
          time: "18:30 PM",
        },
        {
          area: "Linking Road",
          status: "Passed Checkpoint",
          time: "18:42 PM",
        },
        {
          area: "Khar West",
          status: "Passed Checkpoint",
          time: "18:51 PM",
        },
        {
          area: "Santacruz",
          status: "Traffic Delay Detected",
          time: "19:02 PM",
        },
        {
          area: "Juhu Circle",
          status: "Current Location",
          time: "19:05 PM",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 relative"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 border border-primary/20 flex items-center justify-center shrink-0 z-10 bg-bg-secondary">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-black text-text-main">
                  {item.area}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {item.status}
                </p>
              </div>

              <span className="text-[10px] text-text-muted">
                {item.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


{/* ==========================================================
    DATE JOURNEY DETAILS
    STATIC UI (DYNAMIC IMPLEMENTATION LATER)

    Future Logic:
    - Start tracking when both users enable Live Sharing.
    - Continue tracking after meetup.
    - Save all visited locations.
    - Record:
      • Arrival Time
      • Departure Time
      • Time Spent
      • Distance Between Locations
    - Companion Status:
      Together (0-100m)
      Nearby (100-400m)
      Separated (400m+)
    - Auto stop tracking if distance > 400m for 5+ mins.
========================================================== */}

<div className="mt-6 bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    <div>
      <h3 className="text-sm font-black uppercase tracking-wider text-primary">
        Date Journey Details
      </h3>
      <p className="text-xs text-text-muted mt-1">
        Complete timeline of locations visited during the date.
      </p>
    </div>

    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">
        Together
      </span>
    </div>
  </div>

  {/* Journey Summary */}
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] uppercase text-text-muted">
        Started
      </p>
      <p className="text-sm font-black text-text-main mt-1">
        18:30 PM
      </p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] uppercase text-text-muted">
        Duration
      </p>
      <p className="text-sm font-black text-text-main mt-1">
        3h 40m
      </p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] uppercase text-text-muted">
        Places Visited
      </p>
      <p className="text-sm font-black text-text-main mt-1">
        4
      </p>
    </div>

    <div className="bg-bg-base border border-border-main rounded-2xl p-4">
      <p className="text-[10px] uppercase text-text-muted">
        Distance Together
      </p>
      <p className="text-sm font-black text-text-main mt-1">
        7.8 KM
      </p>
    </div>
  </div>

  {/* Companion Status */}
  <div className="bg-bg-base border border-border-main rounded-2xl p-5 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-text-main">
          Companion Status
        </p>
        <p className="text-[11px] text-text-muted mt-1">
          Both users are currently together.
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg font-black text-primary">
          38m
        </p>
        <p className="text-[10px] uppercase text-text-muted">
          Distance Apart
        </p>
      </div>
    </div>
  </div>

  {/* Journey Timeline */}
  <div>
  <h4 className="text-xs font-black uppercase tracking-wider text-primary mb-6">
    Journey Timeline
  </h4>

  <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border-main">

    {journeyTimeline.map((stop, index) => (
      <div key={index} className="relative flex gap-4">
        
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10 bg-bg-secondary">
          <MapPin className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 bg-bg-base border border-border-main rounded-2xl p-4">

          <div className="flex justify-between items-start mb-3">
            <div>
              <h5 className="text-sm font-black text-text-main">
                {stop.location}
              </h5>

              <p className="text-[11px] text-primary">
                {stop.label}
              </p>
            </div>

            <span className="text-[10px] text-text-muted uppercase">
              Stop #{index + 1}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-text-muted uppercase">
                Arrival
              </p>
              <p className="text-xs font-bold text-text-main">
                {stop.arrival}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-text-muted uppercase">
                Departure
              </p>
              <p className="text-xs font-bold text-text-main">
                {stop.departure}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-text-muted uppercase">
                Time Spent
              </p>
              <p className="text-xs font-bold text-text-main">
                {stop.timeSpent}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-text-muted uppercase">
                Distance
              </p>
              <p className="text-xs font-bold text-text-main">
                {stop.distance}
              </p>
            </div>
          </div>

        </div>
      </div>
    ))}

    {/* Final Location Card */}
    <div className="relative flex gap-4">
      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 z-10 bg-bg-secondary">
        🏁
      </div>

      <div className="flex-1 bg-bg-base border border-border-main rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <h5 className="text-sm font-black text-text-main">
              Final Shared Location
            </h5>

            <p className="text-[11px] text-text-muted mt-1">
              Tracking will stop once users remain 400m+ apart.
            </p>
          </div>

          <span className="text-[10px] uppercase tracking-wider text-red-400 font-black">
            End Point
          </span>
        </div>
      </div>
    </div>

  </div>
</div>
</div>  

                </div>
              )}

              {/* 3. Timeline */}
              {activeTab === "timeline" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-6">Booking Milestones</h3>
                  
                  <div className="relative border-l border-border-main ml-4 pl-8 space-y-8">
                    {[
                      {
                        title: "Booking Request Sent",
                        desc: "Your session request has been submitted to the companion.",
                        time: "June 24, 2026 at 02:30 PM",
                        completed: true
                      },
                      {
                        title: "Request Accepted by Companion",
                        desc: "Companion has approved the request slot and matching plan.",
                        time: "June 24, 2026 at 03:15 PM",
                        completed: booking.status !== "Pending"
                      },
                      {
                        title: "Payment Received & Verified",
                        desc: "Transaction validated by secure payment processing.",
                        time: "June 24, 2026 at 03:20 PM",
                        completed: booking.status !== "Pending" && booking.status !== "Declined"
                      },
                      {
                        title: "Session Completed",
                        desc: "The session ended successfully. Thank you for sharing your experience!",
                        time: "June 24, 2026 at 11:30 PM",
                        completed: booking.status === "Completed"
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                          step.completed
                            ? "bg-primary border-primary text-white"
                            : "bg-bg-secondary border-border-main text-text-muted"
                        }`}>
                          {step.completed ? "✓" : idx + 1}
                        </div>
                        
                        <div>
                          <h4 className={`text-sm font-black ${step.completed ? "text-text-main" : "text-text-muted"}`}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">{step.desc}</p>
                          <span className="text-[10px] text-text-muted/60 font-semibold block mt-1.5">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Payment History */}
              {activeTab === "payments" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8 space-y-8">
                  {/* Original Payment invoice card */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-4">Original Transaction</h3>
                    <div className="bg-bg-base border border-border-main rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-main">Base Session Fee</p>
                            <p className="text-[10px] text-text-muted mt-0.5">Transaction Ref: TXN-{booking.id}001</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 sm:gap-8">
                          <div>
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Method</span>
                            <p className="text-xs font-bold text-text-main mt-0.5">UPI / Net Banking</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">Paid Date</span>
                            <p className="text-xs font-bold text-text-main mt-0.5">{booking.date}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-between">
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                          Successful
                        </span>
                        <div className="text-left md:text-right mt-4 md:mt-0">
                          <span className="text-[10px] font-black text-text-muted block">Amount Paid</span>
                          <span className="text-xl font-black text-text-main mt-0.5">₹{basePrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Extension transactions list */}
                  {extensions.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-4">Extension Payments</h3>
                      <div className="space-y-4">
                        {extensions.map((ext) => (
                          <div key={ext.id} className="bg-bg-base border border-border-main rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                  <PlusCircle className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-text-main">+{ext.hours} {isTest ? "Minute" : "Hour"} Session Extension</p>
                                  <p className="text-[10px] text-text-muted mt-0.5">Transaction Ref: TXN-{ext.id}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end justify-between">
                              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                Approved & Paid
                              </span>
                              <div className="text-left md:text-right mt-4 md:mt-0">
                                <span className="text-[10px] font-black text-text-muted block">Amount Paid</span>
                                <span className="text-lg font-black text-text-main mt-0.5">₹{ext.amount.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Extensions */}
              {activeTab === "extensions" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8 space-y-8">
                  {/* Extension form for Confirmed / In Progress sessions */}
                  {booking.status === "Confirmed" && (
                    <div className="border border-border-main rounded-2xl p-5 md:p-6 bg-primary/5">
                      <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-3">Extend Session</h3>
                      {maxAllowedExtension <= 0 ? (
                        <p className="text-xs text-rose-500 font-bold text-center leading-relaxed py-2">
                          You have reached the maximum extension limit of 24 {isTest ? "minute(s)" : "hour(s)"} for this session.
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-text-muted mb-6 leading-relaxed">
                            Need more time with your companion? Request an extension directly. Hourly rates apply: <span className="text-text-main font-bold">₹{(p?.pricing?.oneHour || 2500).toLocaleString("en-IN")}/hour</span>.
                          </p>

                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-3 bg-bg-base border border-border-main rounded-xl p-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setExtendHours(h => Math.max(1, h - 1))}
                                className="w-8 h-8 rounded-lg bg-bg-secondary hover:bg-bg-card flex items-center justify-center text-text-main font-black cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-sm font-black px-4 text-text-main">{extendHours} {isTest ? "Minute(s)" : "Hour(s)"}</span>
                              <button
                                type="button"
                                onClick={() => setExtendHours(h => Math.min(maxAllowedExtension, h + 1))}
                                className="w-8 h-8 rounded-lg bg-bg-secondary hover:bg-bg-card flex items-center justify-center text-text-main font-black cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              disabled={isExtending}
                              onClick={handleRequestExtension}
                              className="w-full sm:w-auto px-6 h-12 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-primary/20"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Confirm Extension (₹{(extendHours * (p?.pricing?.oneHour || 2500)).toLocaleString("en-IN")})
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* List of past extensions */}
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-4">Extension Logs</h3>
                    {extensions.length > 0 ? (
                      <div className="space-y-4">
                        {extensions.map((ext) => (
                          <div key={ext.id} className="bg-bg-base border border-border-main rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-text-main">+{ext.hours} {isTest ? "Minute" : "Hour"} Session Extension</p>
                                <p className="text-[10px] text-text-muted mt-0.5">Status: Approved • Date: {ext.date}</p>
                              </div>
                            </div>
                            <span className="text-sm font-black text-primary">₹{ext.amount.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-xs italic">No extensions have been logged for this booking.</p>
                    )}
                  </div>
                </div>
              )}

              {/* 6. Tips & Gifts */}
              {activeTab === "tips-gifts" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-main/50 pb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                        {isHiredMe ? "Tips & Gifts Received" : "Tips & Gifts Ledger"}
                      </h3>
                      <p className="text-[10px] text-text-muted font-semibold mt-1">
                        {isHiredMe 
                          ? "Overview of all gifts and gratuities received for this session."
                          : "Overview of all gifts and gratuities associated with this booking."}
                      </p>
                    </div>

                    {booking.status === "Completed" && !isHiredMe && (
                      <div className="flex gap-2">
                        <Link href={`/send-tip?partner=${p?.id || booking.id}&booking=${booking.id}`}>
                          <div className="px-4 py-2 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md cursor-pointer">
                            <Coins className="w-3.5 h-3.5" />
                            Send Tip
                          </div>
                        </Link>
                        <Link href={`/send-gift?partner=${p?.id || booking.id}&booking=${booking.id}`}>
                          <div className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md cursor-pointer">
                            <Gift className="w-3.5 h-3.5" />
                            Send Gift
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {tipsGifts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tipsGifts.map((txn: any) => (
                        <div key={txn.id} className="bg-bg-base border border-border-main p-5 rounded-2xl flex flex-col justify-between gap-4 min-w-0">
                          <div className="flex items-start justify-between gap-3 min-w-0">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                txn.type === "tip" ? "bg-emerald-500/10" : "bg-primary/10"
                              }`}>
                                {txn.type === "tip" ? <Coins className="w-5 h-5 text-emerald-500" /> : <Gift className="w-5 h-5 text-primary" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-text-main break-words">
                                  {txn.type === "tip" 
                                    ? "Session Gratuity (Tip)"
                                    : `Gift: "${txn.giftTitle || 'Special Gift'}"`
                                  }
                                </p>
                                <p className="text-[10px] text-text-muted mt-0.5">{txn.date}</p>
                              </div>
                            </div>
                            <span className={`text-base font-black shrink-0 ${
                              txn.type === "tip" ? "text-emerald-500" : "text-primary"
                            }`}>
                              ₹{txn.amount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {txn.message && (
                            <div className="bg-bg-secondary/40 border border-border-main/50 p-3 rounded-xl min-w-0">
                              <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block mb-1">Attached Message</span>
                              <p className="text-xs text-text-main italic font-medium break-words whitespace-pre-wrap">"{txn.message}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-xs italic">No tips or gifts sent for this booking yet.</p>
                  )}
                </div>
              )}

              {activeTab === "chat-history" && (
                <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-black uppercase tracking-wider text-primary">Communication</h3>
                    <div className="h-px bg-border-main my-4" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border-main/40">
                      <span className="text-xs text-text-muted font-bold">Messages Exchanged</span>
                      <span className="text-sm font-black text-text-main">128</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border-main/40">
                      <span className="text-xs text-text-muted font-bold">First Message</span>
                      <span className="text-sm font-black text-text-main">14 Jun, 6:32 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 pb-2">
                      <span className="text-xs text-text-muted font-bold">Last Message</span>
                      <span className="text-sm font-black text-text-main">14 Jun, 10:45 PM</span>
                    </div>
                    
                    <div className="pt-4">
                      <Link
                        href={`/my-booking/${bookingId}/chat${isHiredMe ? "?role=partner" : ""}`}
                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center block shadow-lg shadow-primary/20"
                      >
                        View Full Conversation →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  </div>
);
}
