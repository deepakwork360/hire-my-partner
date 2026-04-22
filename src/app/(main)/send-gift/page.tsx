"use client";

import { useState } from "react";
import BookyInfo from "./sections/booky-info";
import ChooseGift from "./sections/choose-gift";
import MainGift from "./sections/main-gift";
import GiftModal from "@/components/ui/GiftModal";
import Footer from "../home-page/sections/Footer";

export default function SendGift() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<{
    image: string;
    title: string;
    price: string;
  } | null>(null);

  const handleSelectGift = (gift: {
    image: string;
    title: string;
    price: string;
  }) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-bg-base">
      <MainGift />
      <BookyInfo />
      <ChooseGift onSelectGift={handleSelectGift} />

      <GiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipientName="Aarushi Kumari"
        selectedGift={selectedGift}
      />
      <Footer />
    </div>
  );
}



