"use client";

import { motion } from "framer-motion";
import { Camera, Plus, X, Video as VideoIcon, Sparkles, Info } from "lucide-react";

interface MediaStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  onImageFileSelect: (file: File, type: "photo" | "banner") => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveGalleryPhoto: (index: number) => void;
  onVideoUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: (index: number) => void;
  errors?: Record<string, string>;
}

export default function MediaStep({
  formData,
  onChange,
  showErrors,
  onImageFileSelect,
  onGalleryUpload,
  onRemoveGalleryPhoto,
  onVideoUpload,
  onRemoveVideo,
  errors,
}: MediaStepProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "banner") => {
    const file = e.target.files?.[0];
    if (file) {
      onImageFileSelect(file, type);
    }
  };

  return (
    <div className="space-y-10">
      

      {/* Banner & Photo Upload Section */}
      <div className="space-y-6">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Profile Visuals
        </label>
        
        {/* Banner Upload */}
        <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden border-2 border-dashed border-primary/30 bg-bg-secondary/40 backdrop-blur-xl hover:border-primary/60 transition-all duration-500 group/banner">
          {formData.banner ? (
            <div className="w-full h-full relative">
              <img
                src={formData.banner}
                alt="Profile Banner"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover/banner:bg-black/35 transition-colors" />
              <button
                type="button"
                onClick={() => onChange({ banner: null })}
                className="absolute cursor-pointer top-4 right-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-20 hover:scale-110 transition-all duration-300"
                title="Remove Banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group/add transition-all duration-500 hover:bg-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-700 group-hover/add:scale-110">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted group-hover/add:text-primary">
                Upload Profile Banner
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "banner")}
              />
            </label>
          )}
        </div>

        {/* Profile Photo Overlapping */}
        <div className="flex justify-center -mt-20 md:-mt-24 relative z-20">
          <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-[4px] border-bg-base border-dashed flex items-center justify-center bg-bg-base shrink-0 group transition-all duration-500 ${showErrors && !formData.photo ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse" : "border-primary/50 hover:border-primary"}`}>
            {!formData.photo && (
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "photo")}
              />
            )}

            <div className="w-[90%] h-[90%] rounded-full bg-linear-to-b from-primary/10 to-accent/5 flex items-center justify-center overflow-hidden relative hover:from-primary/20 hover:to-accent/15 transition-all shadow-[inset_0_0_30px_rgba(var(--primary-rgb),0.2)] group-hover:scale-105 duration-500">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              ) : (
                <Camera className="w-8 h-8 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
              )}
            </div>

            {/* Plus Badge */}
            {!formData.photo && (
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-linear-to-r from-primary-dark to-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-4 border-bg-base z-10 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Plus className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Remove Image Badge */}
            {formData.photo && (
              <button
                type="button"
                onClick={() => onChange({ photo: null })}
                className="absolute cursor-pointer top-0 right-0 w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-4 border-bg-base z-20 hover:scale-110 transition-all duration-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Upload */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
            Partner Gallery <span className="text-text-muted text-[10px] font-normal tracking-normal italic ml-2">(Min 3 photos required)</span>
          </label>
          {showErrors && errors?.gallery && (
            <p className="text-red-500 text-xs ml-1 font-semibold">
              {errors.gallery}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {/* Render existing gallery images */}
          {(formData.gallery || []).filter(Boolean).map((photo: string, index: number) => (
            <motion.div
              key={index}
              className="relative aspect-square rounded-[32px] overflow-hidden border-2 border-white/5 bg-bg-secondary/40 backdrop-blur-xl hover:border-primary/40 hover:shadow-primary/20 transition-all duration-700 group"
            >
              <div className="w-full h-full group/photo relative">
                <img
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/photo:bg-black/40 transition-colors duration-500" />
                <button
                  type="button"
                  onClick={() => onRemoveGalleryPhoto(index)}
                  className="absolute cursor-pointer top-3 right-3 w-10 h-10 bg-accent/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-10 transition-all duration-300 hover:bg-accent hover:scale-110 hover:-rotate-12"
                  title="Remove photo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add Photo Slot (always available for unlimited uploads) */}
          <motion.div
            className={`relative aspect-square rounded-[32px] overflow-hidden border-2 border-dashed transition-all duration-700 group ${
              showErrors && (formData.gallery || []).length < 3 
                ? "border-red-500/50 bg-red-500/5 animate-pulse" 
                : "border-primary/30 bg-bg-secondary/20 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group/add transition-all duration-500">
              <div className="w-14 h-14 rounded-[20px] bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-700 group-hover/add:rotate-90 group-hover/add:scale-110">
                <Plus className="w-6 h-6 text-primary group-hover/add:text-accent" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover/add:text-primary">
                  Add Photos
                </span>
                {(formData.gallery || []).length < 3 && (
                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider">
                    {3 - (formData.gallery || []).length} more required
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onGalleryUpload}
              />
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover/add:opacity-100 transition-opacity duration-700" />
            </label>
          </motion.div>
        </div>
      </div>

      {/* Video Portfolio */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Video Introductions <span className="text-text-muted text-[10px] font-normal tracking-normal italic ml-2">(Optional - Upload up to 3 intro videos)</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(formData.videos || Array(3).fill(null)).map((video: string | null, index: number) => {
            const videoTypes = [
              { title: "Introduction Reel", desc: "Personal greeting & introduction" },
              { title: "Portfolio Vibe", desc: "Showcase hobbies, style & vibe" },
              { title: "Q&A Session", desc: "Answers to common questions" }
            ];
            const currentType = videoTypes[index] || { title: `Video ${index + 1}`, desc: "Optional video clip" };

            return (
              <motion.div
                key={index}
                className={`relative aspect-video rounded-[32px] overflow-hidden border-2 transition-all duration-700 group backdrop-blur-xl ${
                  video 
                    ? "border-white/5 bg-bg-secondary/40 hover:border-primary/40" 
                    : "border-dashed border-primary/30 bg-bg-secondary/20 hover:border-primary hover:bg-primary/5"
                }`}
              >
                {video ? (
                  <div className="w-full h-full group/video relative bg-black">
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-4 flex items-center justify-between opacity-100 group-hover/video:opacity-0 transition-opacity duration-300 pointer-events-none">
                      <span className="text-white text-xs font-bold">{currentType.title}</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <VideoIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveVideo(index)}
                      className="absolute cursor-pointer top-3 right-3 w-10 h-10 bg-accent/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-10 transition-all duration-300 hover:bg-accent hover:scale-110 hover:-rotate-12"
                      title="Remove video"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group/add transition-all duration-500 hover:bg-primary/5 min-h-[160px] p-4 text-center">
                    <div className="w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-700 group-hover/add:rotate-90 group-hover/add:scale-110 bg-primary/10 border border-primary/20">
                      <VideoIcon className="w-6 h-6 text-primary group-hover/add:text-accent" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main group-hover/add:text-primary">
                        {currentType.title}
                      </span>
                      <span className="text-[9px] text-text-muted/70 block mt-0.5 max-w-[200px] mx-auto font-medium">
                        {currentType.desc}
                      </span>
                      <span className="text-[8px] text-primary/80 font-bold uppercase tracking-wider mt-1">Max size: 15MB</span>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => onVideoUpload(index, e)}
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover/add:opacity-100 transition-opacity duration-700" />
                  </label>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Approval Guidelines */}
      <div className="p-6 rounded-[28px] border border-primary/20 bg-primary/5 dark:bg-primary/5 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse" /> Media Upload Guidelines (Avoid Rejection)
        </h3>
        <p className="text-xs text-text-muted leading-relaxed mb-4">
          To ensure your partner profile is approved quickly by our moderation team, please follow these visual guidelines carefully:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-primary font-bold text-sm">1.</span>
              <div>
                <strong className="text-text-main block mb-0.5">Profile Photo</strong>
                <span className="text-text-muted/80 leading-relaxed block">
                  Well-lit, high-resolution portrait. Face must be fully visible and centered. Avoid sunglasses, hats, masks, or extreme filters.
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-primary font-bold text-sm">2.</span>
              <div>
                <strong className="text-text-main block mb-0.5">Profile Banner</strong>
                <span className="text-text-muted/80 leading-relaxed block">
                  Use landscape orientation. Scenic, aesthetic background or premium texture images work best. Avoid promotional text, contact numbers, or pixelated files.
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-primary font-bold text-sm">3.</span>
              <div>
                <strong className="text-text-main block mb-0.5">Gallery (Min 3 Photos)</strong>
                <span className="text-text-muted/80 leading-relaxed block">
                  Lifestyle, portfolio, or activity shots. Do not upload duplicates, blurry shots, screenshots of chats, or generic stock graphics.
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-primary font-bold text-sm">4.</span>
              <div>
                <strong className="text-text-main block mb-0.5">Video Reels</strong>
                <span className="text-text-muted/80 leading-relaxed block">
                  Clear audio, steady camera work, and under 15MB each. Record in vertical (portrait) orientation for intro, vibe, and Q&A clips.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
