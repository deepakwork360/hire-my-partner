"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Play, X, Volume2, VolumeX } from "lucide-react";

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

  // If no videos are provided or the list is empty, fallback to DEFAULT_VIDEOS
  const displayVideos = (videos && videos.length > 0 ? videos : DEFAULT_VIDEOS).slice(0, 3);

  return (
    <section className={`py-12 md:py-16 px-4 bg-bg-base border-b border-border-main relative overflow-hidden ${outfit.className}`}>
      {/* Decorative luxury gradient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1250px] w-full mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            Showcase
          </span>
          <h2 className={`${rochester.className} text-5xl md:text-6xl text-text-main mt-4 mb-3`}>
            Video Introductions
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto font-medium">
            Get to know them better. Watch high-definition introductions, portfolio reels, and personal greetings.
          </p>
        </motion.div>

        {/* Video Card Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${displayVideos.length} gap-6 md:gap-8 max-w-5xl mx-auto`}>
          {displayVideos.map((url, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedVideo(url)}
              className="relative aspect-video rounded-[32px] overflow-hidden bg-bg-card border border-border-main/60 hover:border-primary/40 cursor-pointer shadow-2xl group"
            >
              {/* Inner card glow border */}
              <div className="absolute inset-0 z-20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] group-hover:shadow-[inset_0_0_0_2px_rgba(var(--primary-rgb),0.4)] transition-shadow duration-500 rounded-[32px]" />

              {/* Dynamic hover state video preview */}
              <video
                src={url}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                preload="metadata"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />

              {/* Glassmorphic Play Trigger Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-4 z-10">
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl relative group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-500"
                >
                  {/* Pulsing ring around the play button */}
                  <span className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-0 group-hover:opacity-100 duration-1000" />
                  <Play className="w-6 h-6 text-white fill-white translate-x-0.5 group-hover:text-primary group-hover:fill-primary transition-colors duration-300" />
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-primary transition-colors duration-300">
                  Intro Clip {idx + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Immersive Glassmorphic Lightbox Video Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-2000 flex items-center justify-center bg-[#070708]/95 backdrop-blur-md cursor-default p-4"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0 z-0" onClick={() => setSelectedVideo(null)} />

            {/* Controls panel top-bar */}
            <div className="fixed top-6 right-6 md:top-10 md:right-10 z-2100 flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all duration-300 shadow-2xl backdrop-blur-xl"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 flex items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl"
              >
                <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            {/* Premium Video Frame Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-[95vw] md:max-w-4xl aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] bg-black"
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
