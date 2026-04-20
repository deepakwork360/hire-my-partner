import Footer from "../home-page/sections/Footer";
import BookDetails from "./sections/book-details";
import MainCheckout from "./sections/main-checkout";
import Profile from "./sections/profile";

export default function Checkout() {
  return (
    <div>
      <MainCheckout />
      <BookDetails />
      {/* <Profile /> */}
      <Footer />
    </div>
  );
}
