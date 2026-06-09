"use client";

import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
  const [isDraggingState, setIsDraggingState] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);

  // Interaction tracking state using refs to keep sliding 60fps buttery smooth
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const hasDragged = useRef(false);
  const isSwipeDirectionDetermined = useRef(false);
  const isHorizontalSwipe = useRef(false);

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

  // Helper to translate the track directly in pixels during drag for optimal performance
  const updateDragTransform = (deltaX: number) => {
    if (!trackRef.current || containerWidth.current === 0) return;
    const baseOffset = -index * (containerWidth.current / currentPerView);

    // Apply smooth rubber band resistance past boundaries
    let finalDeltaX = deltaX;
    if (index === 0 && deltaX > 0) {
      finalDeltaX = deltaX * 0.3;
    } else if (index >= maxIndex && deltaX < 0) {
      finalDeltaX = deltaX * 0.3;
    }

    const translatePx = baseOffset + finalDeltaX;
    trackRef.current.style.transform = `translateX(${translatePx}px)`;
  };

  // --- MOUSE DRAG EVENT HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only support dragging with primary/left click
    if (e.button !== 0) return;

    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
    hasDragged.current = false;

    if (trackRef.current) {
      containerWidth.current = trackRef.current.offsetWidth;
    }
    setIsDraggingState(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    // Safety net: if left mouse button is released outside window/view, abort drag gracefully
    if (e.buttons === 0 || (e.buttons & 1) === 0) {
      handleMouseUp(e);
      return;
    }

    const deltaX = e.clientX - startX.current;
    currentX.current = e.clientX;

    if (Math.abs(deltaX) > 8) {
      hasDragged.current = true;
    }

    updateDragTransform(deltaX);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    setIsDraggingState(false);

    const deltaX = e.clientX - startX.current;

    if (hasDragged.current && containerWidth.current > 0) {
      const cardWidth = containerWidth.current / currentPerView;
      const deltaIndex = deltaX / cardWidth;
      const roundedDiff = Math.round(deltaIndex);
      const threshold = cardWidth * 0.2;

      let newIndex = index;
      if (Math.abs(roundedDiff) >= 1) {
        newIndex = index - roundedDiff;
      } else {
        if (deltaX < -threshold) {
          newIndex = index + 1;
        } else if (deltaX > threshold) {
          newIndex = index - 1;
        }
      }

      newIndex = Math.max(0, Math.min(newIndex, maxIndex));

      if (newIndex === index) {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${index * (100 / currentPerView)}%)`;
        }
      } else {
        setIndex(newIndex);
      }
    }
  };

  // --- MOBILE TOUCH SWIPE EVENT HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = e.touches[0].clientX;
    hasDragged.current = false;
    isSwipeDirectionDetermined.current = false;
    isHorizontalSwipe.current = false;

    if (trackRef.current) {
      containerWidth.current = trackRef.current.offsetWidth;
    }
    setIsDraggingState(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaX = e.touches[0].clientX - startX.current;
    const deltaY = e.touches[0].clientY - startY.current;
    currentX.current = e.touches[0].clientX;

    // Determine lock direction on first slight movement to prevent hijacking native vertical page scroll
    if (!isSwipeDirectionDetermined.current) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isSwipeDirectionDetermined.current = true;
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipe.current) {
      // Prevent browser pull-to-refresh or page bounces horizontally
      if (e.cancelable) {
        e.preventDefault();
      }
      hasDragged.current = true;
      updateDragTransform(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    setIsDraggingState(false);

    const deltaX = currentX.current - startX.current;

    if (hasDragged.current && isHorizontalSwipe.current && containerWidth.current > 0) {
      const cardWidth = containerWidth.current / currentPerView;
      const deltaIndex = deltaX / cardWidth;
      const roundedDiff = Math.round(deltaIndex);
      const threshold = cardWidth * 0.2;

      let newIndex = index;
      if (Math.abs(roundedDiff) >= 1) {
        newIndex = index - roundedDiff;
      } else {
        if (deltaX < -threshold) {
          newIndex = index + 1;
        } else if (deltaX > threshold) {
          newIndex = index - 1;
        }
      }

      newIndex = Math.max(0, Math.min(newIndex, maxIndex));

      if (newIndex === index) {
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${index * (100 / currentPerView)}%)`;
        }
      } else {
        setIndex(newIndex);
      }
    }
  };

  // --- PREVENT ACCIDENTAL CARD CLICKS DURING SWIPE ---
  const handleCaptureClick = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      // Clear flag after event loop finishes to allow subsequent clean clicks
      setTimeout(() => {
        hasDragged.current = false;
      }, 0);
    }
  };

  if (!isMounted) return <div className="h-40 w-full" />; // Prevent hydration flash

  return (
    <div
      className="relative w-full overflow-visible"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => {
        setShowArrows(true);
      }}
    >
      {/* Viewport that clips the overflowing items */}
      <div 
        className="overflow-hidden w-full relative py-4 px-1 touch-pan-y select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClickCapture={handleCaptureClick}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Dynamic Track */}
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(-${index * (100 / currentPerView)}%)`,
            transition: isDraggingState ? "none" : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="shrink-0 flex justify-center px-2 md:px-4 select-none pointer-events-auto"
              style={{ width: `${100 / currentPerView}%` }}
            >
              {renderItem(item, i)}
            </div>
          ))}

          {/* View All Card - PREMIUM REBUILT UI */}
          {viewAllLink && (
            <div
              className="shrink-0 flex justify-center px-2 md:px-4 select-none pointer-events-auto"
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
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 z-30 transition-all duration-500 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      >
        <button
          onClick={prev}
          className="w-14 cursor-pointer h-14 flex items-center justify-center bg-bg-card/80 backdrop-blur-md text-text-main rounded-full shadow-lg border border-border-main transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 disabled:opacity-0"
          disabled={index === 0}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 z-30 transition-all duration-500 ${showArrows ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
      >
        <button
          onClick={next}
          className="w-14 cursor-pointer h-14 flex items-center justify-center bg-bg-card/80 backdrop-blur-md text-text-main rounded-full shadow-lg border border-border-main transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-95 disabled:opacity-0"
          disabled={index >= maxIndex}
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination dots for mobile/touch screens */}
      {maxIndex > 0 && (
        <div className="flex md:hidden justify-center items-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === i 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-text-muted/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
