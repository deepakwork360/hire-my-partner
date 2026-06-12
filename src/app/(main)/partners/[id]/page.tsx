"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { usePartner } from "@/modules/partner/hooks/usePartner";
import ProfileMain from "@/modules/partner/components/profile-main";
import Gallery from "@/modules/partner/components/gallery";
import Availability from "@/modules/partner/components/availability";
import CompanionSay from "@/modules/partner/components/companion-say";
import Report from "@/modules/partner/components/report";
import UMayAlsoLike from "@/modules/partner/components/uMayAlsoLike";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";
import Footer from "../../home-page/sections/Footer";
import PartnerDetailSkeleton from "@/components/loader/PartnerDetailSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { partner, loading, error } = usePartner(id);

  if (loading) {
    return <PartnerDetailSkeleton />;
  }

  if (error || !partner) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-0 relative overflow-hidden">
      <PageHeaderAccent />
      <ProfileMain partner={partner} />
      <Gallery images={partner.gallery} partner={partner} />
      <Availability partner={partner} />
      <Report />
      <CompanionSay reviews={partner.reviews} />
      <UMayAlsoLike excludeId={partner.id} />
      <Footer />
    </div>
  );
}
