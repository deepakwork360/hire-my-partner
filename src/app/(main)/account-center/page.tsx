"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import SideDashboard from "@/components/side-dashboard/side-dashboard";
import Footer from "../home-page/sections/Footer";
import { useAuthStore } from "@/modules/auth/store";
import { toast } from "@/components/ui/toastStore";
import { mockDb } from "@/modules/auth/data/users";
import { partners as mockPartnersList } from "@/modules/partner/data/partners";
import {
  UserRound,
  Lock,
  Bell,
  Trash2,
  BadgeInfo,
  Check,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff,
  Navigation,
  Plus,
  X
} from "lucide-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

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

type SettingsSection = "personal-info" | "profile" | "password" | "notifications" | "delete";

const inputClassName = (invalid = false, disabled = false) => {
  return `w-full h-12 px-4 rounded-xl text-text-main text-xs md:text-sm font-semibold transition-all duration-200 outline-none border focus:outline-none focus:ring-4 ${disabled
      ? "bg-black/[0.015] dark:bg-white/[0.02] border-primary/15 text-text-muted/40 cursor-not-allowed select-none"
      : invalid
        ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
        : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] hover:border-primary/60 focus:bg-bg-base dark:focus:bg-bg-base focus:border-primary focus:ring-primary/20"
    }`;
};

const textareaClassName = (invalid = false, disabled = false) => {
  return `w-full p-4 rounded-xl text-text-main text-xs md:text-sm font-semibold transition-all duration-200 outline-none border focus:outline-none focus:ring-4 resize-none ${disabled
      ? "bg-black/[0.015] dark:bg-white/[0.02] border-primary/15 text-text-muted/40 cursor-not-allowed select-none"
      : invalid
        ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
        : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] hover:border-primary/60 focus:bg-bg-base dark:focus:bg-bg-base focus:border-primary focus:ring-primary/20"
    }`;
};

const selectBtnClassName = (disabled = false, invalid = false) => {
  return `w-full h-12 px-4 rounded-xl text-text-main text-xs md:text-sm font-semibold transition-all duration-200 border flex items-center justify-between outline-none focus:outline-none focus:ring-4 ${disabled
      ? "bg-black/[0.015] dark:bg-white/[0.02] border-primary/15 text-text-muted/40 cursor-not-allowed select-none"
      : invalid
        ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
        : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] hover:border-primary/60 focus:bg-bg-base dark:focus:bg-bg-base focus:border-primary focus:ring-primary/20"
    }`;
};

const labelClassName = "text-[10px] font-bold uppercase tracking-widest text-text-muted/90";

export default function AccountCenterPage() {
  const { user, updateUserProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>("personal-info");
  const [mounted, setMounted] = useState(false);
  const [isLivePartner, setIsLivePartner] = useState(false);

  const storageKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";

  useEffect(() => {
    setMounted(true);
    const checkPartnerStatus = () => {
      // Auto-unlock and auto-seed Companion settings for testing accounts
      if (user && (user.email === "sabrina@gmail.com" || user.email === "gigi@example.com" || user.email === "deepak@example.com")) {
        setIsLivePartner(true);
        try {
          const key = `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
          if (!localStorage.getItem(key)) {
            const mockProfile = mockPartnersList.find(p => p.name.toLowerCase().includes(user.name.toLowerCase()) || p.id === "2");
            localStorage.setItem(key, JSON.stringify({
              verificationStatus: "VERIFIED",
              formData: {
                fullName: mockProfile?.name || user.name,
                displayName: mockProfile?.name.split(" ")[0] || user.name,
                city: mockProfile?.location.split(",")[0] || "Mumbai",
                bio: mockProfile?.bio || "An elegant soul seeking genuine connections.",
                hourlyRate: String(mockProfile?.pricing.oneHour || "3499"),
                languages: Array.isArray(mockProfile?.languages) ? mockProfile?.languages.join(", ") : (mockProfile?.languages || "English"),
                interests: mockProfile?.interests || "Travel, Conversations",
                tags: Array.isArray(mockProfile?.tags) ? mockProfile?.tags.join(", ") : (mockProfile?.tags || "#Friendly")
              },
              gallery: mockProfile?.gallery || []
            }));
          }
        } catch (e) {
          console.error(e);
        }
        return;
      }

      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED") {
            setIsLivePartner(true);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLivePartner(false);
    };
    checkPartnerStatus();
  }, [storageKey, user]);

  if (!mounted) return null;

  const tabOptions: { id: SettingsSection; label: string; icon: any; desc: string; show: boolean }[] = [
    {
      id: "personal-info",
      label: "Personal Information",
      icon: BadgeInfo,
      desc: "Manage your name, contact details, gender, age, and address",
      show: true
    },
    {
      id: "password",
      label: "Password Settings",
      icon: Lock,
      desc: "Secure your account by updating your login password",
      show: true
    },
    {
      id: "notifications",
      label: "Notification Alert",
      icon: Bell,
      desc: "Configure push, SMS, and email alerts for messages and bookings",
      show: true
    },
    {
      id: "delete",
      label: "Delete Account",
      icon: Trash2,
      desc: "Permanently delete your account and clear all active history",
      show: true
    }
  ];

  return (
    <div className={`bg-bg-base min-h-screen relative flex ${outfit.className}`}>
      {/* Sidebar Navigation */}
      <SideDashboard />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Section */}
        <section className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden flex items-center justify-center pt-[70px]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/love1.jpg')", opacity: 0.15 }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-base" />
          <div className="relative z-10 text-center px-4">
            <h1 className={`text-3xl sm:text-4xl md:text-6xl ${rochester.className}`}>
              Account <span className="text-accent">Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
              Manage your personal settings, password details, booking options, and profile configuration.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="w-full max-w-[1600px] mx-auto px-6 py-6 md:py-16 flex-1 flex flex-col md:flex-row gap-8 xl:gap-12">

          {/* Mobile Dropdown Menu Selector */}
          <div className="md:hidden w-full relative z-40">
            <label className="text-[10px] font-black uppercase tracking-wider text-text-muted mb-1.5 block">Select Settings Section</label>
            <div className="relative">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as SettingsSection)}
                className="w-full h-12 px-4 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs font-bold focus:outline-none appearance-none cursor-pointer"
              >
                {tabOptions.filter(t => t.show).map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Desktop Left Tab Menu */}
          <div className="hidden md:flex w-[290px] lg:w-[320px] shrink-0 flex-col gap-3">
            {tabOptions.filter(t => t.show).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`w-full cursor-pointer flex items-center justify-between p-4 border rounded-2xl transition-all text-left ${isActive
                      ? "bg-primary/10 border-primary/45 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] text-primary"
                      : "bg-bg-secondary hover:bg-bg-card border-border-main/50 text-text-muted hover:text-text-main"
                    }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-bg-base text-text-muted"
                      }`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider block">{tab.label}</span>
                      <span className="text-[9px] font-bold opacity-60 truncate block mt-0.5 max-w-[180px]">{tab.desc}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content Panel Container */}
          <div className="flex-1 min-w-0 bg-bg-secondary border border-border-main/40 rounded-3xl p-6 md:p-10 shadow-2xl relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {activeSection === "personal-info" && <PersonalInfoForm />}
                {activeSection === "password" && <PasswordForm />}
                {activeSection === "notifications" && <NotificationsForm />}
                {activeSection === "delete" && <DeleteAccountForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. PERSONAL INFORMATION FORM
   ───────────────────────────────────────────────────────────────────────────── */
function PersonalInfoForm() {
  const { user, updateUserProfile } = useAuthStore();
  const [infoData, setInfoData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    phoneCountryCode: user?.phone_country_code || "+91",
    email: user?.email || "",
    gender: user?.gender || "Select Gender",
    age: user?.age || "",
    country: user?.country || "Select Country",
    city: user?.city || "Select City",
    address: user?.address || ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState<string | null>(null);

  const [fieldsUnlocked, setFieldsUnlocked] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<"email" | "phone" | null>(null);
  const [unlockMethod, setUnlockMethod] = useState<"password" | "otp">("password");
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlockTimer, setUnlockTimer] = useState(59);
  const [otpSent, setOtpSent] = useState(false);
  const [unlockInfo, setUnlockInfo] = useState("");

  useEffect(() => {
    if (user) {
      setInfoData({
        name: user.name || "",
        phone: user.phone || "",
        phoneCountryCode: user.phone_country_code || "+91",
        email: user.email || "",
        gender: user.gender || "Select Gender",
        age: user.age || "",
        country: user.country || "Select Country",
        city: user.city || "Select City",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (unlockModalOpen && unlockMethod === "otp" && unlockTimer > 0) {
      interval = setInterval(() => {
        setUnlockTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [unlockModalOpen, unlockMethod, unlockTimer]);

  const handleUnlockClick = (target: "email" | "phone") => {
    setUnlockTarget(target);
    setUnlockMethod("password");
    setUnlockInput("");
    setUnlockError("");
    setUnlockInfo("");
    setOtpSent(false);
    setUnlockTimer(59);
    setUnlockModalOpen(true);
  };

  const sendUnlockOtp = () => {
    setUnlockMethod("otp");
    setUnlockInput("");
    setUnlockError("");
    setUnlockTimer(59);
    setOtpSent(true);
    setUnlockInfo(`OTP code 123456 sent successfully!`);
  };

  const verifyUnlock = () => {
    setUnlockError("");
    if (unlockMethod === "password") {
      if (unlockInput.length < 4) {
        setUnlockError("Password must be at least 4 characters.");
        return;
      }
      const dbUser = mockDb.findUser(user?.email || user?.phone || "");
      const correctPassword = dbUser?.password || "password123";
      if (unlockInput !== correctPassword) {
        setUnlockError("Incorrect password. Please enter the password used to log in.");
        return;
      }
    } else {
      if (unlockInput !== "123456") {
        setUnlockError("Invalid OTP code. Please enter 123456.");
        return;
      }
    }
    setUnlockModalOpen(false);
    setFieldsUnlocked(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInvalidField(null);

    if (!infoData.name.trim()) {
      setError("Full Name is required.");
      setInvalidField("name");
      return;
    }
    if (!infoData.email.trim()) {
      setError("Email Address is required.");
      setInvalidField("email");
      return;
    }
    if (!infoData.phone.trim()) {
      setError("Phone Number is required.");
      setInvalidField("phone");
      return;
    }
    if (!infoData.gender || infoData.gender === "Select Gender") {
      setError("Gender is required.");
      setInvalidField("gender");
      return;
    }
    const ageNum = parseInt(infoData.age);
    if (!infoData.age || isNaN(ageNum)) {
      setError("Age is required.");
      setInvalidField("age");
      return;
    }
    if (ageNum < 18) {
      setError("You must be at least 18 years old.");
      setInvalidField("age");
      return;
    }
    if (!infoData.country || infoData.country === "Select Country") {
      setError("Country is required.");
      setInvalidField("country");
      return;
    }
    if (!infoData.city || infoData.city === "Select City" || !infoData.city.trim()) {
      setError("City is required.");
      setInvalidField("city");
      return;
    }
    if (!infoData.address.trim()) {
      setError("Address is required.");
      setInvalidField("address");
      return;
    }

    const hasChanges =
      infoData.name.trim() !== (user?.name || "").trim() ||
      infoData.email.trim() !== (user?.email || "").trim() ||
      infoData.phone.trim() !== (user?.phone || "").trim() ||
      infoData.phoneCountryCode !== (user?.phone_country_code || "+91") ||
      infoData.gender !== (user?.gender || "Select Gender") ||
      infoData.age.toString() !== (user?.age?.toString() || "") ||
      infoData.country !== (user?.country || "Select Country") ||
      infoData.city.trim() !== (user?.city || "Select City").trim() ||
      infoData.address.trim() !== (user?.address || "").trim();

    if (!hasChanges) {
      setError("No changes detected to update.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      try {
        updateUserProfile({
          name: infoData.name,
          email: infoData.email,
          phone: infoData.phone,
          phone_country_code: infoData.phoneCountryCode,
          gender: infoData.gender,
          age: infoData.age,
          country: infoData.country,
          city: infoData.city,
          address: infoData.address
        });
        setFieldsUnlocked(false);
        toast.success("Personal information saved successfully!");
      } catch (err) {
        setError("Failed to update profile.");
      } finally {
        setIsSaving(false);
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-text-main flex items-center gap-2">
          <BadgeInfo className="text-primary" size={20} />
          <span>Personal Information</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 font-medium">Update your name, address, gender and contact profiles.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-left flex items-start gap-2.5">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <span className="text-xs text-red-400 font-semibold leading-relaxed">{error}</span>
        </div>
      )}

      {/* Grid containing fields - spacious for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Full Name</label>
          <input
            type="text"
            value={infoData.name}
            onChange={(e) => {
              setInfoData((p) => ({ ...p, name: e.target.value }));
              if (invalidField === "name") setInvalidField(null);
            }}
            placeholder="e.g. John Doe"
            className={inputClassName(invalidField === "name")}
            required
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className={labelClassName}>Email Address</label>
            {!fieldsUnlocked && (
              <button
                type="button"
                onClick={() => handleUnlockClick("email")}
                className="text-[9px] font-black uppercase tracking-widest text-primary hover:scale-[1.02] hover:text-primary-dark transition-all flex items-center gap-1 cursor-pointer"
              >
                <Lock size={10} />
                <span>Verify & Edit</span>
              </button>
            )}
          </div>
          <input
            type="email"
            value={infoData.email}
            onChange={(e) => {
              setInfoData((p) => ({ ...p, email: e.target.value }));
              if (invalidField === "email") setInvalidField(null);
            }}
            disabled={!fieldsUnlocked}
            placeholder="e.g. john@example.com"
            className={inputClassName(invalidField === "email", !fieldsUnlocked)}
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className={labelClassName}>Phone Number</label>
            {!fieldsUnlocked && (
              <button
                type="button"
                onClick={() => handleUnlockClick("phone")}
                className="text-[9px] font-black uppercase tracking-widest text-primary hover:scale-[1.02] hover:text-primary-dark transition-all flex items-center gap-1 cursor-pointer"
              >
                <Lock size={10} />
                <span>Verify & Edit</span>
              </button>
            )}
          </div>
          <div className="flex gap-3 relative">
            <div className="w-[30%] relative">
              <button
                disabled={!fieldsUnlocked}
                type="button"
                onClick={() => setIsCountryDropdownOpen(prev => !prev)}
                className={selectBtnClassName(!fieldsUnlocked)}
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={`https://flagcdn.com/w40/${(countries.find(c => c.code === infoData.phoneCountryCode)?.iso || "in")}.png`}
                    alt="Flag"
                    className="w-4.5 h-3 object-cover rounded-[2px] shrink-0"
                  />
                  <span className="truncate">{infoData.phoneCountryCode}</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted shrink-0 transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsCountryDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      className="absolute z-40 left-0 mt-1.5 w-44 max-h-48 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-xl custom-scrollbar flex flex-col text-left font-outfit"
                    >
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setInfoData(p => ({ ...p, phoneCountryCode: c.code }));
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`w-full cursor-pointer flex items-center gap-2.5 px-3 py-2.5 text-left text-text-main hover:bg-primary/10 transition-colors text-xs font-semibold ${c.code === infoData.phoneCountryCode ? "bg-primary/5 text-primary" : ""
                            }`}
                        >
                          <img
                            src={`https://flagcdn.com/w40/${c.iso}.png`}
                            alt={c.name}
                            className="w-4.5 h-3 object-cover rounded-[1px] shrink-0"
                          />
                          <span>{c.code} ({c.name})</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[70%] relative flex items-center">
              <input
                type="tel"
                value={infoData.phone}
                onChange={(e) => {
                  setInfoData((p) => ({ ...p, phone: e.target.value }));
                  if (invalidField === "phone") setInvalidField(null);
                }}
                placeholder="e.g. 9876543210"
                disabled={!fieldsUnlocked}
                className={inputClassName(invalidField === "phone", !fieldsUnlocked)}
              />
            </div>
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5 relative">
          <label className={labelClassName}>Gender</label>
          <button
            type="button"
            onClick={() => setGenderDropdownOpen((prev) => !prev)}
            className={selectBtnClassName(false, invalidField === "gender")}
          >
            <span>{infoData.gender}</span>
            <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${genderDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {genderDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setGenderDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute left-0 right-0 top-15 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-hidden py-1 flex flex-col"
                >
                  {["Male", "Female", "Other"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setInfoData((p) => ({ ...p, gender: option }));
                        setGenderDropdownOpen(false);
                        if (invalidField === "gender") setInvalidField(null);
                      }}
                      className="w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer text-text-main"
                    >
                      <span>{option}</span>
                      {infoData.gender === option && <Check size={12} className="text-primary" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Age */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Age</label>
          <input
            type="number"
            value={infoData.age}
            onChange={(e) => {
              setInfoData((p) => ({ ...p, age: e.target.value }));
              if (invalidField === "age") setInvalidField(null);
            }}
            placeholder="e.g. 25"
            min="18"
            max="100"
            className={inputClassName(invalidField === "age")}
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5 relative">
          <label className={labelClassName}>Country</label>
          <button
            type="button"
            onClick={() => setCountryDropdownOpen((prev) => !prev)}
            className={selectBtnClassName(false, invalidField === "country")}
          >
            <span>{infoData.country}</span>
            <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${countryDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {countryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setCountryDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute left-0 right-0 top-15 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-y-auto max-h-48 py-1 flex flex-col custom-scrollbar"
                >
                  {Object.keys(countryCitiesMap).map((cName) => (
                    <button
                      key={cName}
                      type="button"
                      onClick={() => {
                        setInfoData((p) => ({ ...p, country: cName, city: "Select City" }));
                        setCountryDropdownOpen(false);
                        if (invalidField === "country") setInvalidField(null);
                      }}
                      className="w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer text-text-main"
                    >
                      <span>{cName}</span>
                      {infoData.country === cName && <Check size={12} className="text-primary" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5 relative">
          <label className={labelClassName}>City</label>
          <button
            type="button"
            disabled={infoData.country === "Select Country"}
            onClick={() => setCityDropdownOpen((prev) => !prev)}
            className={selectBtnClassName(infoData.country === "Select Country", invalidField === "city")}
          >
            <span>{infoData.city}</span>
            <ChevronDown size={14} className={`text-text-muted transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {cityDropdownOpen && infoData.country !== "Select Country" && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setCityDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute left-0 right-0 top-15 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-y-auto max-h-48 py-1 flex flex-col custom-scrollbar"
                >
                  {(countryCitiesMap[infoData.country] || []).map((cityName) => (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => {
                        setInfoData((p) => ({ ...p, city: cityName }));
                        setCityDropdownOpen(false);
                        if (invalidField === "city") setInvalidField(null);
                      }}
                      className="w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer text-text-main"
                    >
                      <span>{cityName}</span>
                      {infoData.city === cityName && <Check size={12} className="text-primary" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Address - Spans full width on desktop */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelClassName}>Address</label>
          <textarea
            value={infoData.address}
            onChange={(e) => {
              setInfoData((p) => ({ ...p, address: e.target.value }));
              if (invalidField === "address") setInvalidField(null);
            }}
            placeholder="Your Home Address"
            rows={3}
            className={textareaClassName(invalidField === "address")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full md:w-fit md:px-10 h-12 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md self-end"
      >
        {isSaving ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Save Changes"
        )}
      </button>

      {/* Unlock Verification Modal */}
      <AnimatePresence>
        {unlockModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnlockModalOpen(false)}
              className="absolute inset-0 bg-black/75"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-bg-base border border-border-main rounded-[24px] p-6 shadow-2xl z-10 flex flex-col gap-4 text-center animate-outfit"
            >
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-base">Verify Identity</h3>
                <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">
                  Please verify your account password or confirm with an OTP to edit your primary contact details.
                </p>
              </div>

              {unlockError && (
                <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-xl text-center">
                  <span className="text-[10px] text-red-400 font-semibold">{unlockError}</span>
                </div>
              )}

              {unlockInfo && (
                <div className="p-2.5 bg-green-500/5 border border-green-500/10 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <Check size={12} className="text-green-500 shrink-0" />
                  <span className="text-[10px] text-green-400 font-semibold leading-none">{unlockInfo}</span>
                </div>
              )}

              {/* Tabs to select method */}
              <div className="flex bg-bg-secondary border border-border-main rounded-xl p-0.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setUnlockMethod("password");
                    setUnlockInput("");
                    setUnlockError("");
                    setUnlockInfo("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${unlockMethod === "password" ? "bg-primary text-white" : "text-text-muted hover:text-text-main"
                    }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnlockMethod("otp");
                    setUnlockInput("");
                    setUnlockError("");
                    setUnlockInfo("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${unlockMethod === "otp" ? "bg-primary text-white" : "text-text-muted hover:text-text-main"
                    }`}
                >
                  OTP Verification
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {unlockMethod === "password" ? (
                  <input
                    type="password"
                    value={unlockInput}
                    onChange={(e) => setUnlockInput(e.target.value)}
                    placeholder="Enter account password"
                    className={inputClassName(false) + " text-center"}
                  />
                ) : !otpSent ? (
                  <div className="py-4 px-2 border border-dashed border-border-main/50 dark:border-white/10 rounded-xl bg-bg-secondary/40 text-center">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
                      Click "Send OTP" to request a verification code.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={unlockInput}
                      onChange={(e) => setUnlockInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className={inputClassName(false) + " text-center text-lg font-black tracking-[0.4em] placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"}
                    />
                    <span className="text-[9px] text-text-muted/65 font-bold uppercase tracking-wider block mt-1">
                      (OTP sent to current {unlockTarget === "email" ? "email" : "phone"}. Code: <span className="text-primary font-black">123456</span>)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                {unlockMethod === "otp" && !otpSent ? (
                  <button
                    type="button"
                    onClick={sendUnlockOtp}
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center shadow-md"
                  >
                    Send OTP
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={verifyUnlock}
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center shadow-md"
                  >
                    Verify & Unlock
                  </button>
                )}

                <div className="flex items-center justify-between text-[10px] font-bold text-text-muted px-1 mt-1">
                  <span>
                    {unlockMethod === "otp" && otpSent && (
                      unlockTimer > 0 ? (
                        `Resend in ${unlockTimer}s`
                      ) : (
                        <button type="button" onClick={sendUnlockOtp} className="text-primary hover:underline cursor-pointer">
                          Resend Code
                        </button>
                      )
                    )}
                  </span>
                  <button type="button" onClick={() => setUnlockModalOpen(false)} className="hover:text-text-main transition-colors cursor-pointer ml-auto">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. COMPANION PROFILE SETTINGS FORM
   ───────────────────────────────────────────────────────────────────────────── */
function ProfileSettingsForm({ storageKey }: { storageKey: string }) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    city: "",
    bio: "",
    hourlyRate: "",
    languages: "",
    interests: "",
    tags: ""
  });
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const fd = parsed.formData || {};
        setFormData({
          fullName: fd.fullName || "",
          displayName: fd.displayName || "",
          city: fd.city || "",
          bio: fd.bio || "",
          hourlyRate: fd.hourlyRate || "",
          languages: Array.isArray(fd.languages) ? fd.languages.join(", ") : (fd.languages || ""),
          interests: Array.isArray(fd.interestsInput) ? fd.interestsInput.join(", ") : (fd.interests || ""),
          tags: Array.isArray(fd.tagsInput) ? fd.tagsInput.join(", ") : (fd.tags || "")
        });

        let rawGallery = parsed.gallery || fd.gallery || [];
        if (rawGallery.length === 0) {
          const approvedStr = localStorage.getItem("approved_partners");
          const list = approvedStr ? JSON.parse(approvedStr) : mockPartnersList;
          const found = list.find((p: any) => p.name === fd.fullName || p.id === "sabrina-carpenter" || (user?.id && String(p.id) === String(user.id)));
          if (found && found.gallery) {
            rawGallery = found.gallery;
          }
        }
        const mappedGallery = rawGallery.map((img: any) => typeof img === "string" ? img : (img && img.image ? img.image : "")).filter(Boolean);
        setGallery(mappedGallery);
      }
    } catch (e) {
      console.error(e);
    }
  }, [storageKey, user]);

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setGallery((prev) => [...prev, ...newUrls]);
      toast.success(`Selected ${newUrls.length} new photo(s) to add.`);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== index));
    toast.success("Photo removed from gallery selection.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    setTimeout(() => {
      try {
        const savedData = localStorage.getItem(storageKey);
        let parsed = savedData ? JSON.parse(savedData) : {};
        if (!parsed.formData) parsed.formData = {};

        const updatedGallery = gallery.map((img, idx) => ({
          id: String(idx + 1),
          image: img
        }));

        parsed.gallery = updatedGallery;
        parsed.formData.gallery = updatedGallery;
        parsed.formData.fullName = formData.fullName;
        parsed.formData.displayName = formData.displayName;
        parsed.formData.city = formData.city;
        parsed.formData.bio = formData.bio;
        parsed.formData.hourlyRate = formData.hourlyRate;
        parsed.formData.languages = formData.languages.split(",").map((s: string) => s.trim()).filter(Boolean);
        parsed.formData.interestsInput = formData.interests.split(",").map((s: string) => s.trim()).filter(Boolean);
        parsed.formData.tagsInput = formData.tags.split(",").map((s: string) => s.trim()).filter(Boolean);

        localStorage.setItem(storageKey, JSON.stringify(parsed));

        const nameToFind = parsed.formData.fullName;
        if (nameToFind) {
          const approvedStr = localStorage.getItem("approved_partners");
          const list = approvedStr ? JSON.parse(approvedStr) : [...mockPartnersList];
          
          let exists = false;
          let updatedList = list.map((p: any) => {
            if (p.name === nameToFind || p.id === "sabrina-carpenter" || (user?.id && String(p.id) === String(user.id))) {
              exists = true;
              return {
                ...p,
                name: formData.fullName,
                location: formData.city,
                bio: formData.bio,
                pricing: {
                  ...p.pricing,
                  oneHour: Number(formData.hourlyRate)
                },
                languages: formData.languages,
                interests: formData.interests,
                tags: formData.tags.split(",").map((s: string) => s.trim().startsWith("#") ? s.trim() : `#${s.trim()}`).filter(Boolean),
                gallery: updatedGallery
              };
            }
            return p;
          });

          if (!exists) {
            const newPartner = {
              id: user?.id || "sabrina-carpenter",
              name: formData.fullName,
              location: formData.city,
              bio: formData.bio,
              pricing: {
                oneHour: Number(formData.hourlyRate),
                twoHours: Number(formData.hourlyRate) * 2,
                threeHours: Number(formData.hourlyRate) * 3,
                fourHours: Number(formData.hourlyRate) * 4,
                fiveHours: Number(formData.hourlyRate) * 5,
                eightHours: Number(formData.hourlyRate) * 8
              },
              languages: formData.languages,
              interests: formData.interests,
              tags: formData.tags.split(",").map((s: string) => s.trim().startsWith("#") ? s.trim() : `#${s.trim()}`).filter(Boolean),
              gallery: updatedGallery,
              verified: true
            };
            updatedList = [newPartner, ...updatedList];
          }

          localStorage.setItem("approved_partners", JSON.stringify(updatedList));
        }

        window.dispatchEvent(new Event("partnerStatusChange"));
        window.dispatchEvent(new Event("partner_profile_updated"));

        setIsSubmitting(false);
        setSuccess(true);
        toast.success("Companion profile details updated successfully!");
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError("Failed to save companion profile details.");
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-text-main flex items-center gap-2">
          <UserRound className="text-primary" size={20} />
          <span>Companion Profile Settings</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 font-medium">Update your bio, pricing details, and keywords shown to clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
            placeholder="e.g. Sabrina Carpenter"
            className={inputClassName()}
            required
          />
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(p => ({ ...p, displayName: e.target.value }))}
            placeholder="e.g. Sabrina"
            className={inputClassName()}
            required
          />
        </div>

        {/* City / Location */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>City / Location</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
            placeholder="e.g. New York, USA"
            className={inputClassName()}
            required
          />
        </div>

        {/* Hourly Rate */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Hourly Rate ($)</label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData(p => ({ ...p, hourlyRate: e.target.value }))}
            placeholder="e.g. 150"
            className={inputClassName()}
            required
          />
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Languages (comma separated)</label>
          <input
            type="text"
            value={formData.languages}
            onChange={(e) => setFormData(p => ({ ...p, languages: e.target.value }))}
            placeholder="e.g. English, French"
            className={inputClassName()}
          />
        </div>

        {/* Interests */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Interests (comma separated)</label>
          <input
            type="text"
            value={formData.interests}
            onChange={(e) => setFormData(p => ({ ...p, interests: e.target.value }))}
            placeholder="e.g. Music, Coffee, Films"
            className={inputClassName()}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelClassName}>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
            placeholder="e.g. Singer, Actor, Artist"
            className={inputClassName()}
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className={labelClassName}>Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tell clients about yourself..."
            rows={4}
            className={textareaClassName()}
            required
          />
        </div>

        {/* Manage Gallery */}
        <div className="flex flex-col gap-3 md:col-span-2 pt-6 border-t border-border-main/30">
          <label className={labelClassName}>Manage Portfolio Gallery</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((src, idx) => (
              <div key={idx} className="relative aspect-square group overflow-hidden bg-bg-base border border-border-main rounded-xl">
                <img
                  src={src}
                  alt={`Gallery Upload ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer z-10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <label
              htmlFor="gallery-file-upload"
              className="relative aspect-square border-2 border-dashed border-border-main/60 hover:border-primary/50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-bg-card hover:bg-primary/5 transition-all text-text-muted hover:text-primary group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Add Photos</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddPhoto}
              className="hidden"
              id="gallery-file-upload"
            />
          </div>
          <p className="text-[10px] text-text-muted font-medium mt-1">Upload high-resolution JPG or PNG portfolio photos. You can upload as many as you want.</p>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full md:w-fit md:px-10 h-12 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer mt-4 shadow-md self-end ${success ? "bg-emerald-600 text-white" : "bg-primary text-white hover:bg-primary/95"
          }`}
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        ) : success ? (
          "Profile Saved"
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PASSWORD MANAGEMENT FORM
   ───────────────────────────────────────────────────────────────────────────── */
function PasswordForm() {
  const { user } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.current || !passData.new || !passData.confirm) {
      setError("All fields are required");
      return;
    }
    if (passData.new.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (passData.new !== passData.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (passData.new === passData.current) {
      setError("New password cannot be the same as the current password.");
      return;
    }

    const dbUser = mockDb.findUser(user?.email || user?.phone || "");
    const correctPassword = dbUser?.password || "password123";
    if (passData.current !== correctPassword) {
      setError("Incorrect current password. Please enter the password used to log in.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        mockDb.updateUserPassword(user?.email || user?.phone || "", passData.new);
        toast.success("Password updated successfully!");
        setPassData({ current: "", new: "", confirm: "" });
      } catch (err) {
        setError("Failed to update password. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left animate-outfit">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-text-main flex items-center gap-2">
          <Lock className="text-primary" size={20} />
          <span>Password Settings</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 font-medium">Update your account login password periodically for maximum safety.</p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Current Password</label>
          <input
            type={showPass ? "text" : "password"}
            value={passData.current}
            onChange={(e) => { setPassData(p => ({ ...p, current: e.target.value })); setError(""); }}
            placeholder="Enter current password"
            className={inputClassName()}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>New Password</label>
          <input
            type={showPass ? "text" : "password"}
            value={passData.new}
            onChange={(e) => { setPassData(p => ({ ...p, new: e.target.value })); setError(""); }}
            placeholder="Min 8 characters"
            className={inputClassName()}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClassName}>Confirm New Password</label>
          <input
            type={showPass ? "text" : "password"}
            value={passData.confirm}
            onChange={(e) => { setPassData(p => ({ ...p, confirm: e.target.value })); setError(""); }}
            placeholder="Repeat new password"
            className={inputClassName()}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-main transition-colors cursor-pointer"
          >
            {showPass ? "Hide Passwords" : "Show Passwords"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10 max-w-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !passData.current || !passData.new || !passData.confirm}
        className={`w-full md:w-fit md:px-10 h-12 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all mt-4 shadow-md self-end ${(passData.current && passData.new && passData.confirm)
            ? "bg-primary text-white hover:bg-primary/95 cursor-pointer"
            : "bg-bg-base border border-border-main/20 text-text-muted/50 cursor-not-allowed"
          }`}
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. NOTIFICATION SETTINGS FORM
   ───────────────────────────────────────────────────────────────────────────── */
function NotificationsForm() {
  const [prefs, setPrefs] = useState<{ email: boolean; sms: boolean; push: boolean }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meetme_notification_prefs");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) { }
      }
    }
    return { email: true, sms: false, push: true };
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const initialPrefs = useRef({ ...prefs });

  const handleSave = () => {
    const hasChanges =
      prefs.email !== initialPrefs.current.email ||
      prefs.sms !== initialPrefs.current.sms ||
      prefs.push !== initialPrefs.current.push;

    if (!hasChanges) {
      setError("No changes detected to update.");
      return;
    }

    setError("");
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("meetme_notification_prefs", JSON.stringify(prefs));
      }
      initialPrefs.current = { ...prefs };
      toast.success("Notification preferences updated successfully!");
    }, 1000);
  };

  const renderToggle = (label: string, desc: string, key: 'email' | 'sms' | 'push') => {
    const enabled = prefs[key];
    return (
      <div className="flex items-center justify-between p-4 bg-bg-base border border-border-main/40 rounded-2xl max-w-xl">
        <div className="flex-1 pr-4 text-left">
          <span className="text-xs font-black uppercase tracking-wider text-text-main block leading-tight">{label}</span>
          <span className="text-[10px] text-text-muted font-semibold leading-relaxed mt-1 block">{desc}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
            setError("");
          }}
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${enabled ? "bg-primary" : "bg-bg-secondary border border-border-main/30"
            }`}
        >
          <motion.div
            animate={{ x: enabled ? 22 : 2 }}
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
          />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-text-main flex items-center gap-2">
          <Bell className="text-primary" size={20} />
          <span>Notification Alert</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 font-medium">Manage how you receive alerts for companion bookings and messages.</p>
      </div>

      <div className="flex flex-col gap-3">
        {renderToggle("Email Alerts", "Receive daily booking summaries, logs, and account reports.", "email")}
        {renderToggle("SMS Alerts", "Receive direct real-time SMS messages for incoming booking inquiries.", "sms")}
        {renderToggle("Push Alerts", "Receive real-time notifications in your browser tab when online.", "push")}
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10 max-w-xl">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isUpdating}
        className="w-full md:w-fit md:px-10 h-12 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all bg-primary text-white hover:bg-primary/95 cursor-pointer mt-4 shadow-md self-end"
      >
        {isUpdating ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        ) : (
          "Save Settings"
        )}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. DELETE ACCOUNT FORM
   ───────────────────────────────────────────────────────────────────────────── */
function DeleteAccountForm() {
  const [typedConfirm, setTypedConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmText = "DELETE ACCOUNT";

  const handleDelete = () => {
    if (typedConfirm !== confirmText) return;
    setIsDeleting(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-xl">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-red-500 flex items-center gap-2">
          <Trash2 className="text-red-500" size={20} />
          <span>Delete Account</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 font-medium">Permanently delete your profile and active history from our directory.</p>
      </div>

      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
        <p className="text-xs text-red-400 font-semibold leading-relaxed">
          Warning: This action is irreversible. All your profile ratings, history logs, messages, and companion entries will be wiped from the database.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClassName}>
          Type <span className="text-red-500 font-black">{confirmText}</span> to confirm
        </label>
        <input
          type="text"
          value={typedConfirm}
          onChange={(e) => setTypedConfirm(e.target.value)}
          placeholder="Type confirmation text..."
          className={inputClassName(false) + " focus:border-red-500 focus:ring-red-500/10"}
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={typedConfirm !== confirmText || isDeleting}
        className={`w-full md:w-fit md:px-10 h-12 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all mt-4 self-end ${typedConfirm === confirmText
            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-md"
            : "bg-bg-base border border-border-main/20 text-text-muted/50 cursor-not-allowed"
          }`}
      >
        {isDeleting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        ) : (
          "Confirm Delete"
        )}
      </button>
    </div>
  );
}
