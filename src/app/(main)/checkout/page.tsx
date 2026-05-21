import { Suspense } from "react";
import Footer from "../home-page/sections/Footer";
import BookDetails from "./sections/book-details";
import MainCheckout from "./sections/main-checkout";

export default function Checkout() {
  return (
    <div>
      <MainCheckout />
      <Suspense fallback={<div className="py-20 text-center text-text-muted font-bold">Loading Checkout Details...</div>}>
        <BookDetails />
      </Suspense>
      <Footer />
    </div>
  );
}



