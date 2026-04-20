"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Apple,
  ShieldCheck,
  Lock,
  ChevronRight,
  Check,
  Sparkles,
  FileText,
  CircleAlert,
} from "lucide-react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// ── Static Data ──────────────────────────────────────────────────────────────

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI / Wallet", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
  { id: "apple", label: "Apple / Google Pay", icon: Apple },
];

const bookingCharges = {
  baseRate: 499,
  hours: 2,
  addOns: [
    { label: "Casual Photoshoot", price: 99 },
    { label: "Personalized Playlist", price: 99 },
  ],
  serviceFee: 49,
};

const baseTotal = bookingCharges.baseRate * bookingCharges.hours;
const addOnTotal = bookingCharges.addOns.reduce((s, a) => s + a.price, 0);
const grandTotal = baseTotal + addOnTotal + bookingCharges.serviceFee;

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentForm() {
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Card-specific state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI-specific state
  const [upiId, setUpiId] = useState("");

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2
      ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
      : digits;
  };

  const canSubmit =
    agreedToTerms &&
    selectedPayment &&
    (selectedPayment === "card"
      ? cardNumber.replace(/\s/g, "").length === 16 &&
        cardName &&
        expiry &&
        cvv.length === 3
      : selectedPayment === "upi"
        ? upiId.includes("@")
        : true);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <section className={`bg-[#050505] py-16 px-4 md:px-8 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-6xl text-pink-600 tracking-wide mb-3`}
          >
            Payment Method
          </h2>
          <p className="text-slate-500 text-sm">
            Confirm your booking with a secure payment below.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* ─── LEFT: FORM ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[58%] bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-8 flex flex-col gap-8"
          >
            {/* Choose Payment Method */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={14} className="text-pink-500" />
                <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Choose Payment Method
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedPayment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPayment(opt.id)}
                      className={`h-14 px-4 border rounded-2xl flex items-center gap-3 text-left transition-all group ${
                        isSelected
                          ? "bg-pink-500/10 border-pink-500/40 ring-1 ring-pink-500/30"
                          : "bg-black/20 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-pink-500"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={
                            isSelected ? "text-white" : "text-slate-400"
                          }
                        />
                      </div>
                      <span
                        className={`text-sm font-medium flex-1 transition-colors ${isSelected ? "text-white" : "text-slate-400"}`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-pink-500 shrink-0"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 mt-4">
                <Lock size={11} className="text-slate-600" />
                <p className="text-slate-600 text-[11px] font-medium italic">
                  "Your payment is secure and encrypted."
                </p>
              </div>
            </div>

            {/* Dynamic Fields */}
            <AnimatePresence mode="wait">
              {selectedPayment === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={13} className="text-pink-500" />
                    <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                      Card Details
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-700 text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-700 text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={7}
                      className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-700 text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      maxLength={3}
                      className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-700 text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {selectedPayment === "upi" && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone size={13} className="text-pink-500" />
                    <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                      UPI ID
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-700 text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                  {upiId && !upiId.includes("@") && (
                    <p className="text-rose-400 text-xs font-bold flex items-center gap-2">
                      <CircleAlert size={13} /> Enter a valid UPI ID (e.g.
                      name@okicici)
                    </p>
                  )}
                </motion.div>
              )}

              {selectedPayment === "cod" && (
                <motion.div
                  key="cod"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4"
                >
                  <CircleAlert
                    size={16}
                    className="text-amber-500 mt-0.5 shrink-0"
                  />
                  <p className="text-amber-400/80 text-xs font-medium leading-relaxed">
                    Pay in cash at the time of your booking. Please carry exact
                    change. Cash on Delivery is subject to service provider
                    approval.
                  </p>
                </motion.div>
              )}

              {selectedPayment === "apple" && (
                <motion.div
                  key="apple"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <Apple size={20} className="text-slate-300 shrink-0" />
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    You'll be redirected to Apple Pay / Google Pay to complete
                    your payment securely.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms & Agreement */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-pink-500" />
                <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Terms &amp; Agreement
                </span>
              </div>
              <button
                onClick={() => setAgreedToTerms((p) => !p)}
                className="flex items-start gap-3 group w-full text-left"
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    agreedToTerms
                      ? "bg-pink-500 border-pink-500"
                      : "border-white/20 bg-black/30 group-hover:border-white/40"
                  }`}
                >
                  {agreedToTerms && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-slate-400 text-sm font-medium leading-snug group-hover:text-slate-300 transition-colors">
                  I agree to the{" "}
                  <span className="text-pink-500 underline underline-offset-2">
                    Terms and Booking Policy
                  </span>
                </span>
              </button>
            </div>

            {/* Confirm & Pay Button */}
            <motion.button
              whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={!canSubmit || submitted}
              className={`w-full h-16 rounded-2xl font-black tracking-[0.3em] uppercase text-xs flex items-center justify-center gap-3 relative overflow-hidden transition-all duration-500 ${
                submitted
                  ? "bg-emerald-600 text-white cursor-default"
                  : canSubmit
                    ? "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-[0_20px_40px_-10px_rgba(219,39,119,0.5)] cursor-pointer"
                    : "bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed"
              }`}
            >
              {canSubmit && !submitted && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
              <span className="relative z-10 flex items-center gap-3">
                {submitted ? (
                  <>
                    <Check size={18} strokeWidth={3} /> Payment Confirmed!
                  </>
                ) : (
                  <>
                    <ChevronRight size={16} /> Confirm &amp; Pay ₹
                    {grandTotal.toLocaleString("en-IN")}
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>

          {/* ─── RIGHT: BOOKING CHARGES ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-full lg:w-[38%] max-w-sm"
          >
            <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              {/* Header */}
              <div className="px-6 pt-8 pb-5 border-b border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles size={14} className="text-pink-500" />
                  <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    Summary
                  </span>
                </div>
                <h3
                  className={`${rochester.className} text-2xl text-white tracking-wide`}
                >
                  Your Booking Charges
                </h3>
              </div>

              {/* Breakdown */}
              <div className="px-6 py-5 flex flex-col gap-3">
                {/* Base Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm font-medium">
                    Base Rate{" "}
                    <span className="text-slate-600 text-xs">
                      ×{bookingCharges.hours} hrs
                    </span>
                  </span>
                  <span className="text-white font-bold text-sm">
                    ₹{baseTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-slate-600 text-xs -mt-1">
                  ₹{bookingCharges.baseRate} × {bookingCharges.hours} hours
                </p>

                {/* Add-ons */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles size={11} className="text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Add-Ons
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {bookingCharges.addOns.map((a) => (
                      <div
                        key={a.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-slate-400 text-xs font-medium">
                          {a.label}
                        </span>
                        <span className="text-slate-300 text-xs font-bold">
                          ₹{a.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Fee */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-slate-400 text-sm font-medium">
                    Service Fee
                  </span>
                  <span className="text-white font-bold text-sm">
                    ₹{bookingCharges.serviceFee}
                  </span>
                </div>

                {/* Taxes */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm font-medium">
                    Taxes
                  </span>
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
                    Included
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mx-4 mb-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 px-5 py-4 flex items-center justify-between">
                <span className="text-white text-sm font-black uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-pink-400 text-xl font-black">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* SSL note */}
              <div className="flex items-center justify-center gap-2 pb-5">
                <ShieldCheck size={13} className="text-slate-700" />
                <p className="text-slate-700 text-[11px] font-medium">
                  Secured by 256-bit SSL
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
