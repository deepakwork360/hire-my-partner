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

interface ImpBannerProps {
  title: string;
  subtitle: string;
  image: string;
  primaryButton?: {
    label: string;
    link: string;
  };
  secondaryButton?: {
    label: string;
    link: string;
  };
}

export default function ImpBanner({
  title,
  subtitle,
  image,
  primaryButton,
  secondaryButton,
}: ImpBannerProps) {
  return (
    <div className="imp-banner-wrapper">
      {/* Background Image Container */}
      <div className="imp-banner-bg">
        <Image
          src={image}
          alt="Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="imp-banner-overlay" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-12 relative z-20">
        <div className="imp-banner-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`${rochester.className}`}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`${outfit.className}`}
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="imp-banner-button"
          >
            {primaryButton && (
              <PremiumButton
                label={primaryButton.label}
                href={primaryButton.link}
                variant="primary"
                size="lg"
              />
            )}
            {secondaryButton && (
              <PremiumButton
                label={secondaryButton.label}
                href={secondaryButton.link}
                variant="outline"
                size="lg"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Dynamic Accents */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-accent/5 pointer-events-none" />
    </div>
  );
}
