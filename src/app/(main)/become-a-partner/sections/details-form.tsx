"use client";

import { useState, useEffect, useRef } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CircleCropper from "@/components/ui/CircleCropper";
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
  Edit3,
  ChevronUp,
  Calendar,
  Video,
  ShieldAlert,
} from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";
import DiscoveryButton from "@/components/ui/DiscoveryButton";
import { toast } from "@/components/ui/toastStore";
import Loader from "@/components/loader/Loader";
import { useAuthStore } from "@/modules/auth/store";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});
const getNext7Days = () => {
  const dates = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      dayName: weekdays[d.getDay()],
      dayNum: d.getDate(),
      month: months[d.getMonth()],
      fullString: d.toISOString().split("T")[0],
    });
  }
  return dates;
};

const timeSlots = [
  "09:30 AM - 10:00 AM",
  "10:30 AM - 11:00 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "03:00 PM - 03:30 PM",
  "04:00 PM - 04:30 PM",
  "05:00 PM - 05:30 PM",
];

// --- Moved Components Outside to prevent Focus Loss ---

const countryCitiesMap: Record<string, string[]> = {
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"],
  "United Kingdom": ["London", "Birmingham", "Leeds", "Glasgow", "Sheffield", "Manchester", "Edinburgh", "Liverpool"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
  "Singapore": ["Singapore"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Taif", "Tabuk", "Buraidah"],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Umm Salal", "Madinat ash Shamal"],
  "Nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Dharan"],
  "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal"],
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Anuradhapura"]
};

const countries = [
  { code: "+91", iso: "in", name: "India" },
  { code: "+1", iso: "us", name: "United States" },
  { code: "+44", iso: "gb", name: "United Kingdom" },
  { code: "+61", iso: "au", name: "Australia" },
  { code: "+971", iso: "ae", name: "United Arab Emirates" },
  { code: "+65", iso: "sg", name: "Singapore" },
  { code: "+49", iso: "de", name: "Germany" },
  { code: "+33", iso: "fr", name: "France" },
  { code: "+966", iso: "sa", name: "Saudi Arabia" },
  { code: "+974", iso: "qa", name: "Qatar" },
  { code: "+977", iso: "np", name: "Nepal" },
  { code: "+880", iso: "bd", name: "Bangladesh" },
  { code: "+94", iso: "lk", name: "Sri Lanka" },
];


const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}



const TagInput = ({ tags, onChange, placeholder }: TagInputProps) => {
  const tagsArray = Array.isArray(tags)
    ? tags
    : typeof tags === "string" && tags
      ? (tags as string).split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!tagsArray.includes(trimmed)) {
      onChange([...tagsArray, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tagsArray.length > 0) {
      onChange(tagsArray.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tagsArray.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="w-full flex flex-wrap items-center gap-2 p-4 min-h-[56px] rounded-2xl border transition-all duration-300 shadow-sm cursor-text bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
    >
      {tagsArray.map((tag, idx) => (
        <span 
          key={idx} 
          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl text-text-main text-xs font-semibold transition-colors hover:bg-white/15 select-none"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(idx);
            }}
            className="text-text-muted hover:text-text-main hover:scale-110 transition-transform p-0.5 flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-text-muted cursor-pointer" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        placeholder={tagsArray.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          if (val.endsWith(",")) {
            addTag(val.slice(0, -1));
          } else {
            setInputValue(val);
          }
        }}
        onBlur={() => addTag(inputValue)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] !bg-transparent !border-none !outline-none focus:!outline-none focus:!border-none focus:!ring-0 !ring-0 text-text-main text-sm font-semibold placeholder:text-text-muted p-0 m-0 !shadow-none"
        style={{ border: "none", outline: "none", boxShadow: "none", background: "transparent", backgroundColor: "transparent" }}
      />
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-5">
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
      className={`w-6 h-6 shrink-0 rounded-[6px] border-2 flex items-center justify-center transition-all duration-300 ${checked ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "border-slate-500 group-hover:border-primary"}`}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-3.5 h-3.5 text-white stroke-3" />
        </motion.div>
      )}
    </div>
    <span
      className={`text-[15px] font-medium transition-colors z-10 ${checked ? "text-text-main font-bold" : "text-text-main group-hover:text-primary"}`}
    >
      {label}
    </span>
    {checked && (
      <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/10 to-transparent z-0 pointer-events-none" />
    )}
  </label>
);

const getInputClass = (hasError = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus:border-primary focus:ring-primary/20"
  }`;

const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const width = crop.width * scaleX;
  const height = crop.height * scaleY;
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Promise.reject(new Error("No 2d context"));
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve("");
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, "image/jpeg", 0.95);
  });
};

export default function DetailsForm() {
  const { user, updateUserProfile } = useAuthStore();
  const storageKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";

  // Crop States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [cropType, setCropType] = useState<'photo' | 'banner' | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = cropType === "photo" ? 1 : 3 / 1;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const [formData, setFormData] = useState({
    photo: null as string | null,
    banner: null as string | null,
    fullName: "",
    gender: "Select Gender",
    age: "",
    city: "",
    mobile: "",
    phoneCountryCode: "+91",
    email: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountHolderName: "",
    country: "",
    pincode: "",
    upiId: "",
    addons: [] as string[],
    otherAddon: "",
    languages: [] as string[],
    bio: "",
    tagsInput: [] as string[],
    interestsInput: [] as string[],
    hourlyRate: "",
    availability: [] as string[],
    instagram: "",
    linkedin: "",
    termsAgreed: false,
    idProofs: [null, null, null, null] as (string | null)[],
    gallery: [] as string[],
    videos: Array(3).fill(null) as (string | null)[],
  });
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [partnerCountryOpen, setPartnerCountryOpen] = useState(false);
  const [partnerCityOpen, setPartnerCityOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  const [view, setView] = useState<"form" | "processing" | "kyc-schedule" | "summary">("form");
  const [submissionStatus, setSubmissionStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  

  const [verificationStatus, setVerificationStatus] = useState<
    "DRAFT" | "PENDING" | "VERIFIED" | "REJECTED" | "NEEDS_REVISION"
  >("DRAFT");
  const [kycStatus, setKycStatus] = useState<
    "NOT_SCHEDULED" | "SCHEDULED" | "APPROVED" | "REJECTED" | "RESCHEDULE_REQUESTED" | "LINK_SHARED"
  >("NOT_SCHEDULED");
  const [kycDate, setKycDate] = useState("");
  const [kycSlot, setKycSlot] = useState("");
  const [selectedKycDate, setSelectedKycDate] = useState("");
  const [selectedKycSlot, setSelectedKycSlot] = useState("");
  const [zoomLink, setZoomLink] = useState("");

  const [verificationNotes, setVerificationNotes] = useState<string>("");
  const [revisionText, setRevisionText] = useState<string>("");
  const [showRevisionForm, setShowRevisionForm] = useState<boolean>(false);

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
    let activeAppId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;

    // Seed Sabrina Carpenter if she is logged in and doesn't have an application yet
    if (user && user.email === "sabrina@gmail.com" && !localStorage.getItem(storageKey)) {
      activeAppId = "APP-123456";
      localStorage.setItem(storageKey, JSON.stringify({
        applicationId: activeAppId,
        formData: {
          fullName: "Sabrina Carpenter",
          displayName: "Sabrina",
          gender: "Female",
          age: "24",
          city: "New York, USA",
          mobile: "+91 9876543210",
          phoneCountryCode: "+91",
          email: "sabrina@gmail.com",
          bio: "Singer, songwriter, actress and your companion. Let's talk about music, films, and coffee.",
          hourlyRate: "899",
          languages: ["English", "French"],
          interestsInput: ["Music", "Coffee", "Films"],
          tagsInput: ["Singer", "Actor", "Artist"],
          termsAgreed: true,
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256",
          verificationStatus: "VERIFIED"
        },
        submissionStatus: "success",
        verificationStatus: "VERIFIED",
        kycStatus: "APPROVED",
        view: "summary"
      }));
    }

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.applicationId) {
          activeAppId = parsed.applicationId;
        }
        setApplicationId(activeAppId);
        const loadedFormData = parsed.formData || {};
        if (typeof loadedFormData.tagsInput === "string") {
          loadedFormData.tagsInput = loadedFormData.tagsInput
            ? loadedFormData.tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean)
            : [];
        }
        if (typeof loadedFormData.interestsInput === "string") {
          loadedFormData.interestsInput = loadedFormData.interestsInput
            ? loadedFormData.interestsInput.split(",").map((i: string) => i.trim()).filter(Boolean)
            : [];
        }
        if (!loadedFormData.videos || !Array.isArray(loadedFormData.videos)) {
          loadedFormData.videos = Array(3).fill(null);
        }
        if (loadedFormData.gallery && Array.isArray(loadedFormData.gallery)) {
          loadedFormData.gallery = loadedFormData.gallery
            .map((img: any) => typeof img === "string" ? img : (img && img.image ? img.image : null))
            .filter(Boolean);
        } else {
          loadedFormData.gallery = [];
        }
        setFormData((prev) => ({
          ...prev,
          ...loadedFormData,
        }));
        setSubmissionStatus(parsed.submissionStatus || "pending");
        setVerificationStatus(parsed.verificationStatus || "DRAFT");
        setVerificationNotes(parsed.verificationNotes || "");
        setKycStatus(parsed.kycStatus || "NOT_SCHEDULED");
        setKycDate(parsed.kycDate || "");
        setKycSlot(parsed.kycSlot || "");
        setZoomLink(parsed.zoomLink || "");        
        // If they already submitted successfully or are pending review/verified, show summary
        if (parsed.submissionStatus === "success" || parsed.verificationStatus === "PENDING" || parsed.verificationStatus === "VERIFIED" || parsed.verificationStatus === "REJECTED") {
          setView("summary");
          setShowSuccessCard(false);
        } else if (parsed.verificationStatus === "NEEDS_REVISION") {
          setView("form");
        } else if (parsed.view === "kyc-schedule") {
          setView("kyc-schedule");
        }
      } catch (e) {
        console.error("Failed to parse saved application data", e);
      }
    } else {
      setApplicationId(activeAppId);
      // Clear/reset form to blank defaults if no saved data exists for this user
      setFormData({
        photo: null,
        banner: null,
        fullName: "",
        gender: "Select Gender",
        age: "",
        city: "",
        mobile: "",
        phoneCountryCode: "+91",
        email: "",
        bankName: "",
        bankAccountNumber: "",
        bankIfscCode: "",
        bankAccountHolderName: "",
        country: "",
        pincode: "",
        upiId: "",
        addons: [],
        otherAddon: "",
        languages: [],
        bio: "",
        tagsInput: [],
        interestsInput: [],
        hourlyRate: "",
        availability: [],
        instagram: "",
        linkedin: "",
        termsAgreed: false,
        idProofs: [null, null, null, null],
        gallery: [],
        videos: Array(3).fill(null),
      });
      setSubmissionStatus("pending");
      setVerificationStatus("DRAFT");
      setKycStatus("NOT_SCHEDULED");
      setView("form");
    }
    setIsHydrated(true);
  }, [storageKey]);

  // Persistence: Save on Change (Include lightweight Browser Object URLs)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          applicationId,
          formData: formData,
          submissionStatus,
          view,
          verificationStatus,
          verificationNotes,
          kycStatus,
          kycDate,
          kycSlot,
          zoomLink,
        }),
      );
      window.dispatchEvent(new Event("partnerStatusChange"));
    }
  }, [formData, submissionStatus, view, verificationStatus, verificationNotes, kycStatus, kycDate, kycSlot, zoomLink, isHydrated, storageKey, applicationId]);


  // Auto-Scroll on View Change
  useEffect(() => {
    if (isHydrated && (view === "processing" || view === "summary" || view === "kyc-schedule")) {
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
      toast.error("Please upload a profile photo.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.fullName) {
      toast.error("Please enter your full name.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (formData.gender === "Select Gender") {
      toast.error("Please select your gender.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.age) {
      toast.error("Please enter your age.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (parseInt(formData.age) < 18) {
      toast.error("You must be 18 years or older to become a partner.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.city || formData.city === "Select City") {
      toast.error("Please select your city.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.mobile) {
      toast.error("Please enter your mobile number.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.email) {
      toast.error("Please enter your email address.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.country || formData.country === "Select Country") {
      toast.error("Please select your country.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.pincode) {
      toast.error("Please enter your pincode.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.upiId) {
      toast.error("Please enter your UPI ID.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.bankAccountHolderName) {
      toast.error("Please enter bank account holder name.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.bankName) {
      toast.error("Please enter your bank name.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.bankAccountNumber) {
      toast.error("Please enter your bank account number.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.bankIfscCode) {
      toast.error("Please enter bank IFSC code.");
      scrollTo(basicInfoRef);
      return false;
    }
    if (!formData.hourlyRate) {
      toast.error("Please enter your hourly rate.");
      scrollTo(basicInfoRef);
      return false;
    }

    const filledGallery = formData.gallery.filter(p => p !== null).length;
    if (filledGallery < 3) {
      toast.error("Please upload at least 3 photos to your gallery.");
      scrollTo(galleryRef);
      return false;
    }

    if (!formData.bio) {
      toast.error("Please write a bio about yourself.");
      scrollTo(bioRef);
      return false;
    }


    if (!formData.idProofs[0] || !formData.idProofs[1] || !formData.idProofs[2] || !formData.idProofs[3]) {
      toast.error("Please upload Aadhaar Front, Aadhaar Back, PAN Card Front, and PAN Card Back.");
      scrollTo(docsRef);
      return false;
    }

    if (!formData.termsAgreed) {
      toast.error("You must agree to the terms and conditions.");
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
    setVerificationStatus("PENDING");
    setVerificationNotes("");
    setShowSuccessCard(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccessCard(false);

    if (kycStatus === "NOT_SCHEDULED") {
      setView("kyc-schedule");
    } else {
      setView("summary");
    }
  };


  const handleApprove = () => {
    setVerificationStatus("VERIFIED");
    setKycStatus("APPROVED");
    setVerificationNotes("");
    toast.success("Application Approved successfully!");

    const saved = localStorage.getItem("approved_partners");
    const list = saved ? JSON.parse(saved) : [];

    // Map formData to Partner interface with unique collision-free ID
    const nameSlug = formData.fullName.toLowerCase().replace(/\s+/g, "-");
    const uniqueSuffix = applicationId ? applicationId.replace("APP-", "") : Math.floor(100000 + Math.random() * 900000);
    const uniqueId = `${nameSlug}-${uniqueSuffix}`;

    // Find if the partner already exists in the approved list
    const existingPartner = list.find((p: any) => 
      p.name === formData.fullName || 
      (p.id && (p.id === "2" || p.id === "sabrina-carpenter")) ||
      (user?.id && String(p.id).includes(user.id))
    );

    const newPartner = {
      ...existingPartner,
      id: existingPartner?.id || uniqueId,
      name: formData.fullName,
      age: parseInt(formData.age) || 22,
      gender: formData.gender,
      location: formData.city || "Mumbai, India",
      rating: existingPartner?.rating || 0,
      verified: true,
      distance: existingPartner?.distance || 0.8,
      image: formData.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256",
      banner: formData.banner || undefined,
      bio: formData.bio || "",
      phoneCountryCode: formData.phoneCountryCode || "+91",
      bankName: formData.bankName,
      bankAccountNumber: formData.bankAccountNumber,
      bankIfscCode: formData.bankIfscCode,
      bankAccountHolderName: formData.bankAccountHolderName,
      country: formData.country,
      pincode: formData.pincode,
      upiId: formData.upiId,
      tags: formData.tagsInput.length > 0 ? formData.tagsInput.map(t => {
        const trimmed = t.trim();
        return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      }).filter(Boolean) : ["NA"],
      interests: formData.interestsInput.length > 0 ? formData.interestsInput.map(i => i.trim()).filter(Boolean).join(", ") : "NA",
      languages: formData.languages && formData.languages.length > 0 ? formData.languages.join(", ") : "NA",
      reviews: existingPartner?.reviews || [],
      gallery: formData.gallery.filter(Boolean).map((img, idx) => ({
        id: String(idx + 1),
        image: img as string,
      })),
      videos: formData.videos.filter(Boolean) as string[],
      pricing: {
        oneHour: parseFloat(formData.hourlyRate) || 499,
        twoHours: (parseFloat(formData.hourlyRate) || 499) * 1.8,
        threeHours: (parseFloat(formData.hourlyRate) || 499) * 2.5,
        fourHours: (parseFloat(formData.hourlyRate) || 499) * 3.2,
        fiveHours: (parseFloat(formData.hourlyRate) || 499) * 4.0,
        eightHours: (parseFloat(formData.hourlyRate) || 499) * 6.0,
      },
    };

    try {
      // Prevent duplicate IDs
      const filtered = list.filter((p: any) => p.id !== newPartner.id);
      localStorage.setItem("approved_partners", JSON.stringify([newPartner, ...filtered]));

      updateUserProfile({
        name: formData.fullName,
        gender: formData.gender,
        age: formData.age,
        country: formData.country,
        city: formData.city,
        phone: formData.mobile,
        phone_country_code: formData.phoneCountryCode,
        address: `${formData.city}, ${formData.country || ""}`
      });
      window.dispatchEvent(new Event("partnerStatusChange"));
      window.dispatchEvent(new Event("partner_profile_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestRevision = (notes: string) => {
    if (!notes.trim()) {
      toast.error("Please enter revision details");
      return;
    }
    setVerificationStatus("NEEDS_REVISION");
    setVerificationNotes(notes);
    setView("form");
    setShowRevisionForm(false);
    setRevisionText("");
    toast.info("Revision feedback submitted. Form re-opened.");
  };

  const handleDecline = () => {
    setVerificationStatus("REJECTED");
    setVerificationNotes("Your application does not meet our community standards.");
    toast.error("Application Declined.");
  };
  const handleReset = () => {
    setVerificationStatus("DRAFT");
    setVerificationNotes("");
    setSubmissionStatus("pending");
    setView("form");
    setKycStatus("NOT_SCHEDULED");
    setKycDate("");
    setKycSlot("");
    setZoomLink("");
    setFormData({
      photo: null,
      banner: null,
      fullName: "",
      gender: "Select Gender",
      age: "",
      city: "",
      mobile: "",
      phoneCountryCode: "+91",
      email: "",
      bankName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankAccountHolderName: "",
      country: "",
      pincode: "",
      upiId: "",
      addons: [],
      otherAddon: "",
      languages: [],
      bio: "",
      tagsInput: [],
      interestsInput: [],
      hourlyRate: "",
      availability: [],
      instagram: "",
      linkedin: "",
      termsAgreed: false,
      idProofs: [null, null, null, null],
      gallery: [],
      videos: Array(3).fill(null),
    });
    localStorage.removeItem(storageKey);
    // Also remove from approved_partners
    try {
      const saved = localStorage.getItem("approved_partners");
      if (saved) {
        const list = JSON.parse(saved);
        const filtered = list.filter((p: any) => p.name !== formData.fullName);
        localStorage.setItem("approved_partners", JSON.stringify(filtered));
      }
    } catch (e) {
      console.error(e);
    }
    toast.info("Application cleared.");
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
      const blobUrl = URL.createObjectURL(file);
      const newProofs = [...formData.idProofs];
      newProofs[index] = blobUrl;
      setFormData({ ...formData, idProofs: newProofs });
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newUrls.push(url);
        }
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newUrls]
      }));
      toast.success(`Selected ${newUrls.length} new photo(s) to add.`);
    }
  };

  const removeGalleryPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));
    toast.success("Photo removed from gallery.");
  };

  const handleVideoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error("Video file is too large (max 15MB)");
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      setFormData((prev) => {
        const newVideos = [...prev.videos];
        newVideos[index] = blobUrl;
        return { ...prev, videos: newVideos };
      });
    }
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      newVideos[index] = null;
      return { ...prev, videos: newVideos };
    });
  };

  if (!isHydrated) {
    return <Loader />;
  }

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
              className="relative bg-bg-card/30 backdrop-blur-2xl border border-border-main rounded-[32px] md:rounded-[48px] p-6 md:p-14 shadow-2xl overflow-hidden"
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
                <div className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent mx-auto mt-6 opacity-30" />
              </div>

              {/* Revision Required Alert Banner */}
              {verificationStatus === "NEEDS_REVISION" && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-14 p-6 md:p-8 bg-red-500/10 border border-red-500/30 rounded-3xl flex flex-col md:flex-row items-start gap-4 relative overflow-hidden shadow-lg z-10"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                  <AlertCircle className="w-7 h-7 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-red-500 text-[11px] font-black uppercase tracking-widest leading-none">
                      Revision Required from Admin
                    </h4>
                    <p className="text-text-main text-sm font-semibold leading-relaxed">
                      {verificationNotes || "Please review and correct the marked fields below before resubmitting."}
                    </p>
                  </div>
                </motion.div>
              )}

              <form
                className="space-y-12 relative z-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {/* Banner & Photo Upload Section */}
                <div className="space-y-6 mb-10" ref={basicInfoRef}>
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
                          onClick={() => setFormData({ ...formData, banner: null })}
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.addEventListener("load", () => {
                                setTempImageSrc(reader.result as string);
                                setCropType("banner");
                                setCropModalOpen(true);
                              });
                              reader.readAsDataURL(file);
                            }
                          }}
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.addEventListener("load", () => {
                                setTempImageSrc(reader.result as string);
                                setCropType("photo");
                                setCropModalOpen(true);
                              });
                              reader.readAsDataURL(file);
                            }
                          }}
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
                          onClick={() =>
                            setFormData({ ...formData, photo: null })
                          }
                          className="absolute cursor-pointer top-0 right-0 w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] border-4 border-bg-base z-20 hover:scale-110 transition-all duration-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
                      <div className={`flex rounded-2xl overflow-hidden transition-all duration-300 border focus-within:ring-4 focus-within:ring-primary/20 ${showErrors && formData.gender === "Select Gender" ? "bg-red-500/5 border-red-500 focus-within:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]" : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus-within:bg-bg-base dark:focus-within:bg-bg-base focus-within:border-primary"}`}>
                        <button
                          type="button"
                          onClick={() => setIsGenderOpen(!isGenderOpen)}
                          className="cursor-pointer flex-1 p-4 md:p-5 text-left text-text-main focus:outline-none min-h-[60px] flex items-center font-medium tracking-wide"
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
                          className="cursor-pointer w-16 bg-linear-to-br from-primary-dark to-accent flex items-center justify-center text-white shrink-0 hover:from-primary hover:to-accent/80 transition-colors shadow-inner"
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
                            className="absolute  z-50 top-full mt-3 left-0 w-full bg-bg-base border border-border-main rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden backdrop-blur-xl"
                          >
                            {genders.map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, gender: g });
                                  setIsGenderOpen(false);
                                }}
                                className="w-full cursor-pointer p-4 md:p-5 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300"
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
                    <div className={`flex rounded-2xl overflow-hidden transition-all duration-300 border min-h-[60px] focus-within:ring-4 focus-within:ring-primary/20 ${showErrors && (!formData.age || parseInt(formData.age) < 18) ? "bg-red-500/5 border-red-500 focus-within:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]" : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus-within:bg-bg-base dark:focus-within:bg-bg-base focus-within:border-primary"}`}>
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
                          className="flex-1 cursor-pointer bg-primary/10 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors border-b border-border-main"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAgeChange(false)}
                          className="flex-1 cursor-pointer bg-primary/10 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

                  {/* Phone Country Code & Number */}
                  <div className="flex gap-4 col-span-1">
                    <div className="w-[105px] shrink-0 relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className={`${getInputClass(showErrors && !formData.phoneCountryCode)} flex items-center justify-between gap-1 whitespace-nowrap cursor-pointer pl-3 pr-2`}
                      >
                        <span className="flex items-center gap-1.5">
                          <img
                            src={`https://flagcdn.com/w40/${(countries.find(c => c.code === formData.phoneCountryCode)?.iso || "in")}.png`}
                            alt="Flag"
                            className="w-5 h-3.5 object-cover rounded-[2px] shrink-0"
                          />
                          <span>{formData.phoneCountryCode}</span>
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 shrink-0 ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isCountryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute z-50 left-0 top-full mt-2 w-56 max-h-60 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl custom-scrollbar flex flex-col"
                          >
                            {countries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, phoneCountryCode: c.code });
                                  setIsCountryDropdownOpen(false);
                                }}
                                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-left text-text-main hover:bg-primary/15 transition-colors text-sm font-medium ${c.code === formData.phoneCountryCode ? "bg-primary/10 text-primary" : ""}`}
                              >
                                <img
                                  src={`https://flagcdn.com/w40/${c.iso}.png`}
                                  alt={c.name}
                                  className="w-5 h-3.5 object-cover rounded-[2px] shrink-0"
                                />
                                <span className="text-xs font-semibold">{c.code} ({c.name})</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex-1">
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
                    </div>
                  </div>

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

                {/* Location & Payment Details */}
                <div>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Location & Payment Details</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <InputWrapper>
                      <button
                        type="button"
                        onClick={() => setPartnerCountryOpen(!partnerCountryOpen)}
                        className={`${getInputClass(showErrors && (!formData.country || formData.country === "Select Country" || formData.country === ""))} flex items-center justify-between cursor-pointer`}
                      >
                        <span className={!formData.country || formData.country === "Select Country" || formData.country === "" ? "text-text-muted" : "text-text-main"}>
                          {formData.country || "Select Country"}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${partnerCountryOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {partnerCountryOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40 cursor-default" 
                              onClick={() => setPartnerCountryOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 5, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl custom-scrollbar flex flex-col"
                            >
                              {Object.keys(countryCitiesMap).map((cName) => (
                                <button
                                  key={cName}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, country: cName, city: "Select City" });
                                    setPartnerCountryOpen(false);
                                  }}
                                  className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                                    formData.country === cName ? "bg-primary/10 text-primary" : ""
                                  }`}
                                >
                                  {cName}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </InputWrapper>

                    <InputWrapper>
                      <button
                        type="button"
                        disabled={!formData.country || formData.country === "Select Country" || formData.country === ""}
                        onClick={() => setPartnerCityOpen(!partnerCityOpen)}
                        className={`${getInputClass(showErrors && (!formData.city || formData.city === "Select City" || formData.city === ""))} flex items-center justify-between ${
                          (!formData.country || formData.country === "Select Country" || formData.country === "") ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <span className={!formData.city || formData.city === "Select City" || formData.city === "" ? "text-text-muted" : "text-text-main"}>
                          {formData.city || "Select City"}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${partnerCityOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {partnerCityOpen && formData.country && formData.country !== "Select Country" && formData.country !== "" && (
                          <>
                            <div 
                              className="fixed inset-0 z-40 cursor-default" 
                              onClick={() => setPartnerCityOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 5, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl custom-scrollbar flex flex-col"
                            >
                              {(countryCitiesMap[formData.country] || []).map((cName) => (
                                <button
                                  key={cName}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, city: cName });
                                    setPartnerCityOpen(false);
                                  }}
                                  className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                                    formData.city === cName ? "bg-primary/10 text-primary" : ""
                                  }`}
                                >
                                  {cName}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </InputWrapper>

                    <InputWrapper>
                      <input
                        type="text"
                        placeholder="Pincode"
                        className={getInputClass(showErrors && !formData.pincode)}
                        value={formData.pincode}
                        onChange={(e) =>
                          setFormData({ ...formData, pincode: e.target.value })
                        }
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <input
                        type="text"
                        placeholder="UPI ID"
                        className={getInputClass(showErrors && !formData.upiId)}
                        value={formData.upiId}
                        onChange={(e) =>
                          setFormData({ ...formData, upiId: e.target.value })
                        }
                      />
                    </InputWrapper>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Bank Account Details</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <InputWrapper className="col-span-1 md:col-span-2">
                      <input
                        type="text"
                        placeholder="Account Holder Name"
                        className={getInputClass(showErrors && !formData.bankAccountHolderName)}
                        value={formData.bankAccountHolderName}
                        onChange={(e) =>
                          setFormData({ ...formData, bankAccountHolderName: e.target.value })
                        }
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <input
                        type="text"
                        placeholder="Bank Name"
                        className={getInputClass(showErrors && !formData.bankName)}
                        value={formData.bankName}
                        onChange={(e) =>
                          setFormData({ ...formData, bankName: e.target.value })
                        }
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <input
                        type="text"
                        placeholder="Account Number"
                        className={getInputClass(showErrors && !formData.bankAccountNumber)}
                        value={formData.bankAccountNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, bankAccountNumber: e.target.value })
                        }
                      />
                    </InputWrapper>

                    <InputWrapper className="col-span-1 md:col-span-2">
                      <input
                        type="text"
                        placeholder="IFSC Code"
                        className={getInputClass(showErrors && !formData.bankIfscCode)}
                        value={formData.bankIfscCode}
                        onChange={(e) =>
                          setFormData({ ...formData, bankIfscCode: e.target.value })
                        }
                      />
                    </InputWrapper>
                  </div>
                </div>

                {/* Languages Spoken */}
                <div>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Languages</SectionTitle>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                    {["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", "Odia", "Spanish", "French", "German", "Arabic"].map((item, idx) => {
                      const isCore = idx < 4;
                      if (!isCore && !showAllLanguages) return null;
                      return (
                        <CheckboxItem
                          key={item}
                          label={item}
                          checked={formData.languages.includes(item)}
                          onChange={() => toggleArrayItem("languages", item)}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllLanguages(!showAllLanguages)}
                    className="w-full cursor-pointer bg-bg-secondary border border-border-main border-dashed rounded-2xl p-5 text-text-muted hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 font-medium group"
                  >
                    {showAllLanguages ? (
                      <>
                        <ChevronUp className="w-5 h-5 text-primary group-hover:scale-125 transition-transform duration-300" />{" "}
                        See Less Languages
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 text-primary group-hover:scale-125 transition-transform duration-300" />{" "}
                        See More Languages
                      </>
                    )}
                  </button>
                </div>

                {/* Short Bio */}
                <div ref={bioRef}>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Short Bio</SectionTitle>
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
                {/* Tags & Interests */}
                <div>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Tags & Interests (Optional)</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputWrapper>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2 ml-1">
                        Tags
                      </label>
                      <TagInput
                        tags={formData.tagsInput}
                        onChange={(tags) => setFormData({ ...formData, tagsInput: tags })}
                        placeholder="e.g. Friendly, Traveler, Foodie (Enter or comma to add)"
                      />
                    </InputWrapper>

                    <InputWrapper>
                      <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2 ml-1">
                        Interests
                      </label>
                      <TagInput
                        tags={formData.interestsInput}
                        onChange={(interests) => setFormData({ ...formData, interestsInput: interests })}
                        placeholder="e.g. Cooking, Photography, Music (Enter or comma to add)"
                      />
                    </InputWrapper>
                  </div>
                </div>

                {/* Gallery Upload */}
                <div ref={galleryRef}>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>
                    Partner Gallery{" "}
                    <span className="text-text-muted text-sm font-normal ml-2 tracking-normal italic">
                      (Min 3 photos)
                    </span>
                  </SectionTitle>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                    {/* Render existing gallery images */}
                    {formData.gallery.filter(Boolean).map((photo, index) => (
                      <motion.div
                        key={index}
                        className="relative aspect-square rounded-[32px] overflow-hidden border-2 border-white/5 bg-bg-secondary/40 backdrop-blur-xl hover:border-primary/40 hover:shadow-primary/20 transition-all duration-700 group shadow-2xl"
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
                            onClick={() => removeGalleryPhoto(index)}
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
                      className={`relative aspect-square rounded-[32px] overflow-hidden border-2 border-dashed transition-all duration-700 group shadow-2xl ${
                        showErrors && formData.gallery.length < 3 
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
                          {formData.gallery.length < 3 && (
                            <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider">
                              {3 - formData.gallery.length} more required
                            </span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                        />
                        {/* Hover Effect Light */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover/add:opacity-100 transition-opacity duration-700" />
                      </label>
                    </motion.div>
                  </div>
                </div>

                {/* Video Portfolio */}
                <div>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>
                    Video Introductions
                    <span className="text-text-muted text-sm font-normal ml-2 tracking-normal italic">
                      (Optional - Upload up to 3 premium video portfolios or intros)
                    </span>
                  </SectionTitle>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {formData.videos.map((video, index) => {
                      const videoTypes = [
                        { title: "Introduction Reel", desc: "Personal greeting & introduction" },
                        { title: "Portfolio Vibe", desc: "Showcase hobbies, style & vibe" },
                        { title: "Q&A Session", desc: "Answers to common questions" }
                      ];
                      const currentType = videoTypes[index] || { title: `Video ${index + 1}`, desc: "Optional video clip" };

                      return (
                        <motion.div
                          key={index}
                          className="relative aspect-video rounded-[32px] overflow-hidden border-2 transition-all duration-700 group shadow-2xl border-white/5 bg-bg-secondary/40 backdrop-blur-xl hover:border-primary/40"
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
                                  <Video className="w-4 h-4" />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVideo(index)}
                                className="absolute cursor-pointer top-3 right-3 w-10 h-10 bg-accent/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-10 transition-all duration-300 hover:bg-accent hover:scale-110 hover:-rotate-12"
                                title="Remove video"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer group/add transition-all duration-500 hover:bg-primary/5 min-h-[160px] p-4 text-center">
                              <div className="w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-700 group-hover/add:rotate-90 group-hover/add:scale-110 bg-primary/10 border border-primary/20">
                                <Video className="w-6 h-6 text-primary group-hover/add:text-accent" />
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
                                onChange={(e) => handleVideoUpload(index, e)}
                              />
                              {/* Hover Effect Light */}
                              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover/add:opacity-100 transition-opacity duration-700" />
                            </label>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* terms and condition agreement  */}
                <div ref={termsRef}>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <div className={`bg-white/2 border p-6 rounded-2xl flex items-start md:items-center gap-4 transition-all duration-500 ${showErrors && !formData.termsAgreed ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5" : "border-border-main"}`}>
                    <label className="flex items-center gap-4 w-fit cursor-pointer group">
                      <div
                        className={`w-6 h-6 shrink-0 rounded flex items-center justify-center border-2 transition-all duration-300 ${formData.termsAgreed ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : showErrors && !formData.termsAgreed ? "border-red-500" : "border-border-main group-hover:border-primary"}`}
                      >
                        {formData.termsAgreed && (
                          <Check className="w-4 h-4 text-white stroke-3" />
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

                {/* Government ID Proof */}
                <div ref={docsRef}>
                  <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
                  <SectionTitle>Verification Documents</SectionTitle>
                  <p className="text-text-muted text-sm mb-5 max-w-2xl">
                    Please upload clear pictures of your Aadhaar Card (Front,
                    Back) and PAN Card (Front, Back) for verification purposes.
                  </p>

                  <div className="bg-bg-secondary border border-border-main p-4 md:p-10 rounded-3xl grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-6 justify-center md:justify-start items-center relative overflow-hidden shadow-sm">
                    {/* Subtle background gradient inside the tray */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" />

                    {[0, 1, 2, 3].map((index) => {
                      const isRequired = true;
                      const hasError = showErrors && isRequired && !formData.idProofs[index];

                      const getLabel = (idx: number) => {
                        switch (idx) {
                          case 0:
                            return "Aadhaar Front";
                          case 1:
                            return "Aadhaar Back";
                          case 2:
                            return "PAN Front";
                          default:
                            return "PAN Back";
                        }
                      };

                      return (
                        <motion.div
                          key={index}
                          animate={hasError ? { 
                            boxShadow: ["0 0 20px rgba(239,68,68,0.1)", "0 0 30px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.1)"] 
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`relative w-full h-24 sm:h-28 md:w-36 md:h-28 border-2 border-dashed transition-all duration-500 flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl group shadow-sm ${
                            hasError 
                              ? "border-red-500 bg-red-500/5" 
                              : "border-border-main bg-bg-card hover:border-primary hover:bg-bg-secondary hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.15)]"
                          }`}
                        >
                          {formData.idProofs[index] ? (
                            <div className="relative w-full h-full group/id">
                              <img
                                src={formData.idProofs[index]!}
                                alt={getLabel(index)}
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
                                className="absolute cursor-pointer top-2 right-2 w-8 h-8 bg-accent/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-20 transition-all duration-300 hover:bg-accent hover:scale-110"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col items-center gap-2">
                                <Plus className={`w-8 h-8 group-hover:scale-125 transition-all duration-300 ${hasError ? "text-red-500" : "text-text-muted group-hover:text-primary"}`} />
                                <div className="flex flex-col items-center gap-1 text-center px-1">
                                  <span className={`text-[8px] font-black uppercase tracking-[0.1em] ${hasError ? "text-red-500" : "text-text-muted group-hover:text-primary"}`}>
                                    {getLabel(index)}
                                  </span>
                                  {isRequired && !formData.idProofs[index] && (
                                    <motion.div 
                                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                      className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] mx-auto" 
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
                    size="xl"
                    variant="primary"
                    icon={<ArrowRight className="w-6 h-6" />}
                    className="w-full cursor-pointer"
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
              className="relative bg-bg-card/50 backdrop-blur-2xl border border-border-main rounded-[48px] p-20 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden min-h-[600px]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />

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

          {view === "kyc-schedule" && (
            <motion.div
              key="kyc-schedule"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="relative bg-bg-card/50 backdrop-blur-2xl border border-border-main rounded-[32px] md:rounded-[48px] p-8 md:p-14 shadow-2xl overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

              {/* Funnel Progress Stepper */}
              <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
                
                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500 font-bold text-sm">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Details Form</span>
                </div>
                
                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] animate-pulse">
                    2
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Video KYC</span>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-bg-secondary border border-border-main flex items-center justify-center text-text-muted font-bold text-sm">
                    3
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Approval Review</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left side: slot choices */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-text-main mb-3 tracking-wide flex items-center gap-3">
                      <Video className="w-8 h-8 text-primary" />
                      Schedule Your Video KYC Call
                    </h2>
                    <p className="text-text-muted text-sm md:text-base font-medium max-w-xl mb-8">
                      Select a date and direct time slot to perform your 30-minute quick identity review call with our verification officer.
                    </p>

                    {/* Dates Horizontal Row */}
                    <div className="mb-8">
                      <label className="text-xs font-black uppercase tracking-widest text-text-muted block mb-4">
                        Available Dates
                      </label>
                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10">
                        {getNext7Days().map((d) => {
                          const isSelected = selectedKycDate === d.fullString;
                          return (
                            <button
                              key={d.fullString}
                              type="button"
                              onClick={() => {
                                setSelectedKycDate(d.fullString);
                                setSelectedKycSlot(""); // Reset slot when date changes
                              }}
                              className={`cursor-pointer min-w-[90px] p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-1 shrink-0 ${
                                isSelected
                                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                                  : "bg-bg-secondary/40 border-border-main text-text-muted hover:border-white/20 hover:text-text-main"
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider">{d.dayName}</span>
                              <span className="text-2xl font-black">{d.dayNum}</span>
                              <span className="text-[9px] font-semibold uppercase">{d.month}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots Grid */}
                    {selectedKycDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                      >
                        <label className="text-xs font-black uppercase tracking-widest text-text-muted block mb-4">
                          Available Slots
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {timeSlots.map((slot) => {
                            const isSelected = selectedKycSlot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedKycSlot(slot)}
                                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 text-center text-xs font-bold flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                                    : "bg-bg-secondary/40 border-border-main text-text-main hover:border-white/20"
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-6">
                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="cursor-pointer text-text-muted hover:text-text-main transition-colors text-sm font-semibold uppercase tracking-wider"
                    >
                      Back to Form
                    </button>
                    <PremiumButton
                      label="Confirm & Schedule Call"
                      onClick={() => {
                        if (!selectedKycDate || !selectedKycSlot) {
                          toast.error("Please select both date and time slot first.");
                          return;
                        }
                        setKycDate(selectedKycDate);
                        setKycSlot(selectedKycSlot);
                        setKycStatus("SCHEDULED");
                        setView("summary");
                        toast.success("Video KYC Scheduled successfully!");
                      }}
                      disabled={!selectedKycDate || !selectedKycSlot}
                      variant="primary"
                      icon={<Check className="w-5 h-5" />}
                    />
                  </div>
                </div>

                {/* Right side: visual checklist cards */}
                <div className="lg:col-span-4 bg-bg-secondary/30 border border-border-main p-6 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                  
                  <h3 className="text-sm font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    KYC Requirements
                  </h3>

                  <div className="space-y-4 text-xs font-semibold text-text-muted leading-relaxed">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] text-text-main">1</div>
                      <p>
                        Keep your registered physical government ID card ready (Aadhaar, PAN, Passport, or DL).
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] text-text-main">2</div>
                      <p>
                        A stable high-speed internet connection is required for video streaming.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] text-text-main">3</div>
                      <p>
                        Position yourself in a well-lit, quiet room to ensure a clean camera stream and clear voice capture.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[10px] font-bold text-text-muted text-center uppercase tracking-wide">
                      Your data is 100% encrypted & secure.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-bg-card/50 backdrop-blur-2xl border border-border-main rounded-[32px] md:rounded-[48px] p-6 md:p-14 shadow-2xl overflow-hidden"
            >
              {/* Cover Banner & Header for Summary */}
              {formData.banner ? (
                <div className="relative mb-16 rounded-3xl overflow-hidden border border-border-main bg-bg-secondary/20">
                  <div className="w-full h-36 md:h-48 relative">
                    <img
                      src={formData.banner}
                      alt="Profile Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-bg-base via-transparent to-transparent opacity-85" />
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-6 px-6 md:px-8 pb-6 -mt-14 md:-mt-16 relative z-10">
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] overflow-hidden shrink-0">
                      <img
                        src={formData.photo!}
                        alt={formData.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left pt-2">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">
                          {formData.fullName}
                        </h2>
                        <div className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest ${
                          verificationStatus === "VERIFIED" 
                            ? "bg-green-500/10 border-green-500/20 text-green-500" 
                            : verificationStatus === "REJECTED"
                              ? "bg-red-500/10 border-red-500/20 text-red-500"
                              : verificationStatus === "NEEDS_REVISION"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse"
                                : "bg-blue-500/10 border-blue-500/20 text-blue-500 animate-pulse"
                        }`}>
                          {verificationStatus === "VERIFIED" 
                            ? "Verified Live" 
                            : verificationStatus === "REJECTED"
                              ? "Declined"
                              : verificationStatus === "NEEDS_REVISION"
                                ? "Revision Requested"
                                : "Pending Review"}
                        </div>
                      </div>
                      <p className={`${rochester.className} text-2xl md:text-3xl text-primary mb-1`}>
                        Partner Application
                      </p>
                      <p className="text-text-muted text-xs font-medium">
                        Application ID: #{applicationId}
                      </p>
                    </div>
                    <div className="md:ml-auto pt-2">
                      <button
                        onClick={() => setView("form")}
                        className="relative group overflow-hidden px-6 py-3 rounded-2xl bg-bg-secondary/40 backdrop-blur-xl border border-border-main hover:border-primary/50 text-text-main hover:text-white font-bold text-sm transition-all duration-500 shadow-md hover:shadow-primary/20 flex items-center gap-3 cursor-pointer active:scale-95 scale-90 md:scale-100"
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-primary-dark/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 blur-sm group-hover:animate-pulse transition-all duration-700 pointer-events-none -z-10" />
                        <div className="p-1 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-95 group-hover:scale-100">
                          <Edit3 className="w-3.5 h-3.5" />
                        </div>
                        <span className="tracking-widest uppercase text-[10px] font-black leading-none">
                          {verificationStatus === "VERIFIED" ? "Edit Active Profile" : "Edit Information"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Header without banner */
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
                      <div className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-widest ${
                        verificationStatus === "VERIFIED" 
                          ? "bg-green-500/10 border-green-500/20 text-green-500" 
                          : verificationStatus === "REJECTED"
                            ? "bg-red-500/10 border-red-500/20 text-red-500"
                            : verificationStatus === "NEEDS_REVISION"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-500 animate-pulse"
                      }`}>
                        {verificationStatus === "VERIFIED" 
                          ? "Verified Live" 
                          : verificationStatus === "REJECTED"
                            ? "Declined"
                            : verificationStatus === "NEEDS_REVISION"
                              ? "Revision Requested"
                              : "Pending Review"}
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
                    <button
                      onClick={() => setView("form")}
                      className="relative group overflow-hidden px-7 py-3.5 rounded-2xl bg-bg-secondary/40 backdrop-blur-xl border border-border-main hover:border-primary/50 text-text-main hover:text-white font-bold text-sm transition-all duration-500 shadow-md hover:shadow-primary/20 flex items-center gap-3 cursor-pointer active:scale-95 scale-90 md:scale-100"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-primary-dark/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 blur-sm group-hover:animate-pulse transition-all duration-700 pointer-events-none -z-10" />
                      <div className="p-1.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-95 group-hover:scale-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                      <span className="tracking-widest uppercase text-[10px] font-black leading-none">
                        {verificationStatus === "VERIFIED" ? "Edit Active Profile" : "Edit Information"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Revision Alert block inside summary */}
              {verificationStatus === "NEEDS_REVISION" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-start gap-4 relative overflow-hidden shadow-lg z-10"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-widest leading-none">
                      Revision Required
                    </h4>
                    <p className="text-text-main text-sm font-semibold leading-relaxed">
                      {verificationNotes || "The administrator has requested changes to your profile details."}
                    </p>
                    <button 
                      onClick={() => setView("form")}
                      className="mt-2 text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 group cursor-pointer"
                    >
                      Make Corrections <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Rejected Alert block inside summary */}
              {verificationStatus === "REJECTED" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-12 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-start gap-4 relative overflow-hidden shadow-lg z-10"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-red-500 text-[10px] font-black uppercase tracking-widest leading-none">
                      Application Declined
                    </h4>
                    <p className="text-text-main text-sm font-semibold leading-relaxed">
                      {verificationNotes || "We regret to inform you that your companion application has been declined."}
                    </p>
                    <button 
                      onClick={handleReset}
                      className="mt-2 text-xs font-bold text-red-500 hover:underline flex items-center gap-1 group cursor-pointer"
                    >
                      Reset Form & Re-apply <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Video KYC Status block inside summary */}
              {kycStatus === "SCHEDULED" && verificationStatus === "PENDING" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-6 md:p-8 bg-bg-card border border-primary/25 hover:border-primary/45 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(var(--primary-rgb),0.08)] z-10 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-primary to-primary-dark" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-inner">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-text-main tracking-tight">
                          Video KYC Appointment
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-muted font-semibold mt-0.5">Identity Verification Call</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1.5 tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Pending Live Check
                      </span>
                    </div>
                  </div>

                  {/* Date/Time grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-bg-secondary/40 border border-border-main/40 rounded-2xl">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted shrink-0 border border-white/5">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Appointment Date</p>
                        <p className="text-sm md:text-base font-black text-text-main mt-0.5">{kycDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-border-main/40 pt-4 sm:pt-0 sm:pl-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted shrink-0 border border-white/5">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Scheduled Time Slot</p>
                        <p className="text-sm md:text-base font-black text-text-main mt-0.5">{kycSlot}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-6 pt-6 border-t border-border-main/50">
                    <p className="text-xs text-text-muted font-semibold max-w-lg leading-relaxed">
                      A representative will contact you via a secure link on your scheduled time. Please keep your physical original government ID cards ready.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView("kyc-schedule")}
                      className="px-6 py-3.5 bg-bg-secondary hover:bg-bg-card border border-border-main hover:border-primary/50 text-text-main font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shrink-0"
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      Reschedule Appointment
                    </button>
                  </div>
                </motion.div>
              )}

              {kycStatus === "REJECTED" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-6 md:p-8 bg-bg-card border border-red-500/20 hover:border-red-500/40 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(239,68,68,0.08)] z-10 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-red-500 to-red-600" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 border border-red-500/20 shadow-inner">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-text-main tracking-tight">
                          Video KYC Verification Failed
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-muted font-semibold mt-0.5">Identity Verification Check</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-500 bg-red-500/10 border border-red-500/25 rounded-full px-3 py-1.5 tracking-wider uppercase">
                        Verification Failed
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-text-main leading-relaxed">
                      Your identity verification check was unsuccessful. The verification officer could not complete the KYC check.
                    </p>
                  </div>

                  {/* Card Footer actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-6 pt-6 border-t border-border-main/50">
                    <p className="text-xs text-text-muted font-semibold max-w-lg leading-relaxed">
                      To activate your companion profile, please schedule another video slot and ensure correct identification documents are available.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView("kyc-schedule")}
                      className="px-6 py-3.5 bg-red-500 text-white hover:bg-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shrink-0 border-0"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      Reschedule Another Slot
                    </button>
                  </div>
                </motion.div>
              )}

              {kycStatus === "RESCHEDULE_REQUESTED" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-6 md:p-8 bg-bg-card border border-amber-500/20 hover:border-amber-500/40 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.08)] z-10 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-amber-500 to-amber-600" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 shadow-inner">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-text-main tracking-tight">
                          KYC Reschedule Required
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-muted font-semibold mt-0.5">Slot Select Required</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1.5 tracking-wider uppercase">
                        Action Required
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-text-main leading-relaxed">
                      The verification officer missed the scheduled appointment or requested a reschedule. Please select a new date and time slot.
                    </p>
                  </div>

                  {/* Card Footer actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-6 pt-6 border-t border-border-main/50">
                    <p className="text-xs text-text-muted font-semibold max-w-lg leading-relaxed">
                      Please select a new slot where you will be available with original identity verification documents.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView("kyc-schedule")}
                      className="px-6 py-3.5 bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shrink-0 border-0"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      Select New Slot
                    </button>
                  </div>
                </motion.div>
              )}

              {kycStatus === "LINK_SHARED" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-6 md:p-8 bg-bg-card border border-green-500/20 hover:border-green-500/40 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(34,197,94,0.08)] z-10 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-green-500 to-green-600" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 border border-green-500/20 shadow-inner">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-text-main tracking-tight">
                          Video KYC Link Ready
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-muted font-semibold mt-0.5">Live Verification Room</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-green-500 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1.5 tracking-wider uppercase animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active Call Room
                      </span>
                    </div>
                  </div>

                  {/* Date/Time grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 bg-bg-secondary/40 border border-border-main/40 rounded-2xl">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted shrink-0 border border-white/5">
                        <Calendar className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Appointment Date</p>
                        <p className="text-sm md:text-base font-black text-text-main mt-0.5">{kycDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-border-main/40 pt-4 sm:pt-0 sm:pl-6">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted shrink-0 border border-white/5">
                        <Clock className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Scheduled Time Slot</p>
                        <p className="text-sm md:text-base font-black text-text-main mt-0.5">{kycSlot}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-6 pt-6 border-t border-border-main/50">
                    <p className="text-xs text-text-muted font-semibold max-w-lg leading-relaxed">
                      The verification officer is waiting for you in the call room. Please click below to join and complete your verification.
                    </p>
                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => setView("kyc-schedule")}
                        className="px-4 py-3 bg-bg-secondary hover:bg-bg-card border border-border-main hover:border-primary/40 text-text-muted hover:text-text-main font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
                      >
                        Change Slot
                      </button>
                      <a
                        href={zoomLink || "https://zoom.us/j/become-a-partner-kyc-call"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.35)] shrink-0"
                      >
                        <Video size={14} className="text-white" />
                        Join KYC Call
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {kycStatus === "NOT_SCHEDULED" && verificationStatus === "PENDING" && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-6 md:p-8 bg-bg-card border border-amber-500/20 hover:border-amber-500/40 rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.08)] z-10 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-amber-500 to-amber-600" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 shadow-inner">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg md:text-xl font-extrabold text-text-main tracking-tight">
                          Schedule Video KYC
                        </h4>
                        <p className="text-[10px] md:text-xs text-text-muted font-semibold mt-0.5">Identity Verification Required</p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1.5 tracking-wider uppercase">
                        Action Required
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-text-main leading-relaxed">
                      You must book a time slot for video identity verification before your companion profile can be activated and made live on the platform.
                    </p>
                  </div>

                  {/* Card Footer actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-6 pt-6 border-t border-border-main/50">
                    <p className="text-xs text-text-muted font-semibold max-w-lg leading-relaxed">
                      The video call takes approximately 5-10 minutes. Please ensure you have a stable internet connection and physical identification documents.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView("kyc-schedule")}
                      className="px-6 py-3.5 bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_35px_rgba(245,158,11,0.25)] shrink-0 border-0"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      Book Slot Now
                    </button>
                  </div>
                </motion.div>
              )}

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
                    <SummaryItem label="Contact" value={`${formData.phoneCountryCode || "+91"} ${formData.mobile}`} />
                    <SummaryItem label="Email" value={formData.email} />
                    <SummaryItem label="Country" value={formData.country} />
                    <SummaryItem label="Pincode" value={formData.pincode} />
                    <SummaryItem label="UPI ID" value={formData.upiId} />
                    <SummaryItem label="Bank Holder" value={formData.bankAccountHolderName} />
                    <SummaryItem label="Bank Name" value={formData.bankName} />
                    <SummaryItem label="Bank Account" value={formData.bankAccountNumber} />
                    <SummaryItem label="IFSC Code" value={formData.bankIfscCode} />
                    <SummaryItem label="Languages" value={formData.languages} />
                  </div>

                  <div className="space-y-4">
                    <SectionTitle>Short Bio</SectionTitle>
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
                            className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/5 shadow-xl group relative"
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
                  {/* Verification Info Panel */}
                  <div className="bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20 p-8 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    <SectionTitle>Verification</SectionTitle>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">Terms Accepted</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">ID Front Uploaded</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">ID Back Uploaded</span>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted font-medium">Selfie Verified</span>
                        <CheckCircle2
                          size={16}
                          className={`${formData.idProofs[2] ? "text-green-500" : "text-text-muted"}`}
                        />
                      </div>
                    </div>

                    <div className="mt-10 p-4 bg-bg-card rounded-2xl border border-border-main">
                      <div className="flex items-center gap-3 text-text-main mb-2">
                        <div className={`w-2 h-2 rounded-full ${verificationStatus === "VERIFIED" ? "bg-green-500" : "bg-blue-500 animate-pulse"}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">
                          Review Status
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                        {verificationStatus === "VERIFIED"
                          ? "Congratulations! Your profile has been approved by the administrators and is now searchable."
                          : verificationStatus === "REJECTED"
                            ? "Your profile application has been declined. Please adjust details and re-apply."
                            : verificationStatus === "NEEDS_REVISION"
                              ? "Revisions are currently requested. Please check the feedback banner above to resubmit."
                              : "Your records are currently in our secure queue. An administrator will verify your ID proofs manually within 24-48 hours."}
                      </p>
                    </div>
                  </div>

                  {/* Active Welcome Portal Card */}
                  {verificationStatus === "VERIFIED" ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-linear-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 p-8 rounded-[32px] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />
                      <SectionTitle>You are Live!</SectionTitle>
                      <p className="text-text-muted text-sm font-medium leading-relaxed mb-6">
                        Welcome to our elite companion community! Your profile has been fully verified and is now live on our search explorer.
                      </p>
                      <button 
                        onClick={() => window.location.href = "/browse-partners"}
                        className="w-full text-center py-4 bg-green-500 text-white rounded-2xl font-bold border border-green-600/40 hover:bg-green-600 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] duration-300"
                      >
                        View Browse Listings
                      </button>
                    </motion.div>
                  ) : showSuccessCard ? (
                    <div className="bg-linear-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 p-8 rounded-[32px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />
                      <SectionTitle>Success!</SectionTitle>
                      <p className="text-text-muted text-sm font-medium leading-relaxed">
                        Congratulations! Your application is in the system. We'll send an invite to{" "}
                        <span className="text-text-main font-bold">{formData.email}</span> once approved.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-bg-card border border-border-main p-8 rounded-[32px]">
                      <SectionTitle>Application Active</SectionTitle>
                      <p className="text-text-muted text-sm font-medium leading-relaxed">
                        Your application is currently being reviewed. You can update your information at any time, which will refresh your place in the queue.
                      </p>
                    </div>
                  )}

                  {/* 🛠️ Admin Simulation Control Center */}
                  <div className="bg-bg-card border-2 border-primary/30 p-8 rounded-[32px] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 border-b border-l border-primary/30 rounded-bl-2xl text-[8px] font-black uppercase text-primary tracking-widest animate-pulse">
                      Admin Simulator
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] animate-pulse" />
                      <h4 className="text-text-main text-md font-extrabold uppercase tracking-wider">
                        Review Control Center
                      </h4>
                    </div>

                    <p className="text-xs text-text-muted font-medium mb-6 leading-relaxed">
                      Use this simulated dashboard panel to toggle administrative review actions and experience different candidate lifecycles.
                    </p>

                    {showRevisionForm ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 mb-6"
                      >
                        <textarea
                          placeholder="Type revision instructions (e.g., Please upload a clearer selfie image with your ID)..."
                          value={revisionText}
                          onChange={(e) => setRevisionText(e.target.value)}
                          className="w-full bg-bg-secondary border border-border-main rounded-xl p-3 text-xs text-text-main outline-none focus:border-amber-500 min-h-[90px] font-medium"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestRevision(revisionText)}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-bg-base font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            Submit Request
                          </button>
                          <button
                            onClick={() => setShowRevisionForm(false)}
                            className="bg-bg-secondary hover:bg-bg-card text-text-main border border-border-main font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {/* 1. Share Zoom Meeting Link */}
                        {(kycStatus === "SCHEDULED" || kycStatus === "RESCHEDULE_REQUESTED") && (
                          <button
                            onClick={() => {
                              setKycStatus("LINK_SHARED");
                              setZoomLink("https://zoom.us/j/become-a-partner-kyc-call");
                              toast.success("Zoom meeting link shared successfully!");
                            }}
                            className="w-full bg-primary text-white font-bold text-xs py-3 px-4 rounded-xl border border-primary hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02]"
                          >
                            <Video size={14} /> Share Zoom Call Link
                          </button>
                        )}

                        {/* 2. Request Reschedule */}
                        {(kycStatus === "SCHEDULED" || kycStatus === "LINK_SHARED") && (
                          <button
                            onClick={() => {
                              setKycStatus("RESCHEDULE_REQUESTED");
                              setZoomLink("");
                              toast.info("Reschedule request sent to the candidate.");
                            }}
                            className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white font-bold text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                          >
                            <Calendar size={14} /> Request KYC Reschedule (Admin Missed)
                          </button>
                        )}

                        {/* 3. Approve and Make Live */}
                        <button
                          onClick={handleApprove}
                          disabled={verificationStatus === "VERIFIED" || kycStatus !== "LINK_SHARED"}
                          className={`w-full font-bold text-xs py-3 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                            verificationStatus === "VERIFIED"
                              ? "bg-green-500/10 border-green-500/20 text-green-500/50 cursor-not-allowed animate-none"
                              : kycStatus !== "LINK_SHARED"
                                ? "bg-white/5 border-white/10 text-text-muted cursor-not-allowed"
                                : "bg-green-500 border-green-600 text-white hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:scale-[1.02]"
                          }`}
                        >
                          <CheckCircle2 size={14} /> {kycStatus === "APPROVED" || verificationStatus === "VERIFIED" ? "Approved & Live" : kycStatus === "LINK_SHARED" ? "Approve Partner Live (Post-Call)" : "Waiting for Call Link"}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setShowRevisionForm(true)}
                            disabled={verificationStatus === "VERIFIED"}
                            className={`font-bold text-xs py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                              verificationStatus === "VERIFIED"
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500/50 cursor-not-allowed"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:scale-[1.02]"
                            }`}
                          >
                            Request Revisions
                          </button>
                          <button
                            onClick={handleDecline}
                            disabled={verificationStatus === "REJECTED"}
                            className={`font-bold text-xs py-3 px-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                              verificationStatus === "REJECTED"
                                ? "bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed"
                                : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:scale-[1.02]"
                            }`}
                          >
                            Decline Profile
                          </button>
                        </div>

                        <button
                          onClick={handleReset}
                          className="w-full bg-bg-secondary hover:bg-bg-card border border-border-main hover:border-red-500/30 text-text-muted hover:text-red-500 font-bold text-xs py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                        >
                          <X size={12} /> Clear & Start Over
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Crop Modal */}
      <AnimatePresence>
        {cropModalOpen && tempImageSrc && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-secondary border border-border-main/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setTempImageSrc(null);
                  setCropType(null);
                }}
                className="absolute top-4 right-4 text-text-muted hover:text-text-main cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-text-main mb-1">
                  {cropType === "photo" ? "Crop Profile Photo" : "Crop Profile Banner"}
                </h3>
                <p className="text-xs text-text-muted">
                  {cropType === "photo"
                    ? "Drag the corners to crop your profile photo to a perfect 1:1 circle format."
                    : "Drag the corners to crop your banner image to the perfect 3:1 aspect ratio."}
                </p>
              </div>

              {/* Crop Component */}
              {cropType === "photo" ? (
                <CircleCropper
                  imageSrc={tempImageSrc}
                  onCropComplete={(croppedUrl) => {
                    setFormData({
                      ...formData,
                      photo: croppedUrl,
                    });
                    setCropModalOpen(false);
                    setTempImageSrc(null);
                    setCropType(null);
                  }}
                  onCancel={() => {
                    setCropModalOpen(false);
                    setTempImageSrc(null);
                    setCropType(null);
                  }}
                />
              ) : (
                <>
                  <div className="max-h-[50vh] overflow-y-auto w-full flex justify-center bg-black/20 rounded-2xl p-2 border border-border-main/10">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      aspect={3 / 1}
                      circularCrop={false}
                      className="max-w-full"
                    >
                      <img
                        ref={imgRef}
                        src={tempImageSrc}
                        alt="Source"
                        onLoad={onImageLoad}
                        className="max-w-full h-auto block"
                        crossOrigin="anonymous"
                      />
                    </ReactCrop>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCropModalOpen(false);
                        setTempImageSrc(null);
                        setCropType(null);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-border-main/50 text-text-muted hover:text-text-main font-bold text-xs cursor-pointer transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (imgRef.current && crop) {
                          const croppedUrl = await getCroppedImg(imgRef.current, crop);
                          setFormData({
                            ...formData,
                            banner: croppedUrl,
                          });
                          setCropModalOpen(false);
                          setTempImageSrc(null);
                          setCropType(null);
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs cursor-pointer transition-all duration-300"
                    >
                      Apply Crop
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>



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



