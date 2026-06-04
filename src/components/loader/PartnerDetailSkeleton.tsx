"use client";

import PageHeaderAccent from "@/components/ui/PageHeaderAccent";
import Footer from "@/app/(main)/home-page/sections/Footer";

export default function PartnerDetailSkeleton() {
  return (
    <div className="flex flex-col gap-10 relative overflow-hidden bg-bg-base min-h-screen">
      <PageHeaderAccent />

      {/* ProfileMain Skeleton */}
      <section className="relative pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 px-4 overflow-hidden">
        <div className="max-w-[1250px] w-full mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
            
            {/* Left Column: Image placeholder */}
            <div className="lg:col-span-5 relative w-full aspect-4/5 max-h-[420px] md:max-h-[500px] lg:max-h-[520px] xl:max-h-[580px] rounded-[32px] overflow-hidden bg-bg-card border border-border-main/50 animate-pulse" />

            {/* Right Column: Content placeholder */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Category tag */}
              <div className="flex items-center gap-2">
                <div className="w-24 h-4 bg-bg-card rounded-md animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-border-main" />
                <div className="w-12 h-4 bg-bg-card rounded-md animate-pulse" />
              </div>

              {/* Title & Age */}
              <div className="space-y-3">
                <div className="w-3/5 h-12 md:h-16 bg-bg-card rounded-2xl animate-pulse" />
                <div className="w-20 h-1 bg-border-main rounded-full" />
              </div>

              {/* Bio description */}
              <div className="space-y-2 relative pl-3">
                <div className="absolute left-0 top-0 w-1 h-full bg-border-main rounded-full" />
                <div className="w-full h-5 bg-bg-card rounded-md animate-pulse" />
                <div className="w-11/12 h-5 bg-bg-card rounded-md animate-pulse" />
                <div className="w-4/5 h-5 bg-bg-card rounded-md animate-pulse" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-16 bg-bg-secondary border border-border-main rounded-[20px] animate-pulse" />
                <div className="h-16 bg-bg-secondary border border-border-main rounded-[20px] animate-pulse" />
                <div className="h-16 bg-bg-secondary border border-border-main rounded-[20px] sm:col-span-2 animate-pulse" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full pt-4">
                <div className="flex-[1.8] h-14 bg-bg-card border border-border-main rounded-2xl animate-pulse" />
                <div className="flex-1 h-14 bg-bg-secondary border border-border-main rounded-2xl animate-pulse" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Portfolio Gallery Skeleton */}
      <section className="py-16 md:py-20 px-4 bg-bg-secondary border-b border-border-main">
        <div className="max-w-[1000px] w-full mx-auto">
          <div className="flex flex-col items-center mb-10 space-y-3">
            <div className="w-48 h-8 bg-bg-card rounded-md animate-pulse" />
            <div className="w-16 h-1 bg-border-main rounded-full" />
          </div>

          {/* Gallery Editorial Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[180px]">
            {/* Featured Item */}
            <div className="col-span-2 row-span-2 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
            {/* Regular Items */}
            <div className="col-span-1 row-span-1 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
            <div className="col-span-1 row-span-1 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
            <div className="col-span-1 row-span-1 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
            <div className="col-span-1 row-span-1 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
            <div className="col-span-1 row-span-1 bg-bg-card border border-border-main rounded-2xl md:rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
