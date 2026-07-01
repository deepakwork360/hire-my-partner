"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { MessageCircleHeart } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function AddMessage({
  message,
  onChange,
}: {
  message: string;
  onChange: (msg: string) => void;
}) {
  const MAX = 300;

  return (
    <section
      className={`bg-bg-base py-6 px-4 md:px-8 ${outfit.className}`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-5 gap-1.5"
        >
          <h2
            className={`${rochester.className} text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-wide px-4 leading-[1.2]`}
          >
            Add a <span className="text-primary">Message</span>
          </h2>

          <p className="text-text-muted text-sm max-w-md leading-relaxed">
            Include a personal note with your tip to make it even more special.
          </p>
        </motion.div>

        {/* Textarea Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative rounded-[24px] bg-bg-card border border-border-main overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative p-4 md:p-5">
            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX) onChange(e.target.value);
              }}
              placeholder="e.g. Thank you so much — you made the evening truly unforgettable! 🌸"
              rows={3}
              className="w-full borderless-textarea bg-transparent border-none border-0 focus:ring-0 text-text-main placeholder-text-muted/40 text-sm md:text-base font-medium leading-relaxed resize-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            />

            {/* Bottom bar */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-main">
              {/* Character count */}
              <span
                className={`text-[10px] font-bold tabular-nums transition-colors ${
                  message.length > MAX * 0.85
                    ? "text-primary"
                    : "text-text-muted"
                }`}
              >
                {message.length} / {MAX}
              </span>

              {/* Animated progress bar */}
              <div className="flex-1 mx-4 h-1 bg-bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-primary to-primary-dark rounded-full"
                  animate={{ width: `${(message.length / MAX) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Clear button */}
              {message.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onChange("")}
                  className="text-[10px] cursor-pointer font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors border-none bg-transparent"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



