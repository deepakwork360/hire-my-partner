"use client";

import { Outfit, Playfair_Display, Rochester } from "next/font/google";
import Slider from "@/components/common/Slider";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import ProfileCardSkeleton from "@/components/ProfileCard/ProfileCardSkeleton";
import { usePartners } from "@/modules/partner/hooks/usePartners";

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
  const { partners: fetchedPartners, loading } = usePartners();

  const profile = fetchedPartners.map((partner, index) => ({
    id: partner.id,
    image: partner.image,
    hourlyRate: `₹${partner.pricing.oneHour}/hr`,
    name: partner.name,
    age: partner.age,
    location: partner.location.split(",")[0].trim(),
    bio: partner.bio,
    rating: partner.rating,
    confirmation: "Just Booked",
    tag: (() => {
      if (partner.tags && partner.tags.length > 0 && partner.tags[0]) {
        const first = partner.tags[0];
        if (first === "NA") return "NA";
        return first.startsWith("#") ? first.substring(1) : first;
      }
      const isMock = partner.id ? !isNaN(Number(partner.id)) : false;
      if (!isMock) return "NA";
      return partner.id === "1" ? "Friendly" : partner.id === "2" ? "MusicFan" : partner.id === "3" ? "Talkative" : partner.id === "4" ? "Traveler" : partner.id === "5" ? "NatureLover" : "BookLover";
    })(),
    buttonText: "View Profile",
    buttonLink: `/partners/${partner.id}`,
    showViewIcon: false,
  }));

  if (!loading && profile.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16 px-4 bg-bg-secondary overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        <h2
          className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2]`}
        >
            Recently <span className="text-accent">Booked Partners</span>
        </h2>
        <div className="relative -mx-4 md:mx-0">
          <div className="px-4 md:px-12 overflow-visible">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center py-4">
                <div className="block"><ProfileCardSkeleton /></div>
                <div className="hidden sm:block"><ProfileCardSkeleton /></div>
                <div className="hidden lg:block"><ProfileCardSkeleton /></div>
                <div className="hidden 2xl:block"><ProfileCardSkeleton /></div>
              </div>
            ) : (
              <Slider
                items={profile}
                renderItem={(item, idx) => <ProfileCard key={idx} {...item} />}
                viewAllLink="/browse-partners"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



