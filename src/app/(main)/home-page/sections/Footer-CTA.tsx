"use client";

import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";
import PremiumButton from "@/components/ui/PremiumButton";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function FooterCTA() {
  return (
    <section className="bg-bg-base py-12 px-4 md:py-16 overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-center md:text-left text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2] mb-6`}
          >
            Ready To Hire Or Be Hired?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`${outfit.className} text-text-muted text-lg mb-8 max-w-md leading-relaxed`}
          >
            Whether you're looking for the perfect companion or ready to offer
            your time — the future of connection starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 mt-4"
          >
            {/* Primary Button: Get Started */}
            <PremiumButton 
              label="Get Started" 
              href="/browse-partners" 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto text-center"
            />

            {/* Secondary Button: Become a partner */}
            <PremiumButton 
              label="Become a partner" 
              href="/become-a-partner" 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto text-center"
            />
          </motion.div>
        </div>

        {/* Right Side: Collage & Countdown */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-12">
          <div className="relative w-full flex justify-center md:justify-end gap-4">
            {/* Main Portrait Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-40 md:w-56 h-auto aspect-3/4 rounded-[32px] overflow-hidden shadow-2xl z-10"
            >
              <Image
                src="/images/img4.webp"
                alt="kavya"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Horizontal Secondary Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative w-48 md:w-64 h-auto aspect-video rounded-[32px] overflow-hidden self-end mb-8 shadow-2xl"
            >
              <Image
                src="/images/kavya.png"
                alt="Connection"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Circular Text Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-12 left-1/4 w-48 h-48 pointer-events-none hidden md:block"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-primary/40 font-medium tracking-widest text-[7px] uppercase"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text fill="currentColor">
                  <textPath href="#circlePath">
                    Where connections, conversations, and relationships begin •
                  </textPath>
                </text>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



