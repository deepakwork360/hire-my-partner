import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
