"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Flag, ChevronDown, CheckCircle2 } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const REPORT_REASONS = [
  "Inappropriate or Offensive Content",
  "Fake Profile or Spam",
  "Harassment or Abusive Behavior",
  "Underage User",
  "Other / Something else",
];

export default function Report() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  return (
    <section
      className={`py-12 md:py-24 px-4 bg-bg-secondary border-b border-border-main flex justify-center ${outfit.className}`}
    >
      <div className="max-w-[1000px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-card border border-border-main rounded-[40px] p-8 md:p-14 shadow-2xl shadow-black/5 relative"
        >
          {/* Subtle Red Warning Glow (isolated so it can be overflow-hidden without breaking dropdown) */}
          <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full" />
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start md:items-center">
            {/* Left: Content */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f43f5e] to-[#e11d48] flex items-center justify-center text-white shadow-md shadow-[#f43f5e]/20">
                  <Flag className="w-5 h-5" />
                </div>
                <h2
                  className={`${rochester.className} text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-rose-500 to-text-main`}
                >
                  Report Profile
                </h2>
              </div>
              <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-lg">
                We take our community guidelines seriously. Please let us know
                specifically what issue you are encountering with this partner.
              </p>
            </div>

            {/* Right: Interactive Form */}
            <div className="w-full md:w-[400px] flex flex-col gap-4 relative z-20">
              {/* Custom Select Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full cursor-pointer bg-bg-secondary border border-border-main hover:border-accent/30 text-left px-6 py-4 rounded-2xl text-text-main font-medium flex items-center justify-between transition-colors"
                >
                  <span
                    className={selectedReason ? "text-text-main font-bold" : "text-text-muted"}
                  >
                    {selectedReason || "Select the problem..."}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-text-main" : "text-text-muted"}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full mt-2 bg-bg-base border border-border-main rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden z-60 transform origin-top"
                    >
                      {REPORT_REASONS.map((reason, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedReason(reason);
                            setIsOpen(false);
                          }}
                          className="px-6 py-4 hover:bg-bg-secondary cursor-pointer text-text-main transition-colors border-b border-border-main last:border-0 flex items-center justify-between group"
                        >
                          {reason}
                          {selectedReason === reason && (
                            <CheckCircle2 className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <button
                disabled={!selectedReason}
                className={`w-full py-4 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                  selectedReason
                    ? "bg-gradient-to-r from-[#f43f5e] to-[#e11d48] hover:from-[#e11d48] hover:to-[#be123c] text-white border border-[#f43f5e]/20 hover:border-[#f43f5e]/40 shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
                    : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
                }`}
              >
                <Flag className="w-5 h-5" />
                Submit Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



