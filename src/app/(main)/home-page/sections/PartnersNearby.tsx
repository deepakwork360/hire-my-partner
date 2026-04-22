"use client";

import Slider from "@/components/common/Slider";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import PremiumDropdown from "@/components/ui/PremiumDropdown";
import { Range } from "react-range";
import { Outfit, Rochester } from "next/font/google";
import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Calendar,
  ChevronDown,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

export default function PartnersNearby() {
  const profile = [
    {
      image: "/images/img8.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4.5",
      bio: "Booked for Wedding Reception ",
      distance: "5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img7.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "5",
      bio: "Booked for Wedding Reception ",
      distance: "2km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img6.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4",
      bio: "Booked for Wedding Reception ",
      distance: "3km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img5.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "3.5",
      bio: "Booked for Wedding Reception ",
      distance: "0.5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img4.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4.5",
      bio: "Booked for Wedding Reception ",
      distance: "5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img3.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4",
      bio: "Booked for Wedding Reception ",
      distance: "5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img2.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4.5",
      bio: "Booked for Wedding Reception ",
      distance: "5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
    {
      image: "/images/img1.webp",
      hourlyRate: "₹2000/hr",
      name: "Emily",
      age: 25,
      location: "New York",
      rating: "4.5",
      bio: "Booked for Wedding Reception ",
      distance: "5km away",
      buttonText: "View Profile",
      buttonLink: "/partner-profile-detail",
      showViewIcon: false,
      messageLink: "",
      mapLink: "",
    },
  ];

  const [age, setAge] = useState("");
  const [eventType, setEventType] = useState("");
  const [rating, setRating] = useState("");
  const [distance, setDistance] = useState("");
  const [values, setValues] = useState<number[]>([10, 60]);

  return (
    <section className="py-10 md:py-16 px-4 bg-bg-secondary overflow-visible border-b border-border-main">
      <div className="max-w-[1600px] w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <h1
            className={`${rochester.className} text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-in fade-in slide-in-from-bottom-4 duration-700 py-4 px-4 leading-[1.2]`}
          >
            Partners Nearby You
          </h1>
          <p
            className={`${outfit.className} text-lg md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200`}
          >
            Looking for the perfect plus-one? Explore charming companions
            nearby, available for events, dinners, or casual meetups.
          </p>
        </div>

        {/* Filters Section - Glassmorphic Design */}
        <div className="relative z-50 mb-8 p-6 md:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-border-main shadow-xl shadow-primary/5 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Age Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 ml-1">
                <User size={12} className="text-primary" /> Age Range
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g. 20-30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 rounded-2xl bg-white/5 border border-border-main text-white placeholder-slate-500 focus:border-primary-dark focus:ring-4 focus:ring-primary/20 outline-hidden transition-all text-sm font-medium"
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:rotate-180 transition-transform"
                  size={16}
                />
              </div>
            </div>

            {/* Event Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 ml-1">
                <Calendar size={12} className="text-primary" /> Event Type
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Select Event"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 rounded-2xl bg-white/5 border border-border-main text-white placeholder-slate-500 focus:border-primary-dark focus:ring-4 focus:ring-primary/20 outline-hidden transition-all text-sm font-medium"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  size={16}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <PremiumDropdown
              label="Min Rating"
              icon={Star}
              value={rating}
              onChange={setRating}
              options={[
                { value: "", label: "Any Rating", icon: Star },
                { value: "4.5", label: "4.5+ Stars", icon: Star },
                { value: "4.0", label: "4.0+ Stars", icon: Star },
                { value: "3.5", label: "3.5+ Stars", icon: Star },
              ]}
              className="flex-1"
            />

            {/* Distance Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-primary" /> Distance
                </label>
                <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {values[0]}km - {values[1]}km
                </span>
              </div>
              <div className="px-2 pt-6 pb-2">
                <Range
                  step={1}
                  min={0}
                  max={100}
                  values={values}
                  onChange={(vals) => setValues(vals)}
                  renderTrack={({ props, children }) => (
                    <div
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      className="w-full h-8 flex items-center cursor-pointer"
                      style={{ ...props.style }}
                    >
                      <div
                        ref={props.ref}
                        className="w-full h-1.5 rounded-full relative"
                        style={{
                          background: `linear-gradient(to right, rgba(255,255,255,0.05) ${values[0]}%, rgb(var(--primary-dark-rgb)) ${values[0]}%, rgb(var(--primary-rgb)) ${values[1]}%, rgba(255,255,255,0.05) ${values[1]}%)`,
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                        }}
                      >
                        {/* Glow for active area */}
                        <div
                          className="absolute h-full top-0 rounded-full"
                          style={{
                            left: `${values[0]}%`,
                            width: `${values[1] - values[0]}%`,
                            boxShadow: "0 0 10px rgba(var(--primary-rgb),0.5)",
                          }}
                        />
                        {children}
                      </div>
                    </div>
                  )}
                  renderThumb={({ props, isDragged, index }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className={`group outline-none flex items-center justify-center ${isDragged ? "z-20" : "hover:z-10 z-0"}`}
                        style={{ ...restProps.style }}
                      >
                        {/* Thumb Design */}
                        <div
                          className={`w-5 h-5 rounded-full bg-white border-[3px] border-primary flex items-center justify-center transition-all duration-200 ${isDragged ? "scale-125 shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]" : "shadow-md group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)]"}`}
                        >
                          {/* Inner dot */}
                          <div className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                        </div>

                        {/* Tooltip */}
                        <div
                          className={`absolute -top-10 px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-lg shadow-xl pointer-events-none transition-all duration-200 flex flex-col items-center min-w-[36px] ${
                            isDragged
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                          }`}
                        >
                          {values[index]}km
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 rounded-sm" />
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Slider */}
        <div className="relative -mx-4 md:mx-0 py-8">
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



