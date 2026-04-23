"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Check,
  Download,
  StarHalf,
} from "lucide-react";
import { Rochester, Outfit } from "next/font/google";
import CategorySwitcher from "./category-switcher";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface BookingData {
  id: number;
  image: string;
  name: string;
  age: number;
  location: string;
  rating: string;
  date: string;
  time: string;
  price: string;
  status: "Pending" | "Confirmed" | "Completed";
  bio: string;
}

const MOCK_BOOKINGS: BookingData[] = [
  {
    id: 1,
    image: "/images/img1.webp",
    name: "Emily",
    age: 22,
    location: "Mumbai",
    rating: "4.9",
    date: "June 24, 2025",
    time: "07:00 PM - 09:00 PM",
    price: "₹5,000",
    status: "Pending",
    bio: "I am looking forward to our dinner session at the rooftop lounge.",
  },
  {
    id: 2,
    image: "/images/img2.webp",
    name: "Sophia",
    age: 24,
    location: "Delhi",
    rating: "4.8",
    date: "June 25, 2025",
    time: "02:00 PM - 05:00 PM",
    price: "₹3,500",
    status: "Confirmed",
    bio: "Exploring the historic sites together will be a wonderful experience.",
  },
  {
    id: 3,
    image: "/images/img3.webp",
    name: "Olivia",
    age: 21,
    location: "Bangalore",
    rating: "5.0",
    date: "June 26, 2025",
    time: "09:00 AM - 11:00 AM",
    price: "₹4,200",
    status: "Pending",
    bio: "Early morning coffee and a walk in the park sounds perfect.",
  },
  {
    id: 4,
    image: "/images/img4.webp",
    name: "Ava",
    age: 23,
    location: "Hyderabad",
    rating: "4.7",
    date: "June 27, 2025",
    time: "08:30 PM - 11:30 PM",
    price: "₹6,000",
    status: "Confirmed",
    bio: "The movie premiere is tonight. Let's make it a night to remember.",
  },
  {
    id: 5,
    image: "/images/img5.webp",
    name: "Isabella",
    age: 25,
    location: "Goa",
    rating: "4.6",
    date: "May 12, 2025",
    time: "04:00 PM - 07:00 PM",
    price: "₹8,000",
    status: "Completed",
    bio: "Had a great time exploring the beaches and the old town.",
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
    date: "July 1, 2025",
    time: "07:00 PM - 10:00 PM",
    price: "₹6,000",
    status: "Pending",
    bio: "Need a companion for a corporate dinner event. Professionalism is key.",
  },
  {
    id: 102,
    image: "/images/img7.webp",
    name: "Siddharth Verma",
    age: 28,
    location: "Gurgaon, Delhi",
    rating: "4.2",
    date: "July 5, 2025",
    time: "01:00 PM - 04:00 PM",
    price: "₹4,500",
    status: "Confirmed",
    bio: "Looking to explore the local cafes and have a meaningful conversation.",
  },
  {
    id: 103,
    image: "/images/img3.webp",
    name: "Arjun Kapoor",
    age: 40,
    location: "Indiranagar, Bangalore",
    rating: "4.8",
    date: "May 20, 2025",
    time: "06:00 PM - 09:00 PM",
    price: "₹7,500",
    status: "Completed",
    bio: "Had a great session discussing tech trends and start-ups.",
  },
];

function BookingCard({
  booking,
  category,
}: {
  booking: BookingData;
  category: string;
}) {
  const [isPaid, setIsPaid] = useState(
    booking.status === "Confirmed" || booking.status === "Completed",
  );
  const isCompleted = booking.status === "Completed";

  // Logical state for "Hired Me" category
  const [requestStatus, setRequestStatus] = useState<
    "pending" | "accepted" | "rejected"
  >(
    booking.status === "Pending"
      ? "pending"
      : booking.status === "Confirmed" || booking.status === "Completed"
        ? "accepted"
        : "rejected",
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="main-profile-card group shrink-0"
    >
      <Link href="/partner-profile-detail" className="relative block">
        {/* Photo Section */}
        <div className="profile-card-image">
          <div className="relative w-full h-full overflow-hidden rounded-[28px]">
            <Image
              src={booking.image}
              alt={booking.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Top Badges */}
          <div className="profile-card-badge">
            {isPaid ? "Paid: " : "Unpaid: "}
            {booking.price}
          </div>
          <div className="profile-card-rating">
            <Star className="profile-card-rating-icon" />
            <span>{booking.rating}</span>
          </div>

          {/* Status Badge */}
          <div
            className={`absolute bottom-6 left-6 z-20 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              !isPaid
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                : booking.status === "Completed"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            }`}
          >
            {isPaid && <Check className="w-3 h-3" />}
            {isPaid
              ? isCompleted
                ? "Completed"
                : "Paid & Confirmed"
              : "Payment Pending"}
          </div>

          {/* Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/80 to-transparent pointer-events-none z-10 mx-4 mb-4 rounded-b-[28px]" />
        </div>

        {/* Content Section */}
        <div className="profile-card-content">
          <div className="profile-card-header">
            <span className="profile-card-name">{booking.name}</span>
            <span className="profile-card-age">{booking.age}</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="profile-card-location">
              <MapPin className="profile-card-location-icon" />
              <span>{booking.location}</span>
            </div>

            {/* Session Details */}
            <div className="flex items-center gap-4 text-[11px] text-text-muted font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary/60" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary/60" />
                <span>{booking.time}</span>
              </div>
            </div>
          </div>

          <p className="profile-card-bio mt-3">{booking.bio}</p>
        </div>
      </Link>

      {/* Actions Section - PREMIUM GLASS-BOX Workflow */}
      <div className="profile-card-footer mt-auto pt-6">
        <div className="flex items-center gap-3 w-full">
          {category === "hired_by_me" ? (
            // --- HIRED BY ME ACTIONS (Existing) ---
            isCompleted ? (
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 h-12 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Again</span>
              </motion.button>
            ) : (
              <>
                {!isPaid ? (
                  <>
                    <motion.button
                      onClick={() => setIsPaid(true)}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-2 h-12 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pay Now</span>
                    </motion.button>
 
                    <motion.button
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 h-12 bg-bg-secondary/80 border-2 border-border-main rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-inner hover:bg-bg-card hover:text-rose-500 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-2 h-12 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </motion.button>
 
                    <motion.button
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 h-12 bg-bg-secondary/80 border-2 border-border-main rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted shadow-inner hover:bg-bg-card hover:text-rose-500 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </motion.button>
                  </>
                )}
              </>
            )
          ) : (
            // --- HIRED ME ACTIONS (New) ---
            <div className="w-full">
              {requestStatus === "pending" && (
                <div className="flex items-center gap-3 w-full">
                  <motion.button
                    onClick={() => setRequestStatus("accepted")}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept</span>
                  </motion.button>
 
                  <motion.button
                    onClick={() => setRequestStatus("rejected")}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[0.6] h-12 bg-bg-secondary/80 border-2 border-border-main rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 shadow-inner hover:bg-bg-card transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </motion.button>
                </div>
              )}

              {requestStatus === "accepted" && (
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 bg-linear-to-br from-primary via-primary-dark to-primary rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Client</span>
                  </motion.button>
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    Accepted
                  </div>
                </div>
              )}

              {requestStatus === "rejected" && (
                <div className="flex items-center justify-center h-12 w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">
                    Declined
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
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
  const currentData =
    activeCategory === "hired_by_me" ? MOCK_BOOKINGS : MOCK_CLIENT_REQUESTS;

  const filteredBookings = currentData.filter((booking) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming")
      return booking.status === "Pending" || booking.status === "Confirmed";
    if (activeFilter === "Past") return booking.status === "Completed";
    return true;
  });

  // Standardized Grid Classes (3 on laptop, 4 on monitor)
  const gridClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

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

      {/* List Header & Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between p-4 bg-bg-card rounded-3xl border border-border-main backdrop-blur-xl">
          <h3 className="text-xl font-bold text-text-main pl-4">Session Records</h3>
          <div className="text-xs text-text-muted font-medium pr-4">
            Showing {filteredBookings.length} results
          </div>
        </div>

        {/* Grid Area */}
        <div className={`grid ${gridClasses} gap-8 justify-items-center`}>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={`${activeCategory}-${booking.id}`}
              booking={booking}
              category={activeCategory}
            />
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-text-muted text-lg">
              No sessions found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



