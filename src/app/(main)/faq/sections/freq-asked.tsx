"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";
import { Plus, Minus, HelpCircle } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const faqData = [
  {
    question: "What is this platform for?",
    answer:
      "Our platform connects elite individuals with professional partners for high-end experiences, social companionship, and professional networking. We prioritize safety, discretion, and premium service quality.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is a seamless process. Click on the 'Join Elite' button, fill in your verification details, and once our team approves your profile, you'll have full access to our community of partners.",
  },
  {
    question: "How do I book a partner?",
    answer:
      "Simply browse through our curated list of partners, view their detailed profiles and experiences, and click the 'Book Now' button. You can then select your preferred time slot and complete the reservation through our secure payment gateway.",
  },
  {
    question: "Is this real dating?",
    answer:
      "No, this is not a dating platform. It is a platform for finding professional partners for high-end experiences, social companionship, and professional networking.",
  },
  {
    question: "Is it safe?",
    answer:
      "Yes, safety is our top priority. We have a rigorous verification process for all our partners, and we use secure payment gateways to protect your information. We also have a 24/7 support team to assist you with any issues.",
  },
  {
    question: "Can I choose based on age or location?",
    answer:
      "Yes, you can choose based on age or location. Our platform has a wide range of partners to choose from, and you can filter them based on your preferences.",
  },
  {
    question: "What are the charges?",
    answer:
      "The charges vary depending on the partner and the experience you choose. You can view the charges on the partner's profile.",
  },
  {
    question: "Can I contact a companion before booking?",
    answer:
      "Yes, you can contact a companion before booking. Our platform has a messaging feature that allows you to communicate with the partner before booking.",
  },
  {
    question: "Can I rebook the same companion?",
    answer:
      "Yes, you can rebook the same companion. Our platform has a feature that allows you to rebook the same companion.",
  },
  {
    question: "What if someone doesn’t show up or behaves badly?",
    answer:
      "If a companion doesn’t show up or behaves inappropriately, please contact our support team immediately. We have a zero-tolerance policy for such behavior and will take appropriate action.",
  },
];

export default function FreqAsked() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className={`py-12 md:py-16 px-4 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      {/* Decorative background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Visual Guide Badge */}
        <div className="flex justify-center mb-12">
          <div className="px-4 py-1.5 rounded-full bg-bg-secondary border border-border-main flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              Quick Support
            </span>
          </div>
        </div>

        {/* FAQ Accordion List */}
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
                  ? "bg-bg-card border-primary/30 shadow-xl shadow-black/5"
                  : "bg-bg-secondary border-border-main hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-8 flex items-center justify-between gap-6 text-left group"
              >
                <span
                  className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                    openIndex === index
                      ? "text-text-main"
                      : "text-text-muted group-hover:text-text-main"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    openIndex === index
                      ? "bg-primary border-primary/50 text-white rotate-180 shadow-lg shadow-primary/20"
                      : "bg-bg-card border-border-main text-text-muted group-hover:border-primary/30"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <div className="px-8 pb-8">
                      <div className="h-px w-12 bg-primary/50 mb-6 rounded-full" />
                      <p className="text-text-muted text-lg font-light leading-relaxed max-w-2xl">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Hook */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-text-muted text-sm italic font-light">
            Don't see your question?{" "}
            <a
              href="/contact"
              className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 decoration-primary/30"
            >
              Connect with our support team
            </a>{" "}
            directly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}



