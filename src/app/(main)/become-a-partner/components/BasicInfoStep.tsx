"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";

// Reusable InputWrapper matching original structure
const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

const getInputClass = (hasError = false, isValid = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : isValid
      ? "bg-emerald-500/5 border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
      : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus:border-primary focus:ring-primary/20"
  }`;

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

interface BasicInfoStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
  countriesList?: any[];
}

export default function BasicInfoStep({
  formData,
  onChange,
  showErrors,
  errors,
  countriesList = [],
}: BasicInfoStepProps) {
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [phoneSearch, setPhoneSearch] = useState("");

  const genders = ["Male", "Female", "Other"];

  const activeCountries = (countriesList && countriesList.length > 0)
    ? countriesList.map((c) => {
        let code = c.phonecode || "";
        if (code && !code.startsWith("+")) {
          code = `+${code}`;
        }
        return {
          code,
          iso: (c.iso2 || c.iso || "in").toLowerCase(),
          name: c.name,
        };
      })
    : countries;

  const filteredActiveCountries = activeCountries.filter((c) =>
    c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(phoneSearch.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setPhoneSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Full Name */}
        <InputWrapper className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Full Name"
            className={getInputClass(showErrors && !!errors?.fullName, showErrors && !errors?.fullName && !!formData.fullName)}
            value={formData.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
          />
          {showErrors && errors?.fullName && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.fullName}
            </p>
          )}
        </InputWrapper>

        {/* Gender Selection */}
        <InputWrapper>
          <div className="relative">
            <div className={`flex rounded-2xl overflow-hidden transition-all duration-300 border focus-within:ring-4 focus-within:ring-primary/20 ${showErrors && errors?.gender ? "bg-red-500/5 border-red-500 focus-within:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]" : showErrors && !errors?.gender && formData.gender !== "Select Gender" && formData.gender !== "" ? "bg-emerald-500/5 border-emerald-500 focus-within:ring-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.08)]" : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 hover:bg-black/[0.035] dark:hover:bg-white/[0.06] focus-within:bg-bg-base dark:focus-within:bg-bg-base focus-within:border-primary"}`}>
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
            {showErrors && errors?.gender && (
              <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                {errors.gender}
              </p>
            )}
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
                        onChange({ gender: g });
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

        {/* Date of Birth */}
        <InputWrapper>
          <div className="relative">
            <PremiumDatePicker
              value={formData.dob}
              onChange={(val) => {
                const age = calculateAge(val);
                onChange({ dob: val, age });
              }}
              placeholder="Date of Birth"
              hasError={showErrors && (!!errors?.dob || !!errors?.age)}
              isValid={showErrors && !errors?.dob && !errors?.age && !!formData.dob}
            />
            {formData.age && (
              <span className="absolute right-24 top-1/2 -translate-y-1/2 text-xs font-bold text-primary pointer-events-none">
                {formData.age} yrs old
              </span>
            )}
            {showErrors && (errors?.dob || errors?.age) && (
              <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
                {errors.dob || errors.age}
              </p>
            )}
          </div>
        </InputWrapper>

        {/* Email Address */}
        <InputWrapper className="col-span-1 md:col-span-2">
          <input
            type="email"
            placeholder="Email Address"
            className={getInputClass(showErrors && !!errors?.email, showErrors && !errors?.email && !!formData.email)}
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
          {showErrors && errors?.email && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.email}
            </p>
          )}
        </InputWrapper>

        {/* Phone Country Code & Number */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
          <div className="flex gap-4 w-full">
            <div className="w-[105px] shrink-0 relative" ref={countryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className={`${getInputClass(showErrors && !!errors?.mobile, showErrors && !errors?.mobile && !!formData.mobile)} flex items-center justify-between gap-1 whitespace-nowrap cursor-pointer pl-3 pr-2`}
              >
                <span className="flex items-center gap-1.5">
                  <img
                    src={`https://flagcdn.com/w40/${(activeCountries.find(c => c.code === formData.phoneCountryCode)?.iso || "in")}.png`}
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
                    className="absolute z-50 left-0 top-full mt-2 w-56 max-h-60 bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col overflow-hidden"
                  >
                    <div className="p-2.5 bg-black/5 dark:bg-white/[0.02] border-b border-border-main/50">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={phoneSearch}
                          onChange={(e) => setPhoneSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (filteredActiveCountries.length === 1) {
                                const c = filteredActiveCountries[0];
                                onChange({ phoneCountryCode: c.code });
                                setPhoneSearch("");
                                setIsCountryDropdownOpen(false);
                              }
                            }
                          }}
                          className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-bg-secondary/40 border border-border-main rounded-xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar flex-1 max-h-44">
                      {filteredActiveCountries.length === 0 ? (
                        <div className="p-4 text-xs text-text-muted text-center font-semibold">
                          No results found
                        </div>
                      ) : (
                        filteredActiveCountries.map((c) => (
                          <button
                            key={`${c.code}-${c.iso}`}
                            type="button"
                            onClick={() => {
                              onChange({ phoneCountryCode: c.code });
                              setPhoneSearch("");
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
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <InputWrapper>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className={getInputClass(showErrors && !!errors?.mobile, showErrors && !errors?.mobile && !!formData.mobile)}
                  value={formData.mobile}
                  onChange={(e) => onChange({ mobile: e.target.value })}
                />
              </InputWrapper>
            </div>
          </div>
          {showErrors && errors?.mobile && (
            <p className="text-red-500 text-xs mt-0.5 ml-2 font-semibold">
              {errors.mobile}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
