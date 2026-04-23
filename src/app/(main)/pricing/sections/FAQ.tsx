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
      className={`py-12 md:py-16 px-4 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      {/* Decorative background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title Section */}
        <div className="text-center mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main mb-4`}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-primary-dark mx-auto rounded-full shadow-lg shadow-primary/20" />
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
                  ? "bg-bg-card border-primary/30 shadow-2xl shadow-black/5"
                  : "bg-bg-secondary border-border-main hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  openIndex === index ? "text-primary" : "text-text-main"
                }`}>
                  {faq.question}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  openIndex === index 
                    ? "bg-primary border-primary rotate-180" 
                    : "bg-bg-secondary border-border-main group-hover:bg-bg-card"
                }`}>
                  {openIndex === index ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-muted" />
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
                      <div className="h-px w-full bg-border-main mb-6" />
                      <p className="text-text-muted text-base md:text-lg leading-relaxed font-light">
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
          className="text-center mt-12 text-text-muted text-sm font-medium"
        >
          Have more questions? <span className="text-primary cursor-pointer hover:underline">Contact our support team</span>
        </motion.p>
      </div>
    </section>
  );
}



