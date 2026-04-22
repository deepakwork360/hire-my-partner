import MainProfile from "./sections/main-profile";
import Form from "./sections/form";
import PassMngmnt from "./sections/pass-mngmnt";
import Notification from "./sections/notification";
import DeleteAccount from "./sections/delete";
import Footer from "../home-page/sections/Footer";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";

export default function MyProfile() {
  return (
    <div className="flex flex-col gap-10 relative overflow-hidden">
      <PageHeaderAccent />
      <MainProfile />
      <Form />
      <PassMngmnt />
      <Notification />
      <DeleteAccount />
      <Footer />
    </div>
  );
}



