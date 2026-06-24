"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Review } from "../types/partner.types";
import Image from "next/image";
import { Rochester, Outfit } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Eye, ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/components/ui/toastStore";
import LazyVideo from "@/components/common/lazy-video";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const defaultReviews = [
  {
    id: 1,
    name: "Rohit",
    role: "User",
    text: "She made my sister's wedding feel so special. Everyone thought we were best friends for years!",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    name: "Aayush",
    role: "User",
    text: "Charming, respectful, and truly present in every moment. I felt totally at ease.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    name: "Karan",
    role: "User",
    text: "Booked her for a formal event. Graceful, well-spoken, and made every interaction smooth and professional.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 4,
    name: "Aryan",
    role: "Companion",
    text: "We had great conversation during dinner. Intelligent, funny, and very respectful.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram",
    role: "User",
    text: "Excellent service! Found a great movie buddy in minutes. Highly recommended.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
    rating: 5,
  },
];

// Extracted Card Component for reuse in grid and modal
const AutoplayVideo = ({ src, autoPlay = true }: { src: string; autoPlay?: boolean }) => {
  return (
    <LazyVideo
      src={src}
      className="group-hover:scale-105 transition-all duration-700 ease-out"
      autoPlay={autoPlay}
    />
  );
};

// Extracted Card Component for reuse in grid and modal
const ReviewCard = ({ review, onPlay, autoPlay = true }: { review: any; onPlay?: (url: string) => void; autoPlay?: boolean }) => {
  const hasVideo = !!review.videoUrl;
  
  if (hasVideo) {
    return (
      <div 
        onClick={() => {
          if (onPlay) onPlay(review.videoUrl);
        }}
        className="bg-bg-card backdrop-blur-xl border border-primary/20 rounded-3xl relative overflow-hidden group hover:border-primary/40 transition-all duration-500 h-full min-h-[400px] flex flex-col shadow-2xl cursor-pointer"
      >
        {/* Background Autoplaying Video */}
        <div className="absolute inset-0 z-0">
          <AutoplayVideo src={review.videoUrl} autoPlay={autoPlay} />
        </div>

        {/* Content Overlay (Floats at bottom) */}
        <div className="mt-auto p-5 relative z-20 flex flex-col gap-3.5">
          {/* Rating */}
          <div className="flex gap-0.5">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
            ))}
          </div>

          {/* Text / Experience */}
          <p className="text-white text-xs leading-relaxed font-semibold line-clamp-3 filter drop-shadow-md">
            &ldquo;{review.text}&rdquo;
          </p>

          {/* User Profile Info Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
              <Image
                src={review.image}
                alt={review.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-black text-white! truncate filter drop-shadow-sm" style={{ color: "white" }}>{review.name}</h4>
                {review.verified && (
                  <span className="inline-flex items-center justify-center bg-emerald-500 text-white rounded-full p-0.5 text-[7px] leading-none shrink-0" title="Verified Booking">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider truncate">{review.role}</p>
            </div>
            {/* Play Button Icon */}
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary/80 group-hover:border-primary transition-all shrink-0">
              <Play className="w-3 h-3 text-white fill-white translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card backdrop-blur-xl border border-border-main rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-colors duration-500 h-full flex flex-col shadow-xl shadow-black/5">
      {/* Premium Glow Header Area */}
      <div className="absolute top-0 w-full h-28 bg-linear-to-b from-primary/30 via-primary/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="px-6 pb-8 pt-12 flex flex-col items-center relative z-10 text-center h-full">
        {/* Overlapping Profile Image */}
        <div className="relative w-24 h-24 shrink-0 rounded-full border-4 border-bg-card shadow-lg shadow-black/10 overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-500">
          <Image
            src={review.image}
            alt={review.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        <h3 className="text-2xl font-bold text-text-main mb-1.5 flex items-center justify-center gap-1.5">
          <span>{review.name}</span>
          {review.verified && (
            <span className="inline-flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider gap-0.5" title="Verified Booking">
              <span>✓ Verified</span>
            </span>
          )}
        </h3>
        <p className="text-text-muted italic text-sm leading-relaxed mb-6 grow flex items-center justify-center">
          &ldquo;{review.text}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-1 mb-5">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider py-1.5 px-6 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)] mt-auto">
          {review.role}
        </div>
      </div>
    </div>
  );
};

const avatarOptions = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop",
];

interface CompanionSayProps {
  reviews?: Review[];
  partnerId?: string;
  partnerName?: string;
}

export default function CompanionSay({ reviews: passedReviews, partnerId, partnerName }: CompanionSayProps) {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const reviewBookingIdParam = searchParams.get("reviewBookingId");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [canWriteReview, setCanWriteReview] = useState(false);

  // Form states
  const [newName, setNewName] = useState(user?.name || "");
  const [newRole, setNewRole] = useState<"User" | "Companion">("User");
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
    if (typeof window !== "undefined" && user?.email) {
      const storageKey = `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED") {
            setIsPartner(true);
            setNewRole("Companion");
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    setIsPartner(false);
    setNewRole("User");
  }, [user]);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [hoverStar, setHoverStar] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const rejectedReviewInfo = useMemo(() => {
    if (typeof window === "undefined" || !selectedBookingId) return null;
    try {
      const localReviews = localStorage.getItem("hire_my_partner_reviews");
      if (localReviews) {
        const parsed = JSON.parse(localReviews);
        const found = parsed.find(
          (r: any) => String(r.bookingId) === String(selectedBookingId) && r.status === "REJECTED"
        );
        if (found) {
          return {
            text: found.text,
            reason: found.rejectionReason || "Does not comply with community guidelines."
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }, [selectedBookingId, isWriteModalOpen]);

  // Eligibility checking and URL parameter extraction
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const localBookings = localStorage.getItem("hire_my_partner_bookings");
        const localReviews = localStorage.getItem("hire_my_partner_reviews");
        
        let parsedBookings: any[] = [];
        if (localBookings) {
          parsedBookings = JSON.parse(localBookings);
        }
        
        let parsedReviews: any[] = [];
        if (localReviews) {
          parsedReviews = JSON.parse(localReviews);
        }

        // Find completed bookings for this partner
        const completedBookings = parsedBookings.filter((b: any) => {
          const idMatch = String(b.id) === String(partnerId);
          const nameMatch = b.name.toLowerCase() === partnerName?.toLowerCase();
          return (idMatch || nameMatch) && b.status === "Completed";
        });

        // Filter out completed bookings that already have reviews in the global list
        const unreviewedCompletedBookings = completedBookings.filter((b: any) => {
          return !parsedReviews.some((r: any) => String(r.bookingId) === String(b.id) && r.status !== "REJECTED");
        });

        const eligible = unreviewedCompletedBookings.length > 0;
        setCanWriteReview(eligible);

        // If there's a specific reviewBookingId in the query parameters:
        if (reviewBookingIdParam) {
          // Check if it's in the unreviewed completed bookings
          const matchedBooking = unreviewedCompletedBookings.find(
            (b: any) => String(b.id) === String(reviewBookingIdParam)
          );
          
          if (matchedBooking) {
            setSelectedBookingId(String(matchedBooking.id));
            setIsWriteModalOpen(true);
          } else {
            // Check if it was already reviewed
            const alreadyReviewed = parsedReviews.some(
              (r: any) => String(r.bookingId) === String(reviewBookingIdParam) && r.status !== "REJECTED"
            );
            if (alreadyReviewed) {
              toast.error("You have already reviewed this booking.");
            } else {
              toast.error("Invalid booking ID or this booking is not completed yet.");
            }
          }
        } else if (eligible) {
          // If no specific parameter, but the user is eligible, we can default to the first unreviewed completed booking
          setSelectedBookingId(String(unreviewedCompletedBookings[0].id));
        }
      } catch (e) {
        console.error("Failed to check bookings for review permission", e);
      }
    }
  }, [partnerId, partnerName, reviewBookingIdParam]);

  // Load reviews from mock partners and global approved review list
  useEffect(() => {
    if (typeof window !== "undefined" && partnerId) {
      const handleGlobalReviewsUpdate = () => {
        try {
          const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
          let globalApprovedList: any[] = [];
          if (savedGlobal) {
            const globalList = JSON.parse(savedGlobal);
            globalApprovedList = globalList.filter((r: any) => 
              String(r.partnerId) === String(partnerId) && r.status === "APPROVED"
            );
          }
          
          const savedLegacy = localStorage.getItem(`partner_reviews_${partnerId}`);
          let legacyApprovedList: any[] = [];
          if (savedLegacy) {
            legacyApprovedList = JSON.parse(savedLegacy);
          }

          const allReviewsMap = new Map();
          (passedReviews || []).forEach((r: any) => {
            if (r && r.id) allReviewsMap.set(String(r.id), r);
          });
          legacyApprovedList.forEach((r: any) => {
            if (r && r.id) allReviewsMap.set(String(r.id), r);
          });
          globalApprovedList.forEach((r: any) => {
            if (r && r.id) allReviewsMap.set(String(r.id), r);
          });

          setReviews(Array.from(allReviewsMap.values()));
        } catch (e) {
          console.error("Failed to parse reviews", e);
        }
      };

      handleGlobalReviewsUpdate();
      window.addEventListener("reviews_updated", handleGlobalReviewsUpdate);
      return () => window.removeEventListener("reviews_updated", handleGlobalReviewsUpdate);
    } else {
      setReviews(passedReviews || []);
    }
  }, [passedReviews, partnerId]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canWriteReview || !selectedBookingId) {
      toast.error("You must have a completed, unreviewed booking with this companion to write a review.");
      return;
    }

    if (!newName.trim() || !newText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    const newReview = {
      id: `REV-${Date.now()}`,
      partnerId: String(partnerId),
      partnerName: partnerName || "",
      bookingId: selectedBookingId,
      name: newName,
      role: newRole,
      text: newText,
      image: randomAvatar,
      rating: newRating,
      videoUrl: videoPreviewUrl || undefined,
      status: "PENDING",
      verified: true,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    try {
      const existingReviewsStr = localStorage.getItem("hire_my_partner_reviews");
      const existingReviews = existingReviewsStr ? JSON.parse(existingReviewsStr) : [];
      
      const alreadyReviewed = existingReviews.some(
        (r: any) => String(r.bookingId) === String(selectedBookingId) && r.status !== "REJECTED"
      );
      if (alreadyReviewed) {
        toast.error("You have already reviewed this booking.");
        return;
      }

      // Filter out any previous reviews for this booking (including rejected ones) to keep it clean
      const filteredReviews = existingReviews.filter(
        (r: any) => String(r.bookingId) !== String(selectedBookingId)
      );
      const updatedGlobalReviews = [newReview, ...filteredReviews];
      localStorage.setItem("hire_my_partner_reviews", JSON.stringify(updatedGlobalReviews));
      
      window.dispatchEvent(new Event("reviews_updated"));
      
      toast.success("Review submitted successfully! It is now pending admin approval.");
      
      // Update local permission check in real time
      const localBookings = localStorage.getItem("hire_my_partner_bookings");
      if (localBookings) {
        const parsedBookings = JSON.parse(localBookings);
        const completedBookings = parsedBookings.filter((b: any) => {
          const idMatch = String(b.id) === String(partnerId);
          const nameMatch = b.name.toLowerCase() === partnerName?.toLowerCase();
          return (idMatch || nameMatch) && b.status === "Completed";
        });
        const unreviewedCompletedBookings = completedBookings.filter((b: any) => {
          return !updatedGlobalReviews.some((r: any) => String(r.bookingId) === String(b.id) && r.status !== "REJECTED");
        });
        setCanWriteReview(unreviewedCompletedBookings.length > 0);
      }
    } catch (err) {
      console.error("Failed to save review", err);
      toast.error("Failed to submit review. Please try again.");
    }

    // Reset form & close modal
    setNewName(user?.name || "");
    setNewRole(isPartner ? "Companion" : "User");
    setNewRating(5);
    setNewText("");
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setIsWriteModalOpen(false);
  };

  // Sort reviews: video reviews first (on the left starting side)
  const sortedReviews = useMemo(() => {
    // Defensive check to filter out empty, null, or undefined review objects
    const validReviews = (reviews || []).filter((r) => r && typeof r === "object");
    return [...validReviews].sort((a, b) => {
      const aHasVideo = !!a.videoUrl;
      const bHasVideo = !!b.videoUrl;
      if (aHasVideo && !bHasVideo) return -1;
      if (!aHasVideo && bHasVideo) return 1;
      return 0;
    });
  }, [reviews]);

  // If there are more than 3 reviews, we show 3 + "View All" card.
  const hasMore = sortedReviews.length > 3;
  const displayedReviews = hasMore ? sortedReviews.slice(0, 3) : sortedReviews;

  return (
    <section
      className={`py-16 md:py-24 px-4 bg-bg-secondary border-b border-border-main ${outfit.className}`}
    >
      <div className="max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col items-center mb-16 gap-6">
          <div className="flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${rochester.className} text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main mb-4 text-center`}
            >
              Experiences Shared by Users
            </motion.h2>
            <div className="w-24 h-1 rounded-full bg-linear-to-r from-primary to-primary-dark shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"></div>
          </div>

          {canWriteReview && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWriteModalOpen(true)}
              className="px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-primary text-xs font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] cursor-pointer"
            >
              Share Your Experience
            </motion.button>
          )}
        </div>

        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto bg-bg-card backdrop-blur-xl border border-border-main rounded-[32px] p-8 md:p-12 text-center shadow-xl shadow-black/5 relative overflow-hidden"
          >
            {/* Ambient glows inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                <Star className="w-10 h-10 animate-pulse text-primary/70 fill-primary/10" />
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-30" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-text-main">No reviews yet</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto font-medium">
                  {canWriteReview 
                    ? "Be the first to share your experience with this companion and help others in the community!"
                    : "No experiences shared yet. Book a session to be the first to share your experience!"}
                </p>
              </div>
              {canWriteReview ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWriteModalOpen(true)}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Write the First Review
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        ) : (
          /* 4-Column Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[400px]" style={{ contentVisibility: "auto", containIntrinsicSize: "400px" }}>
            {displayedReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <ReviewCard review={review} onPlay={setActiveVideoUrl} />
              </motion.div>
            ))}

            {/* Conditional "View All" Card */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full"
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-full min-h-[400px] relative group overflow-hidden rounded-[40px] bg-bg-card border border-border-main transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                >
                  {/* Dynamic Background Glow */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary-dark/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Radial Pulse */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />

                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative mb-8">
                      {/* Glowing Ring */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-150 opacity-0 group-hover:opacity-100" />
                      
                      <div className="relative w-24 h-24 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:scale-110 shadow-xl shadow-black/5">
                        <Eye className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-500" />
                      </div>

                      {/* Badge */}
                      <div className="absolute -top-2 -right-2 bg-primary-dark text-[10px] font-black text-white px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                        {reviews.length} total
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-text-main mb-2 tracking-tight group-hover:text-primary transition-colors">
                      View All
                    </h3>
                    <p className="text-text-muted font-medium mb-8 max-w-[200px]">
                      Read {reviews.length - 3} more experiences shared by others
                    </p>

                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <span>See All Reviews</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/5 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-primary/5 to-transparent pointer-events-none" />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* View All Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bg-base/60 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-base border border-border-main w-full max-w-[1200px] max-h-[85vh] rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-border-main relative z-10 shrink-0">
                <h3
                  className={`${rochester.className} text-3xl md:text-5xl text-text-main`}
                >
                  All Experiences
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-card hover:border-primary/30 transition-all cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Red Glow isolated behind header */}
              <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50" />

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 md:p-8 flex-1 scroll-smooth">
                {/* 3 Column grid for interior of modal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedReviews.map((review) => (
                    <div key={review.id} className="h-full min-h-[350px]">
                      <ReviewCard review={review} onPlay={setActiveVideoUrl} autoPlay={false} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bg-base/60 backdrop-blur-xl"
            onClick={() => setIsWriteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-base border border-border-main w-full max-w-[600px] rounded-[36px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-border-main relative z-10 shrink-0">
                <h3 className={`${rochester.className} text-3xl md:text-4xl text-text-main`}>
                  Share Your <span className="text-primary">Experience</span>
                </h3>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-card hover:border-primary/30 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleReviewSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                {rejectedReviewInfo && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold leading-relaxed space-y-1.5">
                    <p className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-wider text-rose-600 dark:text-rose-400">
                      ⚠️ Previous Review Rejected by Moderation
                    </p>
                    <p className="text-text-main font-medium italic bg-bg-secondary p-3 rounded-xl border border-border-main text-[11px]">
                      "{rejectedReviewInfo.text}"
                    </p>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-wider">
                      Reason: <span className="font-bold normal-case text-text-main">{rejectedReviewInfo.reason}</span>
                    </p>
                    <p className="text-[10px] text-text-muted mt-1 font-semibold">
                      Please rewrite and submit your updated experience below.
                    </p>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={newName}
                    placeholder="User Name"
                    className="w-full h-12 px-5 bg-bg-secondary/40 border border-border-main rounded-2xl text-xs font-bold text-text-muted focus:outline-none cursor-not-allowed opacity-75 transition-all"
                  />
                </div>

                {/* Role and Rating in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Role */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
                      Your Role
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-bg-secondary/40 p-1 rounded-2xl border border-border-main opacity-75">
                      <button
                        type="button"
                        disabled
                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-not-allowed ${
                          newRole === "User"
                            ? "bg-primary text-white"
                            : "text-text-muted"
                        }`}
                      >
                        User
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-not-allowed ${
                          newRole === "Companion"
                            ? "bg-primary text-white"
                            : "text-text-muted"
                        }`}
                      >
                        Companion
                      </button>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
                      Rating
                    </label>
                    <div 
                      className="flex items-center gap-1.5 h-12 px-5 bg-bg-secondary border border-border-main rounded-2xl"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none cursor-pointer transition-transform duration-200 active:scale-90"
                        >
                          <Star
                            className={`w-6 h-6 transition-all duration-150 ${
                              star <= newRating
                                ? "fill-amber-400 text-amber-400 filter drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
                                : "text-text-muted/40"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience Text */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">
                    Your Experience
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Tell others about your experience..."
                    className="w-full p-5 bg-bg-secondary border border-border-main rounded-2xl text-xs font-bold text-text-main focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Video Review Upload Box */}
                <div className="flex flex-col gap-3 p-5 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🎥</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-text-main">Earn ₹100 Cashback Reward!</h4>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Optionally upload a video review. Once verified by the admin, ₹100 will be credited directly to your account.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    {videoPreviewUrl ? (
                      <div className="relative rounded-2xl border border-border-main overflow-hidden bg-bg-card p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                            <video src={videoPreviewUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <span className="text-[10px]">▶️</span>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text-main truncate max-w-[200px]">
                              {videoFile?.name || "video-review.mp4"}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB` : "Ready to upload"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoPreviewUrl(null);
                          }}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-border-main hover:border-primary/40 rounded-2xl p-6 bg-bg-secondary hover:bg-bg-card transition-all cursor-pointer group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">📤</span>
                        <div className="text-center">
                          <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors block">
                            Choose Video File
                          </span>
                          <span className="text-[10px] text-text-muted block mt-0.5">
                            MP4, MOV, WebM (Max 50MB)
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 50 * 1024 * 1024) {
                                toast.error("Video file is too large (max 50MB)");
                                return;
                              }
                              setVideoFile(file);
                              setVideoPreviewUrl(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Submit Experience
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Video Review Lightbox Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-default p-4"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0 z-0" onClick={() => setActiveVideoUrl(null)} />

            {/* Controls panel top-bar */}
            <div className="fixed top-6 right-6 z-210 flex items-center gap-4">
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all duration-300 shadow-2xl backdrop-blur-xl cursor-pointer"
                title={isVideoMuted ? "Unmute" : "Mute"}
              >
                {isVideoMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 flex items-center justify-center text-white transition-all duration-300 group shadow-2xl backdrop-blur-xl cursor-pointer"
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
                src={activeVideoUrl}
                className="w-full h-full object-contain"
                autoPlay
                controls
                muted={isVideoMuted}
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



