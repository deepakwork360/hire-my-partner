"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { toast } from "@/components/ui/toastStore";
import { api } from "@/lib/axios";

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

interface CountryOption {
  id: number;
  name: string;
  iso2?: string;
  iso3?: string;
  phonecode?: string;
}

interface LocationStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
  countriesList?: CountryOption[];
}

export default function LocationStep({
  formData,
  onChange,
  showErrors,
  errors,
  countriesList = [],
}: LocationStepProps) {
  const [partnerCountryOpen, setPartnerCountryOpen] = useState(false);
  const [partnerStateOpen, setPartnerStateOpen] = useState(false);
  const [partnerCityOpen, setPartnerCityOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fallbackCountries = Object.keys(countryCitiesMap).map((cName, idx) => ({
    id: idx + 1,
    name: cName
  }));

  const countries = countriesList && countriesList.length > 0 ? countriesList : fallbackCountries;

  // Sync country_id from selected country name
  useEffect(() => {
    if (!formData.country || formData.country === "Select Country") {
      setStates([]);
      if (formData.country_id) {
        onChange({ country_id: null, state_id: null, city_id: null });
      }
      return;
    }

    const matchedCountry = countries.find(
      (c) => c.name.toLowerCase() === formData.country.toLowerCase()
    );

    if (matchedCountry) {
      if (formData.country_id !== matchedCountry.id) {
        onChange({
          country_id: matchedCountry.id,
          state_id: null,
          city_id: null
        });
      }
    }
  }, [formData.country, countriesList]);

  // Fetch states when country_id changes
  useEffect(() => {
    if (!formData.country_id) {
      setStates([]);
      return;
    }

    async function fetchStates() {
      setLoadingStates(true);
      try {
        const { data } = await api.get(`/countries/${formData.country_id}/states`);
        const list = (data && data.status && Array.isArray(data.data))
          ? data.data
          : (Array.isArray(data) ? data : (data?.data || []));
        setStates(list);

        // Auto-match state name from geolocation if exists
        if (formData.state && formData.state !== "Select State") {
          const matchedState = list.find(
            (s: any) => s.name.toLowerCase() === formData.state.toLowerCase()
          );
          if (matchedState && formData.state_id !== matchedState.id) {
            onChange({ state_id: matchedState.id, city_id: null });
          }
        }
      } catch (err) {
        console.error("Failed to fetch states:", err);
      } finally {
        setLoadingStates(false);
      }
    }

    fetchStates();
  }, [formData.country_id]);

  // Fetch cities when state_id changes
  useEffect(() => {
    if (!formData.state_id) {
      setCities([]);
      return;
    }

    async function fetchCities() {
      setLoadingCities(true);
      try {
        const { data } = await api.get(`/states/${formData.state_id}/cities`);
        const list = (data && data.status && Array.isArray(data.data))
          ? data.data
          : (Array.isArray(data) ? data : (data?.data || []));
        setCities(list);

        // Auto-match city name from geolocation if exists
        if (formData.city && formData.city !== "Select City") {
          const matchedCity = list.find(
            (c: any) => c.name.toLowerCase() === formData.city.toLowerCase()
          );
          if (matchedCity && formData.city_id !== matchedCity.id) {
            onChange({ city_id: matchedCity.id });
          }
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }

    fetchCities();
  }, [formData.state_id]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
            headers: {
              "User-Agent": "hire-my-partner-app"
            }
          });

          if (!res.ok) throw new Error("Reverse geocode request failed");

          const data = await res.json();
          const addr = data.address || {};

          const rawCity = addr.city || addr.town || addr.village || addr.suburb || "Delhi";
          const rawState = addr.state || addr.region || "Delhi";
          const rawCountry = addr.country || "India";
          const postcode = addr.postcode || "";

          const countriesList = ["India", "United States", "United Kingdom", "Australia", "United Arab Emirates", "Singapore", "Germany", "France", "Saudi Arabia", "Qatar", "Nepal", "Bangladesh", "Sri Lanka"];
          const matchedCountry = countriesList.find(c => c.toLowerCase() === rawCountry.toLowerCase()) || "India";

          const statesList = countryStatesMap[matchedCountry] || [];
          const matchedState = statesList.find(s => s.toLowerCase() === rawState.toLowerCase()) || rawState;

          const citiesList = countryCitiesMap[matchedCountry] || [];
          const matchedCity = citiesList.find(c => c.toLowerCase() === rawCity.toLowerCase()) || rawCity;

          const displayAddress = data.display_name || `${matchedCity}, ${matchedState}, ${matchedCountry}`;

          onChange({
            country: matchedCountry,
            state: matchedState,
            city: matchedCity,
            pincode: postcode,
            address: displayAddress,
            current_latitude: lat,
            current_longitude: lng
          });

          toast.success("Successfully fetched your GPS location details!");
        } catch (error) {
          console.error(error);
          onChange({
            current_latitude: lat,
            current_longitude: lng
          });
          toast.info("GPS coordinates retrieved. Please select Country, State, and City manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error(error.message || "Failed to retrieve your GPS location.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* GPS Location Button */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-card/40 border p-5 rounded-3xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
        showErrors && (errors?.current_latitude || errors?.current_longitude)
          ? "border-red-500 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)]"
          : showErrors && !errors?.current_latitude && formData.current_latitude
          ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.08)]"
          : "border-border-main"
      }`}>
        <div className="space-y-1 z-10">
          <p className="text-xs font-black text-text-main uppercase tracking-widest"> GPS Geolocation </p>
          <p className="text-[10px] text-text-muted font-bold leading-relaxed">
            {formData.current_latitude && formData.current_longitude 
              ? `Verification Coordinates: ${formData.current_latitude.toFixed(4)}, ${formData.current_longitude.toFixed(4)}`
              : "Verify your coordinates automatically for distance tracking."}
          </p>
          {showErrors && (errors?.current_latitude || errors?.current_longitude) && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
              {errors.current_latitude || errors.current_longitude}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleLocate}
          disabled={isLocating}
          className="px-5 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/45 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-50 z-10 shrink-0"
        >
          {isLocating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5" />
              Use Current Location
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Country */}
        <InputWrapper>
          <button
            type="button"
            onClick={() => setPartnerCountryOpen(!partnerCountryOpen)}
            className={`${getInputClass(showErrors && !!errors?.country, showErrors && !errors?.country && formData.country !== "Select Country" && formData.country !== "")} flex items-center justify-between cursor-pointer`}
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
                  onClick={() => {
                    setCountrySearch("");
                    setPartnerCountryOpen(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute z-50 left-0 right-0 mt-2 bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col max-h-64 overflow-hidden"
                >
                  <div className="p-3 bg-black/5 dark:bg-white/[0.02] border-b border-border-main/50">
                    <div className="relative">
                      <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredCountries.length === 1) {
                              const c = filteredCountries[0];
                              onChange({
                                country: c.name,
                                country_id: c.id,
                                state: "Select State",
                                state_id: null,
                                city: "Select City",
                                city_id: null
                              });
                              setCountrySearch("");
                              setPartnerCountryOpen(false);
                            }
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary/40 border border-border-main rounded-2xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar max-h-48 flex-1">
                    {filteredCountries.length === 0 ? (
                      <div className="p-4 text-xs text-text-muted text-center font-semibold">
                        No countries found
                      </div>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            onChange({
                              country: c.name,
                              country_id: c.id,
                              state: "Select State",
                              state_id: null,
                              city: "Select City",
                              city_id: null
                            });
                            setCountrySearch("");
                            setPartnerCountryOpen(false);
                          }}
                          className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                            formData.country === c.name ? "bg-primary/10 text-primary" : ""
                          }`}
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
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
            className={`${getInputClass(showErrors && !!errors?.state, showErrors && !errors?.state && formData.state !== "Select State" && formData.state !== "")} flex items-center justify-between ${
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
                  onClick={() => {
                    setStateSearch("");
                    setPartnerStateOpen(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute z-50 left-0 right-0 mt-2 bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col max-h-64 overflow-hidden"
                >
                  <div className="p-3 bg-black/5 dark:bg-white/[0.02] border-b border-border-main/50">
                    <div className="relative">
                      <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search state..."
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredStates.length === 1) {
                              const s = filteredStates[0];
                              onChange({
                                state: s.name,
                                state_id: s.id,
                                city: "Select City",
                                city_id: null
                              });
                              setStateSearch("");
                              setPartnerStateOpen(false);
                            }
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary/40 border border-border-main rounded-2xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar max-h-48 flex-1">
                    {loadingStates ? (
                      <div className="p-4 text-xs text-text-muted text-center font-semibold animate-pulse">
                        Loading states...
                      </div>
                    ) : filteredStates.length === 0 ? (
                      <div className="p-4 text-xs text-text-muted text-center font-semibold">
                        No states found
                      </div>
                    ) : (
                      filteredStates.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            onChange({ state: s.name, state_id: s.id, city: "Select City", city_id: null });
                            setStateSearch("");
                            setPartnerStateOpen(false);
                          }}
                          className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                            formData.state === s.name ? "bg-primary/10 text-primary" : ""
                          }`}
                        >
                          {s.name}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </InputWrapper>

        {/* City */}
        <InputWrapper>
          <button
            type="button"
            disabled={!formData.state || formData.state === "Select State" || formData.state === ""}
            onClick={() => setPartnerCityOpen(!partnerCityOpen)}
            className={`${getInputClass(showErrors && !!errors?.city, showErrors && !errors?.city && formData.city !== "Select City" && formData.city !== "")} flex items-center justify-between ${
              (!formData.state || formData.state === "Select State" || formData.state === "") ? "opacity-55 cursor-not-allowed" : "cursor-pointer"
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
            {partnerCityOpen && formData.state && formData.state !== "Select State" && formData.state !== "" && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => {
                    setCitySearch("");
                    setPartnerCityOpen(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute z-50 left-0 right-0 mt-2 bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col max-h-64 overflow-hidden"
                >
                  <div className="p-3 bg-black/5 dark:bg-white/[0.02] border-b border-border-main/50">
                    <div className="relative">
                      <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredCities.length === 1) {
                              const c = filteredCities[0];
                              onChange({
                                city: c.name,
                                city_id: c.id
                              });
                              setCitySearch("");
                              setPartnerCityOpen(false);
                            }
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-bg-secondary/40 border border-border-main rounded-2xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar max-h-48 flex-1">
                    {loadingCities ? (
                      <div className="p-4 text-xs text-text-muted text-center font-semibold animate-pulse">
                        Loading cities...
                      </div>
                    ) : filteredCities.length === 0 ? (
                      <div className="p-4 text-xs text-text-muted text-center font-semibold">
                        No cities found
                      </div>
                    ) : (
                      filteredCities.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            onChange({ city: c.name, city_id: c.id });
                            setCitySearch("");
                            setPartnerCityOpen(false);
                          }}
                          className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                            formData.city === c.name ? "bg-primary/10 text-primary" : ""
                          }`}
                        >
                          {c.name}
                        </button>
                      ))
                    )}
                  </div>
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
            className={getInputClass(showErrors && !!errors?.pincode, showErrors && !errors?.pincode && !!formData.pincode)}
            value={formData.pincode}
            onChange={(e) => onChange({ pincode: e.target.value })}
          />
          {showErrors && errors?.pincode && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.pincode}
            </p>
          )}
        </InputWrapper>

        {/* Address */}
        <InputWrapper className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Enter Your Current Address"
            className={getInputClass(showErrors && !!errors?.address, showErrors && !errors?.address && !!formData.address)}
            value={formData.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
          />
          {showErrors && errors?.address && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.address}
            </p>
          )}
        </InputWrapper>
      </div>
    </div>
  );
}
