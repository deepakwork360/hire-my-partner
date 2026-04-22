"use client";

import { Outfit, Playfair_Display, Rochester } from "next/font/google";
import Slider from "@/components/common/Slider";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Link from "next/link";

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
  const profile = [
    {
      image: "/images/img1.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img2.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img3.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img4.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img5.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img6.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img7.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
    {
      image: "/images/img8.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      bio: "I am a friendly and outgoing person who loves to meet new people.",
      buttonText: "Book Now",
      buttonLink: "/checkout",
      viewLink: "/partner-profile-detail",
      showViewIcon: true,
    },
  ];

  return (
    <section className="py-10 md:py-16 pt-16 md:pt-24 lg:pt-32 px-4 bg-bg-secondary overflow-hidden border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        <h2
          className={`${rochester.className} text-center text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 leading-[1.2]`}
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



