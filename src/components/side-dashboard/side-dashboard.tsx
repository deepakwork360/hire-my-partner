"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { 
  Calendar, 
  Wallet, 
  UserRound, 
  Heart, 
  ChevronRight, 
  LayoutDashboard,
  X,
  Compass,
  UserCheck,
  LogOut,
  Sparkles,
  HelpCircle,
  LogIn,
  Settings,
  Palette,
  Moon,
  Sun,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Pencil,
  Bell,
  Trash2,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert,
  BadgeInfo
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { useTheme, Theme } from "@/context/ThemeContext";
import { toast } from "@/components/ui/toastStore";
import { mockDb } from "@/modules/auth/data/users";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "rose", label: "Rose", color: "bg-rose-500" },
  { id: "gold", label: "Gold", color: "bg-amber-500" },
  { id: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { id: "violet", label: "Violet", color: "bg-violet-600" },
  { id: "emerald", label: "Emerald", color: "bg-emerald-500" },
];

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface SideDashboardProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export default function SideDashboard({ activeItem = "earning", onItemClick }: SideDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, clearAuth, updateUserAvatar, updateUserProfile } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { activeTheme, setTheme, isPreferenceSet, resetToRotation, appearance, toggleAppearance } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isLivePartner, setIsLivePartner] = useState(false);
  const [partnerPhoto, setPartnerPhoto] = useState("");
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [accountSection, setAccountSection] = useState<"profile" | "password" | "notifications" | "delete" | "personal-info" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageKey = user && user.email ? `partnerApplication_${user.email.replace(/[^a-zA-Z0-9]/g, "_")}` : "partnerApplication";

  const renderMenuItem = (href: string, label: string, IconComponent: any, extraClass?: string) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group border-l-2 ${extraClass || ""} ${
          isActive
            ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
            : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <IconComponent size={18} className={isActive ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
          <span className="text-sm font-semibold tracking-wide">{label}</span>
        </div>
        <ChevronRight size={14} className={isActive ? "text-primary" : "text-text-muted/40 group-hover:text-text-main transition-colors"} />
      </Link>
    );
  };

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event("side_dashboard_opened"));
    } else {
      window.dispatchEvent(new Event("side_dashboard_closed"));
    }
  }, [isOpen]);

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close dashboard on ESC key
  useEffect(() => {
    setMounted(true);
    
    const checkPartnerStatus = () => {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.verificationStatus === "VERIFIED" && parsed.formData) {
            setIsLivePartner(true);
            if (parsed.formData.photo) {
              setPartnerPhoto(parsed.formData.photo);
            }
            // Auto sync approved partner profile values to the logged-in User profile!
            const currentUser = useAuthStore.getState().user;
            const fd = parsed.formData;
            const needsSync =
              fd.fullName !== currentUser?.name ||
              fd.gender !== currentUser?.gender ||
              fd.age !== currentUser?.age ||
              fd.country !== currentUser?.country ||
              fd.city !== currentUser?.city ||
              fd.mobile !== currentUser?.phone ||
              fd.phoneCountryCode !== currentUser?.phone_country_code;

            if (needsSync && currentUser) {
              updateUserProfile({
                name: fd.fullName || currentUser.name,
                gender: fd.gender || currentUser.gender,
                age: fd.age || currentUser.age,
                country: fd.country || currentUser.country,
                city: fd.city || currentUser.city,
                phone: fd.mobile || currentUser.phone,
                phone_country_code: fd.phoneCountryCode || currentUser.phone_country_code,
              });
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      setIsLivePartner(false);
      setPartnerPhoto("");
    };

    checkPartnerStatus();

    // Listen to custom updates
    window.addEventListener("partnerStatusChange", checkPartnerStatus);
    window.addEventListener("partner_profile_updated", checkPartnerStatus);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };
    const handleOpenAccountCenter = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      setShowAccountCenter(true);
      if (customEvent.detail && customEvent.detail.section) {
        setAccountSection(customEvent.detail.section);
      } else {
        setAccountSection(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("toggle_side_dashboard", handleToggle);
    window.addEventListener("open_account_center", handleOpenAccountCenter);

    return () => {
      window.removeEventListener("partnerStatusChange", checkPartnerStatus);
      window.removeEventListener("partner_profile_updated", checkPartnerStatus);
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("toggle_side_dashboard", handleToggle);
      window.removeEventListener("open_account_center", handleOpenAccountCenter);
    };
  }, [storageKey]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [personalInfoSuccess, setPersonalInfoSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false);
      setShowAccountCenter(false);
      setAccountSection(null);
    }
  }, [isOpen]);

  const DefaultSilhouette = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
      <circle cx="50" cy="50" r="50" fill="#c4c4c4" />
      <circle cx="50" cy="42" r="18" fill="#ffffff" />
      <path d="M50 66c-16 0-30 8-34 18 3 4 31 16 34 16s31-12 34-16c-4-10-18-18-34-18z" fill="#ffffff" />
    </svg>
  );

  const handleAvatarUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      const url = URL.createObjectURL(file);
      updateUserAvatar(url);
      if (isLivePartner) {
        try {
          const savedApp = localStorage.getItem(storageKey);
          if (savedApp) {
            const parsed = JSON.parse(savedApp);
            if (!parsed.formData) parsed.formData = {};
            parsed.formData.photo = url;
            localStorage.setItem(storageKey, JSON.stringify(parsed));
            setPartnerPhoto(url);
            const nameToFind = parsed.formData.fullName;
            if (nameToFind) {
              const approvedStr = localStorage.getItem("approved_partners");
              if (approvedStr) {
                const list = JSON.parse(approvedStr);
                const updatedList = list.map((p: any) => {
                  if (p.name === nameToFind) {
                    return { ...p, image: url };
                  }
                  return p;
                });
                localStorage.setItem("approved_partners", JSON.stringify(updatedList));
              }
            }
          }
        } catch (err) {
          console.error("Failed to sync partner photo upload:", err);
        }
      }
      window.dispatchEvent(new Event("partnerStatusChange"));
      window.dispatchEvent(new Event("partner_profile_updated"));
      toast.success("Profile photo updated successfully!");
    }
  };

  const SidebarPassManagement = () => {
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

      // Verify current password matches registered password
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
          setPasswordSuccess(true);
          setPassData({ current: "", new: "", confirm: "" });
        } catch (err) {
          setError("Failed to update password. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }, 1000);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-text-main text-left">Password Management</h4>
        <div className="flex flex-col gap-3">
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                value={passData.current}
                onChange={(e) => { setPassData(p => ({ ...p, current: e.target.value })); setError(""); }}
                placeholder="Enter current password"
                className="w-full h-11 px-4 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">New Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                value={passData.new}
                onChange={(e) => { setPassData(p => ({ ...p, new: e.target.value })); setError(""); }}
                placeholder="Min 8 characters"
                className="w-full h-11 px-4 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40"
              />
            </div>
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Confirm New Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                value={passData.confirm}
                onChange={(e) => { setPassData(p => ({ ...p, confirm: e.target.value })); setError(""); }}
                placeholder="Repeat new password"
                className="w-full h-11 px-4 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-[10px] font-bold text-text-muted hover:text-text-main transition-colors cursor-pointer"
          >
            {showPass ? "Hide Passwords" : "Show Passwords"}
          </button>
        </div>

        {error && (
          <div className="text-[10px] text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-left">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !passData.current || !passData.new || !passData.confirm}
          className={`w-full h-11 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
            (passData.current && passData.new && passData.confirm)
              ? "bg-primary text-white hover:bg-primary/95 cursor-pointer shadow-md"
              : "bg-bg-secondary text-text-muted border border-border-main cursor-not-allowed"
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
  };

  const SidebarNotifications = () => {
    const [prefs, setPrefs] = useState<{ email: boolean; sms: boolean; push: boolean }>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("meetme_notification_prefs");
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (e) {}
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
        setNotificationsSuccess(true);
      }, 1000);
    };

    const renderToggle = (label: string, desc: string, key: 'email' | 'sms' | 'push') => {
      const enabled = prefs[key];
      return (
        <div className="flex items-center justify-between p-3.5 bg-bg-secondary border border-border-main/50 rounded-xl">
          <div className="flex-1 pr-3 text-left">
            <span className="text-xs font-bold text-text-main block leading-tight">{label}</span>
            <span className="text-[9px] text-text-muted leading-tight mt-0.5 block">{desc}</span>
          </div>
          <button
            onClick={() => {
              setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
              setError("");
            }}
            className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
              enabled ? "bg-primary" : "bg-bg-card border border-border-main"
            }`}
          >
            <motion.div
              animate={{ x: enabled ? 18 : 2 }}
              className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-text-main text-left">Notification Alert</h4>
        <div className="flex flex-col gap-2.5">
          {renderToggle("Email Alerts", "Daily status and booking updates.", "email")}
          {renderToggle("SMS Alerts", "Critical messages and booking logs.", "sms")}
          {renderToggle("Push Alerts", "Real-time updates in browser.", "push")}
        </div>

        {error && (
          <div className="text-[10px] text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-left">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className={`w-full h-11 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all bg-primary text-white hover:bg-primary/95 cursor-pointer mt-2 shadow-md`}
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    );
  };

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

  const SidebarPersonalInfo = () => {
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

    // Unified lock state for both email and phone fields
    const [fieldsUnlocked, setFieldsUnlocked] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

    // Unlock verification modal states
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const [unlockTarget, setUnlockTarget] = useState<"email" | "phone" | null>(null);
    const [unlockMethod, setUnlockMethod] = useState<"password" | "otp">("password");
    const [unlockInput, setUnlockInput] = useState("");
    const [unlockError, setUnlockError] = useState("");
    const [unlockTimer, setUnlockTimer] = useState(59);
    const [otpSent, setOtpSent] = useState(false);
    const [unlockInfo, setUnlockInfo] = useState("");

    // Sync input values if the logged-in user object changes
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
        // Retrieve correct password of the logged-in user from mockDb
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

      // Success - unlocks both fields together
      setUnlockModalOpen(false);
      setFieldsUnlocked(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Stop immediate form save/update on Enter key
      }
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

      // Check if any field has actually been modified
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

      performUpdate();
    };

    const performUpdate = () => {
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
          setPersonalInfoSuccess(true);
          setFieldsUnlocked(false);
          setTimeout(() => setPersonalInfoSuccess(false), 3000);
        } catch (err) {
          setError("Failed to update profile.");
        } finally {
          setIsSaving(false);
        }
      }, 800);
    };

    return (
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-text-main text-left">Personal Information</h4>
        {error && (
          <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-left flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <span className="text-[10px] text-red-400 font-semibold leading-relaxed">{error}</span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Full Name</label>
            <input
              type="text"
              value={infoData.name}
              onChange={(e) => {
                setInfoData((p) => ({ ...p, name: e.target.value }));
                if (invalidField === "name") setInvalidField(null);
              }}
              placeholder="e.g. John Doe"
              onKeyDown={handleKeyDown}
              className={`w-full h-11 px-4 mt-1 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all ${
                invalidField === "name"
                  ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5"
                  : "border-border-main"
              }`}
              required
            />
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Email Address</label>
              {!fieldsUnlocked && (
                <button
                  type="button"
                  onClick={() => handleUnlockClick("email")}
                  className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1 cursor-pointer"
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
              placeholder="e.g. john@example.com"
              disabled={!fieldsUnlocked}
              onKeyDown={handleKeyDown}
              className={`w-full h-11 px-4 mt-1 border rounded-xl text-xs focus:outline-none focus:border-primary/50 transition-all ${
                invalidField === "email"
                  ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5 text-text-main"
                  : fieldsUnlocked
                  ? "bg-bg-base border-primary/30 text-text-main shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]"
                  : "bg-bg-secondary/60 border-border-main text-text-muted/70 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="text-left">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Phone Number</label>
              {!fieldsUnlocked && (
                <button
                  type="button"
                  onClick={() => handleUnlockClick("phone")}
                  className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Lock size={10} />
                  <span>Verify & Edit</span>
                </button>
              )}
            </div>
            <div className="flex gap-2 mt-1 relative">
              <div className="w-[30%] relative">
                <button
                  disabled={!fieldsUnlocked}
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(prev => !prev)}
                  className={`w-full h-11 flex items-center justify-between bg-bg-secondary border border-border-main rounded-xl px-3 text-text-main text-xs focus:outline-none transition-all font-medium ${
                    fieldsUnlocked ? "cursor-pointer focus:border-primary/50" : "opacity-55 cursor-not-allowed"
                  }`}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={`https://flagcdn.com/w40/${(countries.find(c => c.code === infoData.phoneCountryCode)?.iso || "in")}.png`}
                      alt="Flag"
                      className="w-4 h-2.5 object-cover rounded-[2px] shrink-0"
                    />
                    <span className="truncate">{infoData.phoneCountryCode}</span>
                  </span>
                  <ChevronDown className={`w-3 h-3 text-text-muted shrink-0 transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isCountryDropdownOpen && (
                    <>
                      {/* Invisible backdrop to dismiss the dropdown click-away */}
                      <div
                        className="fixed inset-0 z-30 cursor-default"
                        onClick={() => setIsCountryDropdownOpen(false)}
                      />
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
                            className={`w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 text-left text-text-main hover:bg-primary/10 transition-colors text-xs font-medium ${
                              c.code === infoData.phoneCountryCode ? "bg-primary/5 text-primary" : ""
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
                  onKeyDown={handleKeyDown}
                  className={`w-full h-11 px-4 border rounded-xl text-xs focus:outline-none focus:border-primary/50 transition-all ${
                    invalidField === "phone"
                      ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5 text-text-main"
                      : fieldsUnlocked
                      ? "bg-bg-base border-primary/30 text-text-main shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]"
                      : "bg-bg-secondary/60 border-border-main text-text-muted/70 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-left relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Gender</label>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setGenderDropdownOpen((prev) => !prev)}
                  className={`w-full h-11 px-4 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all cursor-pointer flex items-center justify-between ${
                    invalidField === "gender" ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5" : "border-border-main"
                  }`}
                >
                  <span>{infoData.gender}</span>
                  <ChevronDown
                    size={14}
                    className={`text-text-muted transition-transform duration-200 ${genderDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {genderDropdownOpen && (
                    <>
                      {/* Invisible backdrop to dismiss the dropdown click-away */}
                      <div 
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setGenderDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 right-0 mt-1.5 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-hidden py-1 flex flex-col"
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
                            className={`w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer ${
                              infoData.gender === option 
                                ? "bg-primary/5 text-primary" 
                                : "text-text-main"
                            }`}
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
            </div>

            <div className="text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Age</label>
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
                onKeyDown={handleKeyDown}
                className={`w-full h-11 px-4 mt-1 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all ${
                  invalidField === "age" ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5" : "border-border-main"
                }`}
              />
            </div>
          </div>

          <div className="text-left relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Country</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setCountryDropdownOpen((prev) => !prev)}
                className={`w-full h-11 px-4 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all cursor-pointer flex items-center justify-between ${
                  invalidField === "country" ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5" : "border-border-main"
                }`}
              >
                <span>{infoData.country}</span>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform duration-200 ${countryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {countryDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setCountryDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 right-0 mt-1.5 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-y-auto max-h-40 py-1 flex flex-col"
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
                          className={`w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer ${
                            infoData.country === cName 
                              ? "bg-primary/5 text-primary" 
                              : "text-text-main"
                          }`}
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
          </div>

          <div className="text-left relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">City</label>
            <div className="relative mt-1">
              <button
                type="button"
                disabled={infoData.country === "Select Country"}
                onClick={() => setCityDropdownOpen((prev) => !prev)}
                className={`w-full h-11 px-4 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all flex items-center justify-between ${
                  invalidField === "city" 
                    ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5" 
                    : "border-border-main"
                } ${
                  infoData.country === "Select Country" ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span>{infoData.city}</span>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform duration-200 ${cityDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {cityDropdownOpen && infoData.country !== "Select Country" && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setCityDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 right-0 mt-1.5 bg-bg-base border border-border-main rounded-xl shadow-xl z-50 overflow-y-auto max-h-40 py-1 flex flex-col"
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
                          className={`w-full h-10 px-4 text-left text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between cursor-pointer ${
                            infoData.city === cityName 
                              ? "bg-primary/5 text-primary" 
                              : "text-text-main"
                          }`}
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
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Address</label>
            <textarea
              value={infoData.address}
              onChange={(e) => {
                setInfoData((p) => ({ ...p, address: e.target.value }));
                if (invalidField === "address") setInvalidField(null);
              }}
              placeholder="Your billing / shipping address"
              rows={3}
              onKeyDown={handleKeyDown}
              className={`w-full p-4 mt-1 bg-bg-secondary border rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all resize-none ${
                invalidField === "address" ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/5" : "border-border-main"
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full h-11 bg-primary hover:bg-primary/95 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md"
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
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      unlockMethod === "password"
                        ? "bg-primary text-white"
                        : "text-text-muted hover:text-text-main"
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
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      unlockMethod === "otp"
                        ? "bg-primary text-white"
                        : "text-text-muted hover:text-text-main"
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
                      className="w-full h-11 px-4 text-center bg-bg-secondary border border-border-main rounded-xl focus:outline-none focus:border-primary/50 text-text-main text-xs"
                    />
                  ) : !otpSent ? (
                    <div className="py-4 px-2 border border-dashed border-border-main rounded-xl bg-bg-secondary/40 text-center">
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
                        className="w-full h-12 text-center text-lg font-black tracking-[0.4em] bg-bg-secondary border border-border-main rounded-xl focus:outline-none focus:border-primary/50 text-text-main placeholder:text-text-muted/30 placeholder:tracking-normal placeholder:font-medium placeholder:text-sm"
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
                          <button
                            type="button"
                            onClick={sendUnlockOtp}
                            className="text-primary hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnlockModalOpen(false)}
                      className="hover:text-text-main transition-colors cursor-pointer ml-auto"
                    >
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
  };

  const SidebarDeleteAccount = () => {
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
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-red-500 text-left">Delete Account</h4>
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-left">
          <p className="text-[10px] text-red-400 font-semibold leading-relaxed">
            Warning: This action is irreversible. It will permanently remove your profile, history, and active bookings.
          </p>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1 block text-left">
            Type <span className="text-red-400">{confirmText}</span> to confirm
          </label>
          <input
            type="text"
            value={typedConfirm}
            onChange={(e) => setTypedConfirm(e.target.value)}
            placeholder="Type standard confirmation text"
            className="w-full h-11 px-4 mt-1.5 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-red-500/50 transition-all placeholder:text-text-muted/40"
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={typedConfirm !== confirmText || isDeleting}
          className={`w-full h-11 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
            typedConfirm === confirmText
              ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              : "bg-bg-secondary text-text-muted border border-border-main cursor-not-allowed"
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
  };

  const SidebarProfileSettings = () => {
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
        }
      } catch (e) {
        console.error(e);
      }
    }, [storageKey]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");

      setTimeout(() => {
        try {
          const savedData = localStorage.getItem(storageKey);
          let parsed = savedData ? JSON.parse(savedData) : {};
          if (!parsed.formData) parsed.formData = {};

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
            if (approvedStr) {
              const list = JSON.parse(approvedStr);
              const updatedList = list.map((p: any) => {
                if (p.name === nameToFind || p.id === "sabrina-carpenter") {
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
                    tags: formData.tags.split(",").map((s: string) => s.trim().startsWith("#") ? s.trim() : `#${s.trim()}`).filter(Boolean)
                  };
                }
                return p;
              });
              localStorage.setItem("approved_partners", JSON.stringify(updatedList));
            }
          }

          window.dispatchEvent(new Event("partnerStatusChange"));
          window.dispatchEvent(new Event("partner_profile_updated"));
          
          setIsSubmitting(false);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
          console.error(err);
          setError("Failed to save companion profile details.");
          setIsSubmitting(false);
        }
      }, 1200);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-text-main text-left">Companion Profile Settings</h4>
        <div className="flex flex-col gap-3">
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
              placeholder="e.g. Sabrina Carpenter"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(p => ({ ...p, displayName: e.target.value }))}
              placeholder="e.g. Sabrina"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">City / Location</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
              placeholder="e.g. New York, USA"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell clients about yourself..."
              rows={3}
              className="w-full p-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all resize-none"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Hourly Rate ($)</label>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => setFormData(p => ({ ...p, hourlyRate: e.target.value }))}
              placeholder="e.g. 150"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
              required
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Languages (comma separated)</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData(p => ({ ...p, languages: e.target.value }))}
              placeholder="e.g. English, French"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Interests (comma separated)</label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData(p => ({ ...p, interests: e.target.value }))}
              placeholder="e.g. Music, Coffee, Films"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted ml-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
              placeholder="e.g. Singer, Actor, Artist"
              className="w-full h-11 px-4 mt-1 bg-bg-secondary border border-border-main rounded-xl text-text-main text-xs focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="text-[10px] text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-left">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-11 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
            success
              ? "bg-emerald-600 text-white"
              : "bg-primary text-white hover:bg-primary-dark cursor-pointer"
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
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    clearAuth();
    setShowLogoutConfirm(false);
    setIsOpen(false);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-y-0 left-0 z-100 h-[100dvh] overflow-hidden ${outfit.className}`}>
      {/* ── SLIDE-OUT PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/45 z-[-1]"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-[100dvh] w-[320px] md:w-[380px] bg-bg-base border-r border-border-main shadow-[20px_0_50px_rgba(0,0,0,0.3)] p-6 pb-8 md:p-8 md:pb-10 flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute cursor-pointer right-4 top-4 p-2 rounded-xl bg-bg-secondary/80 hover:bg-bg-card border border-border-main/40 text-text-muted hover:text-text-main transition-all flex items-center justify-center z-10"
                title="Close Sidebar"
              >
                <ChevronRight size={16} className="rotate-180 text-text-muted" />
              </button>

              <style dangerouslySetInnerHTML={{__html: `
                .sidebar-scroll-container::-webkit-scrollbar {
                  display: none !important;
                }
              `}} />

              {/* Profile Header */}
              <div className="mt-2 mb-4 flex flex-col items-center border-b border-border-main pb-4 shrink-0">
                {isAuthenticated && user ? (
                  <div className="flex flex-col items-center w-full">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="relative w-20 h-20 rounded-full border-2 border-primary/40 shadow-lg mb-3 shrink-0">
                      {isLivePartner && partnerPhoto ? (
                        <img
                          src={partnerPhoto}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <DefaultSilhouette />
                        </div>
                      )}
                      
                      {/* Pencil upload overlay */}
                      <button
                        onClick={handleAvatarUploadClick}
                        className="absolute top-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-primary-dark border-2 border-bg-base text-white flex items-center justify-center shadow-lg transition-all cursor-pointer z-20"
                        title="Update Profile Photo"
                      >
                        <Pencil size={11} />
                      </button>
                    </div>
                    <span className="text-text-main text-lg font-bold tracking-wide">
                      {user.name}
                    </span>
                    <span className="text-text-muted text-xs font-medium tracking-wide mb-3">
                      {user.email}
                    </span>
                    <button
                      onClick={() => setShowAccountCenter(true)}
                      className="cursor-pointer px-4 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings size={10} />
                      <span>Account Center</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-6 w-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-sm border border-primary/20">
                      <Sparkles className="text-primary animate-pulse" size={24} />
                    </div>
                    <h3 className={`${rochester.className} text-3xl text-text-main mb-1.5`}>Welcome Guest</h3>
                    <p className="text-text-muted text-xs max-w-[240px] leading-relaxed mb-5">
                      Create an account to book companions or become a partner for exploring more.
                    </p>
                    <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 bg-linear-to-r from-primary-dark to-accent text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md cursor-pointer">
                        Login / Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <div 
                className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 sidebar-scroll-container"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* EXPLORE SECTION */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                    Explore
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {renderMenuItem("/browse-partners", "Browse Companions", Compass)}
                    {renderMenuItem("/pricing", "Pricing", CircleDollarSign, "lg:hidden")}
                    {!isLivePartner && (
                      <div className="mt-1 px-1">
                        <Link href="/become-a-partner" onClick={() => setIsOpen(false)} className="w-full">
                          <button className="w-full h-11 bg-linear-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
                            <Sparkles size={13} className="animate-pulse" />
                            <span>Become a Partner</span>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* CLIENT DASHBOARD SECTION */}
                {isAuthenticated && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                      Dashboard
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {renderMenuItem("/my-booking", "My Bookings", Calendar)}
                      {renderMenuItem("/my-earning", "My Earnings", Wallet)}
                      {renderMenuItem("/viewed-profile", "Profile Views", UserCheck)}
                      {renderMenuItem("/showed-interest", "Received Interests", Heart)}
                    </div>
                  </div>
                )}

                {/* SETTINGS & SUPPORT */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/70 mb-2 px-1">
                    Settings & Support
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {/* Collapsible Theme Settings Trigger */}
                    <button
                      onClick={() => setShowThemeSettings(!showThemeSettings)}
                      className={`w-full cursor-pointer flex items-center justify-between px-4 py-3.5 rounded-xl border-l-2 transition-all duration-200 group ${
                        showThemeSettings
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Palette size={18} className={showThemeSettings ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide">Appearance & Themes</span>
                      </div>
                      {showThemeSettings ? (
                        <ChevronDown size={14} className="text-primary rotate-180 transition-transform duration-200" />
                      ) : (
                        <ChevronRight size={14} className="text-text-muted/40 group-hover:text-text-main transition-colors" />
                      )}
                    </button>

                    {/* Collapsed Theme Settings Panel */}
                    <AnimatePresence>
                      {showThemeSettings && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-bg-secondary/20 border border-border-main/30 rounded-xl px-4 py-3.5 flex flex-col gap-4 mt-1"
                        >
                          {/* Light/Dark Toggle */}
                          <div className="flex items-center justify-between pb-3 border-b border-border-main/40">
                            <span className="text-xs font-semibold text-text-muted">
                              Dark Mode
                            </span>
                            <button
                              onClick={toggleAppearance}
                              className={`relative w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                                appearance === "dark" ? "bg-primary" : "bg-bg-card border border-border-main"
                              }`}
                            >
                              <motion.div
                                layout
                                className="w-4 h-4 rounded-full bg-white shadow-md absolute top-[3px]"
                                style={{
                                  left: appearance === "dark" ? "21px" : "3px"
                                }}
                              />
                            </button>
                          </div>

                          {/* Theme Color Selection Grid */}
                          <div>
                            <span className="text-xs font-semibold text-text-muted block mb-3">
                              Accent Color
                            </span>
                            <div className="grid grid-cols-5 gap-2">
                              {themes.map((t) => {
                                const isSelected = activeTheme === t.id && isPreferenceSet;
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer relative ${
                                      isSelected
                                        ? "border-primary/60 bg-primary/10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]"
                                        : "border-border-main/40 bg-bg-card hover:border-primary/20"
                                    }`}
                                    title={t.label}
                                  >
                                    <div className={`w-4 h-4 rounded-full ${t.color}`} />
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                        <Check size={8} className="text-white" strokeWidth={3} />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Auto Rotate Option */}
                          <div className="pt-3 border-t border-border-main/40">
                            <button
                              onClick={resetToRotation}
                              className={`w-full cursor-pointer flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                                !isPreferenceSet
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-bg-card border-border-main/50 text-text-muted hover:text-text-main"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <RotateCcw size={14} className={!isPreferenceSet ? "animate-spin text-emerald-400" : ""} style={!isPreferenceSet ? { animationDuration: '4s' } : {}} />
                                <span className="text-xs font-semibold">
                                  Auto Change Themes
                                </span>
                              </div>
                              {!isPreferenceSet && <Sparkles size={10} className="text-emerald-400 animate-pulse" />}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Help & Support (Navigates to Contact) */}
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group border-l-2 ${
                        pathname === "/contact"
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                          : "bg-transparent border-transparent text-text-muted hover:bg-bg-secondary/60 hover:text-text-main"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <HelpCircle size={18} className={pathname === "/contact" ? "text-primary" : "text-text-muted group-hover:text-text-main group-hover:scale-105 transition-transform"} />
                        <span className="text-sm font-semibold tracking-wide">Help & Support</span>
                      </div>
                      <ChevronRight size={14} className={pathname === "/contact" ? "text-primary" : "text-text-muted/40 group-hover:text-text-main transition-colors"} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Logout / Footer Section */}
              {isAuthenticated && (
                <div className="mt-auto pt-6 border-t border-border-main/80 flex flex-col gap-4 shrink-0">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer h-12 rounded-xl bg-bg-secondary hover:bg-red-500/10 border border-border-main hover:border-red-500/20 text-text-muted hover:text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}

              {/* Logout Confirmation Modal Overlay */}
              <AnimatePresence>
                {showLogoutConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-bg-base/95 z-110 flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-full max-w-[280px] bg-bg-base border border-border-main rounded-[24px] p-6 text-center shadow-2xl flex flex-col gap-5"
                    >
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                        <LogOut size={20} className="text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-text-main text-lg">Are you sure?</h4>
                        <p className="text-text-muted text-xs leading-relaxed">
                          You will be logged out of your account.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 cursor-pointer py-2.5 bg-bg-secondary hover:bg-bg-secondary/80 border border-border-main text-text-main text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmLogout}
                          className="flex-1 cursor-pointer py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/10"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Popup Modal */}
              <AnimatePresence>
                {personalInfoSuccess && (
                  <div className="absolute inset-0 bg-black/75 z-[150] flex items-center justify-center p-6">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-full max-w-[280px] bg-bg-base border border-border-main rounded-[24px] p-6 shadow-2xl z-10 flex flex-col gap-4 text-center animate-outfit"
                    >
                      <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
                        <Check size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-main text-base font-outfit">Success</h3>
                        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed font-outfit font-medium">
                          Personal information saved successfully!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPersonalInfoSuccess(false)}
                        className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center shadow-md mt-2 font-outfit"
                      >
                        Great
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Password Success Popup Modal */}
              <AnimatePresence>
                {passwordSuccess && (
                  <div className="absolute inset-0 bg-black/75 z-[150] flex items-center justify-center p-6">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-full max-w-[280px] bg-bg-base border border-border-main rounded-[24px] p-6 shadow-2xl z-10 flex flex-col gap-4 text-center animate-outfit"
                    >
                      <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
                        <Check size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-main text-base font-outfit">Success</h3>
                        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed font-outfit font-medium">
                          Password updated successfully!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPasswordSuccess(false)}
                        className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center shadow-md mt-2 font-outfit"
                      >
                        Great
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Notifications Success Popup Modal */}
              <AnimatePresence>
                {notificationsSuccess && (
                  <div className="absolute inset-0 bg-black/75 z-[150] flex items-center justify-center p-6">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-full max-w-[280px] bg-bg-base border border-border-main rounded-[24px] p-6 shadow-2xl z-10 flex flex-col gap-4 text-center animate-outfit"
                    >
                      <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20">
                        <Check size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-main text-base font-outfit">Success</h3>
                        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed font-outfit font-medium">
                          Notification settings saved successfully!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationsSuccess(false)}
                        className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] transition-all cursor-pointer flex items-center justify-center shadow-md mt-2 font-outfit"
                      >
                        Great
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Account Center Slide-in Sub-drawer */}
              <AnimatePresence>
                {showAccountCenter && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute inset-0 bg-bg-base z-50 p-6 md:p-8 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6 shrink-0">
                      <button
                        onClick={() => {
                          setShowAccountCenter(false);
                          setAccountSection(null);
                        }}
                        className="flex items-center gap-2 text-text-muted hover:text-text-main text-sm font-bold cursor-pointer"
                      >
                        <ChevronRight size={16} className="rotate-180" />
                        <span>Back</span>
                      </button>
                      <h3 className="font-bold text-text-main text-base">Account Center</h3>
                      <div className="w-6" /> {/* Spacer to align title */}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 sidebar-scroll-container" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                      {accountSection === null ? (
                        <div className="flex flex-col gap-3">
                          {/* Personal Information Option */}
                          <button
                            onClick={() => setAccountSection("personal-info")}
                            className="w-full cursor-pointer flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-card border border-border-main/50 rounded-2xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <BadgeInfo size={18} />
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-bold text-text-main block">Personal Information</span>
                                <span className="text-[10px] text-text-muted font-medium block mt-0.5">Manage your name, contact details, gender, age and address</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-text-muted/60 shrink-0" />
                          </button>

                          {/* Companion Profile Settings Option */}
                          {isLivePartner && (
                            <button
                              onClick={() => setAccountSection("profile")}
                              className="w-full cursor-pointer flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-card border border-border-main/50 rounded-2xl transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                  <UserRound size={18} />
                                </div>
                                <div className="text-left">
                                  <span className="text-sm font-bold text-text-main block">Profile Settings</span>
                                  <span className="text-[10px] text-text-muted font-medium block mt-0.5">Edit companion profile name, bio, rates, and more</span>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-text-muted/60 shrink-0" />
                            </button>
                          )}

                          {/* Password Management Option */}
                          <button
                            onClick={() => setAccountSection("password")}
                            className="w-full cursor-pointer flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-card border border-border-main/50 rounded-2xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Lock size={18} />
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-bold text-text-main block">Password Settings</span>
                                <span className="text-[10px] text-text-muted font-medium block mt-0.5">Update and secure your account password</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-text-muted/60 shrink-0" />
                          </button>

                          {/* Notification Alert Option */}
                          <button
                            onClick={() => setAccountSection("notifications")}
                            className="w-full cursor-pointer flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-card border border-border-main/50 rounded-2xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Bell size={18} />
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-bold text-text-main block">Notification Alert</span>
                                <span className="text-[10px] text-text-muted font-medium block mt-0.5">Manage email, SMS, and browser alerts</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-text-muted/60 shrink-0" />
                          </button>

                          {/* Delete Account Option */}
                          <button
                            onClick={() => setAccountSection("delete")}
                            className="w-full cursor-pointer flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 rounded-2xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                <Trash2 size={18} />
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-bold text-text-main block">Delete Account</span>
                                <span className="text-[10px] text-red-400 font-medium block mt-0.5">Permanently close and delete your account</span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-red-400/60 shrink-0" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {/* Sub-section Back button */}
                          <button
                            onClick={() => setAccountSection(null)}
                            className="self-start flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-main mb-2 cursor-pointer"
                          >
                            <ChevronRight size={12} className="rotate-180" />
                            <span>All Settings</span>
                          </button>

                          {accountSection === "personal-info" && (
                            <SidebarPersonalInfo />
                          )}
                          {accountSection === "profile" && (
                            <SidebarProfileSettings />
                          )}
                          {accountSection === "password" && (
                            <SidebarPassManagement />
                          )}
                          {accountSection === "notifications" && (
                            <SidebarNotifications />
                          )}
                          {accountSection === "delete" && (
                            <SidebarDeleteAccount />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
  