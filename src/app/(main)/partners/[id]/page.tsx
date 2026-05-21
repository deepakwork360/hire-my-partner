import { notFound } from "next/navigation";
import { partners } from "@/modules/partner/data/partners";
import ProfileMain from "@/modules/partner/components/profile-main";
import Gallery from "@/modules/partner/components/gallery";
import CompanionSay from "@/modules/partner/components/companion-say";
import RatesBooking from "@/modules/partner/components/rates-booking";
import Report from "@/modules/partner/components/report";
import UMayAlsoLike from "@/modules/partner/components/uMayAlsoLike";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";
import Footer from "../../home-page/sections/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const paramsList: { id: string }[] = [];
  partners.forEach((partner) => {
    paramsList.push({ id: String(partner.id) });
    // Also support slugs like aisha-sharma
    const nameSlug = partner.name.toLowerCase().replace(/\s+/g, "-");
    paramsList.push({ id: nameSlug });
  });
  return paramsList;
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Find partner by raw ID or name-slug (case-insensitive)
  const decodedId = decodeURIComponent(id).toLowerCase();
  const partner = partners.find((p) => {
    const rawIdMatch = String(p.id).toLowerCase() === decodedId;
    const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
    const slugMatch = nameSlug === decodedId;
    return rawIdMatch || slugMatch;
  });

  if (!partner) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 relative overflow-hidden">
      <PageHeaderAccent />
      <ProfileMain partner={partner} />
      <Gallery images={partner.gallery} />
      <RatesBooking partner={partner} />
      <Report />
      <CompanionSay reviews={partner.reviews} />
      <UMayAlsoLike excludeId={partner.id} />
      <Footer />
    </div>
  );
}
