"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Home, Compass, ArrowLeft } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";

const rochester = Rochester({
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function NotFound() {
  return (
    <div className={`h-screen w-full bg-bg-base flex flex-col items-center justify-center p-6 relative overflow-hidden ${outfit.className}`}>
      
      {/* Background Glows (Matching Platform Style) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        
        {/* The 404 Section (Keeping the liked animation & font) */}
        <div className="relative mb-12">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "-0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.1em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[25vw] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-b from-text-main/20 to-text-main/5 leading-none select-none"
          >
            404
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`${rochester.className} absolute bottom-0 right-0 md:-right-8 text-4xl md:text-6xl text-primary drop-shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)]`}
          >
            Page not found
          </motion.div>
        </div>

        {/* Minimalist Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-black text-text-main mb-4 uppercase italic tracking-tight">
            Lost in the Spotlight?
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-sm mx-auto font-medium leading-relaxed">
            The profile or page you are looking for is currently unavailable. 
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Standard Premium Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <PremiumButton
            label="Back to Home"
            href="/"
            variant="primary"
            size="lg"
            icon={<Home className="w-5 h-5" />}
            className="w-full sm:w-60"
          />
          <Link 
            href="/browse-partners"
            className="w-full sm:w-60 h-14 rounded-2xl bg-bg-secondary/60 backdrop-blur-md border border-border-main text-text-main font-bold flex items-center justify-center gap-2 hover:bg-bg-card transition-all active:scale-95 group shadow-lg"
          >
            <Compass className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
            Browse Partners
          </Link>
        </motion.div>

        {/* Branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-20 text-[10px] text-text-muted font-black uppercase tracking-[0.4em]"
        >
          Hire My Partner &copy; 2026
        </motion.p>
      </div>

      {/* Decorative Grid Pattern (Matching Home aesthetic) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
    </div>
  );
}
