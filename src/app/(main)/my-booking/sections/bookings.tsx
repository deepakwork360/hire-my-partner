"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Rochester, Outfit } from "next/font/google";
import { partners } from "@/modules/partner/data/partners";
import CategorySwitcher from "./category-switcher";
import Loader from "@/components/loader/Loader";

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

  useEffect(() => {
    setMounted(true);
    try {
      const localBookings = localStorage.getItem("hire_my_partner_bookings");
      if (localBookings) {
        setBookings(JSON.parse(localBookings));
      } else {
        setBookings(MOCK_BOOKINGS);
        localStorage.setItem("hire_my_partner_bookings", JSON.stringify(MOCK_BOOKINGS));
      }

      const localRequests = localStorage.getItem("hire_my_partner_requests");
      if (localRequests) {
        setClientRequests(JSON.parse(localRequests));
      } else {
        setClientRequests(MOCK_CLIENT_REQUESTS);
        localStorage.setItem("hire_my_partner_requests", JSON.stringify(MOCK_CLIENT_REQUESTS));
      }
    } catch (error) {
      console.error("Error reading localStorage", error);
    }
  }, []);

  const handleUpdateBookingStatus = (id: number | string, newStatus: BookingData["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    localStorage.setItem("hire_my_partner_bookings", JSON.stringify(updated));
  };

  const handleUpdateClientRequestStatus = (id: number | string, newStatus: BookingData["status"]) => {
    const updated = clientRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setClientRequests(updated);
    localStorage.setItem("hire_my_partner_requests", JSON.stringify(updated));
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

        {/* Tabular/Table Area */}
        <div className="relative overflow-x-auto rounded-[24px] border border-border-main overflow-hidden shadow-xl shadow-black/5 custom-scrollbar">
          <table className="w-full text-left min-w-[950px] border-collapse">
            <thead className="bg-linear-to-r from-primary-dark via-primary to-accent text-white">
              <tr className="uppercase font-black text-[10px] xl:text-[11px] tracking-widest">
                <th className="px-6 py-5.5">{activeCategory === "hired_by_me" ? "Companion" : "Client"}</th>
                <th className="px-6 py-5.5">Date & Time</th>
                <th className="px-6 py-5.5">About Session</th>
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

                    {/* 3. Session Bio */}
                    <td className="px-6 py-5.5 max-w-[280px]">
                      <p className="text-xs text-text-muted/90 line-clamp-2 leading-relaxed text-left font-medium">
                        {booking.bio}
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
                            <Link href={href}>
                              <motion.div
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="px-4 py-2 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Book Again</span>
                              </motion.div>
                            </Link>
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
                                    onClick={() => onUpdateStatus(booking.id, "Declined")}
                                    whileHover={{ y: -1, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-rose-500 transition-all cursor-pointer"
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
                                    onClick={() => onUpdateStatus(booking.id, "Declined")}
                                    whileHover={{ y: -1, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-3 py-2 bg-bg-secondary border border-border-main rounded-xl flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-rose-500 transition-all cursor-pointer"
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
                            {requestStatus === "pending" && (
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
                            )}
                            {requestStatus === "accepted" && (
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
                            )}
                            {requestStatus === "rejected" && (
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



