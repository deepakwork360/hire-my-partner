"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  poster?: string;
  autoPlay?: boolean;
  preload?: "none" | "metadata" | "auto";
  onMouseEnter?: (e: React.MouseEvent<HTMLVideoElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

export default function LazyVideo({
  src,
  className = "",
  muted = true,
  loop = true,
  playsInline = true,
  poster,
  autoPlay = true,
  preload,
  onMouseEnter,
  onMouseLeave,
}: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Default preload to "metadata" to ensure the browser loads the first frame as a thumbnail.
  const resolvedPreload = preload || "metadata";

  // Local blob URLs do not support media fragments (like #t=0.1) and will break if appended.
  // Remote URLs require #t=0.1 to force-render the first frame as a thumbnail.
  const resolvedSrc = src.startsWith("blob:") || src.includes("#")
    ? src
    : `${src}#t=0.1`;

  useEffect(() => {
    // 1. Set a delayed timeout to load the video when the browser is idle (after 2 seconds)
    const idleTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const container = containerRef.current;
    if (!container) return;

    // 2. Load immediately if it scrolls into view sooner
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Prevent further unmount/remount cycles during scroll
        }
      },
      {
        rootMargin: "250px", // Trigger slightly before coming into viewport
        threshold: 0.01,
      }
    );

    observer.observe(container);
    return () => {
      clearTimeout(idleTimeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      if (autoPlay) {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isVisible, autoPlay]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {isVisible ? (
        <video
          ref={videoRef}
          src={resolvedSrc}
          className="w-full h-full object-cover"
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          poster={poster}
          preload={resolvedPreload}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      ) : (
        // Render a placeholder matching the video background color for a premium feel
        <div className="w-full h-full bg-black/40 animate-pulse" />
      )}
    </div>
  );
}
