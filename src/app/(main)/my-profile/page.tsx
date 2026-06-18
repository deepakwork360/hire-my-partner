"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Outfit } from "next/font/google";
import MainProfile from "./sections/main-profile";
import Form from "./sections/form";
import PassMngmnt from "./sections/pass-mngmnt";
import Notification from "./sections/notification";
import DeleteAccount from "./sections/delete";
import Footer from "../home-page/sections/Footer";
import PageHeaderAccent from "@/components/ui/PageHeaderAccent";
import Loader from "@/components/loader/Loader";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function MyProfile() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isLivePartner, setIsLivePartner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const checkPartnerStatus = () => {
      try {
        // Automatically verify Sabrina Carpenter if logged in as her
        const authSessionStr = localStorage.getItem("meetme_auth_session");
        if (authSessionStr) {
          const session = JSON.parse(authSessionStr);
          const userObj = session.state?.user;
          if (userObj && userObj.email === "sabrina@gmail.com") {
            const savedData = localStorage.getItem("partnerApplication");
            let parsed = savedData ? JSON.parse(savedData) : null;
            if (!parsed || parsed.verificationStatus !== "VERIFIED") {
              const sabrinaApp = {
                formData: {
                  fullName: "Sabrina Carpenter",
                  displayName: "Sabrina",
                  email: "sabrina@gmail.com",
                  mobile: "9876543210",
                  gender: "Female",
                  dob: "1999-05-11",
                  city: "New York, USA",
                  bio: "Singer, songwriter, actress and your companion. Let's talk about music, films, and coffee.",
                  hourlyRate: "899",
                  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
                  banner: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200",
                  availability: ["Monday", "Wednesday", "Friday"],
                  languages: ["English", "French"],
                  tagsInput: ["Singer", "Actor", "Artist"],
                  interestsInput: ["Music", "Pop", "Travel"]
                },
                submissionStatus: "success",
                view: "summary",
                verificationStatus: "VERIFIED",
                verificationNotes: "",
                kycStatus: "APPROVED",
                kycDate: "2026-06-20",
                kycSlot: "4:00 PM - 4:30 PM",
                zoomLink: "https://zoom.us/j/123456789"
              };
              localStorage.setItem("partnerApplication", JSON.stringify(sabrinaApp));
              
              // Ensure she's in approved_partners
              const approvedStr = localStorage.getItem("approved_partners");
              const list = approvedStr ? JSON.parse(approvedStr) : [];
              const exists = list.some((p: any) => p.name === "Sabrina Carpenter" || p.id === "sabrina-carpenter");
              if (!exists) {
                const newPartner = {
                  id: "sabrina-carpenter",
                  name: "Sabrina Carpenter",
                  age: 27,
                  gender: "Female",
                  location: "New York, USA",
                  rating: 5,
                  verified: true,
                  distance: 0.5,
                  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
                  banner: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200",
                  bio: "Singer, songwriter, actress and your companion. Let's talk about music, films, and coffee.",
                  phoneCountryCode: "+1",
                  pricing: {
                    oneHour: 899,
                    twoHours: 1618,
                    threeHours: 2247,
                    fourHours: 2876,
                    fiveHours: 3596,
                    eightHours: 5394
                  },
                  tags: ["#Singer", "#Actor", "#Artist"],
                  interests: "Music, Pop, Travel",
                  languages: "English, French",
                  reviews: []
                };
                localStorage.setItem("approved_partners", JSON.stringify([newPartner, ...list]));
              }
              
              window.dispatchEvent(new Event("partnerStatusChange"));
              window.dispatchEvent(new Event("partner_profile_updated"));
              setIsLivePartner(true);
              setLoading(false);
              return;
            }
          }
        }

        const savedData = localStorage.getItem("partnerApplication");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED") {
            setIsLivePartner(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLivePartner(false);
      setLoading(false);
    };

    checkPartnerStatus();
  }, []);

  if (!mounted || loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !isLivePartner) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center px-4 bg-bg-base ${outfit.className}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-bg-card border border-border-main rounded-[36px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Accent glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary-dark/10 rounded-full blur-3xl" />
          
          <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
            <Lock size={36} className="animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-wider text-text-main mb-4">
            Access <span className="text-primary">Restricted</span>
          </h2>
          
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            This dashboard profile is only accessible to verified live partners. Please register or check your application status on the Become a Partner page.
          </p>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/become-a-partner"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-98"
            >
              <span>Become a Partner</span>
            </Link>
            
            <Link 
              href="/"
              className="w-full h-14 bg-bg-secondary border border-border-main text-text-main text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center hover:bg-bg-card transition-all"
            >
              <span>Go to Home Page</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
