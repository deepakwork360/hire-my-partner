import Footer from "../home-page/sections/Footer";
import ConfirmationCard from "./sections/confirmation-card";
import MainConfirmation from "./sections/main-confirmation";

export default function BookingConfirmation() {
  return (
    <div>
      <MainConfirmation />
      <ConfirmationCard />
      <Footer />
    </div>
  );
}
