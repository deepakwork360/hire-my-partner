import Footer from "../home-page/sections/Footer";
import ContactForm from "./sections/contact-form";
import MainContact from "./sections/main-contact";
import MapContainer from "./sections/Map-container";

export default function ContactPage() {
  return (
    <div>
      <MainContact />
      <ContactForm />
      {/* <MapContainer /> */}
      <Footer />
    </div>
  );
}
