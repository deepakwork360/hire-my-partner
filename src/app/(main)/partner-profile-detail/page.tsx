import Footer from "../home-page/sections/Footer";
import ProfileMain from "./sections/profile-main";
import Gallery from "./sections/gallery";
import RatesBooking from "./sections/rates-booking";
import Report from "./sections/report";
import CompanionSay from "./sections/companion-say";
import UMayAlsoLike from "./sections/uMayAlsoLike";

export default function PartnerProfileDetailPage() {
  return (
    <div>
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
