"use client";

import Image from "next/image";
import { Rochester, Outfit, Bitcount_Ink } from "next/font/google";
import { motion } from "framer-motion";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const bitcount_ink = Bitcount_Ink({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Sign Up",
      description:
        "Join as a User or Partner. Whether you're looking to hire a companion or offer your time, get started in minutes.",
      position: "left-bottom",
    },
    {
      id: "02",
      title: "Browse Profiles",
      description:
        "Explore a curated list of verified partners near you. Filter by interests, location, language, and availability.",
      position: "left-top",
    },
    {
      id: "03",
      title: "Book by the hour",
      description:
        "Select your preferred partner, choose the number of hours, and book instantly. Transparent pricing. No hidden fees.",
      position: "right-bottom",
    },
    {
      id: "04",
      title: "Meet Safely",
      description:
        "Connect, chat, and meet at your agreed location. Your privacy and safety are our top priority.",
      position: "right-top",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-12 px-4 md:py-16 bg-bg-base overflow-hidden border-b border-border-main"
    >
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2] mb-6`}
          >
            How It Works
          </h2>
        </motion.div>

        {/* Main Content Area */}
        <div className="relative flex flex-col lg:items-center justify-center min-h-[600px]">
          {/* Desktop Circular Layout (Hidden on Mobile) */}
          <div className="hidden lg:block relative w-full h-[600px]">
            {/* Central Circular Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative p-2 rounded-full bg-linear-to-tr from-primary to-accent shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-border-main shadow-inner">
                  <Image
                    src="/assets/howitworks.webp"
                    alt="How it works"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full scale-110"
                  />
                </div>
              </div>
            </motion.div>

            {/* Steps - Positioned around the circle */}
            <Step
              data={steps[1]}
              className="top-0 left-20 w-80 text-right"
              numberClass="justify-end"
            />
            <Step
              data={steps[0]}
              className="bottom-0 left-20 w-80 text-right"
              numberClass="justify-end"
            />
            <Step
              data={steps[3]}
              className="top-0 right-20 w-80 text-left"
              numberClass="justify-start"
            />
            <Step
              data={steps[2]}
              className="bottom-0 right-20 w-80 text-left"
              numberClass="justify-start"
            />

            {/* SVG Connecting Arrows */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1200 600"
              fill="none"
            >
              {/* Arrow 01 to 02 */}
              <motion.path
                d="M 280 420 Q 200 300 280 180"
                stroke="rgb(var(--primary-rgb))"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
                markerEnd="url(#arrowhead)"
              />
              {/* Arrow 02 to Circle */}
              <motion.path
                d="M 400 100 Q 500 100 550 200"
                stroke="rgb(var(--primary-rgb))"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 }}
                markerEnd="url(#arrowhead)"
              />
              {/* Arrow Circle to 03 */}
              <motion.path
                d="M 650 400 Q 700 500 800 500"
                stroke="rgb(var(--primary-rgb))"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1.5 }}
                markerEnd="url(#arrowhead)"
              />
              {/* Arrow 03 to 04 */}
              <motion.path
                d="M 920 420 Q 1000 320 920 180"
                stroke="rgb(var(--primary-rgb))"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 2 }}
                markerEnd="url(#arrowhead)"
              />

              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="0"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgb(var(--primary-rgb))" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Mobile Layout (Visible on Small Screens) */}
          <div className="lg:hidden flex flex-col gap-12 px-6">
            {/* Central Image - Scaled down for mobile */}
            <div className="flex justify-center mb-8">
              <div className="p-1 rounded-full bg-linear-to-tr from-primary to-accent">
                <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-border-main shadow-xl">
                  <Image
                    src="/assets/howitworks.webp"
                    alt="How it works"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <span
                  className={`${outfit.className} text-4xl font-black text-primary opacity-20`}
                >
                  {step.id}
                </span>
                <h3
                  className={`${outfit.className} text-2xl font-bold text-text-main`}
                >
                  {step.title}
                </h3>
                <p
                  className={`${outfit.className} text-text-muted leading-relaxed text-sm max-w-xs`}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  data,
  className,
  numberClass,
}: {
  data: any;
  className: string;
  numberClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`absolute ${className} group`}
    >
      <div className={`flex items-center gap-2 mb-2 ${numberClass}`}>
        <span
          className={`${outfit.className} text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500`}
        >
          {data.id}
        </span>
      </div>
      <h3
        className={`${outfit.className} text-2xl font-bold text-text-main mb-3 group-hover:text-primary transition-colors`}
      >
        {data.title}
      </h3>
      <p
        className={`${outfit.className} text-text-muted leading-relaxed text-[15px]`}
      >
        {data.description}
      </p>
    </motion.div>
  );
}



