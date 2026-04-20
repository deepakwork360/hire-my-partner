"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, MessageSquare, CreditCard, CheckCircle2, Gift as GiftIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Rochester } from "next/font/google";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === "confirm" ? onClose : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-3xl"
          />

          {/* Modal Card */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
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
                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mb-10">
                      <div className="flex items-center gap-3 text-pink-500 mb-2">
                        <User size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Confirmation Required</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        Send gift to <span className="text-pink-500">{recipientName}</span>
                      </h2>
                    </div>

                    <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center gap-6">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                        <Image src={selectedGift.image} alt={selectedGift.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{selectedGift.title}</h3>
                        <div className="inline-flex items-center px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-500 font-bold text-sm">
                          {selectedGift.price}
                        </div>
                      </div>
                    </div>

                    <div className="mb-12">
                      <label className="flex items-center gap-3 text-slate-400 mb-4 px-2">
                        <MessageSquare size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add a personal message</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Hope this makes your day special..."
                        className="w-full h-32 p-6 bg-black/40 border border-white/10 rounded-3xl text-white placeholder-slate-600 focus:outline-hidden focus:border-pink-500/50 transition-all resize-none font-medium leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={onClose} 
                        className="flex-1 h-16 rounded-2xl bg-white/5 text-white font-bold tracking-widest uppercase text-xs hover:bg-white/10 transition-colors border border-white/5"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSend} 
                        className="flex-[2] h-16 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-700 text-white font-black tracking-[0.3em] uppercase text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-3 group"
                      >
                        Confirm & Pay <CreditCard size={18} className="transition-transform group-hover:translate-x-1" />
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
                        className="absolute inset-0 rounded-full border-4 border-pink-500/20 border-t-pink-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="text-pink-500 animate-pulse" size={32} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Processing Payment</h3>
                    <p className="text-slate-400 font-medium">Please do not refresh the page...</p>
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

                    <h2 className={`${rochester.className} text-5xl md:text-6xl text-white text-center mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                      Gift Sent Successfully!
                    </h2>

                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 w-full mb-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full" />
                      
                      <p className="text-slate-300 text-center leading-relaxed font-medium mb-8 text-lg">
                        Your gift <span className="text-white font-black italic">"{selectedGift.title}"</span> has been scheduled for delivery to <span className="text-pink-500 font-black">{recipientName}</span>. 
                        They will receive it on <span className="text-white font-black">April 14, 2024</span>, before their booking time.
                      </p>

                      {/* Summary Connection View */}
                      <div className="flex items-center justify-center gap-4 md:gap-12 relative">
                        {/* Recipient Circle */}
                        <div className="relative group">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-pink-500/30 overflow-hidden relative z-10 shadow-2xl">
                            <Image src="/images/girl1.webp" alt={recipientName} fill className="object-cover" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-20 shadow-lg border-2 border-[#0a0a0a]">
                            <User size={14} className="text-white font-bold" />
                          </div>
                        </div>

                        {/* Animated Connection Line */}
                        <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-pink-500/50 to-green-500/50 relative hidden sm:block">
                           <motion.div 
                            animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white blur-[2px] rounded-full"
                           />
                        </div>
                        <ArrowRight className="text-white/20 sm:hidden" size={24} />

                        {/* Gift Circle */}
                        <div className="relative group">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-green-500/30 overflow-hidden relative z-10 shadow-2xl bg-white/5">
                            <Image src={selectedGift.image} alt={selectedGift.title} fill className="object-cover" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center z-20 shadow-lg border-2 border-[#0a0a0a]">
                            <GiftIcon size={14} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full h-16 rounded-2xl bg-white text-black font-black tracking-[0.4em] uppercase text-xs hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                    >
                      Brilliant
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
