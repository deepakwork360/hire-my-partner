"use client";

import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const testimonials = [
  {
    id: 1,
    name: "Aarushi",
    role: "User",
    text: "I needed a plus-one for a wedding, and it was perfect! Respectful, fun, and totally hassle-free.",
    image: "/assets/Companion-one.png",
  },
  {
    id: 2,
    name: "Priya",
    role: "Companion",
    text: "As a partner, I’ve had great experiences. The platform feels safe, and users are genuine.",
    image: "/assets/Companion-two.png",
  },
  {
    id: 3,
    name: "Rohit",
    role: "User",
    text: "Booked someone for a solo dinner. Great conversation and I didn’t feel alone for once.",
    image: "/assets/Companion-three.png",
  },
  {
    id: 4,
    name: "Sanya",
    role: "Companion",
    text: "The verification process gives me peace of mind. I love meeting new people and earning.",
    image: "/assets/Companion-four.png",
  },
  {
    id: 5,
    name: "Vikram",
    role: "User",
    text: "Excellent service! Found a great movie buddy in minutes. Highly recommended.",
    image: "/assets/Companion-one.png",
  },
  {
    id: 6,
    name: "Anjali",
    role: "Companion",
    text: "Flexible hours and friendly users. HireYourPartner is the best companion platform.",
    image: "/assets/Companion-two.png",
  },
];

const Row = ({
  items,
  direction = "left",
  speed = 25,
}: {
  items: typeof testimonials;
  direction: "left" | "right";
  speed?: number;
}) => {
  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
        className="flex gap-6 whitespace-nowrap"
      >
        {/* Iterate twice for seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="w-[350px] md:w-[450px] h-full shrink-0 bg-bg-secondary backdrop-blur-md p-8 rounded-[32px] border border-border-main shadow-sm transition-all duration-300 hover:border-white/20 hover:shadow-primary/10"
          >
            <div className="flex flex-col gap-6">
              <Quote className="w-10 h-10 text-primary/20" />
              <p
                className={`${outfit.className} text-text-muted italic text-lg leading-relaxed whitespace-normal`}
              >
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border-main">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4
                    className={`${outfit.className} font-bold text-text-main leading-none`}
                  >
                    {item.name}
                  </h4>
                  <p
                    className={`${outfit.className} text-transparent bg-clip-text bg-linear-to-r from-primary to-accent text-sm font-black uppercase tracking-wider mt-1`}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function CompanionSay() {
  const rowA = testimonials.slice(0, 3);
  const rowB = testimonials.slice(3, 6);

  return (
    <section className="py-12 md:py-16 bg-bg-secondary overflow-hidden relative border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto px-4 mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2] mb-6`}
        >
          What Our Users & Companions Say
        </motion.h2>
      </div>

      {/* Testimonial Wall with Fading Edges */}
      <div className="relative">
        {/* Left and Right Vignette/Fade Overlays */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-8">
          <Row items={rowA} direction="right" speed={30} />
          <Row items={rowB} direction="left" speed={25} />
        </div>
      </div>
    </section>
  );
}



