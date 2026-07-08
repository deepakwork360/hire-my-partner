"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Video, Clock, Check } from "lucide-react";
import { api } from "@/lib/axios";

interface KycStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  selectedKycDate: string;
  onKycDateChange: (date: string) => void;
  selectedKycSlot: string;
  onKycSlotChange: (slot: string) => void;
  handleIdUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  uploadingKycIndexes?: Record<number, boolean>;
}

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

export default function KycStep({
  formData,
  onChange,
  showErrors,
  selectedKycDate,
  onKycDateChange,
  selectedKycSlot,
  onKycSlotChange,
  handleIdUpload,
  errors,
  uploadingKycIndexes,
}: KycStepProps) {
  const [kycDocInputs, setKycDocInputs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    async function fetchKycDocs() {
      setLoadingDocs(true);
      try {
        const countryId = formData.country_id || 101; // Default to India (101)
        const response = await api.get(`/partner/kyc-document-inputs?country_id=${countryId}`);
        
        if (response?.data?.status && Array.isArray(response?.data?.data)) {
          const docs = response.data.data;
          setKycDocInputs(docs);
          onChange({ kycDocInputs: docs });
          
          // Initialize/resize idProofs array if length doesn't match
          if (!formData.idProofs || formData.idProofs.length !== docs.length) {
            onChange({ idProofs: Array(docs.length).fill(null), kycDocInputs: docs });
          }
        } else {
          setKycDocInputs([]);
          onChange({ kycDocInputs: [], idProofs: [] });
        }
      } catch (error) {
        console.error("Failed to fetch country-specific KYC documents:", error);
        setKycDocInputs([]);
        onChange({ kycDocInputs: [], idProofs: [] });
      } finally {
        setLoadingDocs(false);
      }
    }

    fetchKycDocs();
  }, [formData.country_id]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Government ID Uploads */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
            Government ID Verification Documents <span className="text-red-500 font-bold">*</span>
          </label>
          {showErrors && errors?.idProofs && (
            <p className="text-red-500 text-xs ml-1 font-semibold">
              {errors.idProofs}
            </p>
          )}
        </div>
        <p className="text-text-muted text-xs max-w-2xl ml-1 leading-relaxed">
          {kycDocInputs.length > 0 
            ? `Please upload clear pictures of your required verification documents (${kycDocInputs.map(d => d.name).join(", ")}) for community safety and identity validation.`
            : "Please upload clear pictures of your required identity validation documents for community safety and verification."}
        </p>

        <div className="bg-bg-secondary border border-border-main p-6 rounded-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center items-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" />

          {loadingDocs ? (
            <div className="col-span-full py-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Loading verification requirements...</span>
            </div>
          ) : kycDocInputs.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-text-muted font-bold">
              No verification documents required for this country.
            </div>
          ) : (
            kycDocInputs.map((doc, index) => {
              const hasError = showErrors && doc.is_required && (!formData.idProofs || !formData.idProofs[index]);
              const isUploaded = formData.idProofs && formData.idProofs[index];

              return (
                <motion.div
                  key={index}
                  animate={hasError ? { 
                    boxShadow: ["0 0 20px rgba(239,68,68,0.1)", "0 0 30px rgba(239,68,68,0.3)", "0 0 20px rgba(239,68,68,0.1)"] 
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`relative w-full aspect-square border-2 border-dashed transition-all duration-500 flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl group shadow-sm ${
                    hasError 
                      ? "border-red-500 bg-red-500/5" 
                      : "border-border-main bg-bg-card hover:border-primary hover:bg-bg-secondary hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.15)]"
                  }`}
                >
                  {uploadingKycIndexes && uploadingKycIndexes[index] ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
                      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary animate-pulse">
                        Uploading...
                      </span>
                    </div>
                  ) : isUploaded ? (
                    <div className="relative w-full h-full group/id">
                      <img
                        src={formData.idProofs[index]!}
                        alt={doc.name}
                        className="w-full h-full object-cover group-hover/id:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newProofs = formData.idProofs ? [...formData.idProofs] : [];
                          newProofs[index] = null;
                          onChange({ idProofs: newProofs });
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
                            {doc.name} {doc.is_required ? "*" : ""}
                          </span>
                          {!isUploaded && doc.is_required && (
                            <motion.div 
                              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] mx-auto mt-1" 
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
            })
          )}
        </div>
      </div>

      {/* Video KYC Scheduling commented out for now
      <div className="space-y-6 pt-6 border-t border-white/5">
        <div>
          <h2 className="text-xl font-bold text-text-main mb-2 tracking-wide flex items-center gap-3">
            <Video className="w-6 h-6 text-primary" />
            Schedule Your Video KYC Call
          </h2>
          {showErrors && errors?.kycSlot && (
            <p className="text-red-500 text-xs font-semibold mb-2 ml-1">
              {errors.kycSlot}
            </p>
          )}
          <p className="text-text-muted text-xs max-w-xl leading-relaxed">
            Select a convenient date and time slot for a 30-minute quick identity review call with our verification officer.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-text-muted block">
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
                    onKycDateChange(d.fullString);
                    onKycSlotChange(""); 
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

        {selectedKycDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="text-xs font-black uppercase tracking-widest text-text-muted block">
              Available Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedKycSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onKycSlotChange(slot)}
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
      */}
      {/* Terms & Conditions Box */}
      <div className="flex flex-col gap-2 w-full pt-6 border-t border-border-main/50">
        <div className={`border p-6 rounded-2xl flex items-start md:items-center gap-4 transition-all duration-500 bg-white/2 ${showErrors && errors?.termsAgreed ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-500/5" : "border-border-main"}`}>
          <label className="flex items-center gap-4 w-fit cursor-pointer group">
            <div
              className={`w-6 h-6 shrink-0 rounded flex items-center justify-center border-2 transition-all duration-300 ${
                formData.termsAgreed 
                  ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                  : showErrors && errors?.termsAgreed 
                  ? "border-red-500" 
                  : "border-border-main group-hover:border-primary"
              }`}
            >
              {formData.termsAgreed && (
                <Check className="w-4 h-4 text-white stroke-3" />
              )}
            </div>
            <span className={`text-sm md:text-base font-medium select-none transition-colors ${showErrors && errors?.termsAgreed ? "text-red-500" : "text-text-main group-hover:text-text-main"}`}>
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
              checked={formData.termsAgreed || false}
              onChange={() => onChange({ termsAgreed: !formData.termsAgreed })}
            />
          </label>
        </div>
        {showErrors && errors?.termsAgreed && (
          <p className="text-red-500 text-xs mt-0.5 ml-2 font-semibold">
            {errors.termsAgreed}
          </p>
        )}
      </div>
    </div>
  );
}
