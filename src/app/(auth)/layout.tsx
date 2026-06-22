import React from "react";
import Navbar from "@/components/Navbar/Navbar";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col pt-[90px] md:pt-[110px] auth-container">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
