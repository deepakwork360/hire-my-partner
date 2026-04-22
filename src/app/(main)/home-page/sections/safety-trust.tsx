"use client";

import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Headphones, BadgeCheck } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function SafetyTrust() {
  const pillars = [
    {
      title: "Background Checks",
      description:
        "All partners go through a strict verification process, including identity checks and background screening, to ensure your experience is both safe and authentic.",
      icon: <Search className="w-8 h-8 text-text-main" />,
    },
    {
      title: "Privacy Guaranteed",
      description:
        "Your personal data stays private. We use industry-standard encryption to protect your information and never share your details without consent.",
      icon: <ShieldCheck className="w-8 h-8 text-text-main" />,
    },
    {
      title: "24/7 Support",
      description:
        "Questions or concerns? Our dedicated support team is available around the clock to help you with anything you need — anytime, anywhere.",
      icon: <Headphones className="w-8 h-8 text-text-main" />,
    },
    {
      title: "Verified Partners Badge",
      description:
        "Look for the badge! Profiles with our “Verified Partner” badge have passed all checks and meet our highest trust and quality standards.",
      icon: <BadgeCheck className="w-8 h-8 text-text-main" />,
    },
  ];

  return (
    <section
      id="safety-and-trust"
      className="py-12 px-4 md:py-16 bg-bg-secondary overflow-hidden border-b border-border-main"
    >
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Header section */}
        <div className="text-center mb-10 space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2] mb-6`}
          >
            Safety & Trust You Can Rely On
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`${outfit.className} text-text-muted max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed font-light`}
          >
            Your safety and peace of mind are our top priorities. That’s why
            we’ve built a secure, transparent, and respectful platform from the
            ground up.
          </motion.p>
        </div>

        {/* Pillars section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon Container with Layered Square Look */}
              <div className="relative mb-8 w-20 h-20">
                {/* Background Layer (Pink) */}
                <div className="absolute inset-0 bg-linear-to-tr from-primary to-accent rounded-2xl transform translate-x-3 translate-y-3 opacity-100 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
                <div className="absolute inset-0 bg-bg-base rounded-2xl border border-border-main flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1">
                  {pillar.icon}
                </div>
              </div>

              <h3
                className={`${outfit.className} text-xl md:text-2xl font-bold text-text-main mb-4 transition-colors duration-300 group-hover:text-primary`}
              >
                {pillar.title}
              </h3>
              <p
                className={`${outfit.className} text-text-muted text-sm md:text-[15px] leading-relaxed font-light max-w-[280px]`}
              >
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



