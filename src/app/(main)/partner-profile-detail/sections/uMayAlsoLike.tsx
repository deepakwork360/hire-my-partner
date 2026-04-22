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

const recommendedPartners = [
  {
    id: 1,
    name: "Aanya",
    age: 26,
    location: "Mumbai, Maharashtra",
    rate: "₹2,499 / hr",
    bio: "Passionate about art, coffee, and deep conversations. Let's explore the city together.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Rohan",
    age: 29,
    location: "Delhi, NCR",
    rate: "₹3,000 / hr",
    bio: "Fitness enthusiast and food lover. I know the best hidden spots for a perfect date.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Kavya",
    age: 24,
    location: "Bangalore, Karnataka",
    rate: "₹2,000 / hr",
    bio: "Techie by day, musician by night. Always up for live gigs and fun weekend adventures.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    rating: "5.0",
  },
];

export default function UMayAlsoLike() {
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
            className={`${rochester.className} text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-main via-primary to-text-main mb-4 text-center drop-shadow-md`}
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
          {recommendedPartners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ProfileCard
                image={partner.image}
                hourlyRate={partner.rate}
                name={partner.name}
                age={partner.age}
                location={partner.location}
                bio={partner.bio}
                rating={partner.rating}
                confirmation="Identity Verified"
                buttonText="View Profile"
                viewLink="/partner-profile-detail"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



