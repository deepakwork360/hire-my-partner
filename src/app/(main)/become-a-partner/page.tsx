"use client";

import dynamic from "next/dynamic";
import MainBecAPart from "./sections/main-bec-a-part";
import Footer from "../home-page/sections/Footer";
import Loader from "@/components/loader/Loader";

const DetailsForm = dynamic(() => import("./sections/details-form"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function BecomeAPartnerPage() {
  return (
    <div>
      <MainBecAPart />
      <DetailsForm />
      <Footer />
    </div>
  );
}



