"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MessageCircle, Shield } from "lucide-react";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import { useAuthStore } from "@/modules/auth/store";
import { partners } from "@/modules/partner/data/partners";

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
}

export default function ChatHistoryPage({
  params
}: {
  params: Promise<{ "booking-id": string }>
}) {
  const router = useRouter();
  const { "booking-id": bookingId } = use(params);
  const searchParams = useSearchParams();
  const isHiredMe = searchParams.get("role") === "partner";
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let foundBooking: BookingData | null = null;
    const localBookings = localStorage.getItem("hire_my_partner_bookings");
    if (localBookings) {
      const list: BookingData[] = JSON.parse(localBookings);
      const matched = list.find(b => String(b.id) === String(bookingId));
      if (matched) foundBooking = matched;
    }

    if (!foundBooking) {
      const localRequests = localStorage.getItem("hire_my_partner_requests");
      if (localRequests) {
        const list: BookingData[] = JSON.parse(localRequests);
        const matched = list.find(b => String(b.id) === String(bookingId));
        if (matched) foundBooking = matched;
      }
    }

    if (!foundBooking) {
      // Find default mock partner if booking not found to prevent crash
      const matchedPartner = partners.find(p => String(p.id) === String(bookingId)) || partners[0];
      foundBooking = {
        id: bookingId,
        image: matchedPartner.image,
        name: matchedPartner.name,
        age: matchedPartner.age,
        location: matchedPartner.location.split(",")[0].trim(),
        rating: matchedPartner.rating,
        date: "June 24, 2026",
        time: "07:00 PM - 09:00 PM",
        price: "₹5,000",
        status: "Completed",
        bio: matchedPartner.bio,
      };
    }

    setBooking(foundBooking);
  }, [bookingId]);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="w-full flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Dashboard */}
        <SideDashboard />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="w-full max-w-[900px] mx-auto px-6 pt-30 pb-12 flex-1 flex flex-col gap-6">
            
            <Link
              href={`/my-booking/${bookingId}${isHiredMe ? "?role=partner" : ""}`}
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-xs font-black uppercase tracking-wider mb-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Booking Details
            </Link>

            {/* Chat Layout Box */}
            <div className="md:bg-bg-secondary md:border md:border-border-main md:rounded-[36px] md:shadow-2xl flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="pb-6 md:p-6 border-b border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:bg-bg-base/40 md:backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-border-main shrink-0">
                    <Image
                      src={booking.image}
                      alt={booking.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-base font-black text-text-main">Conversation with {booking.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-text-muted/60" />
                      <span className="text-[10px] text-text-muted uppercase tracking-widest font-black">Archived Chat</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-bg-secondary md:bg-bg-base border border-border-main flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-wider shadow-sm">
                  <Shield className="w-3.5 h-3.5 text-primary" /> End-to-End Encrypted
                </div>
              </div>

              {/* Chat Feed */}
              <div className="py-4 md:p-6 space-y-6 md:bg-bg-base/20">
                {/* Date separator */}
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 rounded-full bg-bg-secondary border border-border-main text-[9px] font-black uppercase tracking-wider text-text-muted">
                    14 June, 2026
                  </span>
                </div>

                {/* Message 1 (Companion) */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] sm:max-w-[70%]">
                    <div className="bg-bg-secondary border border-border-main text-text-main text-sm px-5 py-3.5 rounded-3xl rounded-tl-none leading-relaxed shadow-sm">
                      Hello! I'm looking forward to our meeting today. I will be heading to Connaught Place shortly.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pl-1">06:32 PM</span>
                  </div>
                </div>

                {/* Message 2 (User) */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end">
                    <div className="bg-primary text-white text-sm px-5 py-3.5 rounded-3xl rounded-tr-none leading-relaxed shadow-md shadow-primary/15">
                      Hi! Me too. I am already in CP and will be waiting at Cafe Delhi Heights. See you soon!
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pr-1">06:38 PM</span>
                  </div>
                </div>

                {/* Message 3 (Companion) */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] sm:max-w-[70%]">
                    <div className="bg-bg-secondary border border-border-main text-text-main text-sm px-5 py-3.5 rounded-3xl rounded-tl-none leading-relaxed shadow-sm">
                      Perfect. I'm on the outer circle, running just 5 minutes late due to traffic, but I'll be there by 7:05 PM.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pl-1">06:45 PM</span>
                  </div>
                </div>

                {/* Message 4 (User) */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end">
                    <div className="bg-primary text-white text-sm px-5 py-3.5 rounded-3xl rounded-tr-none leading-relaxed shadow-md shadow-primary/15">
                      No worries at all! Drive safe. I've reserved a quiet window table.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pr-1">06:50 PM</span>
                  </div>
                </div>

                {/* Message 5 (Companion) */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] sm:max-w-[70%]">
                    <div className="bg-bg-secondary border border-border-main text-text-main text-sm px-5 py-3.5 rounded-3xl rounded-tl-none leading-relaxed shadow-sm">
                      Just parked! Walking inside the cafe now. See you in a moment!
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pl-1">07:03 PM</span>
                  </div>
                </div>

                {/* Message 6 (User) */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end">
                    <div className="bg-primary text-white text-sm px-5 py-3.5 rounded-3xl rounded-tr-none leading-relaxed shadow-md shadow-primary/15">
                      Awesome! I am wearing a black shirt, seated near the window.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pr-1">07:04 PM</span>
                  </div>
                </div>

                {/* Date separator */}
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 rounded-full bg-bg-secondary border border-border-main text-[9px] font-black uppercase tracking-wider text-text-muted">
                    15 June, 2026
                  </span>
                </div>

                {/* Message 7 (Companion) */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] sm:max-w-[70%]">
                    <div className="bg-bg-secondary border border-border-main text-text-main text-sm px-5 py-3.5 rounded-3xl rounded-tl-none leading-relaxed shadow-sm">
                      Thank you for such an amazing time yesterday! The dinner at Cafe Delhi Heights and the walk around India Gate were absolutely wonderful.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pl-1">09:15 AM</span>
                  </div>
                </div>

                {/* Message 8 (User) */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end">
                    <div className="bg-primary text-white text-sm px-5 py-3.5 rounded-3xl rounded-tr-none leading-relaxed shadow-md shadow-primary/15">
                      I had a fantastic time too! Your company made it truly special. Let's definitely coordinate another session soon.
                    </div>
                    <span className="text-[9px] text-text-muted mt-1.5 block pr-1">09:30 AM</span>
                  </div>
                </div>
              </div>

              {/* Read Only Footer Alert */}
              <div className="pt-6 md:p-6 border-t border-border-main flex items-center justify-center md:bg-bg-base/50 md:backdrop-blur-md">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                  🔒 This chat log has been archived and is read-only.
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
