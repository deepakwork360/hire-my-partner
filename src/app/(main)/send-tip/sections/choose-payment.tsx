"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Plus,
  Check,
  ChevronRight,
  Zap,
  Lock,
  User,
  Gift,
  MessageCircleHeart,
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { TipFormData } from "../page";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const savedMethods = [
  {
    id: "upi",
    type: "UPI",
    label: "Saved UPI",
    detail: "rahul****@okicici",
    icon: Smartphone,
    badge: "Primary",
  },
  {
    id: "card",
    type: "Card",
    label: "Saved Card",
    detail: "**** **** **** 4242",
    icon: CreditCard,
    badge: "Visa",
  },
];

export default function ChoosePayment({
  formData,
  onPaymentMethodChange,
  onReset,
}: {
  formData: TipFormData;
  onPaymentMethodChange: (method: string) => void;
  onReset: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [addingNew, setAddingNew] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedMethod(id);
    setAddingNew(false);
    onPaymentMethodChange(id);
  };

  const handleAddNew = () => {
    setAddingNew(true);
    setSelectedMethod("new");
    onPaymentMethodChange("new");
  };

  const canSubmit =
    (selectedMethod && selectedMethod !== "new") ||
    (addingNew && selectedMethod === "new");

  const handleSubmit = () => {
    if (!canSubmit) return;
    console.log("TIP SUBMITTED:", formData);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onReset();
  };

  const tipDisplay =
    formData.tipLabel ||
    (formData.customTipAmount ? `₹${formData.customTipAmount}` : "");

  return (
    <>
      {/* ── Success Modal ── */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[44px] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.8)] ${outfit.className}`}
            >
              {/* Decorative glows */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

              {/* Close button */}
              <button
                onClick={handleCloseSuccess}
                className="absolute top-7 right-7 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="p-8 md:p-12 flex flex-col items-center text-center gap-6">
                {/* Success icon */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Check size={36} className="text-emerald-400" strokeWidth={2.5} />
                  </div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-500/20"
                  />
                </div>

                {/* Title */}
                <h1
                  className={`${rochester.className} text-5xl md:text-6xl text-white tracking-wide leading-tight`}
                >
                  Tip Sent Successfully!
                </h1>

                {/* Dynamic summary */}
                <p className="text-slate-300 text-base leading-relaxed max-w-sm">
                  You tipped{" "}
                  <span className="text-emerald-400 font-black">{tipDisplay}</span>{" "}
                  to{" "}
                  <span className="text-pink-500 font-black">{formData.recipientName}</span>.
                </p>

                {/* Message (optional) */}
                {formData.message && (
                  <div className="w-full bg-white/[0.04] border border-white/10 rounded-3xl p-5 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircleHeart size={14} className="text-violet-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                        Your Message
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                      "{formData.message}"
                    </p>
                  </div>
                )}

                {/* Tip Card Details */}
                <div className="w-full bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 rounded-3xl overflow-hidden">
                  {/* Profile header */}
                  <div className="flex items-center gap-4 p-5 border-b border-white/5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src="/images/girl1.webp"
                        alt={formData.recipientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-black text-base">{formData.recipientName}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                          <MapPin size={11} className="text-pink-500" /> Bengaluru
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-black text-xl">{tipDisplay}</div>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Tip</p>
                    </div>
                  </div>

                  {/* Booking meta */}
                  <div className="grid grid-cols-2 divide-x divide-white/5">
                    <div className="flex items-center gap-3 p-4">
                      <Calendar size={14} className="text-pink-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Date</p>
                        <p className="text-white text-xs font-bold">{formData.bookingDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <Clock size={14} className="text-pink-500 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Time</p>
                        <p className="text-white text-xs font-bold">{formData.bookingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Done button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseSuccess}
                  className="w-full h-16 rounded-2xl bg-white text-black font-black tracking-[0.35em] uppercase text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
                >
                  <Sparkles size={16} /> Brilliant
                </motion.button>

                {/* Security note */}
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-slate-700" />
                  <p className="text-slate-700 text-xs font-medium">
                    Payment secured via 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Section ── */}
      <section className={`bg-[#050505] py-20 px-4 md:px-8 ${outfit.className}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-12 gap-4"
          >
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
              <Lock className="w-4 h-4 text-pink-500" />
              <span className="text-pink-100 text-[10px] font-black uppercase tracking-[0.4em]">
                Secure Checkout
              </span>
            </div>

            <h2
              className={`${rochester.className} text-5xl md:text-7xl text-white tracking-wide`}
            >
              Choose Payment Method
            </h2>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Your payment is secure and goes directly to your{" "}
              <span className="text-pink-500 font-bold">Booky</span>.
            </p>
          </motion.div>

          {/* Saved Payment Cards */}
          <div className="flex flex-col gap-4 mb-4">
            {savedMethods.map((method, i) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSelect(method.id)}
                  className={`
                    relative cursor-pointer rounded-[28px] border p-6 flex items-center gap-5
                    transition-all duration-300 group overflow-hidden
                    ${isSelected
                      ? "bg-pink-500/10 border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.1)] ring-2 ring-offset-2 ring-offset-[#050505] ring-pink-500"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-pink-500 shadow-lg shadow-pink-500/30"
                        : "bg-white/5 border border-white/10 group-hover:border-white/20"
                    }`}
                  >
                    <Icon size={22} className={isSelected ? "text-white" : "text-slate-400"} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-black text-base">{method.label}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/10 rounded-full text-slate-400">
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">{method.detail}</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {isSelected ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shrink-0"
                      >
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div key="chevron" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Add New Payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={handleAddNew}
            className={`
              relative cursor-pointer rounded-[28px] border-2 border-dashed p-6 flex items-center gap-5
              transition-all duration-300 group mb-12
              ${addingNew
                ? "border-pink-500/50 bg-pink-500/5"
                : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
              }
            `}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${addingNew ? "bg-pink-500" : "bg-white/5 border border-white/10"}`}>
              <Plus size={22} className={addingNew ? "text-white" : "text-slate-400"} />
            </div>
            <div className="flex-1">
              <span className="text-white font-black text-base">Add New Payment Method</span>
              <p className="text-slate-500 text-sm font-medium mt-0.5">UPI, Credit / Debit Card, Net Banking</p>
            </div>
            <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors shrink-0" />
          </motion.div>

          {/* Order Summary */}
          <AnimatePresence>
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mb-8 rounded-[32px] bg-white/[0.03] border border-white/10 overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col gap-4">
                  <h3 className="text-white font-black text-base uppercase tracking-widest mb-2">
                    Order Summary
                  </h3>

                  <div className="flex items-center gap-4 py-3 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                      <User size={15} className="text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recipient</p>
                      <p className="text-white font-bold text-sm">{formData.recipientName}</p>
                    </div>
                    <p className="text-slate-500 text-xs font-bold">{formData.bookingDate} · {formData.bookingTime}</p>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Gift size={15} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tip Amount</p>
                      <p className="text-white font-bold text-sm">{tipDisplay || "—"}</p>
                    </div>
                    <p className="text-emerald-400 font-black text-base">{tipDisplay || "₹0"}</p>
                  </div>

                  {formData.message && (
                    <div className="flex items-start gap-4 py-3 border-b border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageCircleHeart size={15} className="text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Message</p>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed italic">"{formData.message}"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-1">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <ShieldCheck size={15} className="text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Paying via</p>
                      <p className="text-white font-bold text-sm capitalize">
                        {selectedMethod === "upi"
                          ? "Saved UPI (rahul****@okicici)"
                          : selectedMethod === "card"
                          ? "Saved Card (**** 4242)"
                          : "New Payment Method"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Send Tip Button */}
          <motion.button
            whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              w-full h-20 rounded-[28px] font-black tracking-[0.35em] uppercase text-sm
              flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden
              ${canSubmit
                ? "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-[0_20px_60px_-10px_rgba(219,39,119,0.5)] cursor-pointer"
                : "bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed"
              }
            `}
          >
            {canSubmit && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <Zap size={18} className={canSubmit ? "fill-white" : ""} />
              Send Tip
              {tipDisplay ? ` · ${tipDisplay}` : ""}
            </span>
          </motion.button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock size={13} className="text-slate-600" />
            <p className="text-slate-600 text-xs font-medium">
              256-bit SSL encrypted · Safe & secure payment
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
