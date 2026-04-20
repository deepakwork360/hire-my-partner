"use client";

import React, { useState } from "react";
import { Rochester, Outfit } from "next/font/google";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Zap,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function BookyInfo() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Shimmer effect calculation
  const shimmerOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0.1, 0.3]);
  const shimmerRotate = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-15deg", "15deg"],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`pt-24 pb-0 bg-[#050505] relative overflow-hidden ${outfit.className}`}
    >
      {/* Cinematic Background Accents */}
      <div className="absolute top-0 right-[5%] w-[800px] h-[800px] bg-pink-600/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full flex flex-col items-center mb-10 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md mb-2">
              <Ticket className="w-4 h-4 text-pink-500" />
              <span className="text-pink-100 text-[10px] font-black uppercase tracking-[0.4em]">
                Active Session Info
              </span>
            </div>

            <h1
              className={`${rochester.className} text-6xl md:text-8xl text-white tracking-widest relative z-10`}
            >
              Booking information
              <div className="absolute -inset-1 blur-2xl opacity-20 bg-pink-500 pointer-events-none -z-10" />
            </h1>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="mb-16">
          <Link href="/my-booking">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-4 px-12 py-5 rounded-full font-black tracking-[0.3em] uppercase text-[10px] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/10 transition-all duration-500" />
              <div className="relative z-10 flex items-center gap-3 text-white">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                <span>Back to Booking</span>
              </div>
            </motion.button>
          </Link>
        </div>

        {/* PROFILE TICKET */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-[100px] border border-white/10 rounded-[50px] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row group min-h-[500px]"
        >
          {/* Shimmer Effect */}
          <motion.div
            style={{ opacity: shimmerOpacity, rotate: shimmerRotate }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[2000ms] ease-in-out pointer-events-none z-30"
          />

          {/* LEFT: Identity */}
          <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto overflow-hidden border-b md:border-b-0 md:border-r border-white/10 h-80 md:h-auto">
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20 z-10" />
            <Image
              src="/images/girl1.webp"
              alt="Aarushi Kumari"
              fill
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              priority
            />

            <div className="absolute bottom-10 left-10 z-20">
              <div className="flex flex-col gap-2">
                <motion.h3
                  className={`${rochester.className} text-5xl md:text-6xl text-white drop-shadow-2xl`}
                >
                  Aarushi Kumari
                </motion.h3>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full w-fit border border-white/5">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Age 24
                  </span>
                  <div className="w-1 h-1 bg-pink-500 rounded-full" />
                  <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-pink-500" /> Bengaluru
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between relative bg-black/20">
            <div className="relative">
              <div className="flex flex-col gap-2 mb-10 px-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-pink-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
                    Service Plan
                  </span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  Private Engagement
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-8 px-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Calendar className="w-3 h-3 text-pink-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Reservation
                    </span>
                  </div>
                  <div className="text-white font-black text-lg lg:text-xl uppercase">
                    APRIL 14, 2024
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <Clock className="w-3 h-3 text-pink-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Scheduled
                    </span>
                  </div>
                  <div className="text-white font-black text-lg lg:text-xl uppercase">
                    07:00 PM
                  </div>
                </div>
              </div>
            </div>

            {/* View Profile Action */}
            <div className="mt-12 flex items-center justify-center lg:justify-start px-2">
              <Link href="/partner-profile-detail">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
                >
                  <User className="w-4 h-4 text-pink-500" />
                  <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
                    View Partner Profile
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Decorative Divider */}
        <div className="mt-16 h-px w-[200px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
