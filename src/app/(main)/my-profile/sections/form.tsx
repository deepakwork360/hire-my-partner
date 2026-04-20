"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { User, Mail, Phone, MapPin, Info, ChevronDown, Calendar, Check, CircleAlert } from "lucide-react";
import { useState, useMemo } from "react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

const initialData = {
  fullName: "Kavya Sharma",
  displayName: "Kavya",
  email: "kavya.sharma@example.com",
  phone: "+91 98765 43210",
  gender: "Female",
  dob: "1998-05-15",
  location: "Andheri East, Mumbai, Maharashtra",
  bio: "I'm a traveler and an art lover. I enjoy deep conversations and exploring new cities."
};

export default function Form() {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData]);

  const isValid = formData.fullName.trim() !== "" && 
                  formData.phone.trim().length >= 10 && 
                  formData.bio.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || !isValid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // In a real app, here you would update the 'initialData' to the current 'formData'
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const updateField = (field: keyof typeof initialData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className={`px-4 md:px-8 py-10 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-10 flex flex-col gap-10"
        >
          {/* Section Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
               <User size={13} className="text-pink-500" />
               <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">Personal Details</span>
            </div>
            <h2 className={`${rochester.className} text-4xl text-white tracking-wide`}>
              General Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Display Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => updateField("displayName", e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1 text-slate-600">Email Address (Locked)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-800" />
                  <input 
                    type="email" 
                    value={formData.email}
                    className="w-full h-14 pl-14 pr-5 bg-black/20 border border-white/5 rounded-2xl text-slate-700 text-sm font-medium focus:outline-none cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Gender</label>
                <div className="relative">
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <select 
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className="w-full h-14 px-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-[#111]">Female</option>
                    <option className="bg-[#111]">Male</option>
                    <option className="bg-[#111]">Other</option>
                    <option className="bg-[#111]">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-3 md:col-span-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest ml-1">Short Bio</label>
                <div className="relative">
                  <Info size={16} className="absolute left-5 top-6 text-slate-600" />
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    className="w-full pl-14 pr-5 py-5 bg-black/40 border border-white/10 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-pink-500/50 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Change Warning / Validation message */}
            {!isValid && hasChanges && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                <CircleAlert size={12} /> Make sure all fields are filled correctly
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting || !hasChanges || !isValid}
                className={`flex-1 h-14 rounded-2xl font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 relative transition-all duration-300 ${
                  success 
                    ? "bg-emerald-600 text-white" 
                    : hasChanges && isValid
                    ? "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-lg hover:shadow-pink-500/20 active:scale-[0.98]"
                    : "bg-white/5 border border-white/10 text-slate-700 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : success ? (
                  <><Check size={18} strokeWidth={3} /> Profile Updated</>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button 
                type="button"
                onClick={() => setFormData(initialData)}
                disabled={!hasChanges || isSubmitting}
                className={`flex-1 h-14 rounded-2xl border font-bold uppercase text-[10px] tracking-widest transition-all ${
                  hasChanges && !isSubmitting
                    ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                    : "border-white/5 text-slate-800 cursor-not-allowed"
                }`}
              >
                Reset Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
