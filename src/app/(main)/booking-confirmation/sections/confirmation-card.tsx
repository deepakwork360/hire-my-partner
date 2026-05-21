"use client";

import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { partners } from "@/modules/partner/data/partners";
import {
  Check,
  Calendar,
  Clock,
  IndianRupee,
  Mail,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  MapPin,
  Star,
  Download,
  Share2,
} from "lucide-react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ConfirmationCard() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partner") || "1";
  const dateParam = searchParams.get("date") || "July 8, 2025 | 7:00 PM – 9:00 PM";
  const durationParam = searchParams.get("duration") || "2 hours";
  const addonsParam = searchParams.get("addons") || "";
  const amountParam = searchParams.get("amount") || "1245";

  // Find partner from database
  const partner = partners.find(
    (p) => String(p.id).toLowerCase() === partnerId.toLowerCase()
  ) || partners[0];

  // Derive companion email
  const companionEmail = partner.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "@email.com";

  // Parse date and time start/end
  const [dateLabel, timeRange] = dateParam.split(" | ");
  let timeStart = "7:00 PM";
  let timeEnd = "9:00 PM";
  if (timeRange) {
    const parts = timeRange.split(/ [–-] /);
    if (parts.length === 2) {
      timeStart = parts[0];
      timeEnd = parts[1];
    } else {
      const partsAlt = timeRange.split("–");
      if (partsAlt.length === 2) {
        timeStart = partsAlt[0].trim();
        timeEnd = partsAlt[1].trim();
      }
    }
  }

  // Parse addons
  const addonsList = addonsParam ? addonsParam.split(",").filter(Boolean) : [];

  // Parse amount
  const parsedAmount = parseInt(amountParam, 10) || 0;

  // Generate dynamic Booking ID deterministically to prevent hydration mismatch
  const hash = (partner.name.length + dateParam.length + amountParam.length) % 10000;
  const bookingId = `BK-2026-${partner.id.padStart(2, "0")}${String(hash).padStart(4, "0")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const existing = localStorage.getItem("hire_my_partner_bookings");
      const bookingsList = existing ? JSON.parse(existing) : [];

      const alreadyExists = bookingsList.some((b: any) => b.id === bookingId);
      if (!alreadyExists) {
        const newBooking = {
          id: bookingId,
          image: partner.image,
          name: partner.name,
          age: partner.age,
          location: partner.location.split(",")[0].trim(),
          rating: partner.rating,
          date: dateLabel || "July 8, 2025",
          time: `${timeStart} - ${timeEnd}`,
          price: `₹${parsedAmount.toLocaleString("en-IN")}`,
          status: "Pending",
          bio: partner.bio.substring(0, 100) + "...",
        };
        
        localStorage.setItem(
          "hire_my_partner_bookings",
          JSON.stringify([newBooking, ...bookingsList])
        );
      }
    } catch (e) {
      console.error("Failed to persist booking in local storage", e);
    }
  }, [bookingId, partner, dateLabel, timeStart, timeEnd, parsedAmount]);

  return (
    <section className={`bg-bg-base py-16 px-4 md:px-8 ${outfit.className}`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          {/* ── Success Icon ── */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Clock size={44} className="text-primary" strokeWidth={2.5} />
            </div>
            {/* Pulse ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/15"
            />
          </motion.div>

          {/* ── Title ── */}
          <motion.div variants={itemVariants} className="text-center">
            <h1
              className={`${rochester.className} text-5xl md:text-6xl text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-wide mb-3`}
            >
              Request Received!
            </h1>
            <p className="text-text-muted text-sm md:text-base max-w-sm mx-auto leading-relaxed">
              Your booking request has been received and is currently waiting for
              approval.
            </p>
          </motion.div>

          {/* ── Booking ID badge ── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 bg-bg-card border border-border-main rounded-full px-5 py-2">
              <BookOpen size={12} className="text-primary" />
              <span className="text-text-muted text-xs font-bold tracking-widest uppercase">
                Booking&nbsp;ID:&nbsp;
              </span>
              <span className="text-text-main text-xs font-black tracking-widest">
                {bookingId}
              </span>
            </div>
          </motion.div>

          {/* ── Booking Summary Card ── */}
          <motion.div
            variants={itemVariants}
            className="w-full bg-linear-to-br from-bg-card to-bg-card/40 backdrop-blur-3xl border border-border-main rounded-[36px] overflow-hidden shadow-2xl"
          >
            {/* Card header */}
            <div className="px-6 pt-6 pb-5 border-b border-border-main text-center">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.35em]">
                Booking Summary
              </span>
            </div>

            {/* Companion profile */}
            <div className="flex flex-col items-center text-center px-6 pt-6 pb-5 border-b border-border-main gap-4">
              <div className="relative w-24 h-32 rounded-2xl overflow-hidden ring-2 ring-primary/30 shadow-[0_8px_24px_rgba(var(--primary-rgb),0.2)]">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div>
                <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                  Your Companion
                </p>
                <h3
                  className={`${rochester.className} text-3xl text-text-main tracking-wide mb-1.5`}
                >
                  {partner.name}
                </h3>
                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-10 bg-primary/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="h-px w-10 bg-primary/40" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <MapPin size={11} className="text-primary" />
                  <span className="text-text-muted text-xs font-medium">
                    {partner.location}
                  </span>
                </div>
                {/* Rating */}
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={
                        s <= Math.round(parseFloat(partner.rating))
                          ? "text-amber-400 fill-amber-400"
                          : "text-amber-400/30"
                      }
                    />
                  ))}
                  <span className="text-text-main text-xs font-black ml-1">
                    {partner.rating}
                  </span>
                  <span className="text-text-muted text-xs">
                    ({partner.reviews.length})
                  </span>
                </div>
              </div>
            </div>

            {/* Booking details row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-main">
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar size={13} className="text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">
                    Date
                  </p>
                  <p className="text-text-main text-xs font-bold">{dateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Clock size={13} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">
                    Time
                  </p>
                  <p className="text-text-main text-xs font-bold">
                    {timeStart} – {timeEnd}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <IndianRupee size={13} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">
                    Amount Payable
                  </p>
                  <p className="text-amber-400 text-xs font-black">
                    ₹{parsedAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {addonsList.length > 0 && (
              <div className="px-6 py-4 border-t border-border-main flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted mr-1">
                  Add-ons:
                </span>
                {addonsList.map((a) => (
                  <span
                    key={a}
                    className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}

            {/* Email receipt note */}
            <div className="mx-4 mb-4 mt-1 bg-bg-card border border-border-main rounded-2xl px-5 py-4 flex items-start gap-3">
              <Mail size={14} className="text-text-muted mt-0.5 shrink-0" />
              <p className="text-text-muted text-xs font-medium leading-relaxed">
                Confirmation of your request has been emailed to{" "}
                <span className="text-text-main font-bold">
                  {companionEmail}
                </span>
              </p>
            </div>

            {/* Need to coordinate */}
            <div className="px-6 pb-7 text-center">
              <p className="text-text-main font-black text-sm mb-1">
                Need to Coordinate?
              </p>
              <p className="text-text-muted text-xs font-medium mb-4">
                Have any last-minute details or questions?
              </p>
              <a
                href={`mailto:${companionEmail}?subject=Coordinating Booking ${bookingId}`}
                className="inline-flex items-center gap-2 text-primary text-sm font-black hover:text-primary/80 transition-colors group"
              >
                <MessageCircle
                  size={15}
                  className="group-hover:scale-110 transition-transform"
                />
                Message {partner.name.split(" ")[0]}
                <span className="text-primary/50 text-xs">→</span>
              </a>
            </div>
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col sm:flex-row gap-3"
          >
            <Link href="/" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 rounded-2xl bg-linear-to-r from-primary-dark to-accent text-white font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 shadow-[0_16px_40px_-10px_rgba(var(--primary-rgb),0.5)] cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ArrowLeft size={15} className="relative z-10" />
                <span className="relative z-10">Back to Home</span>
              </motion.div>
            </Link>
            <Link href="/my-booking" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 rounded-2xl bg-bg-secondary/80 border-2 border-border-main text-text-main font-black tracking-[0.25em] uppercase text-xs flex items-center justify-center gap-2 shadow-inner hover:bg-bg-card hover:border-primary/30 transition-all cursor-pointer"
              >
                <BookOpen size={15} />
                View My Bookings
              </motion.div>
            </Link>
          </motion.div>

          {/* ── Secondary Actions ── */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6"
          >
            <button className="flex items-center gap-2 text-text-muted hover:text-text-muted transition-colors text-xs font-bold uppercase tracking-wider group">
              <Download
                size={13}
                className="group-hover:scale-110 transition-transform"
              />
              Download Receipt
            </button>
            <div className="w-px h-4 bg-border-main" />
            <button className="flex items-center gap-2 text-text-muted hover:text-text-muted transition-colors text-xs font-bold uppercase tracking-wider group">
              <Share2
                size={13}
                className="group-hover:scale-110 transition-transform"
              />
              Share Booking
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



