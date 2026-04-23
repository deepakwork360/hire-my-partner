"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, MessageSquare, CreditCard, CheckCircle2, Gift as GiftIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Rochester, Outfit } from "next/font/google";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  selectedGift: {
    image: string;
    title: string;
    price: string;
  } | null;
}

type ModalStatus = "confirm" | "processing" | "success";

export default function GiftModal({
  isOpen,
  onClose,
  recipientName,
  selectedGift,
}: GiftModalProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ModalStatus>("confirm");

  // Reset status when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus("confirm");
        setMessage("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!selectedGift) return null;

  const handleSend = async () => {
    setStatus("processing");
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 overflow-y-auto overflow-x-hidden ${outfit.className}`}>
          {/* Backdrop Refinement - Less Glassy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === "confirm" ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Card - Solid Surface */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-bg-base border border-border-main rounded-[44px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {status === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Header / Close */}
                    <div className="absolute top-8 right-8 z-10">
                      <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center text-text-main hover:bg-bg-card transition-colors border border-border-main shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mb-10">
                      <div className="flex items-center gap-3 text-primary mb-3">
                        <User size={18} className="drop-shadow-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Confirmation Required</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight leading-tight">
                        Send gift to <span className="text-primary drop-shadow-sm">{recipientName}</span>
                      </h2>
                    </div>

                    <div className="mb-10 p-6 bg-bg-secondary border border-border-main rounded-[32px] flex items-center gap-6 shadow-sm">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-border-main shrink-0 shadow-lg">
                        <Image src={selectedGift.image} alt={selectedGift.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-text-main mb-1">{selectedGift.title}</h3>
                        <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-bold text-sm">
                          {selectedGift.price}
                        </div>
                      </div>
                    </div>

                    <div className="mb-12">
                      <label className="flex items-center gap-3 text-text-muted mb-4 px-2">
                        <MessageSquare size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add a personal message</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Hope this makes your day special..."
                        className="w-full h-32 p-6 bg-bg-secondary border border-border-main rounded-3xl text-text-main placeholder-text-muted/40 focus:outline-hidden focus:border-primary/50 transition-all resize-none font-medium leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center gap-3 w-full">
                      <button 
                        onClick={onClose} 
                        className="flex-[1.2] h-14 rounded-2xl bg-bg-secondary text-text-main font-bold tracking-widest uppercase text-[9px] hover:bg-border-main/5 transition-all border border-border-main shadow-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSend} 
                        className="flex-2 h-14 rounded-2xl bg-linear-to-r from-primary to-primary-dark text-white font-black tracking-[0.2em] uppercase text-[9px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Confirm & Pay <CreditCard size={16} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {status === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="relative w-32 h-32 mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="text-primary animate-pulse" size={32} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-text-main mb-2 uppercase tracking-widest">Processing Payment</h3>
                    <p className="text-text-muted font-medium">Please do not refresh the page...</p>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center py-4"
                  >
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 relative">
                      <CheckCircle2 size={48} className="text-green-500" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-green-500/20"
                      />
                    </div>

                    <h2 className={`${rochester.className} text-5xl md:text-6xl text-text-main text-center mb-6`}>
                      Gift Sent Successfully!
                    </h2>

                    <div className="bg-bg-secondary border border-border-main rounded-[32px] p-8 w-full mb-10 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                      
                      <p className="text-text-muted text-center leading-relaxed font-medium mb-8 text-lg">
                        Your gift <span className="text-text-main font-black italic">"{selectedGift.title}"</span> has been scheduled for delivery to <span className="text-primary font-black">{recipientName}</span>. 
                        They will receive it on <span className="text-text-main font-black">April 14, 2024</span>, before their booking time.
                      </p>

                      {/* Summary Connection View */}
                      <div className="flex items-center justify-center gap-4 md:gap-12 relative">
                        {/* Recipient Circle */}
                        <div className="relative group">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 overflow-hidden relative z-10 shadow-2xl">
                             <Image src="/images/girl1.webp" alt={recipientName} fill className="object-cover" />
                           </div>
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-20 shadow-lg border-2 border-bg-base">
                             <User size={14} className="text-white font-bold" />
                           </div>
                        </div>

                        {/* Animated Connection Line */}
                        <div className="flex-1 max-w-[100px] h-px bg-linear-to-r from-primary/50 to-green-500/50 relative hidden sm:block">
                           <motion.div 
                            animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white blur-[2px] rounded-full"
                           />
                        </div>
                        <ArrowRight className="text-black/20 sm:hidden" size={24} />

                        {/* Gift Circle */}
                        <div className="relative group">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-green-500/30 overflow-hidden relative z-10 shadow-2xl bg-bg-secondary">
                             <Image src={selectedGift.image} alt={selectedGift.title} fill className="object-cover" />
                           </div>
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-20 shadow-lg border-2 border-bg-base">
                             <GiftIcon size={14} className="text-white" />
                           </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full h-16 rounded-2xl bg-text-main text-bg-base font-black tracking-[0.4em] uppercase text-xs hover:opacity-90 transition-all shadow-xl active:scale-95"
                    >
                      Brilliant
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
