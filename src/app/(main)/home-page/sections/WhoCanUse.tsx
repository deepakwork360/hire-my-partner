"use client";

import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function WhoCanUse() {
  const reasons = [
    {
      title: "Events & Functions",
      description:
        "Need a plus-one for a wedding, party, or social event? We've got you covered.",
      image: "/assets/use-this-one.webp",
    },
    {
      title: "Movie or Dinner Dates",
      description:
        "Don't go alone — hire someone for a casual movie night or dinner outing.",
      image: "/assets/use-this-two.png",
      featured: true,
    },
    {
      title: "Travel Companions",
      description:
        "Explore new places with a friendly, verified partner by your side.",
      image: "/assets/use-this-three.png",
    },
    {
      title: "Relationship Roleplay",
      description:
        "Experience romantic companionship without long-term commitments - for fun or comfort.",
      image: "/assets/use-this-four.png",
    },
  ];

  return (
    <section className="py-12 px-4 md:py-16 bg-bg-secondary overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Header section */}
        <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary font-bold text-center tracking-tight py-4 leading-[1.2]`}
          >
            Who Can Use This?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`${outfit.className} text-text-muted max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed`}
          >
            Whether you're looking for company or creating memories,
            HireYourPartner is for you.
          </motion.p>
        </div>

        {/* Cards section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-bg-secondary p-6 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-border-main shadow-lg hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)]"
            >
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={reason.image}
                  alt={reason.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="text-center space-y-3">
                <h3
                  className={`${outfit.className} text-xl font-bold text-text-main squiggle-accent`}
                >
                  {reason.title}
                </h3>
                <p
                  className={`${outfit.className} text-text-muted text-sm leading-relaxed`}
                >
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



