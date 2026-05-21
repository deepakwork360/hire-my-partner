import { Suspense } from "react";
import Footer from "../home-page/sections/Footer";
import ConfirmationCard from "./sections/confirmation-card";
import MainConfirmation from "./sections/main-confirmation";

export default function BookingConfirmation() {
  return (
    <div>
      <MainConfirmation />
      <Suspense fallback={<div className="py-20 text-center text-text-muted font-bold">Loading Confirmation Details...</div>}>
        <ConfirmationCard />
      </Suspense>
      <Footer />
    </div>
  );
}



