"use client";

import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

type SliderProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  perView?: number;
  viewAllLink?: string;
};

export default function Slider<T>({
  items,
  renderItem,
  perView = 4,
  viewAllLink,
}: SliderProps<T>) {
  const [index, setIndex] = useState(0);
  const [currentPerView, setCurrentPerView] = useState(perView);
  const [isMounted, setIsMounted] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateSize = () => {
      const width = window.innerWidth;
      let newPerView = perView;
      if (width < 768) {
        newPerView = 1;
      } else if (width < 1024) {
        newPerView = 2;
      } else if (width < 1536) {
        newPerView = 3;
      } else {
        newPerView = perView;
      }
      setCurrentPerView(newPerView);

      setIndex((prevIndex) => {
        const totalItems = viewAllLink ? items.length + 1 : items.length;
        const maxIndex = Math.max(0, totalItems - newPerView);
        return Math.min(prevIndex, maxIndex);
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [perView, items.length, viewAllLink]);

  const totalSlots = viewAllLink ? items.length + 1 : items.length;
  const maxIndex = Math.max(0, totalSlots - currentPerView);

  const next = () => {
    if (index < maxIndex) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (!isMounted) return <div className="h-40 w-full" />; // Prevent hydration flash

  return (
    <div
      className="relative w-full overflow-visible"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => setShowArrows(true)}
    >
      {/* Viewport that clips the overflowing items */}
      <div className="overflow-hidden w-full relative py-4 px-1">
        {/* Dynamic Track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * (100 / currentPerView)}%)`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="shrink-0 flex justify-center px-2 md:px-4"
              style={{ width: `${100 / currentPerView}%` }}
            >
              {renderItem(item, i)}
            </div>
          ))}

          {/* View All Card - PREMIUM REBUILT UI */}
          {viewAllLink && (
            <div
              className="shrink-0 flex justify-center px-2 md:px-4"
              style={{ width: `${100 / currentPerView}%` }}
            >
              <Link
                href={viewAllLink}
                className="w-full h-full min-h-[460px] relative group overflow-hidden rounded-[36px] bg-bg-card border border-border-main transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.15)]"
              >
                {/* Dynamic Background Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated Radial Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-8">
                    {/* Glowing Ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-150 opacity-0 group-hover:opacity-100" />
                    
                    <div className="relative w-24 h-24 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-primary group-hover:to-primary-dark group-hover:border-primary-dark transition-all duration-500 group-hover:scale-110 shadow-lg">
                      <Eye className="w-10 h-10 text-primary-dark group-hover:text-white transition-colors duration-500" />
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 bg-primary-dark text-[10px] font-black text-white px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                      Explore
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-text-main mb-2 tracking-tight group-hover:text-primary transition-colors">
                    View All
                  </h3>
                  <p className="text-text-muted font-medium mb-8 max-w-[180px]">
                    Discover more amazing partners nearby
                  </p>

                  <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span>See Everyone</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-white/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-primary/5 to-transparent pointer-events-none" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Controls - Premium Glowing Style */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 left-2 md:-left-6 z-30 transition-all duration-500 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      >
        <button
          onClick={prev}
          className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-bg-card/80 backdrop-blur-md text-text-main rounded-full shadow-lg border border-border-main transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 disabled:opacity-0"
          disabled={index === 0}
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div
        className={`absolute top-1/2 -translate-y-1/2 right-2 md:-right-6 z-30 transition-all duration-500 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
      >
        <button
          onClick={next}
          className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-bg-card/80 backdrop-blur-md text-text-main rounded-full shadow-lg border border-border-main transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 disabled:opacity-0"
          disabled={index >= maxIndex}
        >
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
