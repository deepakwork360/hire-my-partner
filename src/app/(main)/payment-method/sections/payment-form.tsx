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
    <section className={`bg-bg-base py-16 px-4 md:px-8 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main tracking-wide mb-3`}
          >
            Payment Method
          </h2>
          <p className="text-text-muted text-sm">
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
            className="w-full lg:w-[58%] bg-bg-card border border-border-main rounded-[32px] p-6 md:p-8 flex flex-col gap-8 shadow-xl shadow-black/5"
          >
            {/* Choose Payment Method */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={14} className="text-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
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
                          ? "bg-primary/10 border-primary/40 ring-1 ring-primary/30"
                          : "bg-bg-secondary border-border-main hover:border-primary/20"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-primary"
                            : "bg-bg-secondary border border-border-main"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={
                            isSelected ? "text-white" : "text-text-muted"
                          }
                        />
                      </div>
                      <span
                        className={`text-sm font-medium flex-1 transition-colors ${isSelected ? "text-primary font-bold" : "text-text-main"}`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-primary shrink-0"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 mt-4">
                <Lock size={11} className="text-text-muted" />
                <p className="text-text-muted text-[11px] font-medium italic">
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
                    <CreditCard size={13} className="text-primary" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                      Card Details
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main placeholder-text-muted text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main placeholder-text-muted text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={7}
                      className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main placeholder-text-muted text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      maxLength={3}
                      className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main placeholder-text-muted text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
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
                    <Smartphone size={13} className="text-primary" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                      UPI ID
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main placeholder-text-muted text-sm font-medium focus:outline-none focus:border-primary/50 transition-all"
                  />
                  {upiId && !upiId.includes("@") && (
                    <p className="text-accent text-xs font-bold flex items-center gap-2">
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
                  className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4"
                >
                  <CircleAlert
                    size={16}
                    className="text-amber-600 mt-0.5 shrink-0"
                  />
                  <p className="text-amber-700 text-xs font-medium leading-relaxed">
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
                  className="flex items-center gap-3 bg-bg-secondary border border-border-main rounded-2xl p-4"
                >
                  <Apple size={20} className="text-text-main shrink-0" />
                  <p className="text-text-muted text-xs font-medium leading-relaxed">
                    You'll be redirected to Apple Pay / Google Pay to complete
                    your payment securely.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms & Agreement */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={14} className="text-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
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
                      ? "bg-primary border-primary"
                      : "border-border-main bg-bg-secondary group-hover:border-primary/40"
                  }`}
                >
                  {agreedToTerms && (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="text-text-muted text-sm font-medium leading-snug group-hover:text-text-main transition-colors">
                  I agree to the{" "}
                  <span className="text-primary underline underline-offset-2">
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
                  ? "bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-500/20"
                  : canSubmit
                    ? "bg-gradient-to-br from-primary via-primary-dark to-primary text-white shadow-2xl shadow-primary/30 cursor-pointer hover:shadow-primary/50 hover:brightness-110"
                    : "bg-bg-secondary/80 border-2 border-border-main text-text-muted cursor-not-allowed shadow-inner"
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
            <div className="bg-bg-card border border-border-main rounded-[32px] overflow-hidden shadow-2xl shadow-black/5">
              {/* Header */}
              <div className="px-6 pt-8 pb-5 border-b border-border-main text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles size={14} className="text-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Summary
                  </span>
                </div>
                <h3
                  className={`${rochester.className} text-2xl text-text-main tracking-wide`}
                >
                  Your Booking Charges
                </h3>
              </div>

              {/* Breakdown */}
              <div className="px-6 py-5 flex flex-col gap-3">
                {/* Base Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm font-medium">
                    Base Rate{" "}
                    <span className="text-text-muted text-xs">
                      ×{bookingCharges.hours} hrs
                    </span>
                  </span>
                  <span className="text-text-main font-bold text-sm">
                    ₹{baseTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-text-muted text-xs -mt-1">
                  ₹{bookingCharges.baseRate} × {bookingCharges.hours} hours
                </p>

                {/* Add-ons */}
                <div className="pt-2 border-t border-border-main">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles size={11} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Add-Ons
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {bookingCharges.addOns.map((a) => (
                      <div
                        key={a.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-text-muted text-xs font-medium">
                          {a.label}
                        </span>
                        <span className="text-text-main text-xs font-bold">
                          ₹{a.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Fee */}
                <div className="flex items-center justify-between pt-2 border-t border-border-main">
                  <span className="text-text-muted text-sm font-medium">
                    Service Fee
                  </span>
                  <span className="text-text-main font-bold text-sm">
                    ₹{bookingCharges.serviceFee}
                  </span>
                </div>

                {/* Taxes */}
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm font-medium">
                    Taxes
                  </span>
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
                    Included
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="mx-4 mb-4 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-4 flex items-center justify-between">
                <span className="text-text-main text-sm font-black uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-primary text-xl font-black">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* SSL note */}
              <div className="flex items-center justify-center gap-2 pb-5">
                <ShieldCheck size={13} className="text-text-muted opacity-50" />
                <p className="text-text-muted text-[11px] font-medium opacity-50">
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



