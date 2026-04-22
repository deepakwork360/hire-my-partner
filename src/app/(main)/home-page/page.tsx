import HeroSection from "./sections/HeroSection";
import HowItWorks from "./sections/HowItWorks";
import PartnersNearby from "./sections/PartnersNearby";
import RecentlyBooked from "./sections/RecentlyBooked";
import SafetyTrust from "./sections/safety-trust";
import TopCompanions from "./sections/TopCompanions";
import WhoCanUse from "./sections/WhoCanUse";
import CompanionSay from "./sections/companion-say";
import FAQ from "./sections/FAQ";
import FooterCTA from "./sections/Footer-CTA";
import Footer from "./sections/Footer";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TopCompanions />
      <HowItWorks />
      <RecentlyBooked />
      <PartnersNearby />
      <WhoCanUse />
      <SafetyTrust />
      <CompanionSay />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  );
}



