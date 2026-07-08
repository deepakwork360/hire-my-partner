"use client";

import { Outfit } from "next/font/google";
import { Star } from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

interface PricingCardSkeletonProps {
  popular?: boolean;
}

export default function PricingCardSkeleton({ popular = false }: PricingCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col relative h-full group ${
        popular ? "lg:-translate-y-8 lg:z-20" : "lg:z-10"
      } ${outfit.className}`}
    >
      {/* Most Popular Ribbon Skeleton */}
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-bg-skeleton-strong dark:bg-slate-800 text-transparent text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Star className="w-3 h-3 text-black/30 dark:text-slate-600 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`flex-1 rounded-[40px] p-8 md:p-10 flex flex-col h-full bg-bg-card border relative overflow-hidden animate-pulse ${
          popular
            ? "border-primary/30 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
            : "border-border-main shadow-xl shadow-black/5"
        }`}
      >
        {/* Shimmer Overlay */}
        <div
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 dark:via-white/5 to-transparent animate-shine z-10"
          style={{ animationDuration: "1.8s" }}
        />

        {/* Plan Header Skeleton */}
        <div className="mb-8 relative z-0">
          <div className="flex items-center justify-between mb-6">
            {/* Icon Wrapper Skeleton */}
            <div className="w-[48px] h-[48px] rounded-2xl bg-bg-skeleton shrink-0" />
            {/* Plan Name Skeleton */}
            <div className="h-4 w-16 rounded bg-bg-skeleton-strong" />
          </div>

          {/* Pricing Text Skeleton */}
          <div className="flex items-end gap-1.5 mb-4">
            <div className="h-12 w-28 rounded-xl bg-bg-skeleton-strong" />
            <div className="h-4 w-12 rounded bg-bg-skeleton mb-1" />
          </div>

          {/* Description Lines Skeletons */}
          <div className="space-y-2 mt-4">
            <div className="h-3 w-full rounded bg-bg-skeleton" />
            <div className="h-3 w-4/5 rounded bg-bg-skeleton" />
          </div>
        </div>

        {/* Features List Skeletons */}
        <div className="space-y-4 mb-10 flex-1">
          {[
            { width: "w-32" },
            { width: "w-44" },
            { width: "w-36" },
            { width: "w-40" },
            { width: "w-28" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* Check Icon Circular Placeholder */}
              <div className="w-5 h-5 rounded-full bg-bg-skeleton-strong shrink-0" />
              {/* Text Placeholder */}
              <div className={`h-3 rounded bg-bg-skeleton ${item.width}`} />
            </div>
          ))}
        </div>

        {/* CTA Buttons Skeletons */}
        <div className="space-y-3">
          {/* Main Huge CTA Button */}
          <div className="w-full h-[60px] rounded-[24px] bg-bg-skeleton-strong" />

          {/* Popular subtext Trial option */}
          {popular && (
            <div className="w-32 h-3.5 mx-auto rounded bg-bg-skeleton" />
          )}
        </div>
      </div>
    </div>
  );
}
