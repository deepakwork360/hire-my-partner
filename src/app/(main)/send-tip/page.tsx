"use client";

import { useState } from "react";
import Footer from "../home-page/sections/Footer";
import AddMessage from "./sections/add-message";
import BookyInfo from "./sections/booky-info";
import ChoosePayment from "./sections/choose-payment";
import ChooseTip from "./sections/choose-tip";
import MainTip from "./sections/main-tip";

export type TipFormData = {
  recipientName: string;
  bookingDate: string;
  bookingTime: string;
  selectedTipAmount: number | null;
  customTipAmount: string;
  tipLabel: string;
  message: string;
  paymentMethod: string;
};

const INITIAL_FORM: TipFormData = {
  recipientName: "Aarushi Kumari",
  bookingDate: "April 14, 2024",
  bookingTime: "07:00 PM",
  selectedTipAmount: null,
  customTipAmount: "",
  tipLabel: "",
  message: "",
  paymentMethod: "",
};

export default function SendTip() {
  const [formData, setFormData] = useState<TipFormData>(INITIAL_FORM);
  // Incrementing this key forces ChooseTip + AddMessage to fully remount (fresh state)
  const [resetKey, setResetKey] = useState(0);

  const updateForm = (fields: Partial<TipFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="bg-bg-base min-h-screen">
      <MainTip />
      <BookyInfo />
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
      <Footer />
    </div>
  );
}



