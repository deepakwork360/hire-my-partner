"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/modules/auth/store";
import MainBecAPart from "./sections/main-bec-a-part";
import Footer from "../home-page/sections/Footer";
import Loader from "@/components/loader/Loader";

const DetailsForm = dynamic(() => import("./sections/details-form"), {
  ssr: false,
});

export default function BecomeAPartnerPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login?redirect=/become-a-partner");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return <Loader />;
  }

  return (
    <div>
      <MainBecAPart />
      <Suspense fallback={<Loader />}>
        <DetailsForm />
      </Suspense>
      <Footer />
    </div>
  );
}





