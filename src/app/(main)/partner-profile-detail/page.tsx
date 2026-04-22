import Footer from "../home-page/sections/Footer";
import ProfileMain from "./sections/profile-main";
import Gallery from "./sections/gallery";
import RatesBooking from "./sections/rates-booking";
import Report from "./sections/report";
import CompanionSay from "./sections/companion-say";
import UMayAlsoLike from "./sections/uMayAlsoLike";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";

export default function PartnerProfileDetailPage() {
  return (
    <div className="flex flex-col gap-10 relative overflow-hidden">
      <PageHeaderAccent />
      <ProfileMain />
      <Gallery />
      <RatesBooking />
      <Report />
      <CompanionSay />
      <UMayAlsoLike />
      <Footer />
    </div>
  );
}



