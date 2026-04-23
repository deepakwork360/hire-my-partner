"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import {
  Camera,
  Plus,
  ChevronDown,
  Check,
  Minus,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import DiscoveryButton from "@/components/ui/DiscoveryButton";
import { toast } from "@/components/ui/toastStore";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

// --- Moved Components Outside to prevent Focus Loss ---

const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-2 h-8 rounded-full bg-linear-to-b from-primary to-accent shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]" />
    <h3 className="text-text-main text-xl md:text-2xl font-bold tracking-wide">
      {children}
    </h3>
  </div>
);

const SummaryItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | string[];
  icon?: React.ReactNode;
}) => (
  <div className="bg-bg-card border border-border-main p-5 rounded-2xl hover:bg-bg-secondary transition-all group">
    <div className="flex items-center gap-3 text-text-muted mb-2">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
    <div className="text-text-main font-semibold">
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((v) => (
            <span
              key={v}
              className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-base">{value || "Not specified"}</span>
      )}
    </div>
  </div>
);

const CheckboxItem = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label
    className={`flex items-center gap-4 border rounded-2xl p-5 cursor-pointer transition-all duration-300 group select-none relative overflow-hidden ${checked ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] transform scale-[1.02]" : "bg-bg-secondary border-border-main hover:border-primary/30 hover:bg-bg-card"}`}
  >
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <div
      className={`w-6 h-6 flex-shrink-0 rounded-[6px] border-2 flex items-center justify-center transition-all duration-300 ${checked ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "border-slate-500 group-hover:border-primary"}`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </motion.div>
      )}
    </div>
    <span
      className={`text-[15px] font-medium transition-colors z-10 ${checked ? "text-text-main font-bold" : "text-text-main group-hover:text-primary"}`}
    >
      {label}
    </span>
    {checked && (
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-transparent z-0 pointer-events-none" />
    )}
  </label>
);

const getInputClass = (hasError = false) =>
  `w-full bg-bg-secondary border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-500 shadow-sm font-medium tracking-wide outline-none ${
    hasError
      ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5"
      : "border-border-main focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_25px_rgba(var(--primary-rgb),0.15)] group-hover:border-primary/50"
  }`;

export default function DetailsForm() {
  const [formData, setFormData] = useState({
    photo: null as string | null,
    fullName: "",
    gender: "Select Gender",
    age: "",
    city: "",
    mobile: "",
    email: "",
    addons: [] as string[],
    otherAddon: "",
    languages: [] as string[],
    bio: "",
    hourlyRate: "",
    availability: [] as string[],
    instagram: "",
    linkedin: "",
    termsAgreed: false,
    idProofs: [null, null, null] as (string | null)[],
    gallery: Array(9).fill(null) as (string | null)[],
  });

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genders = ["Male", "Female", "Non-Binary", "Prefer not to say"];

  const [view, setView] = useState<"form" | "processing" | "summary">("form");
  const [submissionStatus, setSubmissionStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [isHydrated, setIsHydrated] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Section Refs for Auto-Scroll
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  // Persistence: Load on Mount
  useEffect(() => {
    // Generate Stable ID for this session
    setApplicationId(`APP-${Math.floor(100000 + Math.random() * 900000)}`);

    const savedData = localStorage.getItem("partnerApplication");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge text data, but keep images as null from initial state
        setFormData((prev) => ({
          ...prev,
          ...parsed.formData,
          photo: prev.photo, // Don't override with null if already set in memory
          idProofs: prev.idProofs,
        }));
        setSubmissionStatus(parsed.submissionStatus || "pending");
        // If they already submitted successfully, show summary
        if (parsed.submissionStatus === "success") {
          setView("summary");
          setShowSuccessCard(false); // Don't show the initial "Success!" toast-like box on refresh, just summary
        }
      } catch (e) {
        console.error("Failed to parse saved application data", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persistence: Save on Change (Exclude large binary strings)
  useEffect(() => {
    if (isHydrated) {
      // Create a clean copy of formData without images to save storage quota
      const { photo, idProofs, gallery, ...textContent } = formData;

      localStorage.setItem(
        "partnerApplication",
        JSON.stringify({
          formData: textContent,
          submissionStatus,
          view,
        }),
      );
    }
  }, [formData, submissionStatus, view, isHydrated]);

  // Auto-Scroll on View Change
  useEffect(() => {
    if (isHydrated && (view === "processing" || view === "summary")) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [view, isHydrated]);

  const toggleArrayItem = (
    field: "addons" | "languages" | "availability",
    item: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const validateForm = () => {
    setShowErrors(true);

    const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (!formData.photo) {
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.fullName || !formData.age || !formData.city || !formData.mobile || !formData.email || !formData.hourlyRate || formData.gender === "Select Gender") {
      scrollTo(basicInfoRef);
      return false;
    }

    const filledGallery = formData.gallery.filter(p => p !== null).length;
    if (filledGallery < 3) {
      scrollTo(galleryRef);
      return false;
    }

    if (!formData.bio) {
      scrollTo(bioRef);
      return false;
    }

    if (formData.availability.length === 0) {
      scrollTo(scheduleRef);
      return false;
    }

    const filledProofs = formData.idProofs.filter(p => p !== null).length;
    if (filledProofs < 2) {
      scrollTo(docsRef);
      return false;
    }

    if (!formData.termsAgreed) {
      scrollTo(termsRef);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setView("processing");
    setSubmissionStatus("pending");

    // Simulate backend processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setSubmissionStatus("success");
    setShowSuccessCard(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setView("summary");
  };

  if (!isHydrated) return null;

  const handleAgeChange = (increment: boolean) => {
    setFormData((prev) => {
      const currentAge = parseInt(prev.age) || 18;
      const newAge = increment ? currentAge + 1 : Math.max(18, currentAge - 1);
      return { ...prev, age: newAge.toString() };
    });
  };

  const handleIdUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProofs = [...formData.idProofs];
        newProofs[index] = reader.result as string;
        setFormData({ ...formData, idProofs: newProofs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const newGallery = [...prev.gallery];
          newGallery[index] = reader.result as string;
          return { ...prev, gallery: newGallery };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setFormData((prev) => {
      const newGallery = [...prev.gallery];
      newGallery[index] = null;
      return { ...prev, gallery: newGallery };
    });
  };

  return (
    <section
      id="join"
      ref={sectionRef}
      className={`pt-16 md:pt-24 pb-20 md:pb-40 bg-bg-base min-h-screen relative ${outfit.className}`}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <AnimatePresence mode="wait">
          {view === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-bg-card/30 backdrop-blur-[40px] border border-border-main rounded-[32px] md:rounded-[48px] p-6 md:p-14 shadow-2xl overflow-hidden"
            >
              {/* Ambient Inner Glows */}
              <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

              <div className="text-center mb-16 mt-4 relative z-10">
                <h2
                  className={`${rochester.className} text-5xl md:text-7xl text-text-main tracking-wide py-8 leading-[1.4]`}
                >
                  Your Details{" "}
                  <span className="inline-block text-transparent bg-clip-text bg-linear-to-r from-primary-dark to-accent px-4">
                    Form
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 opacity-30" />
              </div>

              <form
                className="space-y-16 relative z-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {/* Photo Upload */}
                <div className="flex justify-center mb-14" ref={basicInfoRef}>
                  <div className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full border-[3px] border-dashed flex items-center justify-center bg-transparent shrink-0 group transition-all duration-500 ${showErrors && !formData.photo ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse" : "border-primary/50 hover:border-primary"}`}>
                    <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-b from-primary/10 to-accent/5 flex items-center justify-center overflow-hidden relative cursor-pointer hover:from-primary/20 hover:to-accent/15 transition-all shadow-[inset_0_0_30px_rgba(var(--primary-rgb),0.2)] group-hover:scale-105 duration-500">
                      {formData.photo ? (
                        <img
                          src={formData.photo}
                          alt="Profile"
                          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                        />
                      ) : (
                        <Camera className="w-10 h-10 text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                      )}
                      {!formData.photo && (
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () =>
                                setFormData({
                                  ...formData,
                                  photo: reader.result as string,
                                });
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      )}
                    </div>

                    {/* Plus Badge */}
                    {!formData.photo && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-linear-to-r from-primary-dark to-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-4 border-[#0c0c0c] z-10 transform group-hover:scale-110 transition-transform duration-500">
                        <Plus className="w-4 h-4" />
                      </div>
                    )}

                    {/* Remove Image Badge */}
                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, photo: null })
                        }
                        className="absolute top-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-4 border-[#0c0c0c] z-20 hover:scale-110 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <InputWrapper className="col-span-1 md:col-span-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={getInputClass(showErrors && !formData.fullName)}
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </InputWrapper>
 
                  <InputWrapper>
                    <div className="relative">
                      <div className={`flex bg-bg-secondary border rounded-2xl overflow-hidden transition-all duration-500 shadow-sm ${showErrors && formData.gender === "Select Gender" ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5" : "border-border-main hover:border-primary/50 focus-within:border-primary ring-primary/20"}`}>
                        <button
                          type="button"
                          onClick={() => setIsGenderOpen(!isGenderOpen)}
                          className="flex-1 p-4 md:p-5 text-left text-text-main focus:outline-none min-h-[60px] flex items-center font-medium tracking-wide"
                        >
                          {formData.gender === "Select Gender" ? (
                            <span className="text-text-muted">Gender</span>
                          ) : (
                            formData.gender
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsGenderOpen(!isGenderOpen)}
                          className="w-16 bg-gradient-to-br from-primary-dark to-accent flex items-center justify-center text-white shrink-0 hover:from-primary hover:to-accent/80 transition-colors shadow-inner"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-500 ${isGenderOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {isGenderOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute z-50 top-full mt-3 left-0 w-full bg-bg-base border border-border-main rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden backdrop-blur-xl"
                          >
                            {genders.map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, gender: g });
                                  setIsGenderOpen(false);
                                }}
                                className="w-full p-4 md:p-5 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300"
                              >
                                {g}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </InputWrapper>
 
                  <InputWrapper>
                    <div className={`flex bg-bg-secondary border rounded-2xl overflow-hidden transition-all duration-500 shadow-sm min-h-[60px] ${showErrors && !formData.age ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5" : "border-border-main hover:border-primary/50 focus-within:border-primary ring-primary/20"}`}>
                      <input
                        type="number"
                        placeholder="Age"
                        className="flex-1 bg-transparent p-4 md:p-5 text-text-main placeholder:text-text-muted focus:outline-none font-medium tracking-wide"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                      <div className="flex flex-col w-12 border-l border-border-main">
                        <button
                          type="button"
                          onClick={() => handleAgeChange(true)}
                          className="flex-1 bg-primary/10 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors border-b border-border-main"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAgeChange(false)}
                          className="flex-1 bg-primary/10 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </InputWrapper>
 
                  <InputWrapper>
                    <input
                      type="text"
                      placeholder="City"
                      className={getInputClass(showErrors && !formData.city)}
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </InputWrapper>
 
                  <InputWrapper>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      className={getInputClass(showErrors && !formData.mobile)}
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                    />
                  </InputWrapper>
 
                  <InputWrapper>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={getInputClass(showErrors && !formData.email)}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </InputWrapper>
 
                  <InputWrapper>
                    <div className="relative group">
                      <div className={`absolute left-5 top-1/2 -translate-y-1/2 font-bold text-lg transition-colors ${showErrors && !formData.hourlyRate ? "text-red-500" : "text-text-muted group-focus-within:text-primary"}`}>
                        ₹
                      </div>
                      <input
                        type="number"
                        placeholder="Hourly Rate"
                        className={`${getInputClass(showErrors && !formData.hourlyRate)} pl-14 md:pl-14`}
                        value={formData.hourlyRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hourlyRate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </InputWrapper>
                </div>


                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Add-Ons */}
                <div>
                  <SectionTitle>
                    Premium Add-Ons{" "}
                    <span className="text-text-muted text-sm font-normal ml-2 tracking-normal italic">
                      (Optional)
                    </span>
                  </SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    {[
                      "Casual Photoshoot",
                      "Personalized Playlist",
                      "Extra Travel Time",
                    ].map((item) => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={formData.addons.includes(item)}
                        onChange={() => toggleArrayItem("addons", item)}
                      />
                    ))}
                  </div>
                  <InputWrapper>
                    <input
                      type="text"
                      placeholder="Specify other services..."
                      className={getInputClass()}
                      value={formData.otherAddon}
                      onChange={(e) =>
                        setFormData({ ...formData, otherAddon: e.target.value })
                      }
                    />
                  </InputWrapper>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Languages Spoken */}
                <div>
                  <SectionTitle>Languages</SectionTitle>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                    {["English", "Hindi", "Bengali", "Tamil"].map((item) => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={formData.languages.includes(item)}
                        onChange={() => toggleArrayItem("languages", item)}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full bg-bg-secondary border border-border-main border-dashed rounded-2xl p-5 text-text-muted hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 font-medium group"
                  >
                    <Plus className="w-5 h-5 text-primary group-hover:scale-125 transition-transform duration-300" />{" "}
                    Add Another Language
                  </button>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Short Bio */}
                <div ref={bioRef}>
                  <SectionTitle>Professional Profile</SectionTitle>
                  <div className="space-y-6">
                    <InputWrapper>
                      <textarea
                        placeholder="I'm outgoing, love events and respectful company..."
                        rows={4}
                        className={getInputClass(showErrors && !formData.bio)}
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </InputWrapper>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Gallery Upload */}
                <div ref={galleryRef}>
                  <SectionTitle>
                    Partner Gallery{" "}
                    <span className="text-text-muted text-sm font-normal ml-2 tracking-normal italic">
                      (Min 3, Max 9 photos)
                    </span>
                  </SectionTitle>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                    {formData.gallery.slice(0, Math.max(4, Math.min(9, formData.gallery.filter(p => p !== null).length + 1))).map((photo, index) => {
                      const isRequired = index < 3;
                      const hasError = showErrors && isRequired && !photo;

                      return (
                        <motion.div
                          key={index}
                          animate={hasError ? { 
                            boxShadow: ["0 0 20px rgba(239,68,68,0.1)", "0 0 30px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.1)"] 
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`relative aspect-square rounded-[32px] overflow-hidden border-2 transition-all duration-700 group shadow-2xl ${
                            hasError 
                              ? "border-red-500/50 bg-red-500/5" 
                              : "border-white/5 bg-bg-secondary/40 backdrop-blur-xl hover:border-primary/40 hover:shadow-primary/20"
                          }`}
                        >
                          {photo ? (
                            <div className="w-full h-full group/photo relative">
                              <img
                                src={photo}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-1000"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/photo:bg-black/40 transition-colors duration-500" />
                              <button
                                type="button"
                                onClick={() => removeGalleryPhoto(index)}
                                className="absolute top-3 right-3 w-10 h-10 bg-accent/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-10 transition-all duration-300 hover:bg-accent hover:scale-110 hover:-rotate-12"
                                title="Remove photo"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group/add transition-all duration-500 hover:bg-primary/5">
                              <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-700 group-hover/add:rotate-90 group-hover/add:scale-110 ${hasError ? "bg-red-500/20" : "bg-primary/10 border border-primary/20"}`}>
                                <Camera className={`w-6 h-6 ${hasError ? "text-red-500" : "text-primary group-hover/add:text-accent"}`} />
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${hasError ? "text-red-500" : "text-text-muted group-hover/add:text-primary"}`}>
                                  {isRequired ? "Required" : `Photo ${index + 1}`}
                                </span>
                                {isRequired && !photo && (
                                  <motion.div 
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                                  />
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleGalleryUpload(index, e)}
                              />
                              {/* Hover Effect Light */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover/add:opacity-100 transition-opacity duration-700" />
                            </label>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Availability */}
                <div ref={scheduleRef}>
                  <SectionTitle>Availability Schedule</SectionTitle>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 p-2 rounded-2xl transition-all duration-500 ${showErrors && formData.availability.length === 0 ? "bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : ""}`}>
                    {[
                      "Weekdays (5 PM - 10 PM)",
                      "Weekends (12 PM - 10 PM)",
                    ].map((item) => (
                      <CheckboxItem
                        key={item}
                        label={item}
                        checked={formData.availability.includes(item)}
                        onChange={() => toggleArrayItem("availability", item)}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Social Links */}
                <div>
                  <SectionTitle>
                    Social Links{" "}
                    <span className="text-text-muted text-sm font-normal ml-2 tracking-normal italic">
                      (Optional)
                    </span>
                  </SectionTitle>                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <InputWrapper>
                      <input
                        type="url"
                        placeholder="Instagram Profile URL"
                        className={getInputClass()}
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    </InputWrapper>
                    <InputWrapper>
                      <input
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        className={getInputClass()}
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin: e.target.value })
                        }
                      />
                    </InputWrapper>
                  </div>
 
                  <div ref={termsRef} className={`bg-white/[0.02] border p-6 rounded-2xl flex items-start md:items-center gap-4 transition-all duration-500 ${showErrors && !formData.termsAgreed ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5" : "border-border-main"}`}>
                    <label className="flex items-center gap-4 w-fit cursor-pointer group">
                      <div
                        className={`w-6 h-6 shrink-0 rounded flex items-center justify-center border-2 transition-all duration-300 ${formData.termsAgreed ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : showErrors && !formData.termsAgreed ? "border-red-500" : "border-border-main group-hover:border-primary"}`}
                      >
                        {formData.termsAgreed && (
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        )}
                      </div>
                      <span className={`text-sm md:text-base font-medium select-none transition-colors ${showErrors && !formData.termsAgreed ? "text-red-500" : "text-text-main group-hover:text-text-main"}`}>
                        I confirm that I agree to the{" "}
                        <span className="text-primary hover:text-primary/80 underline underline-offset-4">
                          Terms
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:text-primary/80 underline underline-offset-4">
                          Booking Guidelines
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.termsAgreed}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            termsAgreed: !formData.termsAgreed,
                          })
                        }
                      />
                    </label>
                  </div>

                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Government ID Proof */}
                <div ref={docsRef}>
                  <SectionTitle>Verification Documents</SectionTitle>
                  <p className="text-text-muted text-sm mb-6 max-w-2xl">
                    Please upload clear pictures of your Government ID (Front,
                    Back) and a selfie holding the ID for verification purposes.
                  </p>

                  <div className="bg-bg-secondary border border-border-main p-6 md:p-10 rounded-3xl flex flex-col md:flex-row gap-6 justify-center md:justify-start items-center relative overflow-hidden shadow-sm">
                    {/* Subtle background gradient inside the tray */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />

                    {[0, 1, 2].map((index) => {
                      const isRequired = index < 2;
                      const hasError = showErrors && isRequired && !formData.idProofs[index];

                      return (
                        <motion.div
                          key={index}
                          animate={hasError ? { 
                            boxShadow: ["0 0 20px rgba(239,68,68,0.1)", "0 0 30px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.1)"] 
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`relative w-36 h-28 border-2 border-dashed transition-all duration-500 flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl group shadow-sm ${
                            hasError 
                              ? "border-red-500 bg-red-500/5" 
                              : "border-border-main bg-bg-card hover:border-primary hover:bg-bg-secondary hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.15)]"
                          }`}
                        >
                          {formData.idProofs[index] ? (
                            <div className="relative w-full h-full group/id">
                              <img
                                src={formData.idProofs[index]!}
                                alt={`ID Proof ${index + 1}`}
                                className="w-full h-full object-cover group-hover/id:scale-105 transition-transform duration-500"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newProofs = [...formData.idProofs];
                                  newProofs[index] = null;
                                  setFormData({
                                    ...formData,
                                    idProofs: newProofs,
                                  });
                                }}
                                className="absolute top-2 right-2 w-8 h-8 bg-accent/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-20 transition-all duration-300 hover:bg-accent hover:scale-110"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col items-center gap-2">
                                <Plus className={`w-8 h-8 group-hover:scale-125 transition-all duration-300 ${hasError ? "text-red-500" : "text-text-muted group-hover:text-primary"}`} />
                                <div className="flex flex-col items-center gap-1">
                                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${hasError ? "text-red-500" : "text-text-muted group-hover:text-primary"}`}>
                                    {index === 0 ? "ID Front" : index === 1 ? "ID Back" : "Selfie"}
                                  </span>
                                  {isRequired && !formData.idProofs[index] && (
                                    <motion.div 
                                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                      className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleIdUpload(index, e)}
                              />
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-10 flex justify-center">
                  <PremiumButton
                    label="Submit Application"
                    onClick={handleSubmit}
                    size="xl"
                    variant="primary"
                    icon={<ArrowRight className="w-6 h-6" />}
                    className="w-full"
                  />
                </div>
              </form>
            </motion.div>
          )}

          {view === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative bg-bg-card/50 backdrop-blur-[40px] border border-border-main rounded-[48px] p-20 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden min-h-[600px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

              <div className="relative mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-t-4 border-primary border-r-4 border-r-transparent border-b-4 border-b-border-main border-l-4 border-l-border-main"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2
                    className={`w-12 h-12 transition-all duration-500 ${submissionStatus === "success" ? "text-green-500 scale-110" : "text-primary opacity-20"}`}
                  />
                </div>
              </div>

              <h2 className="text-3xl font-black text-text-main mb-4 tracking-widest uppercase">
                {submissionStatus === "pending"
                  ? "Processing Application"
                  : "Application Received"}
              </h2>
              <p className="text-text-muted text-lg font-medium max-w-md">
                {submissionStatus === "pending"
                  ? "We're encrypting your data and preparing it for review. Please do not close this tab."
                  : "Your application has been successfully submitted! Redirecting to summary..."}
              </p>

              {/* Status Badge */}
              <div className="mt-12 inline-flex items-center gap-3 px-6 py-2 bg-bg-secondary border border-border-main rounded-full">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${submissionStatus === "pending" ? "bg-primary" : "bg-green-500"}`}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Status: {submissionStatus.toUpperCase()}
                </span>
              </div>
            </motion.div>
          )}

          {view === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-bg-card/50 backdrop-blur-[40px] border border-border-main rounded-[32px] md:rounded-[48px] p-6 md:p-14 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-16 relative z-10">
                <div className="relative w-32 h-32 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] overflow-hidden">
                  <img
                    src={formData.photo!}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h2 className="text-4xl font-bold text-text-main tracking-tight">
                      {formData.fullName}
                    </h2>
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase text-green-500 tracking-widest">
                      Submitted
                    </div>
                  </div>
                  <p
                    className={`${rochester.className} text-3xl text-primary mb-2`}
                  >
                    Partner Application
                  </p>
                  <p className="text-text-muted text-sm font-medium">
                    Application ID: #{applicationId}
                  </p>
                </div>
                <div className="md:ml-auto">
                  <DiscoveryButton
                    label="Edit Information"
                    onClick={() => setView("form")}
                    className="scale-90 md:scale-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SummaryItem label="Gender" value={formData.gender} />
                    <SummaryItem label="Age" value={formData.age} />
                    <SummaryItem label="Location" value={formData.city} />
                    <SummaryItem
                      label="Hourly Rate"
                      value={`₹ ${formData.hourlyRate}/hr`}
                    />
                    <SummaryItem label="Contact" value={formData.mobile} />
                    <SummaryItem label="Email" value={formData.email} />
                    <SummaryItem label="Languages" value={formData.languages} />
                    <SummaryItem
                      label="Availability"
                      value={formData.availability}
                    />
                  </div>

                  <div className="space-y-4">
                    <SectionTitle>Professional Profile</SectionTitle>
                    <div className="bg-bg-secondary border border-border-main p-8 rounded-3xl text-text-main leading-relaxed font-medium">
                      {formData.bio}
                    </div>
                  </div>

                  {/* Gallery Section in Summary */}
                  {formData.gallery.filter(Boolean).length > 0 && (
                    <div className="space-y-4 pt-4">
                      <SectionTitle>Uploaded Gallery</SectionTitle>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-bg-secondary/30 p-6 rounded-[32px] border border-border-main">
                        {formData.gallery.filter(Boolean).map((photo, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-square rounded-2xl overflow-hidden border-2 border-white/5 shadow-xl group"
                          >
                            <img 
                              src={photo!} 
                              alt={`Gallery ${i}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Proofs in Summary */}
                  {formData.idProofs.filter(Boolean).length > 0 && (
                    <div className="space-y-4 pt-4">
                      <SectionTitle>Verification Proofs</SectionTitle>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-bg-secondary/30 p-6 rounded-[32px] border border-border-main">
                        {formData.idProofs.map((proof, i) => proof && (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/5 shadow-xl group relative"
                          >
                            <img 
                              src={proof} 
                              alt={`Proof ${i}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-primary/80 px-3 py-1 rounded-full backdrop-blur-md">
                                {i === 0 ? "ID Front" : i === 1 ? "ID Back" : "Selfie"}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Verification & Status */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-8 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    <SectionTitle>Verification</SectionTitle>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">
                          Terms Accepted
                        </span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">
                          ID Front Uploaded
                        </span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">
                          ID Back Uploaded
                        </span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">
                          Selfie Verified
                        </span>
                        <CheckCircle2
                          size={16}
                          className={`${formData.idProofs[2] ? "text-green-500" : "text-text-muted"}`}
                        />
                      </div>
                    </div>

                    <div className="mt-10 p-4 bg-bg-card rounded-2xl border border-border-main">
                      <div className="flex items-center gap-3 text-text-main mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">
                          Review Status
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                        Your records are now in our secure queue. An
                        administrator will verify your ID proofs manually within
                        24-48 hours.
                      </p>
                    </div>
                  </div>

                  {/* Welcome/Success Message - Only shows on fresh submission */}
                  {showSuccessCard ? (
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 p-8 rounded-[32px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />
                      <SectionTitle>Success!</SectionTitle>
                      <p className="text-text-muted text-sm font-medium leading-relaxed">
                        Congratulations! Your application is in the system.
                        We'll send an invite to{" "}
                        <span className="text-text-main font-bold">
                          {formData.email}
                        </span>{" "}
                        once approved.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-bg-card border border-border-main p-8 rounded-[32px]">
                      <SectionTitle>Application Active</SectionTitle>
                      <p className="text-text-muted text-sm font-medium leading-relaxed">
                        Your application is currently being reviewed. You can
                        update your information at any time, which will refresh
                        your place in the queue.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS Overrides */}
      <style jsx global>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </section>
  );
}



