"use client";

import { motion } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import { 
  User, Mail, Phone, MapPin, 
  Calendar, Check, CircleAlert, Sparkles, 
  Fingerprint, Compass, PenTool, CircleDollarSign,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import PremiumDropdown from "@/components/ui/PremiumDropdown";
import PremiumDatePicker from "@/components/ui/PremiumDatePicker";
import { toast } from "@/components/ui/toastStore";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });

const PremiumField = ({ label, icon: Icon, children, className = "" }: any) => (
  <div className={`flex flex-col gap-3 group ${className}`}>
    <div className="flex items-center gap-2 ml-2">
      <Icon size={14} className="text-text-muted group-focus-within:text-primary transition-colors" />
      <label className="text-text-main text-xs md:text-sm font-bold uppercase tracking-wider group-focus-within:text-primary transition-colors cursor-pointer">
        {label}
      </label>
    </div>
    <div className="relative">
       {children}
    </div>
  </div>
);

const PremiumInput = ({ icon: Icon, ...props }: any) => (
  <div className="relative group/input">
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-primary transition-all duration-300">
      <Icon size={18} />
    </div>
    <input 
      {...props}
      className={`w-full h-14 pl-14 pr-14 bg-bg-secondary border border-border-main rounded-2xl text-text-main text-sm font-medium focus:outline-none focus:border-primary/50 transition-all duration-300 placeholder:text-text-muted/50 ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    />
  </div>
);

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    phone: "",
    gender: "Female",
    dob: "1998-05-15",
    location: "",
    bio: "",
    hourlyRate: "499"
  });

  const [initialData, setInitialData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadData = () => {
    try {
      const savedData = localStorage.getItem("partnerApplication");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const loaded = parsed.formData || {};
        const state = {
          fullName: loaded.fullName || "",
          displayName: loaded.displayName || loaded.fullName || "",
          email: loaded.email || "",
          phone: loaded.mobile || "",
          gender: loaded.gender || "Female",
          dob: loaded.dob || "1998-05-15",
          location: loaded.city || "",
          bio: loaded.bio || "",
          hourlyRate: loaded.hourlyRate || "499"
        };
        setFormData(state);
        setInitialData(state);
      }
    } catch (e) {
      console.error("Failed to load profile data inside form", e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("partner_profile_updated", loadData);
    return () => window.removeEventListener("partner_profile_updated", loadData);
  }, []);

  const hasChanges = initialData ? JSON.stringify(formData) !== JSON.stringify(initialData) : false;

  const isValid = formData.fullName.trim() !== "" && 
                  formData.phone.trim().length >= 10 && 
                  formData.bio.trim().length >= 10 &&
                  formData.hourlyRate.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || !isValid) return;

    setIsSubmitting(true);
    
    try {
      const savedData = localStorage.getItem("partnerApplication");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (!parsed.formData) parsed.formData = {};
        
        const oldName = parsed.formData.fullName;

        // Update partnerApplication fields
        parsed.formData.fullName = formData.fullName;
        parsed.formData.displayName = formData.displayName;
        parsed.formData.mobile = formData.phone;
        parsed.formData.gender = formData.gender;
        parsed.formData.dob = formData.dob;
        parsed.formData.city = formData.location;
        parsed.formData.bio = formData.bio;
        parsed.formData.hourlyRate = formData.hourlyRate;
        
        // Dynamically compute age from dob
        if (formData.dob) {
          const birthYear = new Date(formData.dob).getFullYear();
          const currentYear = new Date().getFullYear();
          if (birthYear && currentYear) {
            parsed.formData.age = String(currentYear - birthYear);
          }
        }

        localStorage.setItem("partnerApplication", JSON.stringify(parsed));

        // Update companion record in approved_partners
        const approvedStr = localStorage.getItem("approved_partners");
        if (approvedStr) {
          const list = JSON.parse(approvedStr);
          const updatedList = list.map((p: any) => {
            if (p.name === oldName || p.id?.startsWith(oldName.toLowerCase().replace(/\s+/g, "-"))) {
              const rateNum = parseFloat(formData.hourlyRate) || 499;
              return {
                ...p,
                name: formData.fullName,
                age: parsed.formData.age ? parseInt(parsed.formData.age) : p.age,
                gender: formData.gender,
                location: formData.location,
                bio: formData.bio,
                pricing: {
                  oneHour: rateNum,
                  twoHours: rateNum * 1.8,
                  threeHours: rateNum * 2.5,
                  fourHours: rateNum * 3.2,
                  fiveHours: rateNum * 4.0,
                  eightHours: rateNum * 6.0,
                }
              };
            }
            return p;
          });
          localStorage.setItem("approved_partners", JSON.stringify(updatedList));
        }

        // Notify app-wide stores and hooks
        window.dispatchEvent(new Event("partnerStatusChange"));
        window.dispatchEvent(new Event("partner_profile_updated"));
        
        toast.success("Profile general information updated successfully!");
        
        setIsSubmitting(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      toast.error("Failed to update profile settings");
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!initialData) return null;

  return (
    <section className={`px-4 md:px-8 py-10 ${outfit.className} bg-bg-base`}>
      <div className="max-w-[1250px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative"
        >
          <div className="relative bg-bg-card border border-border-main rounded-[32px] p-6 md:p-10 backdrop-blur-3xl shadow-xl shadow-black/5 overflow-hidden">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b border-border-main">
              <div className="space-y-2">
                <h2 className={`${rochester.className} text-5xl text-text-main tracking-tight`}>
                  General <span className="text-primary">Information</span>
                </h2>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                 <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">Profile Status</span>
                 <div className="w-48 h-2 bg-bg-secondary rounded-full overflow-hidden border border-border-main">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      className="h-full bg-linear-to-r from-primary to-primary-dark shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                    />
                 </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <PremiumField label="Full Legal Name" icon={User}>
                  <PremiumInput 
                    icon={User} 
                    value={formData.fullName}
                    onChange={(e: any) => updateField("fullName", e.target.value)}
                    placeholder="Enter full name"
                  />
                </PremiumField>

                <PremiumField label="Display Name" icon={Sparkles}>
                  <PremiumInput 
                    icon={Sparkles} 
                    value={formData.displayName}
                    onChange={(e: any) => updateField("displayName", e.target.value)}
                    placeholder="Enter display name"
                  />
                </PremiumField>

                <PremiumField label="Email Address (Verified)" icon={Mail}>
                  <PremiumInput 
                    icon={Mail} 
                    value={formData.email}
                    disabled
                  />
                </PremiumField>

                <PremiumField label="Contact Number" icon={Phone}>
                  <PremiumInput 
                    icon={Phone} 
                    value={formData.phone}
                    onChange={(e: any) => updateField("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </PremiumField>

                <PremiumField label="Gender Identity" icon={Fingerprint}>
                  <PremiumDropdown
                    value={formData.gender}
                    onChange={(val) => updateField("gender", val)}
                    options={[
                      { value: "Female", label: "Female", icon: User },
                      { value: "Male", label: "Male", icon: User },
                      { value: "Other", label: "Other", icon: User },
                      { value: "Prefer not to say", label: "Prefer not to say", icon: User },
                    ]}
                  />
                </PremiumField>

                <PremiumField label="Birth Date" icon={Calendar}>
                  <PremiumDatePicker 
                    value={formData.dob}
                    onChange={(val) => updateField("dob", val)}
                    placeholder="Birth Date"
                  />
                </PremiumField>

                <PremiumField label="Current Base Location" icon={Compass}>
                  <PremiumInput 
                    icon={MapPin} 
                    value={formData.location}
                    onChange={(e: any) => updateField("location", e.target.value)}
                    placeholder="Enter city, state, country"
                  />
                </PremiumField>

                <PremiumField label="Hourly Rate (₹/hr)" icon={CircleDollarSign}>
                  <PremiumInput 
                    icon={CircleDollarSign} 
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e: any) => updateField("hourlyRate", e.target.value)}
                    placeholder="Enter hourly rate in INR"
                  />
                </PremiumField>

                <div className="md:col-span-2">
                  <PremiumField label="Professional Bio" icon={PenTool}>
                    <div className="relative group/bio">
                      <div className="absolute left-5 top-6 text-text-muted group-focus-within/bio:text-primary transition-all">
                        <MessageSquare size={18} />
                      </div>
                      <textarea 
                        rows={6}
                        value={formData.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        className="w-full pl-14 pr-6 py-6 bg-bg-secondary border border-border-main rounded-[24px] text-text-main text-sm font-medium focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-text-muted/50"
                        placeholder="Share your experience and personality..."
                      />
                    </div>
                  </PremiumField>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-border-main">
                <div className="flex items-center gap-4">
                  {!isValid && hasChanges ? (
                    <div className="flex items-center gap-3 text-rose-500 animate-pulse">
                      <CircleAlert size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Required fields missing</span>
                    </div>
                  ) : hasChanges ? (
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles size={18} className="animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Unsaved modifications</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-text-muted">
                      <Check size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">All information up-to-date</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={() => setFormData(initialData)}
                    disabled={!hasChanges || isSubmitting}
                    className="px-10 h-14 rounded-2xl border border-border-main text-text-muted text-[10px] font-black uppercase tracking-[0.3em] hover:bg-bg-secondary hover:text-text-main transition-all disabled:opacity-10 cursor-pointer"
                  >
                    Reset
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !hasChanges || !isValid}
                    className={`flex-1 sm:flex-none px-16 h-14 rounded-2xl font-black tracking-[0.4em] uppercase text-[10px] relative overflow-hidden transition-all duration-500 cursor-pointer ${
                      success 
                        ? "bg-emerald-600 text-white" 
                        : hasChanges && isValid
                        ? "bg-primary text-white shadow-[0_15px_40px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.6)] hover:-translate-y-1 active:scale-[0.98]"
                        : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : success ? (
                        <><Check size={20} strokeWidth={3} /> Saved</>
                      ) : (
                        <>Update Profile</>
                      )}
                    </div>
                    {/* Premium Shine Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
