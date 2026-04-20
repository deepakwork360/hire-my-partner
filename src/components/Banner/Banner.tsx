"use client";

import React from "react";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import PremiumButton from "../ui/PremiumButton";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

interface BannerProps {
  title: string;
  subtitle: string;
  image: string;
  buttons: {
    label: string;
    link: string;
    variant: "primary" | "outline";
  }[];
}

export default function Banner({
  title,
  subtitle,
  image,
  buttons,
}: BannerProps) {
  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Banner Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${rochester.className} text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight`}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${outfit.className} text-slate-300 text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl font-light leading-relaxed`}
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            {buttons.map((btn, idx) => (
              <PremiumButton
                key={idx}
                label={btn.label}
                href={btn.link}
                variant={btn.variant}
                size="lg"
                className="w-full sm:w-auto"
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
