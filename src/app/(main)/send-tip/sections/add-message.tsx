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
      className={`bg-bg-base py-16 px-4 md:px-8 ${outfit.className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-10 gap-4"
        >
          <div className="flex items-center gap-3 bg-bg-secondary border border-border-main px-5 py-2 rounded-full backdrop-blur-md">
            <MessageCircleHeart className="w-4 h-4 text-primary" />
            <span className="text-primary/80 text-[10px] font-black uppercase tracking-[0.4em]">
              Optional
            </span>
          </div>

          <h2
            className={`${rochester.className} text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main tracking-wide py-4 px-4 leading-[1.2]`}
          >
            Add a Message
          </h2>

          <p className="text-text-muted text-sm max-w-md leading-relaxed">
            Include a personal note with your tip to make it even more special.
          </p>
        </motion.div>

        {/* Textarea Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative rounded-[32px] bg-bg-card border border-border-main overflow-hidden shadow-2xl shadow-black/5"
        >
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative p-6 md:p-8">
            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX) onChange(e.target.value);
              }}
              placeholder="e.g. Thank you so much — you made the evening truly unforgettable! 🌸"
              rows={5}
              className="w-full bg-transparent text-text-main placeholder-text-muted/40 text-base md:text-lg font-medium leading-relaxed resize-none outline-none focus:outline-none"
            />

            {/* Bottom bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-main">
              {/* Character count */}
              <span
                className={`text-xs font-bold tabular-nums transition-colors ${
                  message.length > MAX * 0.85
                    ? "text-primary"
                    : "text-text-muted"
                }`}
              >
                {message.length} / {MAX}
              </span>

              {/* Animated progress bar */}
              <div className="flex-1 mx-6 h-1 bg-bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
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
                  className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick suggestions */}
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          {[
            "Thank you so much! 🙏",
            "You were amazing! ✨",
            "Truly unforgettable! 🌸",
            "Made my day! 💫",
          ].map((suggestion) => (
            <motion.button
              key={suggestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const combined =
                  message.length > 0
                    ? `${message} ${suggestion}`
                    : suggestion;
                if (combined.length <= MAX) onChange(combined);
              }}
              className="px-4 py-2 rounded-full bg-bg-secondary border border-border-main text-text-muted text-xs font-bold hover:bg-bg-card hover:text-text-main transition-all tracking-wide"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}



