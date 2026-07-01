"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookyInfo from "./sections/booky-info";
import ChooseGift from "./sections/choose-gift";
import MainGift from "./sections/main-gift";
import GiftModal from "@/components/ui/GiftModal";
import Footer from "../home-page/sections/Footer";
import { partners } from "@/modules/partner/data/partners";

const findPartnerByNameOrId = (nameOrId: string | number): any => {
  if (!nameOrId) return null;
  const target = String(nameOrId).toLowerCase();

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("approved_partners");
      if (saved) {
        const localList: any[] = JSON.parse(saved);
        const found = localList.find((p) => 
          String(p.id).toLowerCase() === target ||
          p.name.toLowerCase() === target
        );
        if (found) return found;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return partners.find((p) => 
    String(p.id).toLowerCase() === target ||
    p.name.toLowerCase() === target
  ) || null;
};

function ChooseGiftContent() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partner") || "";
  const bookingId = searchParams.get("booking") || "";

  const [partner, setPartner] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("April 14, 2024");
  const [bookingTime, setBookingTime] = useState("07:00 PM - 09:00 PM");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<{
    image: string;
    title: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    // Load partner
    if (partnerId) {
      const found = findPartnerByNameOrId(partnerId);
      if (found) {
        setPartner(found);
      } else {
        setPartner(partners[0]);
      }
    } else {
      // Fallback
      setPartner(partners[0]);
    }

    // Load booking date & time
    if (bookingId && typeof window !== "undefined") {
      try {
        const savedBookings = localStorage.getItem("hire_my_partner_bookings");
        if (savedBookings) {
          const bookingsList = JSON.parse(savedBookings);
          const foundBooking = bookingsList.find((b: any) => String(b.id) === String(bookingId));
          if (foundBooking) {
            setBookingDate(foundBooking.date);
            setBookingTime(foundBooking.time.replace(/\s*[-–]\s*/, " - "));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [partnerId, bookingId]);

  const handleSelectGift = (gift: {
    image: string;
    title: string;
    price: string;
  }) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <>
      <BookyInfo partner={partner} bookingDate={bookingDate} bookingTime={bookingTime} />
      <ChooseGift onSelectGift={handleSelectGift} />

      <GiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipientName={partner?.name || "Aarushi Kumari"}
        partnerId={partner?.id || "1"}
        bookingId={bookingId}
        selectedGift={selectedGift}
      />
    </>
  );
}

export default function SendGift() {
  return (
    <div className="relative min-h-screen bg-bg-base">
      <MainGift />
      <Suspense fallback={<div className="py-20 text-center text-text-muted font-bold">Loading Gift Options...</div>}>
        <ChooseGiftContent />
      </Suspense>
      <Footer />
    </div>
  );
}
