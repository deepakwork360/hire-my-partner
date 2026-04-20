"use client";

import Banner from "@/components/Banner/Banner";
import { motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function HeroSection() {
  return (
    <section className="relative overflow-visible pb-0 pt-0">
      <div className="relative z-10 w-full">
        <Banner
          title="Find Your Ideal Partner — Anytime, Anywhere"
          subtitle="Hire a companion on an hourly basis. Safe, verified, and easy to book."
          image="/assets/home-banner.webp"
          buttons={[
            { label: "Hire Now", link: "/browse-partners", variant: "primary" },
            {
              label: "Become a Partner",
              link: "/become-a-partner",
              variant: "outline",
            },
          ]}
        />
      </div>

      {/* Centered Circular Identity (Straddling Bottom Edge) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52"
        >
          {/* Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <defs>
                <path
                  id="centeredCirclePath"
                  d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                />
              </defs>
              <text className={`${outfit.className} uppercase font-bold tracking-[0.2em] text-[5.5px] fill-primary/30`}>
                <textPath href="#centeredCirclePath" startOffset="0%">
                  Connections • Conversations • Relationships • Companion •
                </textPath>
              </text>
            </svg>
          </motion.div>

          {/* Inner Logo & Glow */}
          <div className="absolute inset-[15%] rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center p-5 group shadow-[0_0_80px_rgba(var(--primary-rgb),0.15)]">
            {/* Pulsing Aura */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
            />
            
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/images/Logo.webp"
                alt="Logo"
                width={200}
                height={200}
                className="w-[85%] h-auto object-contain drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
              />
            </div>
          </div>

          {/* Orbital Orbs */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full blur-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full blur-xs" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
