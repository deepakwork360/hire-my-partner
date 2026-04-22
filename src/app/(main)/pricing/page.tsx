import FooterCTA from "./sections/footerCTA";
import FAQ from "./sections/FAQ";
import MainPricing from "./sections/main-pricing";
import PricingPlan from "./sections/pricing-plan";
import Footer from "../home-page/sections/Footer";

export default function PricingPage() {
  return (
    <div>
      <MainPricing />
      <PricingPlan />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  );
}



