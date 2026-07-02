"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const InputWrapper = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`w-full relative group ${className}`}>{children}</div>;

const getInputClass = (hasError = false) =>
  `w-full border rounded-2xl p-4 md:p-5 text-text-main placeholder:text-text-muted transition-all duration-300 shadow-sm font-medium tracking-wide outline-none focus:outline-none focus:ring-4 ${
    hasError
      ? "bg-red-500/5 border-red-500 focus:border-red-500 focus:ring-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
      : "bg-black/[0.025] dark:bg-white/[0.04] border-primary/35 hover:border-primary/60 focus:border-primary focus:ring-primary/20"
  }`;

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

interface LocationStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function LocationStep({
  formData,
  onChange,
  showErrors,
  errors,
}: LocationStepProps) {
  const [partnerCountryOpen, setPartnerCountryOpen] = useState(false);
  const [partnerStateOpen, setPartnerStateOpen] = useState(false);
  const [partnerCityOpen, setPartnerCityOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Country */}
        <InputWrapper>
          <button
            type="button"
            onClick={() => setPartnerCountryOpen(!partnerCountryOpen)}
            className={`${getInputClass(showErrors && !!errors?.country)} flex items-center justify-between cursor-pointer`}
          >
            <span className={!formData.country || formData.country === "Select Country" || formData.country === "" ? "text-text-muted" : "text-text-main"}>
              {formData.country || "Select Country"}
            </span>
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${partnerCountryOpen ? "rotate-180" : ""}`} />
          </button>
          {showErrors && errors?.country && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.country}
            </p>
          )}

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
                        onChange({ country: cName, state: "Select State", city: "Select City" });
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

        {/* State */}
        <InputWrapper>
          <button
            type="button"
            disabled={!formData.country || formData.country === "Select Country" || formData.country === ""}
            onClick={() => setPartnerStateOpen(!partnerStateOpen)}
            className={`${getInputClass(showErrors && !!errors?.state)} flex items-center justify-between ${
              (!formData.country || formData.country === "Select Country" || formData.country === "") ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span className={!formData.state || formData.state === "Select State" || formData.state === "" ? "text-text-muted" : "text-text-main"}>
              {formData.state || "Select State"}
            </span>
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${partnerStateOpen ? "rotate-180" : ""}`} />
          </button>
          {showErrors && errors?.state && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.state}
            </p>
          )}

          <AnimatePresence>
            {partnerStateOpen && formData.country && formData.country !== "Select Country" && formData.country !== "" && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setPartnerStateOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl custom-scrollbar flex flex-col"
                >
                  {(countryStatesMap[formData.country] || []).map((sName) => (
                    <button
                      key={sName}
                      type="button"
                      onClick={() => {
                        onChange({ state: sName, city: "Select City" });
                        setPartnerStateOpen(false);
                      }}
                      className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                        formData.state === sName ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {sName}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </InputWrapper>

        {/* City */}
        <InputWrapper>
          <button
            type="button"
            disabled={!formData.country || formData.country === "Select Country" || formData.country === ""}
            onClick={() => setPartnerCityOpen(!partnerCityOpen)}
            className={`${getInputClass(showErrors && !!errors?.city)} flex items-center justify-between ${
              (!formData.country || formData.country === "Select Country" || formData.country === "") ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span className={!formData.city || formData.city === "Select City" || formData.city === "" ? "text-text-muted" : "text-text-main"}>
              {formData.city || "Select City"}
            </span>
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${partnerCityOpen ? "rotate-180" : ""}`} />
          </button>
          {showErrors && errors?.city && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.city}
            </p>
          )}

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
                        onChange({ city: cName });
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

        {/* Pincode */}
        <InputWrapper>
          <input
            type="text"
            placeholder="Pincode"
            className={getInputClass(showErrors && !!errors?.pincode)}
            value={formData.pincode}
            onChange={(e) => onChange({ pincode: e.target.value })}
          />
          {showErrors && errors?.pincode && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.pincode}
            </p>
          )}
        </InputWrapper>
      </div>
    </div>
  );
}
