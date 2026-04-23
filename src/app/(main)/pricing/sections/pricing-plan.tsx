"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import {
  Check,
  X,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plans = [
  {
    name: "Basic",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description:
      "Perfect for getting started and exploring our premium community.",
    icon: <Shield className="w-6 h-6 text-text-muted" />,
    features: [
      { text: "Limited Booking", included: true },
      { text: "No Support", included: false },
      { text: "No Custom Requests", included: false },
      { text: "No Dashboard Access", included: false },
      { text: "No Visibility Boost", included: false },
    ],
    buttonText: "Get Started",
    popular: false,
    color: "slate",
  },
  {
    name: "Pro",
    price: {
      monthly: 499,
      yearly: 399,
    },
    description:
      "The most popular choice for regular users seeking flexibility.",
    icon: <Zap className="w-6 h-6 text-primary" />,
    features: [
      { text: "10 Bookings Monthly", included: true },
      { text: "Priority Email Support", included: true },
      { text: "Custom Requests", included: true },
      { text: "No Dashboard Access", included: false },
      { text: "Visibility Boost", included: true },
    ],
    buttonText: "Choose Pro",
    trialText: "Includes Free Trial",
    popular: true,
    color: "primary",
  },
  {
    name: "Business",
    price: {
      monthly: 999,
      yearly: 799,
    },
    description: "Maximum power and unlimited access for professional needs.",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    features: [
      { text: "Unlimited Bookings", included: true },
      { text: "Premium 24/7 Support", included: true },
      { text: "All Custom Requests", included: true },
      { text: "Full Dashboard Access", included: true },
      { text: "Max Visibility Boost", included: true },
    ],
    buttonText: "Go Business",
    popular: false,
    color: "amber",
  },
];

export default function PricingPlan() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <section
      className={`py-12 md:py-16 px-4 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main mb-4`}
          >
            Pricing Plans
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-primary-dark mx-auto rounded-full shadow-lg shadow-primary/20" />
        </motion.div>

        {/* Billing Toggle */}
         <div className="flex justify-center mb-16">
          <div className="bg-bg-secondary backdrop-blur-md p-1.5 rounded-2xl border border-border-main flex relative shadow-xl shadow-black/5">
              <motion.div
                animate={{ x: billingCycle === "monthly" ? 0 : "100%" }}
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-primary rounded-xl shadow-lg shadow-primary/20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 ${
                billingCycle === "monthly"
                  ? "text-white"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "text-white"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Yearly
              <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${billingCycle === 'yearly' ? 'bg-white/20 text-white border-white/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col relative h-full group ${
                plan.popular ? "lg:-translate-y-8 lg:z-20" : "lg:z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                  <div className="bg-linear-to-r from-primary to-primary-dark text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_4px_20px_rgba(var(--primary-rgb),0.4)] flex items-center gap-2">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`flex-1 rounded-[40px] p-8 md:p-10 transition-all duration-500 flex flex-col h-full bg-bg-card border ${
                  plan.popular
                    ? "border-primary/30 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border-main hover:border-primary/20 shadow-xl shadow-black/5"
                } relative overflow-hidden group-hover:scale-[1.02]`}
              >
                {/* Visual Accent */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${
                    plan.color === "primary"
                      ? "from-primary/10"
                      : plan.color === "amber"
                        ? "from-amber-500/10"
                        : "from-text-main/5"
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl ${
                        plan.color === "primary"
                          ? "bg-primary/10"
                          : plan.color === "amber"
                            ? "bg-amber-500/10"
                            : "bg-bg-secondary"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-widest opacity-50">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-bold text-text-main">
                      ₹
                      {billingCycle === "monthly"
                        ? plan.price.monthly
                        : plan.price.yearly}
                    </span>
                    <span className="text-text-muted font-medium">/Month</span>
                  </div>
                  <p className="mt-4 text-text-muted text-sm leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check
                          className={`w-5 h-5 shrink-0 ${
                            plan.color === "primary"
                              ? "text-primary"
                              : plan.color === "amber"
                                ? "text-amber-500"
                                : "text-text-muted"
                          }`}
                        />
                      ) : (
                        <X className="w-5 h-5 text-text-muted opacity-40 shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          feature.included ? "text-text-main" : "text-text-muted"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    className={`w-full py-5 rounded-[24px] font-black text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden ${
                      plan.popular
                        ? "bg-linear-to-br from-primary via-primary-dark to-primary text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1"
                        : "bg-bg-secondary/80 text-text-main border-2 border-border-main shadow-inner hover:bg-bg-card hover:border-primary/30"
                    }`}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  {plan.trialText && (
                    <button className="w-full py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[3px] text-primary/70 hover:text-primary transition-colors">
                      {plan.trialText}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



