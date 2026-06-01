"use client";

import { Rochester, Outfit } from "next/font/google";
import { motion } from "framer-motion";
import ProfileCard from "@/components/ProfileCard/ProfileCard";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

import { usePartners } from "@/modules/partner/hooks/usePartners";

interface UMayAlsoLikeProps {
  excludeId?: string;
}

export default function UMayAlsoLike({ excludeId }: UMayAlsoLikeProps) {
  const { partners: fetchedPartners, loading } = usePartners();

  // Filter out the profile currently being viewed (case-insensitive ID check)
  const filteredPartners = fetchedPartners.filter(
    (p) => String(p.id).toLowerCase() !== String(excludeId || "").toLowerCase()
  );

  // Take up to 3 companions to showcase as recommendations
  const displayPartners = filteredPartners.slice(0, 3);

  if (loading) {
    return (
      <section
        className={`py-16 md:py-24 px-4 bg-bg-secondary border-b border-border-main ${outfit.className}`}
      >
        <div className="max-w-[1600px] w-full mx-auto flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-text-muted text-sm font-medium">Finding perfect recommendations...</p>
        </div>
      </section>
    );
  }

  return (
    <section  
      className={`py-16 md:py-24 px-4 bg-bg-secondary border-b border-border-main ${outfit.className}`}
    >
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="flex flex-col items-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${rochester.className} text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main mb-4 text-center drop-shadow-md`}
          >
            You May Also Like
          </motion.h2>
          <div className="w-24 h-1 rounded-full bg-linear-to-r from-primary to-primary-dark shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"></div>
          <p className="text-text-muted mt-6 text-center max-w-lg">
            Discover other highly-rated companions that match your preferences
            and style.
          </p>
        </div>

        {/* Centered Profile Card Flex Layout */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-[1400px] mx-auto">
          {displayPartners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ProfileCard
                image={partner.image}
                hourlyRate={`₹${partner.pricing.oneHour} / hr`}
                name={partner.name}
                age={partner.age}
                location={partner.location}
                bio={partner.bio}
                rating={partner.rating}
                confirmation="Identity Verified"
                buttonText="View Profile"
                buttonLink={`/partners/${partner.id}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



