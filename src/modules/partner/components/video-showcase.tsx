"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Play, X, Volume2, VolumeX } from "lucide-react";
import LazyVideo from "@/components/common/lazy-video";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface VideoShowcaseProps {
  videos?: string[];
}

const DEFAULT_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-light-12407-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-and-looking-at-camera-42289-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-eyeglasses-smiling-41764-large.mp4"
];

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Filter out empty/null/undefined items
  const validVideos = (videos || []).filter(Boolean);

  // If no videos are uploaded, do not render the section
  if (validVideos.length === 0) {
    return null;
  }

  const displayVideos = validVideos.slice(0, 3);

  const CLIP_DETAILS = [
    {
      title: "Introduction Reel",
      desc: "A warm personal greeting and introduction clip."
    },
    {
      title: "Portfolio Vibe",
      desc: "A look into my hobbies, personality, and styling."
    },
    {
      title: "Quick Q&A Session",
      desc: "Answering favorite topics and standard questions."
    }
  ];

  return (
    <section className={`py-16 md:py-24 px-4 bg-bg-base border-b border-border-main relative overflow-hidden ${outfit.className}`}>
      {/* Cinematic top radial ambient light reflecting theme rgb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-primary/5 via-accent/2 to-transparent blur-[100px] pointer-events-none" />

      {/* Modern abstract geometric visual grid lines for tech-luxury feel */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-[1250px] w-full mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-primary bg-primary/10 px-5 py-2 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Media Showcase
          </span>
          <h2 className={`${rochester.className} text-6xl md:text-7xl text-text-main mt-5 mb-4 tracking-wide`}>
            Video Introductions
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Get to know them better. Watch high-definition introductions, portfolio reels, and personal greetings.
          </p>
        </motion.div>

        {/* Video Card Grid - Adaptively scales based on video count */}
        <div className={`grid grid-cols-1 ${
          displayVideos.length === 3 
            ? "md:grid-cols-3" 
            : displayVideos.length === 2 
              ? "md:grid-cols-2 max-w-4xl" 
              : "max-w-2xl"
        } gap-8 mx-auto`}>
          {displayVideos.map((url, idx) => {
            const details = CLIP_DETAILS[idx] || { title: "Companion Clip", desc: "Short video overview." };
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
                onClick={() => setSelectedVideo(url)}
                className="relative aspect-video rounded-[36px] overflow-hidden bg-bg-card border border-white/5 hover:border-primary/45 cursor-pointer shadow-[0_30px_60px_rgba(0,0,0,0.4)] group transition-all duration-500 hover:shadow-[0_40px_80px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1"
              >
                {/* Glow border overlay */}
                <div className="absolute inset-0 z-20 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.06)] group-hover:shadow-[inset_0_0_0_2px_rgba(var(--primary-rgb),0.5)] transition-all duration-500 rounded-[36px]" />

                {/* Video Tag with autoplay preview on hover */}
                <LazyVideo
                  src={url}
                  className="grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  autoPlay={false}
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />

                {/* Premium Dark Gradient Overlay & Glassmorphic Details Panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/98 transition-colors duration-500 flex flex-col justify-end p-6 z-10">
                  {/* Sliding wrapper */}
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-0 w-full">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <h3 className="text-primary! text-lg font-black tracking-wide leading-tight group-hover:text-primary! transition-colors" style={{ color: "white" }}>
                        {details.title}
                      </h3>
                      
                      {/* Interactive Play Circle Trigger */}
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary shadow-2xl transition-all duration-500 shrink-0 group-hover:rotate-6">
                        <Play className="w-4.5 h-4.5 text-white fill-white translate-x-0.5 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    {/* Height animated description */}
                    <div className="max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out">
                      <p className="text-white/60 text-xs font-semibold max-w-[85%] leading-relaxed pt-0.5">
                        {details.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ambient glow underneath hover */}
                <div className="absolute -inset-10 bg-radial-gradient from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl -z-10" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Immersive Cinematic Lightbox Video Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050506]/98 backdrop-blur-xl cursor-default p-4 md:p-8"
          >
            {/* Real-time ambient backdrop glow (Ambilight effect) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 select-none">
              <video
                src={selectedVideo}
                className="hidden md:block w-full h-full object-cover filter blur-[40px] scale-125 translate-z-0 will-change-[filter,transform]"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-[#050506]/60 backdrop-blur-[20px]" />
            </div>

            {/* Backdrop click zone to close */}
            <div className="absolute inset-0 z-10 cursor-zoom-out" onClick={() => setSelectedVideo(null)} />

            {/* Controls panel top-bar */}
            <div className="fixed top-6 right-6 md:top-8 md:right-8 z-30 flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all duration-300 shadow-2xl backdrop-blur-md active:scale-95"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-12 h-12 cursor-pointer rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-all duration-300 group shadow-2xl backdrop-blur-md active:scale-95"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Cinema Video Frame Wrapper */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="relative z-20 w-full max-w-5xl aspect-video rounded-[36px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(var(--primary-rgb),0.35)] bg-black"
            >
              <video
                src={selectedVideo}
                className="w-full h-full object-contain"
                autoPlay
                controls
                muted={isMuted}
                playsInline
                loop
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
