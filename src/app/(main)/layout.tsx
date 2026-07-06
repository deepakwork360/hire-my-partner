"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import ActiveMeetingWidget from "@/components/ActiveMeetingWidget/ActiveMeetingWidget";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isLivePartner, setIsLivePartner] = useState(false);

  const storageKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";

  useEffect(() => {
    setMounted(true);

    const checkPartnerStatus = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          const fd = parsed.formData || {};
          
          if (fd.photo) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser && currentUser.avatar !== fd.photo) {
              useAuthStore.getState().updateUserAvatar(fd.photo);
            }
          }

          if (parsed.verificationStatus === "VERIFIED") {
            setIsLivePartner(true);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLivePartner(false);
    };

    checkPartnerStatus();
    window.addEventListener("storage", checkPartnerStatus);
    window.addEventListener("partnerStatusChange", checkPartnerStatus);

    return () => {
      window.removeEventListener("storage", checkPartnerStatus);
      window.removeEventListener("partnerStatusChange", checkPartnerStatus);
    };
  }, [storageKey]);

  const dashboardTabs = [
    "/my-booking",
    "/my-earning",
    "/viewed-profile",
    "/showed-interest"
  ];

  const showGlobalDashboard = mounted && !dashboardTabs.includes(pathname);

  return (
    <>
      <Navbar />
      {showGlobalDashboard && <SideDashboard />}
      <main className="flex-1">{children}</main>
      <ActiveMeetingWidget />
    </>
  );
}



