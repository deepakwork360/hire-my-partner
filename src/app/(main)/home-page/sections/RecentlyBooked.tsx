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

const RECENT_EVENTS = [
  "Booked for Wedding Reception",
  "Booked for Luxury Yacht Dinner",
  "Booked for Premium Corporate Gala",
  "Booked for Private Art Exhibition",
  "Booked for Exclusive Charity Ball",
  "Booked for Red Carpet Launch Event",
];

export default function RecentlyBooked() {
  const profile = partners.map((partner, index) => ({
    image: partner.image,
    hourlyRate: `₹${partner.pricing.oneHour}/hr`,
    name: partner.name,
    age: partner.age,
    location: partner.location.split(",")[0].trim(),
    bio: RECENT_EVENTS[index % RECENT_EVENTS.length],
    confirmation: "Just Booked",
    buttonText: "View Profile",
    buttonLink: `/partners/${partner.id}`,
    showViewIcon: false,
  }));

  return (
    <section className="py-10 md:py-16 px-4 bg-bg-secondary overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        <h2
          className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2]`}
        >
          Recently Booked Partners
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



