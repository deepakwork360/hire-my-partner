"use client";

import React, { useState, useRef } from "react";
import { Rochester, Outfit } from "next/font/google";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Star,
  CheckCircle2,
  CalendarCheck,
  Zap,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MotionLink = motion(Link);

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});
export default function BookyInfo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`pt-32 pb-0 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      {/* Cinematic Background Accents */}
      <div className="absolute top-0 right-[5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex flex-col items-center">
        {/* NEW Header Section: Perfectly Centered */}
        <div className="w-full flex flex-col items-center mb-10 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4 bg-bg-secondary border border-border-main px-5 py-2 rounded-full backdrop-blur-md mb-2">
              <Ticket className="w-4 h-4 text-primary" />
              <span className="text-primary/80 text-[10px] font-black uppercase tracking-[0.4em]">
                Official Reservation
              </span>
            </div>

            <h1
              className={`${rochester.className} text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main tracking-tight`}
            >
              Booking <span className="text-primary">Information</span>
            </h1>
            <p className="text-text-muted max-w-xl">
              Review your official reservation details and manage your booking preferences below.
            </p>
          </motion.div>
        </div>

        {/* ULTRA-PREMIUM REDESIGNED BUTTON - Repositioned between H1 and Card */}
        <div className="mb-16">
          <Link href="/my-booking">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-4 px-10 py-4 rounded-full font-black tracking-[0.2em] uppercase text-[10px] transition-all duration-500"
            >
              {/* Dynamic Background Architecture */}
              <div className="absolute inset-0 bg-bg-card border-2 border-primary/30 group-hover:border-primary shadow-2xl shadow-primary/10 rounded-full transition-all duration-500" />
              
              {/* Internal Accent Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-primary/5 blur-xl transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3 text-text-main group-hover:text-primary transition-all duration-500">
                <div className="w-10 h-10 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                   <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </div>
                <span className="tracking-widest">Back to booking</span>
              </div>
            </motion.button>
          </Link>
        </div>

        {/* ULTRA-PREMIUM CONCIERGE TICKET */}
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-bg-card backdrop-blur-[100px] border border-border-main rounded-[50px] shadow-2xl shadow-black/5 overflow-hidden flex flex-col md:flex-row group min-h-[500px]"
        >

          {/* LEFT: Visual Showcase - Wider & Shorter */}
          <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto overflow-hidden border-b md:border-b-0 md:border-r border-border-main h-80 md:h-auto">
            {/* Professional Scrim for white-background uploads */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10 shadow-[inset_0_-150px_100px_-50px_rgba(0,0,0,0.4)]" />
            <Image
              src="/images/girl1.webp"
              alt="Aarushi Kumari"
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
              priority
            />

            {/* Elite Vintage Stamp Overlay */}
            <div className="absolute top-10 left-10 z-20 transform -rotate-12">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-dashed border-primary/40 flex items-center justify-center bg-primary/5 backdrop-blur-sm shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                <div className="text-[9px] md:text-[11px] font-black text-primary uppercase flex flex-col items-center leading-tight">
                  <span>Elite</span>
                  <span className="text-white/80">Status</span>
                </div>
              </div>
            </div>

            {/* Identity Signature */}
            <div className="absolute bottom-12 left-10 z-20">
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <motion.h3
                    className={`${rochester.className} text-5xl md:text-7xl !text-white mb-2 leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
                  >
                    Aarushi Kumari
                  </motion.h3>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full mb-4 shadow-lg shadow-primary/20" />
                </div>
                <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full w-fit border border-white/20">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Age 24
                  </span>
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary" /> Bengaluru
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-End Details Panel - Streamlined */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between relative bg-bg-secondary">
            <div className="relative">
              {/* Header Details */}
              <div className="flex flex-col gap-2 mb-10 px-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted">
                    Service Plan
                  </span>
                </div>
                <h2 className="text-text-main text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  Private Engagement
                </h2>
              </div>

              {/* Data Ticket Grid */}
              <div className="grid grid-cols-2 gap-8 px-2">
                {/* DATE */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Reservation
                    </span>
                  </div>
                  <div className="text-text-main font-black text-lg lg:text-xl">
                    APRIL 14, 2024
                  </div>
                </div>

                {/* TIME */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Scheduled
                    </span>
                  </div>
                  <div className="text-text-main font-black text-lg lg:text-xl uppercase">
                    07:00 PM
                  </div>
                </div>

                {/* QUOTE / DETAIL - Smaller */}
                <div className="col-span-2 bg-bg-secondary p-4 rounded-2xl border border-border-main mt-2">
                  <p className="text-text-muted text-xs md:text-sm leading-relaxed font-medium italic opacity-80">
                    "An exclusive engagement tailored for sophisticated
                    connection and shared luxury moments."
                  </p>
                </div>
              </div>
            </div>

            {/* REDESIGNED Action Buttons - Simplified */}
            <div className="mt-12 flex items-center justify-between gap-6 px-2 w-full">
              <Link href="/partner-profile-detail" className="shrink-0">
                <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary pb-1 whitespace-nowrap">
                  View Profile
                </span>
              </Link>

              <MotionLink
                href="/checkout"
                animate={{
                  boxShadow: isHovered
                    ? [
                        "0 0 15px rgba(var(--primary-rgb),0.1)",
                        "0 0 30px rgba(var(--primary-rgb),0.3)",
                        "0 0 15px rgba(var(--primary-rgb),0.1)",
                      ]
                    : "none",
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex-1 h-14 bg-gradient-to-r from-primary to-primary-dark rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_15px_30px_-5px_rgba(var(--primary-rgb),0.4)] hover:-translate-y-1 active:scale-95 transition-all relative overflow-hidden group flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Book Now <Zap className="w-3 h-3 fill-white" />
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              </MotionLink>
            </div>
          </div>
        </motion.div>

        {/* Global Decor Lines */}
        <div className="mt-12 h-px w-[200px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}



