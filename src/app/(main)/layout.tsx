import Navbar from "@/components/Navbar/Navbar";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}
