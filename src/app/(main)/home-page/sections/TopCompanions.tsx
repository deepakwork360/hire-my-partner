"use client";

import { Outfit, Playfair_Display, Rochester } from "next/font/google";
import Slider from "@/components/common/Slider";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Link from "next/link";

import { partners } from "@/modules/partner/data/partners";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic", "normal"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

export default function TopCompanions() {
  const profile = partners.map((partner) => ({
    image: partner.image,
    hourlyRate: `₹${partner.pricing.oneHour}/hr`,
    name: partner.name,
    age: partner.age,
    location: partner.location.split(",")[0].trim(),
    bio: partner.bio,
    rating: partner.rating,
    distance: partner.distance,
    confirmation: partner.verified ? "Identity Verified" : undefined,
    buttonText: "Book Now",
    buttonLink: `/checkout?partner=${partner.id}`,
    viewLink: `/partners/${partner.id}`,
    showViewIcon: true,
  }));

  return (
    <section className="py-10 md:py-16 pt-16 md:pt-24 lg:pt-32 px-4 bg-bg-secondary overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        <h2
          className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2]`}
        >
          Meet Our Top Companions
        </h2>
        <div className="relative -mx-4 md:mx-0">
          <div className="px-4 md:px-12 overflow-visible">
            <Slider
              items={profile}
              renderItem={(item) => <ProfileCard {...item} />}
              viewAllLink="/browse-partners"
            />
          </div>
        </div>
      </div>
    </section>
  );
}



