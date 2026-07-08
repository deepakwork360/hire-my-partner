"use client";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export default function ProfileCardSkeleton() {
  return (
    <div
      className={`relative flex flex-col bg-bg-base overflow-hidden border border-border-main animate-pulse ${outfit.className}`}
      style={{
        borderRadius: "36px",
        width: "328px",
        height: "510px",
        boxShadow: "0 15px 40px -20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(var(--primary-rgb), 0.05)",
      }}
    >
      {/* Premium Shimmer Overlay */}
      <div
        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 dark:via-white/5 to-transparent animate-shine z-10"
        style={{ animationDuration: "1.8s" }}
      />

      {/* Photo Container Skeleton */}
      <div className="relative w-full shrink-0 p-4" style={{ height: "256px" }}>
        <div className="w-full h-full rounded-[28px] bg-bg-skeleton" />
        
        {/* Rating Badge Skeleton */}
        <div className="absolute top-6 right-6 w-14 h-6 rounded-full bg-bg-skeleton-strong" />

        {/* Rate Badge Skeleton */}
        <div className="absolute top-6 left-6 w-20 h-6 rounded-full bg-bg-skeleton-strong" />
      </div>

      {/* Content Skeleton */}
      <div className="px-6 py-4 flex flex-col gap-3 grow">
        <div className="flex items-end gap-2 mb-1">
          {/* Name skeleton */}
          <div className="h-7 w-32 rounded-lg bg-bg-skeleton-strong" />
          {/* Age skeleton */}
          <div className="h-4 w-8 rounded-md bg-bg-skeleton" />
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-bg-skeleton-strong" />
          <div className="h-3 w-24 rounded bg-bg-skeleton" />
        </div>

        {/* Bio skeleton */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-3.5 w-full rounded bg-bg-skeleton" />
          <div className="h-3.5 w-4/5 rounded bg-bg-skeleton" />
        </div>

        {/* Distance / Confirmation line */}
        <div className="flex items-center justify-between mt-auto pt-2 w-full">
          <div className="w-24 h-5 rounded-full bg-bg-skeleton" />
          <div className="w-16 h-3 rounded bg-bg-skeleton" />
        </div>
      </div>

      {/* Footer / Buttons Skeleton */}
      <div className="px-6 pb-6 pt-2 mt-auto flex flex-col grow-0">
        <div className="flex items-center gap-2">
          {/* Main button */}
          <div className="h-12 flex-1 rounded-2xl bg-bg-skeleton-strong" />
          {/* View icon */}
          <div className="h-12 w-12 rounded-2xl bg-bg-skeleton shrink-0" />
        </div>
      </div>
    </div>
  );
}
