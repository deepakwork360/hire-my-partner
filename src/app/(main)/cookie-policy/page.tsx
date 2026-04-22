import Footer from "../home-page/sections/Footer";
import MainCookieBanner from "./sections/main-cookie-banner";
import CookieEffectiveDate from "./sections/cookie-effective-date";
import CookieContent from "./sections/cookie-content";

export default function CookiePolicyPage() {
  return (
    <div className="bg-bg-base min-h-screen">
      <MainCookieBanner />
      <CookieEffectiveDate />
      <CookieContent />
      <Footer />
    </div>
  );
}



