"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Check,
  Gift,
  Coins,
  X,
  Share,
} from "lucide-react";
import { Rochester, Outfit } from "next/font/google";
import { partners } from "@/modules/partner/data/partners";
import CategorySwitcher from "./category-switcher";
import Loader from "@/components/loader/Loader";
import { toast } from "@/components/ui/toastStore";
import { useAuthStore } from "@/modules/auth/store";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface BookingData {
  id: number | string;
  image: string;
  name: string;
  age: number;
  location: string;
  rating: string;
  date: string;
  time: string;
  price: string;
  status: "Pending" | "Confirmed" | "Completed" | "Declined";
  bio: string;
  reason?: string;
}

const MOCK_BOOKINGS: BookingData[] = [
  {
    id: partners[0].id,
    image: partners[0].image,
    name: partners[0].name,
    age: partners[0].age,
    location: partners[0].location.split(",")[0].trim(),
    rating: partners[0].rating,
    date: "June 24, 2026",
    time: "07:00 PM - 09:00 PM",
    price: `₹${(partners[0].pricing.twoHours).toLocaleString("en-IN")}`,
    status: "Pending",
    bio: "Looking forward to our premium dinner session. Let's make it memorable.",
  },
  {
    id: partners[1].id,
    image: partners[1].image,
    name: partners[1].name,
    age: partners[1].age,
    location: partners[1].location.split(",")[0].trim(),
    rating: partners[1].rating,
    date: "June 25, 2026",
    time: "02:00 PM - 05:00 PM",
    price: `₹${(partners[1].pricing.threeHours).toLocaleString("en-IN")}`,
    status: "Confirmed",
    bio: "Exploring the local art galleries and having deep conversations.",
  },
  {
    id: partners[3].id,
    image: partners[3].image,
    name: partners[3].name,
    age: partners[3].age,
    location: partners[3].location.split(",")[0].trim(),
    rating: partners[3].rating,
    date: "June 26, 2026",
    time: "09:00 AM - 11:00 AM",
    price: `₹${(partners[3].pricing.twoHours).toLocaleString("en-IN")}`,
    status: "Pending",
    bio: "A quick morning walk and warm coffee to discuss architecture sounds perfect.",
  },
  {
    id: partners[4].id,
    image: partners[4].image,
    name: partners[4].name,
    age: partners[4].age,
    location: partners[4].location.split(",")[0].trim(),
    rating: partners[4].rating,
    date: "June 27, 2026",
    time: "08:30 PM - 11:30 PM",
    price: `₹${(partners[4].pricing.threeHours).toLocaleString("en-IN")}`,
    status: "Confirmed",
    bio: "Attending the indie acoustic live session event together tonight.",
  },
  {
    id: partners[5].id,
    image: partners[5].image,
    name: partners[5].name,
    age: partners[5].age,
    location: partners[5].location.split(",")[0].trim(),
    rating: partners[5].rating,
    date: "May 12, 2026",
    time: "04:00 PM - 07:00 PM",
    price: `₹${(partners[5].pricing.threeHours).toLocaleString("en-IN")}`,
    status: "Completed",
    bio: "Had a great time visiting the local museums and vintage cafes.",
  },
];

const MOCK_CLIENT_REQUESTS: BookingData[] = [
  {
    id: 101,
    image: "/images/img4.webp",
    name: "Rajesh Malhotra",
    age: 35,
    location: "Bandra, Mumbai",
    rating: "4.5",
    date: "June 24, 2026",
    time: "07:00 PM - 10:00 PM",
    price: "₹6,000",
    status: "Pending",
    bio: "Need a companion for a corporate dinner event. Professionalism is key.",
    reason: "Looking for a companion to accompany me to a high-end corporate gala dinner.",
  },
  {
    id: 102,
    image: "/images/img7.webp",
    name: "Siddharth Verma",
    age: 28,
    location: "Gurgaon, Delhi",
    rating: "4.2",
    date: "June 25, 2026",
    time: "01:00 PM - 04:00 PM",
    price: "₹4,500",
    status: "Confirmed",
    bio: "Looking to explore the local cafes and have a meaningful conversation.",
    reason: "Visiting Gurgaon for a weekend and want to explore some nice specialty coffee shops.",
  },
  {
    id: 103,
    image: "/images/img3.webp",
    name: "Arjun Kapoor",
    age: 40,
    location: "Indiranagar, Bangalore",
    rating: "4.8",
    date: "May 20, 2026",
    time: "06:00 PM - 09:00 PM",
    price: "₹7,500",
    status: "Completed",
    bio: "Had a great session discussing tech trends and start-ups.",
    reason: "Looking for a social companion for dynamic conversations around local tech scenes.",
  },
  {
    id: 104,
    image: "/images/img8.webp",
    name: "Vikram Singhania",
    age: 45,
    location: "Alipore, Kolkata",
    rating: "4.9",
    date: "June 28, 2026",
    time: "08:00 PM - 11:00 PM",
    price: "₹9,000",
    status: "Pending",
    bio: "Attending an art exhibition followed by premium wine tasting.",
    reason: "Need a cultured companion to accompany me to the Alipore contemporary art gallery preview.",
  },
  {
    id: 105,
    image: "/images/img1.webp",
    name: "Kabir Mehta",
    age: 31,
    location: "Colaba, Mumbai",
    rating: "4.6",
    date: "June 15, 2026",
    time: "07:30 PM - 09:30 PM",
    price: "₹5,000",
    status: "Declined",
    bio: "Looking for a jogging and workout buddy in Colaba.",
    reason: "Requesting a running session around Marine Drive.",
  }
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

function canCancelBooking(dateStr: string, timeRangeStr: string): boolean {
  const startDateTime = parseBookingStartDateTime(dateStr, timeRangeStr);
  const endDateTime = parseBookingEndDateTime(dateStr, timeRangeStr);
  
  if (startDateTime && endDateTime) {
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    // If duration is 2 minutes or less (e.g. 1 minute for test session), allow cancellation anytime
    if (durationMinutes > 0 && durationMinutes <= 2) {
      return true;
    }
  }

  if (!startDateTime) return true;
  const now = new Date();
  const diffMs = startDateTime.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes >= 20;
}

interface BookingsProps {
  activeFilter: string;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isSidebarOpen?: boolean;
}

export default function Bookings({
  activeFilter,
  activeCategory,
  setActiveCategory,
}: BookingsProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [clientRequests, setClientRequests] = useState<BookingData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingData | null>(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>([]);
  
  const { user } = useAuthStore();

  const getLoggedPartnerId = () => {
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

  useEffect(() => {
    setMounted(true);
    try {
      let initialBookings: BookingData[] = [];
      const localBookings = localStorage.getItem("hire_my_partner_bookings");
      if (localBookings) {
        initialBookings = JSON.parse(localBookings);
      } else {
        initialBookings = MOCK_BOOKINGS;
      }

      let initialRequests: BookingData[] = [];
      const localRequests = localStorage.getItem("hire_my_partner_requests");
      if (localRequests) {
        initialRequests = JSON.parse(localRequests);
        if (initialRequests.length < MOCK_CLIENT_REQUESTS.length) {
          initialRequests = MOCK_CLIENT_REQUESTS;
          localStorage.setItem("hire_my_partner_requests", JSON.stringify(MOCK_CLIENT_REQUESTS));
        }
      } else {
        initialRequests = MOCK_CLIENT_REQUESTS;
      }

      // Check and auto-complete past bookings
      let bookingsChanged = false;
      const checkedBookings = initialBookings.map((b) => {
        if (b.status === "Confirmed") {
          const endDate = parseBookingEndDateTime(b.date, b.time);
          if (endDate && endDate.getTime() < Date.now()) {
            bookingsChanged = true;
            return { ...b, status: "Completed" as const };
          }
        } else if (b.status === "Pending") {
          const startDate = parseBookingStartDateTime(b.date, b.time);
          if (startDate && startDate.getTime() < Date.now()) {
            bookingsChanged = true;
            return { ...b, status: "Declined" as const };
          }
        }
        return b;
      });

      // Ensure there is at least one Completed booking for testing post-booking engagement
      const hasCompleted = checkedBookings.some((b) => b.status === "Completed");
      if (!hasCompleted) {
        const testPartner = partners[0] || {
          id: "1",
          image: "/images/girl1.webp",
          name: "Aarushi Kumari",
          age: 24,
          location: "Bengaluru, Karnataka",
          rating: "4.9",
          pricing: { twoHours: 5000 },
          bio: "Elegant companion for premium dining and social events."
        };
        checkedBookings.push({
          id: testPartner.id,
          image: testPartner.image,
          name: testPartner.name,
          age: testPartner.age,
          location: testPartner.location.split(",")[0].trim(),
          rating: testPartner.rating,
          date: "May 12, 2026",
          time: "07:00 PM - 09:00 PM",
          price: `₹${(testPartner.pricing?.twoHours || 5000).toLocaleString("en-IN")}`,
          status: "Completed",
          bio: testPartner.bio || "Elegant companion for premium dining and social events.",
          reason: "Celebrating a corporate milestone dinner party.",
        });
        bookingsChanged = true;
      }

      let requestsChanged = false;
      const checkedRequests = initialRequests.map((r) => {
        if (r.status === "Confirmed") {
          const endDate = parseBookingEndDateTime(r.date, r.time);
          if (endDate && endDate.getTime() < Date.now()) {
            requestsChanged = true;
            return { ...r, status: "Completed" as const };
          }
        } else if (r.status === "Pending") {
          const startDate = parseBookingStartDateTime(r.date, r.time);
          if (startDate && startDate.getTime() < Date.now()) {
            requestsChanged = true;
            return { ...r, status: "Declined" as const };
          }
        }
        return r;
      });

      setBookings(checkedBookings);
      if (bookingsChanged || !localBookings) {
        localStorage.setItem("hire_my_partner_bookings", JSON.stringify(checkedBookings));
      }

      setClientRequests(checkedRequests);
      if (requestsChanged || !localRequests) {
        localStorage.setItem("hire_my_partner_requests", JSON.stringify(checkedRequests));
      }
    } catch (error) {
      console.error("Error reading localStorage", error);
    }
  }, []);

  useEffect(() => {
    const handleReviewsUpdate = () => {
      try {
        const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
        if (savedGlobal) {
          const globalList = JSON.parse(savedGlobal);
          const reviewedIds = globalList
            .filter((r: any) => r.bookingId && r.status !== "REJECTED")
            .map((r: any) => String(r.bookingId));
          setReviewedBookingIds(reviewedIds);
        }
      } catch (e) {
        console.error("Failed to parse global reviews", e);
      }
    };
    handleReviewsUpdate();
    window.addEventListener("reviews_updated", handleReviewsUpdate);
    return () => window.removeEventListener("reviews_updated", handleReviewsUpdate);
  }, []);

  useEffect(() => {
    const handleBookingsUpdate = () => {
      try {
        const localBookings = localStorage.getItem("hire_my_partner_bookings");
        if (localBookings) {
          setBookings(JSON.parse(localBookings));
        }
      } catch (e) {
        console.error("Failed to parse bookings on event", e);
      }
    };
    window.addEventListener("bookings_updated", handleBookingsUpdate);
    return () => window.removeEventListener("bookings_updated", handleBookingsUpdate);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkInterval = setInterval(() => {
      // 1. Check bookings directly from localStorage to prevent stale state issues
      try {
        const localBookings = localStorage.getItem("hire_my_partner_bookings");
        if (localBookings) {
          const parsedBookings = JSON.parse(localBookings);
          let changed = false;
          const updated = parsedBookings.map((b: any) => {
            if (b.status === "Confirmed") {
              const endDate = parseBookingEndDateTime(b.date, b.time);
              if (endDate && endDate.getTime() < Date.now()) {
                changed = true;
                return { ...b, status: "Completed" as const };
              }
            } else if (b.status === "Pending") {
              const startDate = parseBookingStartDateTime(b.date, b.time);
              if (startDate && startDate.getTime() < Date.now()) {
                changed = true;
                return { ...b, status: "Declined" as const };
              }
            }
            return b;
          });

          if (changed) {
            localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updated));
            setBookings(updated);
            window.dispatchEvent(new Event("bookings_updated"));
          }
        }
      } catch (e) {
        console.error("Error checking bookings in interval", e);
      }

      // 2. Check client requests directly from localStorage
      try {
        const localRequests = localStorage.getItem("hire_my_partner_requests");
        if (localRequests) {
          const parsedRequests = JSON.parse(localRequests);
          let changed = false;
          const updated = parsedRequests.map((r: any) => {
            if (r.status === "Confirmed") {
              const endDate = parseBookingEndDateTime(r.date, r.time);
              if (endDate && endDate.getTime() < Date.now()) {
                changed = true;
                return { ...r, status: "Completed" as const };
              }
            } else if (r.status === "Pending") {
              const startDate = parseBookingStartDateTime(r.date, r.time);
              if (startDate && startDate.getTime() < Date.now()) {
                changed = true;
                return { ...r, status: "Declined" as const };
              }
            }
            return r;
          });

          if (changed) {
            localStorage.setItem("hire_my_partner_requests", JSON.stringify(updated));
            setClientRequests(updated);
            window.dispatchEvent(new Event("bookings_updated"));
          }
        }
      } catch (e) {
        console.error("Error checking requests in interval", e);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [mounted]);

  const handleUpdateBookingStatus = (id: number | string, newStatus: BookingData["status"]) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        let updatedBooking = { ...b, status: newStatus };
        if (newStatus === "Confirmed") {
          const start = parseBookingStartDateTime(b.date, b.time);
          const end = parseBookingEndDateTime(b.date, b.time);
          if (start && end) {
            const durationMs = end.getTime() - start.getTime();
            const durationMins = durationMs / (60 * 1000);
            const isTestSession = durationMins <= 5;
            const hasExpired = end.getTime() <= Date.now();

            if (isTestSession || hasExpired) {
              const newStart = new Date(Date.now() + 10 * 1000); // starts in 10 seconds
              const newEnd = new Date(newStart.getTime() + durationMs);
              
              const formatTimeStr = (d: Date) => {
                let hrs = d.getHours();
                const mins = d.getMinutes();
                const ampm = hrs >= 12 ? "PM" : "AM";
                hrs = hrs % 12;
                hrs = hrs ? hrs : 12;
                return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
              };
              
              const formatYearMonthDay = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };

              updatedBooking.date = formatYearMonthDay(newStart);
              updatedBooking.time = `${formatTimeStr(newStart)} - ${formatTimeStr(newEnd)}`;
            }
          }
        }
        return updatedBooking;
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updated));

    // Propagate to partner requests
    try {
      const localRequests = localStorage.getItem("hire_my_partner_requests");
      if (localRequests) {
        const requestsList = JSON.parse(localRequests);
        const updatedRequests = requestsList.map((r: any) => {
          if (r.id === id) {
            const matchedBooking = updated.find(b => b.id === id);
            if (matchedBooking) {
              return {
                ...r,
                status: newStatus,
                date: matchedBooking.date,
                time: matchedBooking.time,
                price: matchedBooking.price
              };
            }
          }
          return r;
        });
        localStorage.setItem("hire_my_partner_requests", JSON.stringify(updatedRequests));
        setClientRequests(updatedRequests);
      }
    } catch (e) {
      console.error("Failed to propagate booking status to requests", e);
    }

    window.dispatchEvent(new Event("bookings_updated"));
  };

  const handleUpdateClientRequestStatus = (id: number | string, newStatus: BookingData["status"]) => {
    const updated = clientRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setClientRequests(updated);
    localStorage.setItem("hire_my_partner_requests", JSON.stringify(updated));

    // Propagate to client bookings
    try {
      const localBookings = localStorage.getItem("hire_my_partner_bookings");
      if (localBookings) {
        const bookingsList = JSON.parse(localBookings);
        const updatedBookings = bookingsList.map((b: any) => b.id === id ? { ...b, status: newStatus } : b);
        localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
      }
    } catch (e) {
      console.error("Failed to propagate request status to bookings", e);
    }

    window.dispatchEvent(new Event("bookings_updated"));
  };

  const currentData =
    activeCategory === "hired_by_me" ? bookings : clientRequests;

  const filteredBookings = currentData.filter((booking) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming")
      return booking.status === "Pending" || booking.status === "Confirmed";
    if (activeFilter === "Past") return booking.status === "Completed";
    return true;
  });

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className={`space-y-12 ${outfit.className}`}>
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 mb-8">
        <div className="flex flex-col items-start justify-start text-left space-y-4">
          <motion.h1
            key={activeFilter}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${rochester.className} text-5xl md:text-7xl lg:text-8xl text-text-main`}
          >
            {activeFilter} <span className="text-primary">Bookings</span>
          </motion.h1>
          <div className="w-32 h-1 bg-linear-to-r from-primary to-primary-dark rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)]" />
        </div>

        <CategorySwitcher
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          className="hidden sm:block"
          id="desktop"
        />
      </div>

      {/* List Header & Table */}
      <div className="space-y-8">
        <div className="flex items-center justify-between p-4 bg-bg-card rounded-3xl border border-border-main backdrop-blur-xl">
          <h3 className="text-xl font-bold text-text-main pl-4">Session Records</h3>
          <div className="text-xs text-text-muted font-medium pr-4">
            Showing {filteredBookings.length} results
          </div>
        </div>

        {/* Tabular/Table Area - Desktop View */}
        <div className="hidden sm:block relative overflow-x-auto rounded-[24px] border border-border-main overflow-hidden shadow-xl shadow-black/5 custom-scrollbar">
          <table className="w-full text-left min-w-[950px] border-collapse">
            <thead className="bg-linear-to-r from-primary-dark via-primary to-accent text-white">
              <tr className="uppercase font-black text-[10px] xl:text-[11px] tracking-widest">
                <th className="px-6 py-5.5">{activeCategory === "hired_by_me" ? "Companion" : "Client"}</th>
                <th className="px-6 py-5.5">Date & Time</th>
                <th className="px-6 py-5.5">Reason for Booking</th>
                <th className="px-6 py-5.5">Price</th>
                <th className="px-6 py-5.5">Status</th>
                <th className="px-6 py-5.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main bg-bg-secondary/20">
              {filteredBookings.map((booking, idx) => {
                const isPaid = booking.status === "Confirmed" || booking.status === "Completed";
                const isCompleted = booking.status === "Completed";
                const isDeclined = booking.status === "Declined";
                
                const requestStatus =
                  booking.status === "Pending"
                    ? "pending"
                    : (booking.status === "Confirmed" || booking.status === "Completed")
                      ? "accepted"
                      : "rejected";

                const partner = findPartnerByNameOrId(booking.id) || findPartnerByNameOrId(booking.name);
                const href = partner
                  ? `/partners/${partner.name.toLowerCase().replace(/\s+/g, "-")}`
                  : `/partners/${booking.id}`;

                const onUpdateStatus = activeCategory === "hired_by_me"
                  ? handleUpdateBookingStatus
                  : handleUpdateClientRequestStatus;

                const allowedToCancel = canCancelBooking(booking.date, booking.time);
                
                const handleCancelAction = () => {
                  if (!allowedToCancel) {
                    toast.error("Sessions can only be cancelled at least 20 minutes before starting time.");
                    return;
                  }
                  onUpdateStatus(booking.id, "Declined");
                  toast.success("Booking cancelled successfully.");
                };

                return (
                  <motion.tr
                    key={`${activeCategory}-${booking.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.04 }}
                    className="group hover:bg-primary/5 transition-all duration-200"
                  >
                    {/* 1. Companion / Client Info */}
                    <td className="px-6 py-5.5">
                      <div className="flex items-center gap-3">
                        {activeCategory === "hired_by_me" ? (
                          <Link href={href} className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border-main shrink-0 hover:ring-2 hover:ring-primary/50 transition-all">
                            <Image
                              src={booking.image}
                              alt={booking.name}
                              fill
                              className="object-cover"
                            />
                          </Link>
                        ) : (
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border-main shrink-0">
                            <Image
                              src={booking.image}
                              alt={booking.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-1.5">
                            {activeCategory === "hired_by_me" ? (
                              <Link href={href} className="text-sm font-bold text-text-main hover:text-primary transition-colors uppercase tracking-tight">
                                {booking.name}
                              </Link>
                            ) : (
                              <span className="text-sm font-bold text-text-main uppercase tracking-tight">
                                {booking.name}
                              </span>
                            )}
                            <span className="text-xs text-text-muted">({booking.age})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} className="text-primary/60" />
                              {booking.location}
                            </span>
                            <span className="w-1 h-1 bg-border-main rounded-full" />
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star size={11} className="fill-amber-500" />
                              {booking.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Date & Time */}
                    <td className="px-6 py-5.5">
                      <div className="flex flex-col gap-1 text-left">
                        <div className="flex items-center gap-1.5 text-xs text-text-main font-semibold">
                          <Calendar size={13} className="text-primary/70 shrink-0" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-text-muted italic">
                          <Clock size={13} className="text-primary/50 shrink-0" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Reason for Booking */}
                    <td className="px-6 py-5.5 max-w-[280px]">
                      <p className="text-xs text-text-muted/90 line-clamp-2 leading-relaxed text-left font-medium">
                        {booking.reason || booking.bio}
                      </p>
                    </td>

                    {/* 4. Price */}
                    <td className="px-6 py-5.5">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-black text-text-main">{booking.price}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          isPaid ? "text-emerald-500" : "text-amber-500"
                        }`}>
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </td>

                    {/* 5. Status */}
                    <td className="px-6 py-5.5">
                      <div
                        className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest items-center gap-1.5 ${
                          isDeclined
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                            : isCompleted
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                              : booking.status === "Pending"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        }`}
                      >
                        {isDeclined && <XCircle className="w-3 h-3" />}
                        {booking.status === "Pending" && <Clock className="w-3 h-3" />}
                        {isPaid && !isCompleted && !isDeclined && <Check className="w-3 h-3" />}
                        {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                        {booking.status}
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td className="px-6 py-5.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isDeclined ? (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60 pr-2">
                            Declined
                          </span>
                        ) : activeCategory === "hired_by_me" ? (
                          isCompleted ? (
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              {!reviewedBookingIds.includes(String(booking.id)) && (
                                <Link href={`${href}?reviewBookingId=${booking.id}`}>
                                  <div
                                    className="px-3.5 py-2 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer"
                                  >
                                    <Share className="w-3.5 h-3.5 text-white" />
                                    <span>Share Review</span>
                                  </div>
                                </Link>
                              )}

                              <Link href={`/send-gift?partner=${partner?.id || booking.id}&booking=${booking.id}`}>
                                <div
                                  className="px-3.5 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer"
                                >
                                  <Gift className="w-3.5 h-3.5" />
                                  <span>Send Gift</span>
                                </div>
                              </Link>
                              
                              <Link href={`/send-tip?partner=${partner?.id || booking.id}&booking=${booking.id}`}>
                                <div
                                  className="px-3.5 py-2 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer"
                                >
                                  <Coins className="w-3.5 h-3.5" />
                                  <span>Send Tip</span>
                                </div>
                              </Link>

                              <Link href={href}>
                                <div
                                  className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all cursor-pointer"
                                  title="Book Again"
                                >
                                  <Calendar className="w-3 h-3" />
                                  <span>Book Again</span>
                                </div>
                              </Link>

                              <Link href={`/my-booking/${booking.id}`}>
                                <div className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all cursor-pointer">
                                  <span>View Details</span>
                                </div>
                              </Link>
                            </div>
                          ) : (
                            <>
                              {!isPaid ? (
                                <>
                                  <motion.button
                                    onClick={() => onUpdateStatus(booking.id, "Confirmed")}
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Pay Now</span>
                                  </motion.button>
                                  <motion.button
                                    onClick={handleCancelAction}
                                    whileHover={allowedToCancel ? { y: -1, scale: 1.02 } : {}}
                                    whileTap={allowedToCancel ? { scale: 0.98 } : {}}
                                    className={`px-3 py-2 border rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all ${
                                      allowedToCancel
                                        ? "bg-bg-secondary border-border-main text-text-muted hover:text-rose-500 cursor-pointer"
                                        : "bg-bg-secondary/40 border-border-main/50 text-text-muted/40 cursor-not-allowed opacity-50"
                                    }`}
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Cancel</span>
                                  </motion.button>
                                </>
                              ) : (
                                <>
                                  <a href={`mailto:${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Coordinating Session`}>
                                    <motion.div
                                      whileHover={{ y: -2, scale: 1.03 }}
                                      whileTap={{ scale: 0.97 }}
                                      className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>Message</span>
                                    </motion.div>
                                  </a>
                                  <motion.button
                                    onClick={handleCancelAction}
                                    whileHover={allowedToCancel ? { y: -1, scale: 1.02 } : {}}
                                    whileTap={allowedToCancel ? { scale: 0.98 } : {}}
                                    className={`px-3 py-2 border rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all ${
                                      allowedToCancel
                                        ? "bg-bg-secondary border-border-main text-text-muted hover:text-rose-500 cursor-pointer"
                                        : "bg-bg-secondary/40 border-border-main/50 text-text-muted/40 cursor-not-allowed opacity-50"
                                    }`}
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Cancel</span>
                                  </motion.button>
                                </>
                              )}
                            </>
                          )
                        ) : (
                          // Client Requests ("Hired Me")
                          <>
                            {isCompleted ? (
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                <a href={`mailto:client-${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Session Completed`}>
                                  <motion.div
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Message</span>
                                  </motion.div>
                                </a>
                                <Link href={`/my-booking/${booking.id}?role=partner`}>
                                  <motion.div
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all cursor-pointer"
                                  >
                                    <span>View Details</span>
                                  </motion.div>
                                </Link>
                              </div>
                            ) : requestStatus === "pending" ? (
                              <>
                                <motion.button
                                  onClick={() => onUpdateStatus(booking.id, "Confirmed")}
                                  whileHover={{ y: -2, scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => onUpdateStatus(booking.id, "Declined")}
                                  whileHover={{ y: -1, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-rose-500 transition-all cursor-pointer"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </motion.button>
                              </>
                            ) : requestStatus === "accepted" ? (
                              <>
                                <a href={`mailto:client-${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Session Approved`}>
                                  <motion.div
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Message</span>
                                  </motion.div>
                                </a>
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                  Accepted
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60 pr-2">
                                Declined
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tabular/Table Area - Mobile View Card List */}
        <div className="block sm:hidden space-y-6">
          {filteredBookings.map((booking, idx) => {
            const isPaid = booking.status === "Confirmed" || booking.status === "Completed";
            const isCompleted = booking.status === "Completed";
            const isDeclined = booking.status === "Declined";
            
            const requestStatus =
              booking.status === "Pending"
                ? "pending"
                : (booking.status === "Confirmed" || booking.status === "Completed")
                  ? "accepted"
                  : "rejected";

            const partner = findPartnerByNameOrId(booking.id) || findPartnerByNameOrId(booking.name);
            const href = partner
              ? `/partners/${partner.name.toLowerCase().replace(/\s+/g, "-")}`
              : `/partners/${booking.id}`;

            const onUpdateStatus = activeCategory === "hired_by_me"
              ? handleUpdateBookingStatus
              : handleUpdateClientRequestStatus;

            const allowedToCancel = canCancelBooking(booking.date, booking.time);
            
            const handleCancelAction = () => {
              if (!allowedToCancel) {
                toast.error("Sessions can only be cancelled at least 20 minutes before starting time.");
                return;
              }
              onUpdateStatus(booking.id, "Declined");
              toast.success("Booking cancelled successfully.");
            };

            return (
              <motion.div
                key={`mobile-${activeCategory}-${booking.id}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-bg-secondary border border-border-main rounded-3xl p-5 space-y-4 shadow-md"
              >
                {/* 1. Companion / Client Info & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {activeCategory === "hired_by_me" ? (
                      <Link href={href} className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border-main shrink-0">
                        <Image
                          src={booking.image}
                          alt={booking.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    ) : (
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border-main shrink-0">
                        <Image
                          src={booking.image}
                          alt={booking.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeCategory === "hired_by_me" ? (
                          <Link href={href} className="text-sm font-bold text-text-main hover:text-primary transition-colors uppercase tracking-tight">
                            {booking.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-text-main uppercase tracking-tight">
                            {booking.name}
                          </span>
                        )}
                        <span className="text-xs text-text-muted">({booking.age})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-primary/60" />
                          {booking.location}
                        </span>
                        <span className="w-1 h-1 bg-border-main rounded-full" />
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star size={11} className="fill-amber-500" />
                          {booking.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest items-center gap-1.5 shrink-0 ${
                      isDeclined
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        : isCompleted
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : booking.status === "Pending"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>

                {/* 2. Date & Time & Price */}
                <div className="grid grid-cols-2 gap-4 bg-bg-base/40 border border-border-main/50 rounded-2xl p-3.5">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Schedule</span>
                    <div className="flex items-center gap-1 text-xs text-text-main font-semibold flex-wrap">
                      <Calendar size={12} className="text-primary/70 shrink-0" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted italic flex-wrap">
                      <Clock size={12} className="text-primary/50 shrink-0" />
                      <span>{booking.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center text-right">
                    <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Session Fee</span>
                    <span className="text-sm font-black text-text-main">{booking.price}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      isPaid ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {isPaid ? "Paid" : "Pending Payment"}
                    </span>
                  </div>
                </div>

                {/* 3. Reason for Booking */}
                {(booking.reason || booking.bio) && (
                  <div className="text-left bg-bg-base/20 rounded-2xl p-3 border border-border-main/30">
                    <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold block mb-1">Booking Request Details</span>
                    <p className="text-xs text-text-muted/90 leading-relaxed font-medium">
                      {booking.reason || booking.bio}
                    </p>
                  </div>
                )}

                {/* 4. Actions */}
                <div className="pt-2 border-t border-border-main/30 flex items-center justify-end gap-2 flex-wrap">
                  {isDeclined ? (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60 pr-2">
                      Declined
                    </span>
                  ) : activeCategory === "hired_by_me" ? (
                    isCompleted ? (
                      <div className="flex items-center gap-2 flex-wrap w-full justify-end">
                        {!reviewedBookingIds.includes(String(booking.id)) && (
                          <Link href={`${href}?reviewBookingId=${booking.id}`} className="flex-1 min-w-[120px]">
                            <div className="px-3.5 py-2.5 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer">
                              <Share className="w-3.5 h-3.5 text-white" />
                              <span>Share Review</span>
                            </div>
                          </Link>
                        )}

                        <Link href={`/send-gift?partner=${partner?.id || booking.id}&booking=${booking.id}`} className="flex-1 min-w-[100px]">
                          <div className="px-3.5 py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer">
                            <Gift className="w-3.5 h-3.5" />
                            <span>Gift</span>
                          </div>
                        </Link>
                        
                        <Link href={`/send-tip?partner=${partner?.id || booking.id}&booking=${booking.id}`} className="flex-1 min-w-[100px]">
                          <div className="px-3.5 py-2.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all cursor-pointer">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Tip</span>
                          </div>
                        </Link>

                        <Link href={`/my-booking/${booking.id}`} className="flex-1 min-w-[120px]">
                          <div className="px-3.5 py-2.5 bg-bg-base border border-border-main rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-main hover:text-primary transition-all cursor-pointer">
                            <span>Details</span>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap w-full justify-end">
                        {!isPaid ? (
                          <>
                            <button
                              onClick={() => onUpdateStatus(booking.id, "Confirmed")}
                              className="flex-1 min-w-[110px] px-4 py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pay Now</span>
                            </button>
                            <button
                              onClick={handleCancelAction}
                              disabled={!allowedToCancel}
                              className={`flex-1 min-w-[100px] px-3 py-2.5 border rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                                allowedToCancel
                                  ? "bg-bg-base border-border-main text-text-muted hover:text-rose-500 cursor-pointer"
                                  : "bg-bg-base/40 border-border-main/50 text-text-muted/40 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <a href={`mailto:${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Coordinating Session`} className="flex-1 min-w-[110px]">
                              <div className="w-full py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Message</span>
                              </div>
                            </a>
                            <button
                              onClick={handleCancelAction}
                              disabled={!allowedToCancel}
                              className={`flex-1 min-w-[100px] px-3 py-2.5 border rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                                allowedToCancel
                                  ? "bg-bg-base border-border-main text-text-muted hover:text-rose-500 cursor-pointer"
                                  : "bg-bg-base/40 border-border-main/50 text-text-muted/40 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        <Link href={`/my-booking/${booking.id}`} className="flex-1 min-w-[120px]">
                          <div className="px-3.5 py-2.5 bg-bg-base border border-border-main rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-main hover:text-primary transition-all cursor-pointer">
                            <span>Details</span>
                          </div>
                        </Link>
                      </div>
                    )
                  ) : (
                    // Client Requests ("Hired Me")
                    <div className="flex items-center gap-2 flex-wrap w-full justify-end">
                      {isCompleted ? (
                        <>
                          <a href={`mailto:client-${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Session Completed`} className="flex-1 min-w-[110px]">
                            <div className="w-full py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </div>
                          </a>
                          <Link href={`/my-booking/${booking.id}?role=partner`} className="flex-1 min-w-[120px]">
                            <div className="px-3 py-2.5 bg-bg-base border border-border-main rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all cursor-pointer">
                              <span>Details</span>
                            </div>
                          </Link>
                        </>
                      ) : requestStatus === "pending" ? (
                        <>
                          <button
                            onClick={() => onUpdateStatus(booking.id, "Confirmed")}
                            className="flex-1 min-w-[110px] px-4 py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onUpdateStatus(booking.id, "Declined")}
                            className="flex-1 min-w-[100px] px-3 py-2.5 bg-bg-base border border-border-main rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : requestStatus === "accepted" ? (
                        <>
                          <a href={`mailto:client-${booking.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@email.com?subject=Session Approved`} className="flex-1 min-w-[110px]">
                            <div className="w-full py-2.5 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </div>
                          </a>
                          <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            Accepted
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/60 pr-2">
                          Declined
                        </span>
                      )}
                      <Link href={`/my-booking/${booking.id}?role=partner`} className="flex-1 min-w-[120px]">
                        <div className="px-3 py-2.5 bg-bg-base border border-border-main rounded-xl flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all cursor-pointer">
                          <span>Details</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredBookings.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-muted text-lg">
              No sessions found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBookingDetails && (() => {
          const isHiredMe = activeCategory === "hired_me";
          const p = findPartnerByNameOrId(selectedBookingDetails.name);
          
          let earnings = [];
          if (isHiredMe) {
            const myPartnerId = getLoggedPartnerId();
            const allPartnerEarnings = getGiftsAndTipsForPartner(myPartnerId);
            earnings = allPartnerEarnings.filter((txn: any) => 
              txn.sender && txn.sender.toLowerCase() === selectedBookingDetails.name.toLowerCase()
            );
            if (earnings.length === 0 && selectedBookingDetails.name === "Arjun Kapoor") {
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
          } else {
            earnings = getGiftsAndTipsForPartner(p?.id || selectedBookingDetails.id);
          }

          const totalPaid = parseInt(selectedBookingDetails.price.replace(/[^\d]/g, ""), 10) || 0;
          const basePrice = Math.round(totalPaid / 1.18);
          const gstAmount = totalPaid - basePrice;

          return (
            <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBookingDetails(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`relative w-full max-w-2xl bg-bg-base border border-border-main rounded-[36px] overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col gap-6 ${outfit.className}`}
              >
                {/* Decorative glows */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Booking Receipt & Details</span>
                    <h2 className="text-2xl font-black text-text-main mt-1">Booking #{selectedBookingDetails.id}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedBookingDetails(null)}
                    className="cursor-pointer w-9 h-9 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-main hover:bg-bg-card transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Scrollable wrapper */}
                <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-1 z-10">
                  
                  {/* 1. Client / Companion Details Card */}
                  <div className="bg-bg-secondary border border-border-main rounded-2xl p-4 flex items-center gap-4 relative pt-6 md:pt-4">
                    <span className="absolute top-2 right-4 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-text-muted/10 text-text-muted rounded-md border border-border-main">
                      {isHiredMe ? "Client Details" : "Companion Details"}
                    </span>
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border-main shrink-0">
                      <Image
                        src={selectedBookingDetails.image}
                        alt={selectedBookingDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-text-main truncate">{selectedBookingDetails.name}</h3>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-primary">
                          {selectedBookingDetails.age} Yrs
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-text-muted text-xs font-semibold">
                          <MapPin size={12} className="text-primary" /> {selectedBookingDetails.location}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted text-xs font-semibold">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> {selectedBookingDetails.rating} Rating
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Schedule details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-bg-secondary/40 border border-border-main/60 rounded-2xl p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Booking Date</p>
                        <p className="text-text-main text-sm font-bold mt-0.5">{selectedBookingDetails.date}</p>
                      </div>
                    </div>
                    <div className="bg-bg-secondary/40 border border-border-main/60 rounded-2xl p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Time Slots</p>
                        <p className="text-text-main text-sm font-bold mt-0.5">{selectedBookingDetails.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Pricing breakdown */}
                  <div className="border border-border-main rounded-2xl p-5 bg-bg-secondary/20">
                    <h4 className="text-xs font-black uppercase tracking-wider text-text-main mb-3">Payment Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                        <span>Base Price (excl. GST)</span>
                        <span>₹{basePrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="h-px bg-border-main my-2" />
                      <div className="flex justify-between items-center text-base font-black text-text-main">
                        <span>Total Amount Paid</span>
                        <span className="text-primary">₹{totalPaid.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Tips & Gifts sent */}
                  <div className="border border-border-main rounded-2xl p-5 bg-bg-secondary/20">
                    <h4 className="text-xs font-black uppercase tracking-wider text-text-main mb-3">
                      {isHiredMe ? "Tips & Gifts Received" : "Tips & Gifts Given"}
                    </h4>
                    {earnings.length > 0 ? (
                      <div className="space-y-3">
                        {earnings.map((txn: any) => (
                          <div key={txn.id} className="flex items-center justify-between bg-bg-card border border-border-main/55 p-3.5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                txn.type === "tip" ? "bg-emerald-500/10" : "bg-primary/10"
                              }`}>
                                {txn.type === "tip" ? <Coins className="w-4 h-4 text-emerald-500" strokeWidth={2.5} /> : <Gift className="w-4 h-4 text-primary" />}
                              </div>
                              <div>
                                <p className="text-xs font-black text-text-main">
                                  {txn.type === "tip" 
                                    ? (isHiredMe ? "Received Tip" : "Sent Tip")
                                    : (isHiredMe 
                                        ? `Received Gift: "${txn.giftTitle || 'Special Gift'}"`
                                        : `Sent Gift: "${txn.giftTitle || 'Special Gift'}"`
                                      )
                                  }
                                </p>
                                {txn.message && (
                                  <p className="text-[11px] text-text-muted italic mt-0.5">"{txn.message}"</p>
                                )}
                                <p className="text-[9px] text-text-muted/70 mt-1">{txn.date}</p>
                              </div>
                            </div>
                            <span className={`text-sm font-black ${
                              txn.type === "tip" ? "text-emerald-500" : "text-primary"
                            }`}>
                              ₹{txn.amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-xs italic">
                        {isHiredMe 
                          ? "No tips or gifts received yet for this session."
                          : "No tips or gifts sent yet for this booking."}
                      </p>
                    )}
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border-main z-10">
                  {/* Chat History - future work */}
                  <button
                    onClick={() => toast.success("Chat history is locked. Integrated communication channels coming soon!")}
                    className="flex-1 cursor-pointer h-12 rounded-xl bg-bg-secondary hover:bg-bg-card border border-border-main text-text-main font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Chat History</span>
                  </button>
                  <button
                    onClick={() => setSelectedBookingDetails(null)}
                    className="flex-1 cursor-pointer h-12 rounded-xl bg-text-main text-bg-base font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <span>Close Receipt</span>
                  </button>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}



