"use client";

import Image from "next/image";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { MapPin, Star, Eye, MessageSquare, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import PremiumButton from "../ui/PremiumButton";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

interface ProfileCardProps {
  image: string;
  name: string;
  age: number;
  location: string;
  hourlyRate: string;
  bio: string;
  rating?: string;
  distance?: string;
  confirmation?: string;
  buttonText?: string;
  buttonLink?: string;
  viewLink?: string;
  messageLink?: string;
  mapLink?: string;
  showViewIcon?: boolean;
}

export default function ProfileCard({
  image,
  name,
  age,
  location,
  hourlyRate,
  bio,
  rating = "4.5",
  distance,
  confirmation,
  buttonText = "Book Now",
  buttonLink = "/checkout",
  viewLink = "/profile",
  messageLink,
  mapLink,
  showViewIcon = false,
}: ProfileCardProps) {
  return (
    <div className={`main-profile-card group ${outfit.className}`}>
      {/* Photo Container */}
      <div className="profile-card-image">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-w-768px) 100vw, 328px"
          priority
        />
        
        {/* Rating Badge */}
        <div className="profile-card-rating">
          <Star className="profile-card-rating-icon" />
          <span>{rating}</span>
        </div>

        {/* Rate Badge */}
        <div className="profile-card-badge">
          {hourlyRate}
        </div>
      </div>

      {/* Content */}
      <div className="profile-card-content">
        <div className="profile-card-header">
          <h3 className="profile-card-name">{name}</h3>
          <span className="profile-card-age">{age}</span>
        </div>

        <div className="profile-card-location">
          <MapPin className="profile-card-location-icon" />
          <span>{location}</span>
        </div>

        <p className="profile-card-bio">
          {bio}
        </p>

        {confirmation && (
          <div className="profile-card-confirmation">
            <Navigation className="profile-card-confirmation-icon" />
            <span>{confirmation}</span>
          </div>
        )}

        {distance && (
          <div className="profile-card-distance">
            {distance}
          </div>
        )}
      </div>

      {/* Footer / Buttons */}
      <div className="profile-card-footer">
        <div className="flex items-center gap-2">
          <PremiumButton
            label={buttonText}
            href={buttonLink}
            variant="primary"
            size="md"
            className="flex-1"
          />
          
          <div className="flex items-center gap-2">
            {showViewIcon && (
              <Link href={viewLink} className="profile-card-view">
                <Eye size={20} />
              </Link>
            )}
            {messageLink && (
              <Link href={messageLink} className="profile-card-message">
                <MessageSquare size={20} />
              </Link>
            )}
            {mapLink && (
              <Link href={mapLink} className="profile-card-map">
                <Navigation size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
