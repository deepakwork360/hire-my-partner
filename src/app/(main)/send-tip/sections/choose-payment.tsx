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

  const isCustomTip = formData.tipLabel === "Custom Tip";
  const tipAmount = formData.selectedTipAmount || 0;
  const isTipAmountValid = isCustomTip 
    ? tipAmount >= 250 && tipAmount <= 100000 
    : tipAmount > 0;

  const canSubmit =
    ((selectedMethod && selectedMethod !== "new") ||
    (addingNew && selectedMethod === "new")) &&
    isTipAmountValid;

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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-xl bg-bg-base border border-border-main rounded-[44px] overflow-hidden shadow-2xl ${outfit.className}`}
            >
              {/* Decorative glows */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

              {/* Close button */}
               <button
                onClick={handleCloseSuccess}
                className="absolute top-7 right-7 z-10 w-10 h-10 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-main hover:bg-bg-card transition-colors shadow-lg"
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
                  className={`${rochester.className} text-5xl md:text-6xl text-text-main tracking-tight leading-tight mb-2`}
                >
                  Tip Sent Successfully!
                </h1>

                 {/* Dynamic summary */}
                <p className="text-text-muted text-base leading-relaxed max-w-sm font-medium">
                  You tipped{" "}
                  <span className="text-emerald-500 font-black">{tipDisplay}</span>{" "}
                  to <span className="text-primary font-black drop-shadow-sm">{formData.recipientName}</span>.
                </p>

                {/* Message (optional) */}
                 {formData.message && (
                  <div className="w-full bg-bg-secondary border border-border-main rounded-3xl p-5 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircleHeart size={14} className="text-violet-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">
                        Your Message
                      </span>
                    </div>
                    <p className="text-text-main text-sm font-medium leading-relaxed italic">
                      "{formData.message}"
                    </p>
                  </div>
                )}

                 {/* Tip Card Details */}
                <div className="w-full bg-bg-secondary border border-border-main rounded-3xl overflow-hidden shadow-sm">
                  {/* Profile header */}
                  <div className="flex items-center gap-4 p-5 border-b border-border-main">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-border-main shrink-0">
                      <Image
                        src="/images/girl1.webp"
                        alt={formData.recipientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                     <div className="flex-1 text-left">
                      <p className="text-text-main font-black text-base">{formData.recipientName}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-text-muted text-xs font-medium">
                          <MapPin size={11} className="text-primary" /> Bengaluru
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-black text-xl">{tipDisplay}</div>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Tip</p>
                    </div>
                  </div>
                  {/* Booking meta */}
                  <div className="grid grid-cols-2 divide-x divide-border-main">
                    <div className="flex items-center gap-3 p-4">
                      <Calendar size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Date</p>
                        <p className="text-text-main text-xs font-bold">{formData.bookingDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <Clock size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Time</p>
                        <p className="text-text-main text-xs font-bold">{formData.bookingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Done button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseSuccess}
                  className="w-full h-16 rounded-2xl bg-text-main text-bg-base font-black tracking-[0.35em] uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl"
                >
                  <Sparkles size={16} /> Brilliant
                </motion.button>

                {/* Security note */}
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-text-muted" />
                  <p className="text-text-muted text-xs font-medium">
                    Payment secured via 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Section ── */}
      <section className={`bg-bg-base py-20 px-4 md:px-8 ${outfit.className}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-12 gap-4"
          >
             <div className="flex items-center gap-3 bg-bg-secondary border border-border-main px-5 py-2 rounded-full backdrop-blur-md">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-primary/80 text-[10px] font-black uppercase tracking-[0.4em]">
                Secure Checkout
              </span>
            </div>

            <h2
              className={`${rochester.className} text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main tracking-wide py-4 px-4 leading-[1.2]`}
            >
              Choose Payment Method
            </h2>

            <p className="text-text-muted text-sm max-w-md leading-relaxed">
              Your payment is secure and goes directly to your{" "}
              <span className="text-primary font-bold">Booky</span>.
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
                      ? "bg-primary/10 border-primary/40 shadow-2xl shadow-primary/10 ring-2 ring-offset-2 ring-offset-bg-base ring-primary"
                      : "bg-bg-card border-border-main hover:border-primary/30 hover:bg-bg-secondary"
                    }
                  `}
                >
                   <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-primary shadow-lg shadow-primary/30"
                        : "bg-bg-secondary border border-border-main group-hover:border-primary/30"
                    }`}
                  >
                    <Icon size={22} className={isSelected ? "text-white" : "text-text-muted"} />
                  </div>

                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                      <span className="text-text-main font-black text-base">{method.label}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-bg-secondary border border-border-main rounded-full text-text-muted">
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm font-medium">{method.detail}</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {isSelected ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0"
                      >
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div key="chevron" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ChevronRight size={20} className="text-text-muted group-hover:text-white transition-colors" />
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
                ? "border-primary/50 bg-primary/5"
                : "border-border-main hover:border-primary/30 hover:bg-bg-secondary"
              }
            `}
          >
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${addingNew ? "bg-primary" : "bg-bg-secondary border border-border-main"}`}>
              <Plus size={22} className={addingNew ? "text-white" : "text-text-muted"} />
            </div>
            <div className="flex-1">
              <span className="text-text-main font-black text-base">Add New Payment Method</span>
              <p className="text-text-muted text-sm font-medium mt-0.5">UPI, Credit / Debit Card, Net Banking</p>
            </div>
            <ChevronRight size={20} className="text-text-muted group-hover:text-white transition-colors shrink-0" />
          </motion.div>

          {/* Order Summary */}
          <AnimatePresence>
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mb-8 rounded-[32px] bg-bg-card border border-border-main overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col gap-4">
                  <h3 className="text-text-main font-black text-base uppercase tracking-widest mb-2">
                    Order Summary
                  </h3>

                  <div className="flex items-center gap-4 py-3 border-b border-border-main">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <User size={15} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Recipient</p>
                      <p className="text-text-main font-bold text-sm">{formData.recipientName}</p>
                    </div>
                    <p className="text-text-muted text-xs font-bold">{formData.bookingDate} · {formData.bookingTime}</p>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-b border-border-main">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Gift size={15} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Tip Amount</p>
                      <p className="text-text-main font-bold text-sm">{tipDisplay || "—"}</p>
                    </div>
                    <p className="text-emerald-500 font-black text-base">{tipDisplay || "₹0"}</p>
                  </div>

                  {formData.message && (
                    <div className="flex items-start gap-4 py-3 border-b border-border-main">
                      <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageCircleHeart size={15} className="text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Message</p>
                        <p className="text-text-main text-sm font-medium leading-relaxed italic">"{formData.message}"</p>
                      </div>
                    </div>
                  )}

                   <div className="flex items-center gap-4 pt-1">
                    <div className="w-9 h-9 rounded-xl bg-bg-secondary border border-border-main flex items-center justify-center shrink-0">
                      <ShieldCheck size={15} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Paying via</p>
                      <p className="text-text-main font-bold text-sm capitalize">
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
              w-full h-14 rounded-2xl font-black tracking-[0.35em] uppercase text-[10px]
              flex items-center justify-center gap-3 transition-all duration-500 relative overflow-hidden
              ${canSubmit
                ? "bg-linear-to-r from-primary to-primary-dark text-white shadow-2xl shadow-primary/30 cursor-pointer"
                : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
              }
            `}
          >
            {canSubmit && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <Zap size={16} className={canSubmit ? "fill-white" : ""} />
              Send Tip
              {tipDisplay ? ` · ${tipDisplay}` : ""}
            </span>
          </motion.button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock size={13} className="text-text-muted" />
            <p className="text-text-muted text-xs font-medium">
              256-bit SSL encrypted · Safe & secure payment
            </p>
          </div>
        </div>
      </section>
    </>
  );
}



