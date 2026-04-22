"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import Image from "next/image";
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
} from "lucide-react";
import Link from "next/link";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// ── Static Data ──────────────────────────────────────────────────────────────

const dateTimeOptions = [
  "July 8, 2025 | 7:00 PM – 9:00 PM",
  "July 10, 2025 | 5:00 PM – 7:00 PM",
  "July 12, 2025 | 8:00 PM – 10:00 PM",
  "July 15, 2025 | 6:00 PM – 8:00 PM",
];

const durationOptions = ["1 hour", "2 hours", "3 hours", "4 hours"];

const addOnOptions = [
  { id: "photoshoot", label: "Casual Photoshoot", price: 499 },
  { id: "playlist", label: "Personalized Playlist", price: 299 },
  { id: "travel", label: "Extra Travel Time", price: 199 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BookDetails() {
  const [selectedDateTime, setSelectedDateTime] = useState(dateTimeOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[1]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState(
    '"Please arrive 10 mins early. This is for a formal event."',
  );
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const selectedAddOnLabels = addOnOptions
    .filter((a) => selectedAddOns.includes(a.id))
    .map((a) => a.label);

  const [dateLabel, timeRange] = selectedDateTime.split(" | ");

  return (
    <section className={`bg-bg-base py-20 px-4 md:px-8 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Full-width centered header above both cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-6xl text-primary tracking-wide mb-3`}
          >
            Booking Details Form
          </h2>
          <p className="text-text-muted text-sm">
            Fill in your preferences to complete your booking.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* LEFT: FORM */}
          <div className="w-full lg:w-[56%]">
            {/* Card wrapper */}
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

                {/* Date & Time */}
                <div className="relative mb-4">
                  <button
                    onClick={() => {
                      setShowDateMenu((p) => !p);
                      setShowDurationMenu(false);
                    }}
                    className="w-full h-14 px-5 bg-bg-secondary/50 border border-border-main rounded-2xl text-text-main text-sm font-medium flex items-center justify-between hover:border-primary/30 transition-all group"
                  >
                    <span className="flex items-center gap-3">
                      <Clock size={15} className="text-primary shrink-0" />
                      <span className="text-text-muted text-xs font-bold uppercase tracking-widest mr-2">
                        Date & Time:
                      </span>
                      {selectedDateTime}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-primary transition-transform ${showDateMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showDateMenu && (
                    <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-bg-base/95 backdrop-blur-2xl border border-border-main rounded-2xl overflow-hidden shadow-2xl">
                      {dateTimeOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedDateTime(opt);
                            setShowDateMenu(false);
                          }}
                          className={`w-full px-5 py-3.5 text-left text-sm font-medium flex items-center justify-between hover:bg-primary/5 transition-colors ${
                            selectedDateTime === opt
                              ? "text-primary"
                              : "text-text-main"
                          }`}
                        >
                          {opt}
                          {selectedDateTime === opt && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDurationMenu((p) => !p);
                      setShowDateMenu(false);
                    }}
                    className="w-full h-14 px-5 bg-bg-secondary/50 border border-border-main rounded-2xl text-text-main text-sm font-medium flex items-center justify-between hover:border-primary/30 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Clock size={15} className="text-primary shrink-0" />
                      <span className="text-text-muted text-xs font-bold uppercase tracking-widest mr-2">
                        Duration:
                      </span>
                      {selectedDuration}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-primary transition-transform ${showDurationMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showDurationMenu && (
                    <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-bg-base/95 backdrop-blur-2xl border border-border-main rounded-2xl overflow-hidden shadow-2xl">
                      {durationOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSelectedDuration(opt);
                            setShowDurationMenu(false);
                          }}
                          className={`w-full px-5 py-3.5 text-left text-sm font-medium flex items-center justify-between hover:bg-primary/5 transition-colors ${
                            selectedDuration === opt
                              ? "text-primary"
                              : "text-text-main"
                          }`}
                        >
                          {opt}
                          {selectedDuration === opt && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Add-ons ── */}
              <div>
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
                        className={`w-full h-14 px-5 border rounded-2xl flex items-center gap-4 text-left transition-all group ${
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
              </div>

              {/* ── Notes ── */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={15} className="text-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Preferences / Notes{" "}
                    <span className="text-text-muted normal-case tracking-normal">
                      (Optional)
                    </span>
                  </span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special requests or instructions..."
                  className="w-full bg-bg-secondary/50 border border-border-main rounded-2xl p-5 text-text-main text-sm font-medium leading-relaxed placeholder:text-text-muted/40 focus:outline-none focus:border-primary/40 transition-all resize-none"
                />
              </div>

              {/* ── CTA ── */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-16 rounded-2xl bg-linear-to-r from-primary-dark to-accent text-white font-black tracking-[0.3em] uppercase text-xs shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Link
                  href="/booking-confirmation"
                  className="relative z-10 flex items-center gap-3"
                >
                  Send Booking Request{" "}
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
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
                    src="/images/girl1.webp"
                    alt="Aarushi Kumari"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div>
                  <h3
                    className={`${rochester.className} text-3xl text-text-main tracking-wide mb-1`}
                  >
                    Aarushi Kumari
                  </h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-text-muted text-xs font-medium">
                      Andheri, Mumbai
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
                          s <= 4
                            ? "text-amber-400 fill-amber-400"
                            : "text-amber-400/30 fill-none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-text-main text-xs font-black">4.9</span>
                  <span className="text-text-muted text-xs font-medium">
                    (128)
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="px-6 py-4 border-b border-border-main">
                <p className="text-text-muted text-xs leading-relaxed font-medium text-center">
                  Charming companion with a love for fine dining, art, and
                  meaningful conversations.
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
                      {selectedDuration}
                    </p>
                  </div>
                </div>

                {/* Add-ons */}
                <div>
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



