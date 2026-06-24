"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, X, ShieldAlert, Play, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/toastStore";
import Image from "next/image";

interface Review {
  id: string;
  partnerId: string;
  partnerName: string;
  bookingId: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  videoUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  verified: boolean;
  date: string;
  rejectionReason?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [rejectingReviewId, setRejectingReviewId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const loadReviews = () => {
    try {
      const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
      if (savedGlobal) {
        setReviews(JSON.parse(savedGlobal));
      } else {
        setReviews([]);
      }
    } catch (e) {
      console.error("Failed to load reviews in Admin", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadReviews();

    const handleReviewsUpdate = () => {
      loadReviews();
    };

    window.addEventListener("reviews_updated", handleReviewsUpdate);
    return () => window.removeEventListener("reviews_updated", handleReviewsUpdate);
  }, []);

  const handleApprove = (reviewId: string) => {
    try {
      const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
      if (savedGlobal) {
        const list: Review[] = JSON.parse(savedGlobal);
        const updated = list.map((r) => {
          if (r.id === reviewId) {
            return { ...r, status: "APPROVED" as const };
          }
          return r;
        });
        localStorage.setItem("hire_my_partner_reviews", JSON.stringify(updated));
        setReviews(updated);
        window.dispatchEvent(new Event("reviews_updated"));
        toast.success("Review has been approved and is now live!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve review.");
    }
  };

  const handleReject = (reviewId: string, reason: string) => {
    try {
      const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
      if (savedGlobal) {
        const list: Review[] = JSON.parse(savedGlobal);
        const updated = list.map((r) => {
          if (r.id === reviewId) {
            return { 
              ...r, 
              status: "REJECTED" as const,
              rejectionReason: reason || "Does not comply with community guidelines."
            };
          }
          return r;
        });
        localStorage.setItem("hire_my_partner_reviews", JSON.stringify(updated));
        setReviews(updated);
        window.dispatchEvent(new Event("reviews_updated"));
        toast.success("Review has been rejected.");
        setRejectingReviewId(null);
        setRejectionReasonInput("");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject review.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingReviews = reviews.filter((r) => r.status === "PENDING");

  return (
    <div className="min-h-screen bg-bg-main pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-main pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-black uppercase tracking-wider text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-4xl font-extrabold text-text-main tracking-tight font-outfit">
              Review Moderation
            </h1>
            <p className="text-sm text-text-muted mt-2">
              Approve or reject customer reviews submitted for completed bookings.
            </p>
          </div>
          <div className="bg-bg-card border border-border-main rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-text-main">{pendingReviews.length}</div>
              <div className="text-[10px] font-black uppercase tracking-wider text-text-muted">Pending Reviews</div>
            </div>
          </div>
        </div>

        {/* Reviews content */}
        <AnimatePresence mode="popLayout">
          {pendingReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-bg-card border border-border-main rounded-3xl p-12 text-center shadow-xl shadow-black/5 max-w-xl mx-auto mt-8"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2 font-outfit">All Clean!</h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
                There are no pending reviews requiring moderation at the moment. Excellent work!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layoutId={review.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-bg-card border border-border-main rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-black/5 hover:border-primary/20 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Premium background shine */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />

                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border-main shrink-0">
                          <Image
                            src={review.image}
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-main leading-tight flex items-center gap-1.5">
                            {review.name}
                            {review.verified && (
                              <span className="inline-flex items-center justify-center bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full text-[8px] px-1.5 py-0.2 font-black uppercase tracking-wider">
                                Verified
                              </span>
                            )}
                          </h3>
                          <p className="text-[10px] font-black uppercase tracking-wider text-text-muted mt-0.5">
                            {review.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider text-text-muted block">
                          Reviewing Partner
                        </span>
                        <span className="text-xs font-bold text-primary block mt-0.5">
                          {review.partnerName}
                        </span>
                      </div>
                    </div>

                    {/* Rating and Date */}
                    <div className="flex items-center justify-between gap-4 mb-4 bg-bg-secondary/60 rounded-xl px-4 py-2 border border-border-main/50">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.4)]"
                                : "text-border-main"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-text-muted font-medium">{review.date}</span>
                    </div>

                    {/* Review text */}
                    <p className="text-text-muted text-sm leading-relaxed mb-6 italic">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    {/* Video review placeholder / preview if present */}
                    {review.videoUrl && (
                      <div className="mb-6">
                        <button
                          onClick={() => review.videoUrl && setActiveVideoUrl(review.videoUrl)}
                          className="w-full h-36 bg-neutral-900 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center group cursor-pointer"
                        >
                          <video
                            src={review.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                          <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white translate-x-0.5" />
                          </div>
                          <span className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-black uppercase text-white tracking-widest border border-white/10">
                            Video Review
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-border-main/50 pt-4 mt-auto">
                    <button
                      onClick={() => setRejectingReviewId(review.id)}
                      className="flex-1 py-3 px-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-rose-500/5 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex-1 py-3 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden max-w-2xl w-full aspect-video relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <video src={activeVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {rejectingReviewId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => {
              setRejectingReviewId(null);
              setRejectionReasonInput("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-bg-base border border-border-main rounded-[32px] w-full max-w-md overflow-hidden p-6 md:p-8 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setRejectingReviewId(null);
                  setRejectionReasonInput("");
                }}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main leading-tight font-outfit">
                    Reject Review
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted mt-0.5">
                    Specify Rejection Reason
                  </p>
                </div>
              </div>

              {/* Predefined Tags */}
              <div className="space-y-3 mb-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block">
                  Quick Select Reason
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Inappropriate video content",
                    "Inappropriate or abusive language",
                    "Spam or fake review",
                    "Off-topic feedback",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRejectionReasonInput(tag)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        rejectionReasonInput === tag
                          ? "bg-rose-500/10 border-rose-500 text-rose-500"
                          : "bg-bg-secondary border-border-main text-text-muted hover:text-text-main hover:border-border-main/80"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted block">
                  Custom Rejection Reason
                </label>
                <textarea
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Explain why this review is being rejected..."
                  rows={3}
                  className="w-full p-4 bg-bg-secondary border border-border-main rounded-2xl text-xs font-bold text-text-main focus:outline-none focus:border-rose-500/50 transition-all resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingReviewId(null);
                    setRejectionReasonInput("");
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-border-main bg-bg-secondary text-text-muted hover:text-text-main text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(rejectingReviewId, rejectionReasonInput)}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/20 transition-colors cursor-pointer"
                >
                  Reject Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
