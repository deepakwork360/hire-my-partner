"use client";

import { motion } from "framer-motion";

export default function PageHeaderAccent() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-[5]">
      {/* The "Snake" Animated Gradient */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          x: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          y: { duration: 1, ease: "easeOut" },
          opacity: { duration: 1 },
          x: { 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          scale: { 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-linear-to-b from-primary/60 via-primary/20 to-transparent blur-[120px] rounded-full"
      />

      {/* Secondary Accent for more depth */}
      <motion.div
        animate={{ 
          x: [-20, 20, -20],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-10 left-[10%] w-[40%] h-[150px] bg-primary-dark/20 blur-[80px] rounded-full"
      />

      <motion.div
        animate={{ 
          x: [20, -20, 20],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-10 right-[10%] w-[40%] h-[150px] bg-accent/20 blur-[80px] rounded-full"
      />
    </div>
  );
}
