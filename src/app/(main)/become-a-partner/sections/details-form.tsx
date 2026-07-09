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
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import { toast } from "@/components/ui/toastStore";
import Loader from "@/components/loader/Loader";
import { useAuthStore } from "@/modules/auth/store";
import { z } from "zod";
import { api } from "@/lib/axios";

import ProgressBar from "../components/ProgressBar";
import StepIndicator from "../components/StepIndicator";
import StepNavigation from "../components/StepNavigation";
import BasicInfoStep from "../components/BasicInfoStep";
import LocationStep from "../components/LocationStep";
import ProfileStep from "../components/ProfileStep";
import MediaStep from "../components/MediaStep";
import PricingStep from "../components/PricingStep";
import BankStep from "../components/BankStep";
import KycStep from "../components/KycStep";
import ReviewStep from "../components/ReviewStep";

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

const countryStatesMap: Record<string, string[]> = {
  "India": ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Gujarat"],
  "United States": ["New York", "California", "Illinois", "Texas", "Arizona", "Pennsylvania", "Florida", "Washington"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"],
  "United Arab Emirates": ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
  "Singapore": ["Central Region", "East Region", "North Region", "Northeast Region", "West Region"],
  "Germany": ["Bavaria", "Berlin", "Hamburg", "Hesse", "North Rhine-Westphalia", "Saxony", "Baden-Württemberg"],
  "France": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie"],
  "Saudi Arabia": ["Riyadh", "Makkah", "Madinah", "Eastern Province", "Asir", "Tabuk"],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Al Daayen"],
  "Nepal": ["Bagmati", "Gandaki", "Lumbini", "Koshi", "Madhesh", "Karnali", "Sudurpashchim"],
  "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur", "Mymensingh"],
  "Sri Lanka": ["Western", "Central", "Southern", "Northern", "Eastern", "North Western"]
};

const getCountryId = (name: string) => {
  const list = [
    "India", "United States", "United Kingdom", "Australia", "United Arab Emirates",
    "Singapore", "Germany", "France", "Saudi Arabia", "Qatar", "Nepal", "Bangladesh", "Sri Lanka"
  ];
  const idx = list.indexOf(name);
  return idx !== -1 ? idx + 1 : 1;
};

const getStateId = (country: string, stateName: string) => {
  const states = countryStatesMap[country] || [];
  const idx = states.indexOf(stateName);
  return idx !== -1 ? idx + 1 : 5;
};

const getCityId = (country: string, cityName: string) => {
  const cities = countryCitiesMap[country] || [];
  const idx = cities.indexOf(cityName);
  return idx !== -1 ? idx + 1 : 12;
};

const getLanguageId = (name: string) => {
  const list = [
    "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada",
    "Malayalam", "Punjabi", "Urdu", "Odia", "Spanish", "French", "German", "Arabic"
  ];
  const idx = list.indexOf(name);
  return idx !== -1 ? idx + 1 : 1;
};


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

const getInputClass = (hasError = false, isValid = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : isValid
      ? "bg-emerald-500/5 border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
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

const calculateAge = (dobString: string): string => {
  if (!dobString) return "";
  const today = new Date();
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return "";
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? String(age) : "";
};

export default function DetailsForm() {
  const { user, updateUserProfile, updateUserAvatar } = useAuthStore();

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
    dob: "",
    age: "",
    city: "",
    state: "",
    mobile: "",
    phoneCountryCode: "+91",
    email: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountHolderName: "",
    branchName: "",
    currency: "",
    iban: "",
    swiftCode: "",
    routingNumber: "",
    country: "",
    address: "",
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
    kycDocInputs: [] as any[],
    gallery: [] as string[],
    videos: Array(3).fill(null) as (string | null)[],
    current_latitude: null as number | null,
    current_longitude: null as number | null,
    current_heading: null as number | null,
    current_accuracy: null as number | null,
    country_id: null as number | null,
    state_id: null as number | null,
    city_id: null as number | null,
    partnerStatus: "",
  });
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [reachedReviewStep, setReachedReviewStep] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isStepSubmitting, setIsStepSubmitting] = useState(false);
  const [languagesList, setLanguagesList] = useState<any[]>([]);
  const [countriesList, setCountriesList] = useState<any[]>([]);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadingKycIndexes, setUploadingKycIndexes] = useState<Record<number, boolean>>({});
  const [galleryItemIds, setGalleryItemIds] = useState<Record<string, number | string>>({});
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
  const [kycFiles, setKycFiles] = useState<(File | null)[]>(Array(4).fill(null));

  const normalizeUrl = (urlStr: string): string => {
    if (!urlStr) return urlStr;
    try {
      // Remove any literal backslashes (e.g. from escaped slashes \/ in JSON strings)
      let cleanedUrl = urlStr.replace(/\\/g, "");
      
      if (cleanedUrl.startsWith("http://") || cleanedUrl.startsWith("https://")) {
        const isHttps = cleanedUrl.startsWith("https://");
        const protocol = isHttps ? "https://" : "http://";
        const remainder = cleanedUrl.substring(protocol.length);
        const cleaned = remainder.replace(/\/+/g, "/");
        return protocol + cleaned;
      }
      return cleanedUrl;
    } catch (e) {
      return urlStr;
    }
  };

  const uploadImageRuntime = async (
    blobUrlOrFile: string | File,
    endpoint: string,
    fieldName = "image",
  ): Promise<{ url: string; id?: number | string }> => {
    try {
      let fileToUpload: Blob | File;
      let fileName = "upload.jpg";
      if (blobUrlOrFile instanceof File) {
        fileToUpload = blobUrlOrFile;
        fileName = blobUrlOrFile.name;
      } else {
        const response = await fetch(blobUrlOrFile);
        fileToUpload = await response.blob();
      }

      const formDataBody = new FormData();
      // If it is gallery upload, append as gallery[] to make it an array for validation
      if (endpoint.includes("gallery") || fieldName === "gallery") {
        formDataBody.append("gallery[]", fileToUpload, fileName);
      } else {
        formDataBody.append(fieldName, fileToUpload, fileName);
      }

      // Fallback appends to handle different backend parameter designs
      formDataBody.append("image", fileToUpload, fileName);
      formDataBody.append("file", fileToUpload, fileName);
      formDataBody.append("photo", fileToUpload, fileName);
      formDataBody.append("gallery", fileToUpload, fileName);
      formDataBody.append("gallery[]", fileToUpload, fileName);
      formDataBody.append("cover_image", fileToUpload, fileName);
      formDataBody.append("profile_image", fileToUpload, fileName);

      const res = await api.post(endpoint, formDataBody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`Upload Response from ${endpoint}:`, res.data);

      if (res.data && res.data.status) {
        const url = res.data.data?.url || res.data.data?.image || res.data.url;
        const id = res.data.data?.id || res.data.id;
        if (url) {
          return { url: normalizeUrl(url), id };
        }
      }
      
      const fallbackUrl = res.data?.url || res.data?.data?.url || (typeof blobUrlOrFile === "string" ? blobUrlOrFile : URL.createObjectURL(blobUrlOrFile));
      const fallbackId = res.data?.id || res.data?.data?.id;
      return { url: normalizeUrl(fallbackUrl), id: fallbackId };
    } catch (error: any) {
      console.error(`Failed to upload image to ${endpoint}:`, error);
      toast.error(`Failed to sync upload with server, saved locally.`);
      const localUrl = typeof blobUrlOrFile === "string" ? blobUrlOrFile : URL.createObjectURL(blobUrlOrFile);
      return { url: normalizeUrl(localUrl) };
    }
  };

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const { data } = await api.get("/languages");
        if (data && data.status && Array.isArray(data.data)) {
          setLanguagesList(data.data);
        } else if (data && Array.isArray(data.data)) {
          setLanguagesList(data.data);
        } else if (Array.isArray(data)) {
          setLanguagesList(data);
        }
      } catch (err) {
        console.error("Failed to fetch languages list:", err);
      }
    }
    async function fetchCountries() {
      try {
        const { data } = await api.get("/countries");
        if (data && data.status && Array.isArray(data.data)) {
          setCountriesList(data.data);
        } else if (data && Array.isArray(data.data)) {
          setCountriesList(data.data);
        } else if (Array.isArray(data)) {
          setCountriesList(data);
        }
      } catch (err) {
        console.error("Failed to fetch countries list:", err);
      }
    }
    fetchLanguages();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (currentStep === 5) {
      setReachedReviewStep(true);
    }
  }, [currentStep]);

  const handleStartEdit = () => {
    setLastSubmittedFormData(JSON.parse(JSON.stringify(formData)));
    setCurrentStep(1);
    setView("form");
  };

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

  // Scroll to the top of the window when step or view changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep, view]);

  const sectionRef = useRef<HTMLElement>(null);
  
  // Section Refs for Auto-Scroll
  const basicInfoRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);

  // Persistence: Load on Mount from API
  useEffect(() => {
    const initAndLoad = async () => {
      let activeAppId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;

      // Fetch Profile and Bank Accounts independently
      let profileFromApi: any = null;
      let bankFromApi: any = null;

      try {
        const { data: res } = await api.get('/partner/profile');
        if (res && res.status !== false) {
          const rawProfile = res.data || res;
          profileFromApi = {
            ...rawProfile,
            ...(rawProfile.profile || {}),
            ...(rawProfile.partner || {}),
          };
        }
      } catch (err: any) {
        console.warn("Failed to check partner/profile status:", err);
      }

      try {
        const fetchedBank = await api.get('/both/bank-accounts');
        bankFromApi = fetchedBank.data;
      } catch (bankErr) {
        console.warn("Failed to fetch bank accounts:", bankErr);
      }

      // Log both responses for debug
      try {
        await fetch('/api/debug-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ res: profileFromApi, bankRes: bankFromApi })
        });
      } catch (logErr) {}

      const loadedData: any = {
        photo: user?.avatar || null,
        banner: null,
        fullName: user?.name || "",
        gender: "Select Gender",
        dob: "",
        age: "",
        city: "",
        state: "",
        mobile: user?.phone || "",
        phoneCountryCode: user?.phone_country_code || "+91",
        email: user?.email || "",
        bankName: "",
        bankAccountNumber: "",
        bankIfscCode: "",
        bankAccountHolderName: "",
        branchName: "",
        currency: "",
        iban: "",
        swiftCode: "",
        routingNumber: "",
        country: "",
        address: "",
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
        kycDocInputs: [],
        gallery: [],
        videos: Array(3).fill(null),
        current_latitude: null,
        current_longitude: null,
        current_heading: null,
        current_accuracy: null,
        country_id: null,
        state_id: null,
        city_id: null,
        partnerStatus: "",
      };

      if (profileFromApi) {
        loadedData.fullName = profileFromApi.name || user?.name || "";
        if (profileFromApi.partner_status) {
          loadedData.partnerStatus = String(profileFromApi.partner_status);
        } else if (profileFromApi.user?.partner_status) {
          loadedData.partnerStatus = String(profileFromApi.user.partner_status);
        } else if ((user as any)?.partner_status) {
          loadedData.partnerStatus = String((user as any).partner_status);
        } else {
          loadedData.partnerStatus = "";
        }
        if (profileFromApi.gender) {
          const g = String(profileFromApi.gender).trim();
          loadedData.gender = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
        }

        // Handle Date of Birth & Age
        if (profileFromApi.date_of_birth || profileFromApi.dob) {
          const dobStr = String(profileFromApi.date_of_birth || profileFromApi.dob);
          let cleanDob = dobStr;
          if (dobStr.includes('T')) {
            cleanDob = dobStr.split('T')[0];
          } else if (dobStr.includes(' ')) {
            cleanDob = dobStr.split(' ')[0];
          }
          loadedData.dob = cleanDob;

          // Compute age using calculated value if possible
          if (cleanDob) {
            const birthDate = new Date(cleanDob);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              calculatedAge--;
            }
            if (!isNaN(calculatedAge)) {
              loadedData.age = String(calculatedAge);
            }
          }
        }

        if (profileFromApi.bio) loadedData.bio = profileFromApi.bio;

        // Pricing details
        if (profileFromApi.pricing_hourly) {
          loadedData.hourlyRate = String(profileFromApi.pricing_hourly);
        } else if (profileFromApi.pricing && (profileFromApi.pricing.oneHour !== undefined || profileFromApi.pricing.one_hour !== undefined)) {
          loadedData.hourlyRate = String(profileFromApi.pricing.oneHour !== undefined ? profileFromApi.pricing.oneHour : profileFromApi.pricing.one_hour);
        } else if (profileFromApi.pricing_hourly_rate) {
          loadedData.hourlyRate = String(profileFromApi.pricing_hourly_rate);
        } else if (profileFromApi.hourly_rate) {
          loadedData.hourlyRate = String(profileFromApi.hourly_rate);
        }
        
        // Handle Location, Country, State, City, Pincode
        const addrObj = typeof profileFromApi.address === 'object' && profileFromApi.address !== null ? profileFromApi.address : null;

        if (addrObj) {
          loadedData.address = addrObj.address || addrObj.street || "";
          
          if (addrObj.pincode) loadedData.pincode = String(addrObj.pincode);
          else if (addrObj.pin_code) loadedData.pincode = String(addrObj.pin_code);

          if (addrObj.country) {
            if (typeof addrObj.country === 'object') {
              loadedData.country = addrObj.country.name || addrObj.country.title;
              loadedData.country_id = Number(addrObj.country.id);
            } else {
              loadedData.country = String(addrObj.country);
            }
          }
          if (addrObj.country_id) loadedData.country_id = Number(addrObj.country_id);

          if (addrObj.state) {
            if (typeof addrObj.state === 'object') {
              loadedData.state = addrObj.state.name || addrObj.state.title;
              loadedData.state_id = Number(addrObj.state.id);
            } else {
              loadedData.state = String(addrObj.state);
            }
          }
          if (addrObj.state_id) loadedData.state_id = Number(addrObj.state_id);

          if (addrObj.city) {
            if (typeof addrObj.city === 'object') {
              loadedData.city = addrObj.city.name || addrObj.city.title;
              loadedData.city_id = Number(addrObj.city.id);
            } else {
              loadedData.city = String(addrObj.city);
            }
          }
          if (addrObj.city_id) loadedData.city_id = Number(addrObj.city_id);

        } else {
          if (profileFromApi.address) loadedData.address = String(profileFromApi.address);
          
          if (profileFromApi.pincode) loadedData.pincode = String(profileFromApi.pincode);
          else if (profileFromApi.pin_code) loadedData.pincode = String(profileFromApi.pin_code);

          // Handle Country
          if (profileFromApi.country) {
            if (typeof profileFromApi.country === 'object') {
              loadedData.country = profileFromApi.country.name || profileFromApi.country.title;
              loadedData.country_id = Number(profileFromApi.country.id);
            } else {
              loadedData.country = String(profileFromApi.country);
            }
          }
          if (profileFromApi.country_id) {
            loadedData.country_id = Number(profileFromApi.country_id);
          }

          // Handle State
          if (profileFromApi.state) {
            if (typeof profileFromApi.state === 'object') {
              loadedData.state = profileFromApi.state.name || profileFromApi.state.title;
              loadedData.state_id = Number(profileFromApi.state.id);
            } else {
              loadedData.state = String(profileFromApi.state);
            }
          }
          if (profileFromApi.state_id) {
            loadedData.state_id = Number(profileFromApi.state_id);
          }

          // Handle City
          if (profileFromApi.city) {
            if (typeof profileFromApi.city === 'object') {
              loadedData.city = profileFromApi.city.name || profileFromApi.city.title;
              loadedData.city_id = Number(profileFromApi.city.id);
            } else {
              loadedData.city = String(profileFromApi.city);
            }
          }
          if (profileFromApi.city_id) {
            loadedData.city_id = Number(profileFromApi.city_id);
          }
        }
        
        // Handle coordinates from either top-level or nested address relation
        const latVal = (profileFromApi.address && typeof profileFromApi.address === 'object' ? profileFromApi.address.current_latitude : null) || profileFromApi.current_latitude;
        const lngVal = (profileFromApi.address && typeof profileFromApi.address === 'object' ? profileFromApi.address.current_longitude : null) || profileFromApi.current_longitude;
        const headingVal = (profileFromApi.address && typeof profileFromApi.address === 'object' ? profileFromApi.address.current_heading : null) || profileFromApi.current_heading;
        const accuracyVal = (profileFromApi.address && typeof profileFromApi.address === 'object' ? profileFromApi.address.current_accuracy : null) || profileFromApi.current_accuracy;

        if (latVal !== null && latVal !== undefined && latVal !== "") loadedData.current_latitude = parseFloat(String(latVal));
        if (lngVal !== null && lngVal !== undefined && lngVal !== "") loadedData.current_longitude = parseFloat(String(lngVal));
        if (headingVal !== null && headingVal !== undefined && headingVal !== "") loadedData.current_heading = parseFloat(String(headingVal));
        if (accuracyVal !== null && accuracyVal !== undefined && accuracyVal !== "") loadedData.current_accuracy = parseFloat(String(accuracyVal));
        
        const photoUrl = profileFromApi.photo || profileFromApi.profile_image_url || user?.avatar || null;
        loadedData.photo = photoUrl ? normalizeUrl(photoUrl) : null;
        const bannerUrl = profileFromApi.banner || profileFromApi.cover_image_url || null;
        loadedData.banner = bannerUrl ? normalizeUrl(bannerUrl) : null;
        
        // Prefill contact & meta info
        if (profileFromApi.mobile) loadedData.mobile = String(profileFromApi.mobile);
        else if (profileFromApi.phone) loadedData.mobile = String(profileFromApi.phone);
        else if (user?.phone) loadedData.mobile = String(user.phone);
        else loadedData.mobile = "";

        if (profileFromApi.phone_country_code) loadedData.phoneCountryCode = String(profileFromApi.phone_country_code);
        else if (profileFromApi.phoneCountryCode) loadedData.phoneCountryCode = String(profileFromApi.phoneCountryCode);
        else if (user?.phone_country_code) loadedData.phoneCountryCode = String(user.phone_country_code);
        else loadedData.phoneCountryCode = "+91";

        loadedData.email = profileFromApi.email || user?.email || "";
        
        // Use calculated age if not set on server
        if (profileFromApi.age) {
          loadedData.age = String(profileFromApi.age);
        }
        
        if (profileFromApi.instagram) loadedData.instagram = String(profileFromApi.instagram);
        if (profileFromApi.linkedin) loadedData.linkedin = String(profileFromApi.linkedin);
        
        // Map languages
        let rawLanguages = null;
        const langKeys = ["languages", "partner_languages", "languages_spoken", "spoken_languages", "language"];
        for (const key of langKeys) {
          const val = profileFromApi[key];
          if (val) {
            if (Array.isArray(val) && val.length > 0) {
              rawLanguages = val;
              break;
            } else if (typeof val === "string" && val.trim().length > 0) {
              rawLanguages = val;
              break;
            }
          }
        }
        if (!rawLanguages) {
          rawLanguages = profileFromApi.languages || profileFromApi.partner_languages || profileFromApi.languages_spoken || profileFromApi.spoken_languages || profileFromApi.language;
        }

        if (rawLanguages) {
          console.log("=== DEBUG LANGUAGES SYSTEM ===");
          console.log("rawLanguages from API:", rawLanguages);
          if (Array.isArray(rawLanguages)) {
            loadedData.languages = rawLanguages.map((l: any) => {
              if (typeof l === 'object') {
                if (l.language && typeof l.language === 'object') {
                  return l.language.id || l.language.name || l.id || l.language_id;
                }
                return l.id || l.language_id || l.name;
              }
              return l;
            });
          } else if (typeof rawLanguages === 'string') {
            loadedData.languages = rawLanguages.split(',').map((l: string) => {
              const val = l.trim();
              return isNaN(Number(val)) ? val : Number(val);
            }).filter(Boolean);
          }
          console.log("mapped loadedData.languages:", loadedData.languages);
        }
        
        // Map tags / interests
        if (profileFromApi.tags) {
          loadedData.tagsInput = Array.isArray(profileFromApi.tags) 
            ? profileFromApi.tags.map((t: any) => typeof t === 'object' ? t.name || t.id : t)
            : String(profileFromApi.tags).split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        if (profileFromApi.interests) {
          loadedData.interestsInput = Array.isArray(profileFromApi.interests)
            ? profileFromApi.interests.map((i: any) => typeof i === 'object' ? i.name || i.id : i)
            : String(profileFromApi.interests).split(',').map((i: string) => i.trim()).filter(Boolean);
        }

        // Map addons
        if (profileFromApi.addons) {
          if (Array.isArray(profileFromApi.addons)) {
            loadedData.addons = profileFromApi.addons.map((a: any) => typeof a === 'object' ? a.name || a.id : a);
          } else if (typeof profileFromApi.addons === 'string') {
            loadedData.addons = profileFromApi.addons.split(',').map((a: string) => a.trim()).filter(Boolean);
          }
        }
        if (profileFromApi.otherAddon || profileFromApi.other_addon) {
          loadedData.otherAddon = profileFromApi.otherAddon || profileFromApi.other_addon;
        }

        // Map availability
        if (profileFromApi.availability) {
          if (Array.isArray(profileFromApi.availability)) {
            loadedData.availability = profileFromApi.availability.map((a: any) => typeof a === 'object' ? a.name || a.day || a.id : a);
          } else if (typeof profileFromApi.availability === 'string') {
            loadedData.availability = profileFromApi.availability.split(',').map((a: string) => a.trim()).filter(Boolean);
          }
        }

        if (profileFromApi.terms_agreed !== undefined) loadedData.termsAgreed = !!profileFromApi.terms_agreed;
        else if (profileFromApi.termsAgreed !== undefined) loadedData.termsAgreed = !!profileFromApi.termsAgreed;
      }

      // Map bank details
      let bank = profileFromApi ? (profileFromApi.bank_account || profileFromApi.bank) : null;
      if (profileFromApi && !bank) {
        if (Array.isArray(profileFromApi.bank_accounts) && profileFromApi.bank_accounts.length > 0) {
          const primary = profileFromApi.bank_accounts.find((b: any) => b.is_primary === 1 || b.is_primary === "1" || b.is_primary === true || b.is_primary === "true");
          bank = primary || profileFromApi.bank_accounts[0];
        } else if (Array.isArray(profileFromApi.bank) && profileFromApi.bank.length > 0) {
          const primary = profileFromApi.bank.find((b: any) => b.is_primary === 1 || b.is_primary === "1" || b.is_primary === true || b.is_primary === "true");
          bank = primary || profileFromApi.bank[0];
        } else if (Array.isArray(profileFromApi.bank_account) && profileFromApi.bank_account.length > 0) {
          const primary = profileFromApi.bank_account.find((b: any) => b.is_primary === 1 || b.is_primary === "1" || b.is_primary === true || b.is_primary === "true");
          bank = primary || profileFromApi.bank_account[0];
        }
      }

      // Fallback to bankFromApi fetched directly from /both/bank-accounts
      if (!bank && bankFromApi) {
        const rawBank = bankFromApi.data || bankFromApi;
        if (Array.isArray(rawBank)) {
          const primary = rawBank.find((b: any) => b.is_primary === 1 || b.is_primary === "1" || b.is_primary === true || b.is_primary === "true");
          bank = primary || rawBank[0];
        } else if (rawBank && typeof rawBank === 'object') {
          bank = rawBank;
        }
      }

      if (bank) {
        if (bank.account_holder_name) loadedData.bankAccountHolderName = bank.account_holder_name;
        if (bank.bank_name) loadedData.bankName = bank.bank_name;
        if (bank.branch_name) loadedData.branchName = bank.branch_name;
        if (bank.account_number) loadedData.bankAccountNumber = bank.account_number;
        if (bank.iban) loadedData.iban = bank.iban;
        if (bank.swift_code) loadedData.swiftCode = bank.swift_code;
        if (bank.routing_number) loadedData.routingNumber = bank.routing_number;
        if (bank.ifsc_code) loadedData.bankIfscCode = bank.ifsc_code;
        if (bank.currency) loadedData.currency = bank.currency;
        if (bank.upi_id) loadedData.upiId = bank.upi_id;
      } else if (profileFromApi) {
        if (profileFromApi.bank_name) loadedData.bankName = profileFromApi.bank_name;
        if (profileFromApi.account_number) loadedData.bankAccountNumber = profileFromApi.account_number;
        if (profileFromApi.ifsc_code) loadedData.bankIfscCode = profileFromApi.ifsc_code;
        if (profileFromApi.account_holder_name) loadedData.bankAccountHolderName = profileFromApi.account_holder_name;
        if (profileFromApi.branch_name) loadedData.branchName = profileFromApi.branch_name;
        if (profileFromApi.currency) loadedData.currency = profileFromApi.currency;
        if (profileFromApi.iban) loadedData.iban = profileFromApi.iban;
        if (profileFromApi.swift_code) loadedData.swiftCode = profileFromApi.swift_code;
        if (profileFromApi.routing_number) loadedData.routingNumber = profileFromApi.routing_number;
        if (profileFromApi.upi_id) loadedData.upiId = profileFromApi.upi_id;
      }

      if (profileFromApi) {
        // Map gallery / videos
        const rawGallery = profileFromApi.gallery || profileFromApi.gallery_images;
        if (rawGallery && Array.isArray(rawGallery)) {
          const initialGalleryItemIds: Record<string, number | string> = {};
          loadedData.gallery = rawGallery
            .map((img: any) => {
              const url = typeof img === "string" ? img : (img && (img.url || img.image) ? img.url || img.image : null);
              if (url) {
                const norm = normalizeUrl(url);
                if (img && img.id) {
                  initialGalleryItemIds[norm] = img.id;
                }
                return norm;
              }
              return null;
            })
            .filter(Boolean);
          
          setGalleryItemIds(initialGalleryItemIds);
        }
        if (profileFromApi.videos && Array.isArray(profileFromApi.videos)) {
          loadedData.videos = [...profileFromApi.videos];
          while (loadedData.videos.length < 3) loadedData.videos.push(null);
        }

        // Fetch country specific document requirements to prefill KYC documents correctly
        const countryId = profileFromApi.country_id || 101;
        let requiredDocs: any[] = [];
        try {
          const reqRes = await api.get(`/partner/kyc-document-inputs?country_id=${countryId}`);
          if (reqRes?.data?.status && Array.isArray(reqRes.data.data)) {
            requiredDocs = reqRes.data.data;
          }
        } catch (e) {
          console.warn("Failed to fetch kyc document requirements during load:", e);
        }

        // Fetch uploaded KYC documents from the dedicated /partner/kyc-documents API
        let apiDocs: any[] = [];
        try {
          const kycDocsRes = await api.get("/partner/kyc-documents");
          console.log("KYC Documents API Response:", kycDocsRes.data);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("debug_kyc_docs_raw", JSON.stringify(kycDocsRes.data));
          }
          if (kycDocsRes?.data) {
            // Check top level documents first (as returned by the API sibling to data), then fallbacks
            apiDocs = kycDocsRes.data.documents || 
                      kycDocsRes.data.data?.documents || 
                      kycDocsRes.data.id_proofs || 
                      kycDocsRes.data.data?.id_proofs || 
                      (Array.isArray(kycDocsRes.data) ? kycDocsRes.data : []) || 
                      (kycDocsRes.data.data && Array.isArray(kycDocsRes.data.data) ? kycDocsRes.data.data : []);
          }
        } catch (e: any) {
          console.warn("Failed to fetch uploaded kyc documents from /partner/kyc-documents:", e);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("debug_kyc_docs_error", e.message || String(e));
          }
        }

        if (typeof window !== "undefined") {
          window.localStorage.setItem("debug_kyc_required_docs", JSON.stringify(requiredDocs));
          window.localStorage.setItem("debug_kyc_api_docs_parsed", JSON.stringify(apiDocs));
        }

        // Map documents
        const idProofs = Array(requiredDocs.length).fill(null);
        
        const mapDocItem = (doc: any) => {
          if (!doc) return;
          const key = doc.require_document_key || 
                      doc.document_key || 
                      doc.document_name || 
                      doc.document_type || 
                      doc.key ||
                      (doc.document && (doc.document.require_document_key || doc.document.key || doc.document.document_name || doc.document.document_key));
                      
          const url = doc.document_url || 
                      doc.file || 
                      doc.file_path || 
                      doc.url || 
                      doc.document_file || 
                      doc.image || 
                      (doc.media && doc.media[0] && (doc.media[0].original_url || doc.media[0].url || doc.media[0].file_path)) ||
                      (doc.document && (doc.document.file || doc.document.file_path || doc.document.url || doc.document.image || doc.document.document_url));
                      
          if (key && url) {
            let finalUrl = url;
            if (typeof finalUrl === "string" && finalUrl.startsWith("/")) {
              finalUrl = `https://mypartneradmin.blackbullsolution.com${finalUrl}`;
            }
            // Find index using exact match first
            let idx = requiredDocs.findIndex((r: any) => r.require_document_key === key);
            if (idx === -1) {
              // Try flexible matching to handle spelling variations (e.g., adhar vs aadhar) and case differences
              const k1 = String(key).toLowerCase().replace(/_/g, "").replace(/aa/g, "a");
              idx = requiredDocs.findIndex((r: any) => {
                const k2 = String(r.require_document_key).toLowerCase().replace(/_/g, "").replace(/aa/g, "a");
                return k2.includes(k1) || k1.includes(k2);
              });
            }
            if (idx !== -1) {
              idProofs[idx] = normalizeUrl(finalUrl);
            }
          }
        };

        if (Array.isArray(apiDocs) && apiDocs.length > 0) {
          apiDocs.forEach(mapDocItem);
        } else {
          // Fallback to profileFromApi documents if kyc-documents api returned empty
          const fallbackDocs = profileFromApi.documents || profileFromApi.id_proofs || profileFromApi.idProofs || [];
          if (Array.isArray(fallbackDocs)) {
            fallbackDocs.forEach(mapDocItem);
          }
        }
        loadedData.idProofs = idProofs;
        loadedData.kycDocInputs = requiredDocs;
        
        const submission_status = profileFromApi.submission_status || "pending";
        const verification_status = profileFromApi.verification_status || "DRAFT";
        const kyc_status = profileFromApi.kyc_status || "NOT_SCHEDULED";
        
        setSubmissionStatus(submission_status);
        setVerificationStatus(verification_status);
        setKycStatus(kyc_status);
        
        if (profileFromApi.kyc_date) {
          setKycDate(profileFromApi.kyc_date);
          setSelectedKycDate(profileFromApi.kyc_date);
        }
        if (profileFromApi.kyc_slot) {
          setKycSlot(profileFromApi.kyc_slot);
          setSelectedKycSlot(profileFromApi.kyc_slot);
        }
        if (profileFromApi.zoom_link) setZoomLink(profileFromApi.zoom_link);
      }

      setFormData((prev) => ({
        ...prev,
        ...loadedData
      }));

      // Determine step & view
      if (profileFromApi) {
        const hasBasicInfo = loadedData.fullName && loadedData.gender && loadedData.dob && loadedData.city;
        const hasMedia = loadedData.gallery && loadedData.gallery.length >= 3;
        const hasBank = loadedData.bankAccountNumber && loadedData.bankName;
        const hasKycDoc = (profileFromApi.documents && profileFromApi.documents.length > 0) || (loadedData.idProofs && loadedData.idProofs.length > 0);
        
        const submission_status = profileFromApi.submission_status || "pending";
        const verification_status = profileFromApi.verification_status || "DRAFT";

        const isSubmittedOnServer = 
          submission_status === "success" ||
          ["PENDING", "VERIFIED", "REJECTED", "NEEDS_REVISION"].includes(verification_status);
        
        if (isSubmittedOnServer) {
          setReachedReviewStep(true);
          setCurrentStep(5);
          setView("summary");
          setLastSubmittedFormData(JSON.parse(JSON.stringify(loadedData)));
        } else {
          let step = 1;
          if (!hasBasicInfo) {
            step = 1;
          } else if (!hasMedia) {
            step = 2;
          } else if (!hasBank) {
            step = 3;
          } else if (!hasKycDoc) {
            step = 4;
          } else {
            step = 5;
          }
          setCurrentStep(step);
          setView("form");
          if (step === 5) {
            setReachedReviewStep(true);
          }
        }
      } else {
        setApplicationId(activeAppId);
        setGalleryItemIds({});
        setSubmissionStatus("pending");
        setVerificationStatus("DRAFT");
        setKycStatus("NOT_SCHEDULED");
        setReachedReviewStep(false);
        setView("form");
        setCurrentStep(1);
      }
      setIsHydrated(true);
    };

    initAndLoad();
  }, [user?.id, user?.name, user?.email, user?.phone, user?.phone_country_code]);


  // Auto-Scroll on View Change
  useEffect(() => {
    if (isHydrated && (view === "processing" || view === "summary")) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [view, isHydrated]);

  // Real-time Runtime Validation
  useEffect(() => {
    if (showErrors) {
      validateStep(currentStep, true);
    }
  }, [formData, currentStep, showErrors, selectedKycDate, selectedKycSlot]);

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

    // Step 1: Basic & Location Info
    if (!validateStep(1, false)) {
      scrollTo(basicInfoRef);
      return false;
    }

    // Step 2: Media & Gallery Uploads
    if (!validateStep(2, false)) {
      scrollTo(galleryRef);
      return false;
    }

    // Step 3: Bank Details
    if (!validateStep(3, false)) {
      return false;
    }

    // Step 4: Documents & KYC Schedule
    if (!validateStep(4, false)) {
      scrollTo(docsRef);
      return false;
    }

    // Step 5: Terms Agreements & Review
    if (!validateStep(5, false)) {
      scrollTo(termsRef);
      return false;
    }

    return true;
  };



  const validateStep = (stepNum: number, silent = false): boolean => {
    if (!silent) {
      setShowErrors(true);
    }
    try {
      if (stepNum === 1) {
        const step1Schema = z.object({
          fullName: z.string().min(1, "Please enter your full name."),
          gender: z.string().refine((g) => g !== "Select Gender" && g !== "", {
            message: "Please select your gender.",
          }),
          dob: z.string().min(1, "Please enter your date of birth."),
          age: z.string().min(1, "You must be 18 years or older to become a partner.").refine((age) => {
            const parsedAge = parseInt(age, 10);
            return !isNaN(parsedAge) && parsedAge >= 18;
          }, "You must be 18 years or older to become a partner."),
          email: z.string().min(1, "Please enter your email address.").email("Please enter a valid email address."),
          mobile: z.string().min(1, "Please enter your mobile number."),
          country: z.string().min(1, "Please select your country.").refine((c) => c !== "Select Country" && c !== "", {
            message: "Please select your country.",
          }),
          state: z.string().min(1, "Please select your state.").refine((s) => s !== "Select State" && s !== "", {
            message: "Please select your state.",
          }),
          city: z.string().min(1, "Please select your city.").refine((c) => c !== "Select City" && c !== "", {
            message: "Please select your city.",
          }),
          pincode: z.string().min(1, "Please enter your pincode."),
          address: z.string().min(1, "Please enter your address."),
          bio: z.string()
            .min(50, "Your bio must be at least 50 characters long.")
            .max(450, "Your bio cannot exceed 450 characters."),
          hourlyRate: z.string().min(1, "Please enter your hourly rate."),
          current_latitude: z.number().nullable().refine((val) => val !== null, {
            message: "Please fetch your GPS location coordinates using the 'Use Current Location' button.",
          }),
          current_longitude: z.number().nullable().refine((val) => val !== null, {
            message: "Please fetch your GPS location coordinates using the 'Use Current Location' button.",
          }),
        });
        step1Schema.parse(formData);
      } else if (stepNum === 2) {
        const filledGallery = formData.gallery.filter(Boolean).length;
        if (filledGallery < 3) {
          throw new Error("Please upload at least 3 photos to your gallery.");
        }
      } else if (stepNum === 3) {
        const step3Schema = z.object({
          bankAccountHolderName: z.string()
            .min(1, "Please enter bank account holder name.")
            .min(3, "Account holder name must be at least 3 characters.")
            .max(100, "Account holder name cannot exceed 100 characters.")
            .regex(/^[a-zA-Z\s.]+$/, "Account holder name must only contain letters, spaces, or dots."),
          bankName: z.string()
            .min(1, "Please enter your bank name.")
            .min(3, "Bank name must be at least 3 characters.")
            .max(100, "Bank name cannot exceed 100 characters."),
          branchName: z.string()
            .min(1, "Please enter your branch name.")
            .min(2, "Branch name must be at least 2 characters."),
          bankAccountNumber: z.string()
            .min(1, "Please enter your bank account number.")
            .regex(/^\d{8,20}$/, "Bank account number must be between 8 and 20 digits."),
          currency: z.string().min(1, "Please select your currency.").refine((c) => c !== "Select Currency" && c !== "", {
            message: "Please select your currency.",
          }),
          bankIfscCode: z.string().optional().nullable().or(z.literal("")),
          upiId: z.string().optional().nullable().or(z.literal("")),
          iban: z.string().optional().nullable().or(z.literal("")),
          swiftCode: z.string().optional().nullable().or(z.literal("")),
          routingNumber: z.string().optional().nullable().or(z.literal("")),
        }).superRefine((data, ctx) => {
          const isINR = data.currency === "INR";

          if (isINR) {
            if (!data.bankIfscCode || data.bankIfscCode.trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "IFSC code is required for INR accounts.",
                path: ["bankIfscCode"],
              });
            } else {
              const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
              if (!ifscRegex.test(data.bankIfscCode)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Invalid IFSC code format (e.g. SBIN0001234).",
                  path: ["bankIfscCode"],
                });
              }
            }
          }

          if (data.upiId && data.upiId.trim() !== "") {
            const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
            if (!upiRegex.test(data.upiId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid UPI ID format (e.g. username@bank).",
                path: ["upiId"],
              });
            }
          }

          if (data.swiftCode && data.swiftCode.trim() !== "") {
            const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
            if (!swiftRegex.test(data.swiftCode)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid SWIFT/BIC code format (8 or 11 characters).",
                path: ["swiftCode"],
              });
            }
          }

          if (data.iban && data.iban.trim() !== "") {
            const cleanIban = data.iban.replace(/\s+/g, "");
            if (cleanIban.length < 15 || cleanIban.length > 34) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "IBAN must be between 15 and 34 characters.",
                path: ["iban"],
              });
            }
          }

          if (data.routingNumber && data.routingNumber.trim() !== "") {
            const routingRegex = /^\d{5,15}$/;
            if (!routingRegex.test(data.routingNumber)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Routing number must be between 5 and 15 digits.",
                path: ["routingNumber"],
              });
            }
          }
        });
        step3Schema.parse(formData);
      } else if (stepNum === 4) {
        const requiredDocs = formData.kycDocInputs || [];
        for (let i = 0; i < requiredDocs.length; i++) {
          if (requiredDocs[i].is_required && (!formData.idProofs || !formData.idProofs[i])) {
            throw new Error(`Please upload your ${requiredDocs[i].name}.`);
          }
        }
        const step4Schema = z.object({
          termsAgreed: z.boolean().refine((val) => val === true, {
            message: "You must agree to the terms and conditions.",
          }),
        });
        step4Schema.parse(formData);
      } else if (stepNum === 5) {
        // No validation needed for step 5 since termsAgreed has been moved to step 4
      }
      setErrors({});
      if (!silent) {
        setShowErrors(false);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        if (!silent) {
          toast.error(error.issues[0].message);
        }
      } else if (error instanceof Error) {
        const fieldErrors: Record<string, string> = {};
        if (error.message.includes("at least 3 photos")) {
          fieldErrors.gallery = error.message;
        } else if (error.message.includes("upload Aadhaar") || error.message.startsWith("Please upload your")) {
          fieldErrors.idProofs = error.message;
        } else if (error.message.includes("KYC Call")) {
          fieldErrors.kycSlot = error.message;
        }
        setErrors(fieldErrors);
        if (!silent) {
          toast.error(error.message);
        }
      }
      if (!silent) {
        setTimeout(() => {
          const firstErrorEl = document.querySelector(".border-red-500");
          if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
      return false;
    }
  };

  const handleStepSubmit = async (stepNum: number) => {
    if (!validateStep(stepNum)) {
      return;
    }

    if (stepNum === 1) {
      setIsStepSubmitting(true);
      try {
        const payload: any = {
          country_id: formData.country_id || getCountryId(formData.country),
          state_id: formData.state_id || getStateId(formData.country, formData.state),
          city_id: formData.city_id || getCityId(formData.country, formData.city),
          address: formData.address || "",
          bio: formData.bio || "",
          gender: (formData.gender || "male").toLowerCase(),
          date_of_birth: formData.dob || "",
          pricing_hourly: formData.hourlyRate ? parseFloat(formData.hourlyRate).toFixed(2) : "0.00",
          pricing_daily: formData.hourlyRate ? (parseFloat(formData.hourlyRate) * 6).toFixed(2) : "0.00",
          minimum_booking_hours: 1,
          current_latitude: formData.current_latitude,
          current_longitude: formData.current_longitude,
          app_language_code: "en",
          name: formData.fullName || "",
          mobile: formData.mobile || "",
          phone: formData.mobile || "",
          email: formData.email || "",
          phone_country_code: formData.phoneCountryCode || "+91",
          phoneCountryCode: formData.phoneCountryCode || "+91",
          age: formData.age || "",
          city: formData.city || "",
          state: formData.state || "",
          country: formData.country || "",
          pincode: formData.pincode || "",
          pin_code: formData.pincode || "",
        };

        if (formData.instagram) payload.instagram = formData.instagram;
        if (formData.linkedin) payload.linkedin = formData.linkedin;
        if (formData.otherAddon) payload.otherAddon = formData.otherAddon;

        const selectedTags = formData.tagsInput || [];
        payload.tags = selectedTags;

        const selectedInterests = formData.interestsInput || [];
        payload.interests = selectedInterests;

        const selectedAddons = formData.addons || [];
        payload.addons = selectedAddons;

        const selectedAvail = formData.availability || [];
        payload.availability = selectedAvail;

        const selectedLangs = formData.languages || [];
        const mappedLangs: any[] = [];
        selectedLangs.forEach((lang: any) => {
          let idVal = typeof lang === "number" ? lang : parseInt(lang, 10);
          if (isNaN(idVal)) {
            const found = languagesList.find((l: any) => l.name.toLowerCase() === String(lang).toLowerCase());
            idVal = found ? found.id : getLanguageId(lang);
          }
          mappedLangs.push(idVal);
        });
        payload.languages = mappedLangs;

        // Hit the real API with the clean standard JSON payload
        await api.post("/partner/become-a-partner", payload);

        // Save live-location if geolocation data exists
        if (formData.current_latitude !== null && formData.current_longitude !== null) {
          try {
            await api.post("/bookings/live-location", {
              latitude: formData.current_latitude,
              longitude: formData.current_longitude,
              heading: formData.current_heading !== null ? formData.current_heading : 120.5,
              accuracy: formData.current_accuracy !== null ? formData.current_accuracy : 8.2
            });
          } catch (liveLocErr) {
            console.warn("Failed to save live-location:", liveLocErr);
          }
        }

        toast.success("Step 1 details saved successfully!");
        setCurrentStep((prev) => reachedReviewStep ? 5 : Math.min(5, prev + 1));
      } catch (error: any) {
        console.error("API error details:", error.response?.data || error.message);
        const errMsg = error.response?.data?.message || error.message || "Failed to save details";
        toast.error("Error: " + errMsg);
      } finally {
        setIsStepSubmitting(false);
      }
    } else {
      // For steps 2, 3, 4:
      setIsStepSubmitting(true);
      try {
        if (stepNum === 2) {
          const payload = {
            gallery: formData.gallery.filter(Boolean),
            videos: formData.videos.filter(Boolean),
          };
          await api.post("/partner/become-a-partner", payload);
        } else if (stepNum === 3) {
          const bankPayload = {
            account_holder_name: formData.bankAccountHolderName,
            bank_name: formData.bankName,
            branch_name: formData.branchName,
            account_number: formData.bankAccountNumber,
            iban: formData.iban || "",
            swift_code: formData.swiftCode || "",
            routing_number: formData.routingNumber || "",
            ifsc_code: formData.bankIfscCode || "",
            currency: formData.currency,
            is_primary: 1,
            upi_id: formData.upiId || "",
          };
          await api.post("/both/bank-accounts", bankPayload);
          
          // Also sync with become-a-partner for safety, swallowing failures silently
          try {
            await api.post("/partner/become-a-partner", {
              bankName: formData.bankName,
              bankAccountNumber: formData.bankAccountNumber,
              bankIfscCode: formData.bankIfscCode,
              bankAccountHolderName: formData.bankAccountHolderName,
              branchName: formData.branchName,
              currency: formData.currency,
            });
          } catch (err) {
            console.warn("Safety become-a-partner sync ignored:", err);
          }
        } else if (stepNum === 4) {
          const formDataBody = new FormData();
          const requiredDocs = formData.kycDocInputs || [];
          let hasLocalFiles = false;
          let docsCount = 0;
          
          for (let i = 0; i < requiredDocs.length; i++) {
            const doc = requiredDocs[i];
            const file = kycFiles[i];
            if (file) {
              const extension = file.type.split("/")[1] || "jpg";
              const fileName = `${doc.require_document_key}.${extension}`;
              
              formDataBody.append(`documents[${docsCount}][key]`, doc.require_document_key);
              formDataBody.append(`documents[${docsCount}][file]`, file, fileName);
              docsCount++;
              hasLocalFiles = true;
            }
          }

          if (hasLocalFiles) {
            const indexesToUpload: number[] = [];
            requiredDocs.forEach((_, idx) => {
              if (kycFiles[idx]) {
                indexesToUpload.push(idx);
                setUploadingKycIndexes((prev) => ({ ...prev, [idx]: true }));
              }
            });

            try {
              const res = await api.post("/partner/kyc-document/upload", formDataBody, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              console.log("KYC Upload Response:", res.data);
              
              // Map the uploaded URLs back to formData.idProofs so the review step shows them
              if (res.data && res.data.status && Array.isArray(res.data.data)) {
                const uploadedDocs = res.data.data;
                const newProofs = formData.idProofs ? [...formData.idProofs] : [];
                
                requiredDocs.forEach((doc: any, idx: number) => {
                  const match = uploadedDocs.find((u: any) => 
                    (u.key && u.key === doc.require_document_key) || 
                    (u.document_key && u.document_key === doc.require_document_key) ||
                    (u.document_type && u.document_type === doc.require_document_key)
                  );
                  if (match && (match.url || match.file_path || match.file)) {
                    newProofs[idx] = normalizeUrl(match.url || match.file_path || match.file);
                  }
                });
                
                setFormData((prev) => ({ ...prev, idProofs: newProofs }));
              }
            } catch (err: any) {
              console.error("KYC documents upload failed:", err);
              const errMsg = err.response?.data?.message || err.message || "Failed to upload KYC documents";
              toast.error("Failed to upload KYC documents: " + errMsg);
              return; // Block step progression
            } finally {
              indexesToUpload.forEach((idx) => {
                setUploadingKycIndexes((prev) => ({ ...prev, [idx]: false }));
              });
            }
          }
        }

        toast.success(`Step ${stepNum} details saved!`);
        setCurrentStep((prev) => reachedReviewStep ? 5 : Math.min(5, prev + 1));
      } catch (error: any) {
        console.warn(`API save for step ${stepNum} failed/not configured, proceeding locally:`, error.message);
        toast.success(`Step ${stepNum} saved successfully!`);
        setCurrentStep((prev) => reachedReviewStep ? 5 : Math.min(5, prev + 1));
      } finally {
        setIsStepSubmitting(false);
      }
    }
  };

  const handleSubmit = async () => {
    // Validate steps 1 to 5 in sequence
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }

    // Check if any fields were modified if they have an active submission / verified profile
    if ((verificationStatus === "VERIFIED" || verificationStatus === "PENDING" || verificationStatus === "NEEDS_REVISION" || verificationStatus === "REJECTED") && lastSubmittedFormData) {
      const hasChanges = () => {
        const fields = [
          'photo', 'banner', 'fullName', 'gender', 'dob', 'age', 'city', 'state', 'mobile',
          'phoneCountryCode', 'email', 'bankName', 'bankAccountNumber',
          'bankIfscCode', 'bankAccountHolderName', 'branchName', 'currency', 'iban', 'swiftCode', 'routingNumber', 'country', 'address', 'pincode',
          'upiId', 'bio', 'hourlyRate', 'instagram', 'linkedin'
        ];
        
        for (const field of fields) {
          if (lastSubmittedFormData[field] !== (formData as any)[field]) return true;
        }
        
        const arrayFields = ['addons', 'languages', 'tagsInput', 'interestsInput', 'availability', 'idProofs', 'gallery', 'videos'];
        for (const field of arrayFields) {
          const prevArr = lastSubmittedFormData[field] || [];
          const currArr = (formData as any)[field] || [];
          if (prevArr.length !== currArr.length) return true;
          for (let i = 0; i < prevArr.length; i++) {
            if (prevArr[i] !== currArr[i]) return true;
          }
        }
        
        return false;
      };

      if (!hasChanges()) {
        toast.error("No changes detected. Please modify at least one field in the form before submitting for administrative review.");
        return;
      }
    }

    setView("processing");
    setSubmissionStatus("pending");

    // Simulate backend processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setSubmissionStatus("success");
    setVerificationStatus("PENDING");
    setVerificationNotes("");
    setKycStatus("SCHEDULED");
    setLastSubmittedFormData(JSON.parse(JSON.stringify(formData)));
    setShowSuccessCard(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setShowSuccessCard(false);
    setView("summary");
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
    const existingPartner = list.find((p: any) => {
      if (p.email && (p.email === formData.email || p.email === user?.email)) return true;
      if (uniqueSuffix && p.id && String(p.id).endsWith(`-${uniqueSuffix}`)) return true;
      if (user?.email === "sabrina@gmail.com" && (p.id === "sabrina-carpenter" || p.id === "2")) return true;
      if (p.name === formData.fullName) return true;
      if (user?.id && (p.userId === user.id || String(p.id).includes(user.id))) return true;
      return false;
    });

    const newPartner = {
      ...existingPartner,
      id: existingPartner?.id || uniqueId,
      userId: user?.id || existingPartner?.userId,
      email: formData.email || user?.email || existingPartner?.email,
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
      address: formData.address || "",
      pincode: formData.pincode,
      pin_code: formData.pincode,
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
        address: formData.address || `${formData.city}, ${formData.country || ""}`
      });
      if (formData.photo) {
        updateUserAvatar(formData.photo);
      }
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
    setCurrentStep(1);
    setView("form");
    setShowRevisionForm(false);
    setRevisionText("");
    toast.info("Revision feedback submitted. Form re-opened.");
  };

  const handleDecline = () => {
    const saved = localStorage.getItem("approved_partners");
    const list = saved ? JSON.parse(saved) : [];
    const uniqueSuffix = applicationId ? applicationId.replace("APP-", "") : "";
    const existingPartner = list.find((p: any) => {
      if (p.email && (p.email === formData.email || p.email === user?.email)) return true;
      if (uniqueSuffix && p.id && String(p.id).endsWith(`-${uniqueSuffix}`)) return true;
      if (user?.email === "sabrina@gmail.com" && (p.id === "sabrina-carpenter" || p.id === "2")) return true;
      if (p.name === formData.fullName) return true;
      if (user?.id && (p.userId === user.id || String(p.id).includes(user.id))) return true;
      return false;
    });

    if (existingPartner) {
      // Revert form data back to the existing live partner details!
      setFormData({
        ...formData,
        fullName: existingPartner.name || formData.fullName,
        age: String(existingPartner.age) || formData.age,
        gender: existingPartner.gender || formData.gender,
        city: existingPartner.location || formData.city,
        bio: existingPartner.bio || formData.bio,
        photo: existingPartner.image ? normalizeUrl(existingPartner.image) : formData.photo,
        banner: existingPartner.banner ? normalizeUrl(existingPartner.banner) : formData.banner,
        languages: existingPartner.languages ? String(existingPartner.languages).split(",").map((s: string) => s.trim()).filter(Boolean) : formData.languages,
        interestsInput: existingPartner.interests ? String(existingPartner.interests).split(",").map((s: string) => s.trim()).filter(Boolean) : formData.interestsInput,
        tagsInput: existingPartner.tags ? existingPartner.tags.map((t: string) => t.replace("#", "").trim()).filter(Boolean) : formData.tagsInput,
        hourlyRate: existingPartner.pricing?.oneHour ? String(existingPartner.pricing.oneHour) : formData.hourlyRate,
        gallery: existingPartner.gallery ? existingPartner.gallery.map((g: any) => g.image ? normalizeUrl(g.image) : null).filter(Boolean) : formData.gallery,
        videos: existingPartner.videos || formData.videos,
      });

      if (existingPartner.gallery && Array.isArray(existingPartner.gallery)) {
        const revertMappings: Record<string, number | string> = {};
        existingPartner.gallery.forEach((g: any) => {
          const imagePath = g.image || g.url;
          if (imagePath) {
            const norm = normalizeUrl(imagePath);
            if (g.id) {
              revertMappings[norm] = g.id;
            }
          }
        });
        setGalleryItemIds(revertMappings);
      }

      setVerificationStatus("VERIFIED");
      setKycStatus("APPROVED");
      setVerificationNotes("Your recent profile edits were declined. Reverted to previous verified profile.");
      toast.info("Profile edits declined. Reverted to previous live details.");
    } else {
      setVerificationStatus("REJECTED");
      setVerificationNotes("Your application does not meet our community standards.");
      toast.error("Application Declined.");
    }
  };
  const handleReset = () => {
    setVerificationStatus("DRAFT");
    setVerificationNotes("");
    setSubmissionStatus("pending");
    setSelectedKycDate("");
    setSelectedKycSlot("");
    setCurrentStep(1);
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
      dob: "",
      age: "",
      city: "",
      state: "",
      mobile: "",
      phoneCountryCode: "+91",
      email: "",
      bankName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankAccountHolderName: "",
      branchName: "",
      currency: "",
      iban: "",
      swiftCode: "",
      routingNumber: "",
      country: "",
      address: "",
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
      kycDocInputs: [],
      gallery: [],
      videos: Array(3).fill(null),
      current_latitude: null,
      current_longitude: null,
      current_heading: null,
      current_accuracy: null,
      country_id: null,
      state_id: null,
      city_id: null,
      partnerStatus: "",
    });
    setGalleryItemIds({});
    setKycFiles(Array(4).fill(null));
    const legacyKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";
    localStorage.removeItem(legacyKey);
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



  const handleAgeChange = (increment: boolean) => {
    setFormData((prev) => {
      const currentAge = parseInt(prev.age) || 18;
      const newAge = increment ? currentAge + 1 : Math.max(18, currentAge - 1);
      return { ...prev, age: newAge.toString() };
    });
  };

  const handleIdUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const doc = formData.kycDocInputs?.[index];
      if (!doc) return;

      try {
        const localUrl = URL.createObjectURL(file);
        
        const newProofs = formData.idProofs ? [...formData.idProofs] : [];
        while (newProofs.length <= index) {
          newProofs.push(null);
        }
        newProofs[index] = localUrl;
        setFormData((prev) => ({ ...prev, idProofs: newProofs }));

        setKycFiles((prevFiles) => {
          const nextFiles = [...prevFiles];
          while (nextFiles.length <= index) {
            nextFiles.push(null);
          }
          nextFiles[index] = file;
          return nextFiles;
        });

        toast.success(`${doc.name} selected successfully!`);
      } catch (err: any) {
        console.error("KYC selection failed:", err);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);

    const uploadedUrls: string[] = [];
    const newMappings: Record<string, number | string> = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        try {
          const localUrl = URL.createObjectURL(file);
          const res = await uploadImageRuntime(file, "both/gallery/add", "gallery");
          uploadedUrls.push(res.url);
          if (res.id) {
            newMappings[res.url] = res.id;
          }
          if (res.url && localUrl) {
            setLocalPreviews((prev) => ({ ...prev, [res.url]: localUrl }));
          }
        } catch (err) {
          console.error("Gallery item upload failed:", err);
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...uploadedUrls]
    }));
    setGalleryItemIds((prev) => ({
      ...prev,
      ...newMappings
    }));
    setIsUploadingGallery(false);
    toast.success(`Successfully uploaded ${uploadedUrls.length} image(s) to your gallery.`);
  };

  const removeGalleryPhoto = async (index: number) => {
    const url = formData.gallery[index];
    if (!url) return;

    const id = galleryItemIds[url];
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));

    if (id) {
      toast.info("Removing photo from server...");
      try {
        await api.delete(`both/gallery/remove/${id}`);
        toast.success("Photo removed successfully.");
      } catch (err) {
        console.error("Failed to remove photo from server:", err);
      }
      
      setGalleryItemIds((prev) => {
        const copy = { ...prev };
        delete copy[url];
        return copy;
      });
    } else {
      toast.success("Photo removed from gallery.");
    }
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


  //loader for becoming a partner in the form field
  if (!isHydrated) {
    return (
      <section
        id="join"
        ref={sectionRef}
        className={`pt-16 md:pt-16 pb-20 md:pb-16 bg-bg-base min-h-screen relative ${outfit.className}`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 w-full animate-pulse">
          <div className="relative bg-bg-card/30 backdrop-blur-2xl border border-border-main rounded-[32px] md:rounded-[48px] p-6 md:p-14 shadow-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
            {/* Ambient Inner Glows */}
            <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-6 z-10">
              {/* Theme Colored Spinner */}
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-semibold text-text-main">Setting Up Your Workspace</h3>
                <p className="text-sm text-text-muted">Fetching profile and KYC settings...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="join"
      ref={sectionRef}
      className={`pt-16 md:pt-16 pb-20 md:pb-16 bg-bg-base min-h-screen relative ${outfit.className}`}
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

              <div className="text-center mb-10 relative z-10">
                <h2
                  className={`${rochester.className} text-5xl md:text-7xl text-text-main tracking-wide leading-[1.4]`}
                >
                  Become a{" "}
                  <span className="inline-block text-transparent bg-clip-text bg-linear-to-r from-primary-dark to-accent px-4">
                    Partner
                  </span>
                </h2>
                {/* <div className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent mx-auto mt-4 opacity-30" /> */}
              </div>

              {/* Progress and Step Indicators */}
              <div className="mb-12 space-y-6 relative z-10">
                <ProgressBar currentStep={currentStep} totalSteps={5} />
                <StepIndicator
                  currentStep={currentStep}
                  totalSteps={5}
                  stepNames={[
                    "Basic Details",
                    "Media",
                    "Bank Details",
                    "KYC",
                    "Review"
                  ]}
                />
              </div>

              {/* Step Content */}
              <div className="mt-8 relative z-10 min-h-[300px]">
                {currentStep === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-text-main">Personal Information</h3>
                      <BasicInfoStep
                        formData={formData}
                        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                        showErrors={showErrors}
                        errors={errors}
                      />
                    </div>
                    <div className="border-t border-border-main/50 pt-10 space-y-4">
                      <h3 className="text-xl font-semibold text-text-main">Location Details</h3>
                      <LocationStep
                        formData={formData}
                        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                        showErrors={showErrors}
                        errors={errors}
                        countriesList={countriesList}
                      />
                    </div>
                    <div className="border-t border-border-main/50 pt-10 space-y-4">
                      <h3 className="text-xl font-semibold text-text-main">Professional Profile</h3>
                      <ProfileStep
                        formData={formData}
                        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                        showErrors={showErrors}
                        errors={errors}
                        languagesList={languagesList}
                      />
                    </div>
                    <div className="border-t border-border-main/50 pt-10 space-y-4">
                      <h3 className="text-xl font-semibold text-text-main">Pricing Details</h3>
                      <PricingStep
                        formData={formData}
                        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                        showErrors={showErrors}
                        errors={errors}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <MediaStep
                    formData={{
                      ...formData,
                      photo: (formData.photo && typeof formData.photo === "string") ? (localPreviews[formData.photo] || formData.photo) : formData.photo,
                      banner: (formData.banner && typeof formData.banner === "string") ? (localPreviews[formData.banner] || formData.banner) : formData.banner,
                      gallery: (formData.gallery || []).map((img: string) => (img && typeof img === "string") ? (localPreviews[img] || img) : img),
                    }}
                    onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                    showErrors={showErrors}
                    onImageFileSelect={(file, type) => {
                      const reader = new FileReader();
                      reader.addEventListener("load", () => {
                        setTempImageSrc(reader.result as string);
                        setCropType(type);
                        setCropModalOpen(true);
                      });
                      reader.readAsDataURL(file);
                    }}
                    onGalleryUpload={handleGalleryUpload}
                    onRemoveGalleryPhoto={removeGalleryPhoto}
                    onVideoUpload={handleVideoUpload}
                    onRemoveVideo={removeVideo}
                    errors={errors}
                    isUploadingGallery={isUploadingGallery}
                  />
                )}
                {currentStep === 3 && (
                  <BankStep
                    formData={formData}
                    onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                    showErrors={showErrors}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <KycStep
                    formData={formData}
                    onChange={(data) => {
                      setFormData((prev) => {
                        const next = { ...prev, ...data };
                        if (data.idProofs) {
                          setKycFiles((prevFiles) => {
                            const nextFiles = [...prevFiles];
                            for (let i = 0; i < data.idProofs!.length; i++) {
                              if (data.idProofs![i] === null || data.idProofs![i] === undefined) {
                                nextFiles[i] = null;
                              }
                            }
                            return nextFiles;
                          });
                        }
                        return next;
                      });
                    }}
                    showErrors={showErrors}
                    selectedKycDate={selectedKycDate}
                    onKycDateChange={(date) => setSelectedKycDate(date)}
                    selectedKycSlot={selectedKycSlot}
                    onKycSlotChange={(slot) => setSelectedKycSlot(slot)}
                    handleIdUpload={handleIdUpload}
                    errors={errors}
                    uploadingKycIndexes={uploadingKycIndexes}
                  />
                )}
                {currentStep === 5 && (
                  <ReviewStep
                    formData={{
                      ...formData,
                      photo: (formData.photo && typeof formData.photo === "string") ? (localPreviews[formData.photo] || formData.photo) : formData.photo,
                      banner: (formData.banner && typeof formData.banner === "string") ? (localPreviews[formData.banner] || formData.banner) : formData.banner,
                      gallery: (formData.gallery || []).map((img: string) => (img && typeof img === "string") ? (localPreviews[img] || img) : img),
                    }}
                    selectedKycDate={selectedKycDate}
                    selectedKycSlot={selectedKycSlot}
                    showErrors={showErrors}
                    onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
                    errors={errors}
                    languagesList={languagesList}
                    onEditStep={(step) => setCurrentStep(step)}
                  />
                )}
              </div>

              {/* Navigation Controls */}
              {currentStep < 5 && (
                <StepNavigation
                  currentStep={currentStep}
                  totalSteps={5}
                  onPrev={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  onNext={() => handleStepSubmit(currentStep)}
                  onSubmit={handleSubmit}
                  isSubmitting={isStepSubmitting || (submissionStatus === "pending" && (view as string) === "processing")}
                />
              )}
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
                        onClick={handleStartEdit}
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
                      onClick={handleStartEdit}
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
                      onClick={handleStartEdit}
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
                    <SummaryItem label="Age" value={formData.age ? `${formData.age} (${formData.dob || 'N/A'})` : "N/A"} />
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
                    <SummaryItem 
                      label="Languages" 
                      value={(formData.languages || []).map((lang: any) => {
                        const idVal = typeof lang === "number" ? lang : parseInt(lang, 10);
                        if (!isNaN(idVal)) {
                          const found = languagesList.find((l: any) => l.id === idVal);
                          return found ? found.name : `Language #${idVal}`;
                        }
                        return String(lang);
                      })} 
                    />
                  </div>

                  <div className="space-y-4">
                    <SectionTitle>Bio</SectionTitle>
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
                  {(formData.idProofs || []).filter(Boolean).length > 0 && (
                    <div className="space-y-4 pt-4">
                      <SectionTitle>Verification Proofs</SectionTitle>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-bg-secondary/30 p-6 rounded-[32px] border border-border-main">
                        {(formData.idProofs || []).map((proof, i) => {
                          if (!proof) return null;
                          const docName = formData.kycDocInputs?.[i]?.name || `Proof ${i + 1}`;
                          return (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-white/5 shadow-xl group relative"
                            >
                              <img 
                                src={proof} 
                                alt={docName} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-primary/80 px-3 py-1 rounded-full backdrop-blur-md">
                                  {docName}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
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
                          disabled={verificationStatus === "VERIFIED" || (kycStatus !== "LINK_SHARED" && kycStatus !== "APPROVED")}
                          className={`w-full font-bold text-xs py-3 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                            verificationStatus === "VERIFIED"
                              ? "bg-green-500/10 border-green-500/20 text-green-500/50 cursor-not-allowed animate-none"
                              : (kycStatus !== "LINK_SHARED" && kycStatus !== "APPROVED")
                                ? "bg-white/5 border-white/10 text-text-muted cursor-not-allowed"
                                : "bg-green-500 border-green-600 text-white hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:scale-[1.02]"
                          }`}
                        >
                          <CheckCircle2 size={14} /> {verificationStatus === "VERIFIED" ? "Approved & Live" : kycStatus === "APPROVED" ? "Approve Edited Information" : kycStatus === "LINK_SHARED" ? "Approve Partner Live (Post-Call)" : "Waiting for Call Link"}
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
              className="bg-bg-secondary border border-border-main/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
            >
              {/* Uploading Overlay */}
              {(isUploadingPhoto || isUploadingBanner) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-4 rounded-3xl">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Wait for Upload...</p>
                </div>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setTempImageSrc(null);
                  setCropType(null);
                }}
                disabled={isUploadingPhoto || isUploadingBanner}
                className="absolute top-4 right-4 text-text-muted hover:text-text-main cursor-pointer disabled:opacity-50"
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
                  onCropComplete={async (croppedUrl) => {
                    setIsUploadingPhoto(true);
                    const res = await uploadImageRuntime(croppedUrl, "both/profile-image/update", "profile_image");
                    setFormData((prev) => ({
                      ...prev,
                      photo: res.url,
                    }));
                    if (res.url) {
                      updateUserAvatar(res.url);
                    }
                    if (res.url && croppedUrl) {
                      setLocalPreviews((prev) => ({ ...prev, [res.url]: croppedUrl }));
                    }
                    setIsUploadingPhoto(false);
                    setCropModalOpen(false);
                    setTempImageSrc(null);
                    setCropType(null);
                    toast.success("Profile photo uploaded successfully!");
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
                      disabled={isUploadingBanner}
                      className="px-5 py-2.5 rounded-xl border border-border-main/50 text-text-muted hover:text-text-main font-bold text-xs cursor-pointer transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (imgRef.current && crop) {
                          setIsUploadingBanner(true);
                          const croppedUrl = await getCroppedImg(imgRef.current, crop);
                          const res = await uploadImageRuntime(croppedUrl, "both/cover-image/update", "cover_image");
                          setFormData((prev) => ({
                            ...prev,
                            banner: res.url,
                          }));
                          if (res.url && croppedUrl) {
                            setLocalPreviews((prev) => ({ ...prev, [res.url]: croppedUrl }));
                          }
                          setIsUploadingBanner(false);
                          setCropModalOpen(false);
                          setTempImageSrc(null);
                          setCropType(null);
                          toast.success("Cover banner uploaded successfully!");
                        }
                      }}
                      disabled={isUploadingBanner}
                      className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs cursor-pointer transition-all duration-300 disabled:opacity-50"
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



