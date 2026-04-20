"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import PremiumButton from "./PremiumButton";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

interface GiftCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  onSend: () => void;
}

export default function GiftCard({
  image,
  title,
  description,
  price,
  onSend,
}: GiftCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative h-full bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] flex flex-col ${outfit.className}`}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square overflow-hidden m-3 rounded-[32px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* PRICE TAG */}
        <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <span className="text-white font-black text-sm tracking-tighter">
            {price}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 pt-2 flex flex-col flex-1">
        <h3 className="text-xl font-black text-white mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
          {description}
        </p>

        <div className="mt-auto">
          <PremiumButton
            label="Select Gift"
            onClick={onSend}
            variant="primary"
            size="md"
            className="w-full"
          />
        </div>
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
}
