"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, MessageSquare, CreditCard, CheckCircle2, Gift as GiftIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Rochester, Outfit } from "next/font/google";
import { partners } from "@/modules/partner/data/partners";

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
  partnerId: string | number;
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
  partnerId,
  selectedGift,
}: GiftModalProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ModalStatus>("confirm");
  const [giftType, setGiftType] = useState<"virtual" | "physical">("virtual");
  const [partner, setPartner] = useState<any>(null);

  const handleClose = () => {
    onClose();
    if (status === "success") {
      router.push("/my-booking");
    }
  };

  // Reset status when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStatus("confirm");
        setMessage("");
        setGiftType("virtual");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && partnerId) {
      const target = String(partnerId).toLowerCase();
      let found = null;
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("approved_partners");
          if (saved) {
            const localList: any[] = JSON.parse(saved);
            found = localList.find((p) => 
              String(p.id).toLowerCase() === target ||
              p.name.toLowerCase() === target
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (!found) {
        found = partners.find((p: any) => 
          String(p.id).toLowerCase() === target ||
          p.name.toLowerCase() === target
        );
      }
      setPartner(found);
    }
  }, [isOpen, partnerId]);

  const getRegisteredAddress = () => {
    if (!partner) return "Loading registered address...";
    const parts = [];
    if (partner.location) parts.push(partner.location);
    if (partner.pincode) parts.push(partner.pincode);
    if (partner.country) parts.push(partner.country);
    return parts.join(", ");
  };

  if (!selectedGift) return null;

  const handleSend = async () => {
    setStatus("processing");
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save to localStorage if virtual
    if (typeof window !== "undefined") {
      try {
        const rawPriceStr = selectedGift.price.replace(/[^0-9]/g, "");
        const priceNum = parseInt(rawPriceStr, 10) || 0;

        const transaction = {
          id: `TXN-${Date.now()}`,
          type: "gift",
          sender: "You",
          amount: priceNum,
          date: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          rawDate: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          giftTitle: selectedGift.title,
          giftImage: selectedGift.image,
          message: message,
          isVirtual: giftType === "virtual",
          partnerId: partnerId,
          shippingAddress: giftType === "physical" ? getRegisteredAddress() : null,
        };

        if (giftType === "virtual") {
          const existing = localStorage.getItem("hire_my_partner_partner_earnings");
          const earningsList = existing ? JSON.parse(existing) : [];
          localStorage.setItem(
            "hire_my_partner_partner_earnings",
            JSON.stringify([transaction, ...earningsList])
          );
        }
      } catch (e) {
        console.error("Failed to save transaction", e);
      }
    }

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
            className="relative w-full max-w-2xl bg-bg-base border border-border-main rounded-[44px] shadow-2xl overflow-hidden my-auto"
          >
            <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto custom-scrollbar">
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
                        className="w-12 h-12 cursor-pointer rounded-full bg-bg-secondary flex items-center justify-center text-text-main hover:bg-bg-card transition-colors border border-border-main shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mb-10">
                      <h2 className={`text-4xl md:text-5xl text-text-main tracking-tight leading-tight ${rochester.className}`}>
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

                    {/* Gift Delivery Method Selection */}
                    <div className="mb-8">
                      <label className="flex items-center gap-3 text-text-muted mb-4 px-2">
                        <GiftIcon size={16} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select Delivery Mode</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setGiftType("virtual")}
                          className={`cursor-pointer rounded-3xl p-5 border text-left flex flex-col gap-1.5 transition-all ${
                            giftType === "virtual"
                              ? "bg-primary/10 border-primary shadow-[0_4px_20px_rgba(236,72,153,0.15)]"
                              : "bg-bg-secondary border-border-main hover:bg-bg-card"
                          }`}
                        >
                          <span className="text-text-main font-bold text-sm">Virtual Gift</span>
                          <span className="text-[11px] text-text-muted leading-relaxed">
                            Sent virtually. The gift's value is added directly to the partner's account earnings.
                          </span>
                        </div>
                        <div
                          onClick={() => setGiftType("physical")}
                          className={`cursor-pointer rounded-3xl p-5 border text-left flex flex-col gap-1.5 transition-all ${
                            giftType === "physical"
                              ? "bg-primary/10 border-primary shadow-[0_4px_20px_rgba(236,72,153,0.15)]"
                              : "bg-bg-secondary border-border-main hover:bg-bg-card"
                          }`}
                        >
                          <span className="text-text-main font-bold text-sm">Physical Gift</span>
                          <span className="text-[11px] text-text-muted leading-relaxed">
                            A real item will be shipped directly to the partner's address.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Address Fields */}
                    {giftType === "physical" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-8"
                      >
                        <label className="flex items-center gap-3 text-text-muted mb-4 px-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shipping Destination</span>
                        </label>
                        <div className="bg-bg-secondary border border-border-main rounded-3xl p-6 text-left">
                          <p className="text-[10px] text-text-muted mb-2 font-bold uppercase tracking-wider">
                            Partner's Registered Address
                          </p>
                          <div className="p-4 bg-bg-card border border-border-main rounded-2xl text-text-main font-semibold text-xs md:text-sm">
                            {getRegisteredAddress()}
                          </div>
                          <p className="text-[10px] text-text-muted mt-3 leading-relaxed">
                            Note: The physical item will be automatically dispatched to this registered address on file.
                          </p>
                        </div>
                      </motion.div>
                    )}

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
                        className="flex-[1.2] cursor-pointer h-14 rounded-2xl bg-bg-secondary text-text-main font-bold tracking-widest uppercase text-[9px] hover:bg-border-main/5 transition-all border border-border-main shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSend}
                        className="flex-2 cursor-pointer h-14 rounded-2xl bg-linear-to-r from-primary to-primary-dark text-white font-black tracking-[0.2em] uppercase text-[9px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                      
                      <p className="text-text-muted text-center leading-relaxed font-medium mb-8 text-sm md:text-base">
                        {giftType === "virtual" ? (
                          <>
                            Your virtual gift <span className="text-text-main font-black italic">"{selectedGift.title}"</span> was sent to <span className="text-primary font-black">{recipientName}</span>. The cash value of <span className="text-emerald-500 font-bold">{selectedGift.price}</span> has been credited to their account.
                          </>
                        ) : (
                          <>
                            Your physical gift <span className="text-text-main font-black italic">"{selectedGift.title}"</span> has been scheduled for shipping to <span className="text-primary font-black">{recipientName}</span>'s registered address: <span className="text-text-main font-bold">{getRegisteredAddress()}</span>.
                          </>
                        )}
                      </p>

                      {/* Summary Connection View */}
                      <div className="flex items-center justify-center gap-4 md:gap-12 relative">
                        {/* Recipient Circle */}
                        <div className="relative group">
                           <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/30 overflow-hidden relative z-10 shadow-2xl">
                             <Image src={partner?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256"} alt={recipientName} fill className="object-cover object-top" />
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
                      onClick={handleClose}
                      className="w-full h-16 cursor-pointer rounded-2xl bg-text-main text-bg-base font-black tracking-[0.4em] uppercase text-xs hover:opacity-90 transition-all shadow-xl active:scale-95"
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
