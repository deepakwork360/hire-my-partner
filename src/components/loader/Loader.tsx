"use client";

import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import ThemeLogo from "@/components/ui/ThemeLogo";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-bg-base overflow-hidden">
      {/* Background Ambient Glows - Theme Aware */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Insignia Ring */}
        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center">
          {/* CSS Animation is highly performant, bypasses JS hydration delay, and updates instantly */}
          <div
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "6s", animationTimingFunction: "linear" }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full fill-primary/80 font-bold uppercase tracking-[0.3em] text-[12px]">
              <path
                id="loaderPath"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill="none"
              />
              <text>
                <textPath href="#loaderPath" spacing="auto" className={outfit.className}>
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
        </div>

        {/* Loading Text */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <span className={`${outfit.className} text-text-muted text-[10px] uppercase tracking-[0.5em]`}>
            Initializing Experience
          </span>
          <div className="w-32 h-px bg-border-main relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-primary/50 to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
