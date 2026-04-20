"use client";

import { useState } from "react";
import { Rochester, Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      question: "Can i cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time through your dashboard. Your premium benefits will remain active until the end of your current billing cycle, and you won't be charged again.",
    },
    {
      question: "Is support included?",
      answer: "Absolutely! All Pro and Business plans include dedicated support. Business members enjoy 24/7 priority access to our specialist team for immediate assistance with any custom requests.",
    },
    {
      question: "What if I don’t use my bookings?",
      answer: "Bookings included in the Pro plan must be used within the billing month as they do not roll over. However, our Business plan offers unlimited bookings, so you never have to worry about usage limits.",
    },
  ];

  return (
    <section
      className={`py-12 md:py-16 px-4 bg-[#050505] relative overflow-hidden ${outfit.className}`}
    >
      {/* Decorative background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-5xl md:text-7xl text-white font-bold mb-4`}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="w-24 h-1 bg-linear-to-r from-pink-500 to-rose-500 mx-auto rounded-full shadow-[0_0_15px_rgba(219,39,119,0.5)]" />
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${
                openIndex === index
                  ? "bg-white/5 border-pink-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  : "bg-white/2 border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  openIndex === index ? "text-pink-400" : "text-slate-300 group-hover:text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  openIndex === index 
                    ? "bg-pink-500 border-pink-400 rotate-180" 
                    : "bg-white/5 border-white/10 group-hover:bg-white/10"
                }`}>
                  {openIndex === index ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 pt-0">
                      <div className="h-px w-full bg-white/5 mb-6" />
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint (optional, but adds premium feel) */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12 text-slate-500 text-sm font-medium"
        >
          Have more questions? <span className="text-pink-500 cursor-pointer hover:underline">Contact our support team</span>
        </motion.p>
      </div>
    </section>
  );
}
