"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../home-page/sections/Footer";
import AddMessage from "./sections/add-message";
import BookyInfo from "./sections/booky-info";
import ChoosePayment from "./sections/choose-payment";
import ChooseTip from "./sections/choose-tip";
import MainTip from "./sections/main-tip";
import { partners } from "@/modules/partner/data/partners";

export type TipFormData = {
  recipientName: string;
  partnerId: string | number;
  bookingId?: string | number;
  bookingDate: string;
  bookingTime: string;
  selectedTipAmount: number | null;
  customTipAmount: string;
  tipLabel: string;
  message: string;
  paymentMethod: string;
};

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

function SendTipContent() {
  const searchParams = useSearchParams();
  const partnerIdParam = searchParams.get("partner") || "";
  const bookingIdParam = searchParams.get("booking") || "";

  const [partner, setPartner] = useState<any>(null);
  const [formData, setFormData] = useState<TipFormData>({
    recipientName: "Aarushi Kumari",
    partnerId: "1",
    bookingId: "",
    bookingDate: "April 14, 2024",
    bookingTime: "07:00 PM - 09:00 PM",
    selectedTipAmount: null,
    customTipAmount: "",
    tipLabel: "",
    message: "",
    paymentMethod: "",
  });

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let currentPartner = partners[0];
    if (partnerIdParam) {
      const found = findPartnerByNameOrId(partnerIdParam);
      if (found) {
        currentPartner = found;
      }
    }
    setPartner(currentPartner);

    let date = "April 14, 2024";
    let time = "07:00 PM - 09:00 PM";

    if (bookingIdParam && typeof window !== "undefined") {
      try {
        const savedBookings = localStorage.getItem("hire_my_partner_bookings");
        if (savedBookings) {
          const bookingsList = JSON.parse(savedBookings);
          const foundBooking = bookingsList.find((b: any) => String(b.id) === String(bookingIdParam));
          if (foundBooking) {
            date = foundBooking.date;
            time = foundBooking.time.replace(/\s*[-–]\s*/, " - ");
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    setFormData((prev) => ({
      ...prev,
      recipientName: currentPartner?.name || "Aarushi Kumari",
      partnerId: currentPartner?.id || "1",
      bookingId: bookingIdParam,
      bookingDate: date,
      bookingTime: time,
    }));
  }, [partnerIdParam, bookingIdParam]);

  const updateForm = (fields: Partial<TipFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleReset = () => {
    setFormData({
      recipientName: partner?.name || "Aarushi Kumari",
      partnerId: partner?.id || "1",
      bookingId: bookingIdParam,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      selectedTipAmount: null,
      customTipAmount: "",
      tipLabel: "",
      message: "",
      paymentMethod: "",
    });
    setResetKey((k) => k + 1);
  };

  return (
    <>
      <BookyInfo partner={partner} bookingDate={formData.bookingDate} bookingTime={formData.bookingTime} />
      <ChooseTip
        key={`tip-${resetKey}`}
        onTipChange={(amount, label, custom) =>
          updateForm({ selectedTipAmount: amount, tipLabel: label, customTipAmount: custom })
        }
      />
      <AddMessage
        key={`msg-${resetKey}`}
        message={formData.message}
        onChange={(msg) => updateForm({ message: msg })}
      />
      <ChoosePayment
        key={`pay-${resetKey}`}
        formData={formData}
        onPaymentMethodChange={(method) => updateForm({ paymentMethod: method })}
        onReset={handleReset}
      />
    </>
  );
}

export default function SendTip() {
  return (
    <div className="bg-bg-base min-h-screen">
      <MainTip />
      <Suspense fallback={<div className="py-20 text-center text-text-muted font-bold">Loading Tip Details...</div>}>
        <SendTipContent />
      </Suspense>
      <Footer />
    </div>
  );
}
