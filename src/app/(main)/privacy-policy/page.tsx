import Footer from "../home-page/sections/Footer";
import MainPrivacyBanner from "./sections/main-privacy-banner";
import PrivacyEffectiveDate from "./sections/privacy-effective-date";
import PrivacyContent from "./sections/privacy-content";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-bg-base min-h-screen">
      <MainPrivacyBanner />
      <PrivacyEffectiveDate />
      <PrivacyContent />
      <Footer />
    </div>
  );
}



