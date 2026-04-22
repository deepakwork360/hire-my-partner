"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Outfit, Rochester } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

interface ContactSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseMs?: number;
}

export default function ContactSuccess({
  isOpen,
  onClose,
  autoCloseMs = 5000,
}: ContactSuccessProps) {
  // Auto-close functionality
  useEffect(() => {
    if (isOpen && autoCloseMs > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseMs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 ${outfit.className}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-bg-secondary border border-border-main rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all border border-border-main z-10"
            >
              <X size={18} />
            </button>

            <div className="p-10 flex flex-col items-center text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-8 relative">
                <CheckCircle2 size={40} className="text-pink-500" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-pink-500/20"
                />
              </div>

              {/* Title */}
              <h2 className={`${rochester.className} text-5xl text-text-main mb-4`}>
                Message <span className="text-pink-500">Received!</span>
              </h2>

              {/* Subtitle */}
              <p className="text-text-muted text-base font-medium leading-relaxed mb-10">
                Thank you for reaching out to Meet Me. Your request has been logged, and our team will get back to you within 24 hours.
              </p>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full h-14 rounded-2xl bg-text-main text-bg-base font-black tracking-[0.3em] uppercase text-xs hover:opacity-90 transition-all active:scale-95 shadow-lg"
              >
                Brilliant
              </button>
            </div>

            {/* Progress bar for auto-close */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 origin-left"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}



