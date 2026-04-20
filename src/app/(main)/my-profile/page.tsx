import MainProfile from "./sections/main-profile";
import Form from "./sections/form";
import PassMngmnt from "./sections/pass-mngmnt";
import Notification from "./sections/notification";
import DeleteAccount from "./sections/delete";
import Footer from "../home-page/sections/Footer";

export default function MyProfile() {
  return (
    <div className="flex flex-col gap-10">
      <MainProfile />
      <Form />
      <PassMngmnt />
      <Notification />
      <DeleteAccount />
      <Footer />
    </div>
  );
}
