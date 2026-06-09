"use client";

import Banner from "@/components/Banner/Banner";
import { motion } from "framer-motion";
import Image from "next/image";
import { Outfit } from "next/font/google";
import ThemeLogo from "@/components/ui/ThemeLogo";

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
              style: {
                background: "linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--primary-rgb), 0.05) 100%)",
                border: "1px solid rgba(var(--primary-rgb), 0.3)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }
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
          className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center"
        >
          {/* Outer Rotating Ring */}
          <div
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "8s", animationTimingFunction: "linear" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full fill-primary/80 font-bold uppercase tracking-[0.3em] text-[12px]">
              <path
                id="centeredCirclePath"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill="none"
              />
              <text>
                <textPath href="#centeredCirclePath" spacing="auto" className={outfit.className}>
                  GO PARTNER • GO PARTNER •  
                </textPath>
              </text>
            </svg>
          </div>

          {/* Central Logo Container */}
          <motion.div
            animate={{ 
              scale: [0.95, 1.05, 0.95],
              boxShadow: [
                "0 0 20px rgba(var(--primary-rgb), 0.2)",
                "0 0 40px rgba(var(--primary-rgb), 0.4)",
                "0 0 20px rgba(var(--primary-rgb), 0.2)"
              ]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-28 h-28 md:w-36 md:h-36 bg-bg-secondary/40 backdrop-blur-2xl rounded-full border border-border-main p-5 flex items-center justify-center overflow-hidden"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <ThemeLogo
                width={80}
                height={68}
                imgClassName="object-contain p-2 w-auto h-full"
                priority
                style={{ width: "auto", height: "100%" }}
              />
            </div>
            {/* Subtle Inner Glow - Theme Aware */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/5 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



