"use client";

import { useState } from "react";
import { Rochester, Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import Link from "next/link";

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
      question: "Is this real dating?",
      answer:
        "No, this is not a dating app. It is a platform that connects people for platonic companionship. Whether you're looking for a plus-one for an event, a dinner date, a movie buddy, or just someone to hang out with, we help you find the perfect match.",
    },
    {
      question: "Is it Safe?",
      answer:
        "Yes, it is safe. We have a strict verification process for all our partners. We also have a rating system that allows you to rate your experience with your partner. This helps us maintain the quality of our platform.",
    },
    {
      question: "Can I choose based on age or location?",
      answer:
        "Yes! You can filter partners based on age, location, and other preferences. This helps you find the perfect match for your needs.",
    },
    {
      question: "What are the charges?",
      answer:
        "The charges vary depending on the partner and the duration of the booking. You can view the charges on the partner's profile.",
    },
    {
      question: "Can I contact a companion before booking?",
      answer:
        "Yes, you can! Once you book a companion, you can contact them through the app to coordinate your meeting.",
    },
    {
      question: "Can I rebook the same companion?",
      answer:
        "Yes, you can! If you had a great experience with a companion, you can book them again for future events.",
    },
    {
      question: "What if someone doesn’t show up or behaves badly?",
      answer:
        "We have a zero-tolerance policy for such behavior. If a companion doesn't show up or behaves inappropriately, please contact our support team immediately. We will take appropriate action and ensure your safety.",
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
            className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2] mb-6`}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-accent mx-auto rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
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
                  ? "bg-bg-card border-primary/30 shadow-lg"
                  : "bg-bg-secondary border-border-main hover:border-border-main"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span
                  className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                    openIndex === index
                      ? "text-primary-dark"
                      : "text-text-main group-hover:text-primary"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    openIndex === index
                      ? "bg-gradient-to-br from-primary to-primary-dark border-primary-dark rotate-180"
                      : "bg-bg-secondary border-border-main group-hover:bg-bg-card"
                  }`}
                >
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

        {/* Bottom CTA hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-12 text-text-muted text-sm font-medium"
        >
          Still have questions?{" "}
          <Link
            href="/contact"
            className="text-primary cursor-pointer hover:underline"
          >
            Chat with our experts
          </Link>
        </motion.p>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-linear-to-bl from-primary/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}



