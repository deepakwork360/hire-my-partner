"use client";

import { ShieldCheck, User, MapPin, DollarSign, Landmark, Check } from "lucide-react";

interface ReviewStepProps {
  formData: any;
  selectedKycDate: string;
  selectedKycSlot: string;
  showErrors: boolean;
  onChange: (data: any) => void;
  errors?: Record<string, string>;
  languagesList?: any[];
}

export default function ReviewStep({
  formData,
  selectedKycDate,
  selectedKycSlot,
  showErrors,
  onChange,
  errors,
  languagesList = [],
}: ReviewStepProps) {

  const getDocLabel = (idx: number) => {
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 select-none">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-main">Review Your Application</h3>
        <p className="text-text-muted text-xs mt-1">Please double check all information below before submitting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Full Name</span>
              <span className="text-text-main font-bold">{formData.fullName || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Gender</span>
              <span className="text-text-main font-bold">{formData.gender || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Date of Birth</span>
              <span className="text-text-main font-bold">{formData.dob ? `${formData.dob} (${formData.age} yrs old)` : "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Email Address</span>
              <span className="text-text-main font-bold">{formData.email || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Mobile Number</span>
              <span className="text-text-main font-bold">
                {formData.phoneCountryCode} {formData.mobile || "—"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted font-medium">Languages</span>
              <span className="text-text-main font-bold text-right">
                {(formData.languages || []).map((lang: any) => {
                  const idVal = typeof lang === "number" ? lang : parseInt(lang, 10);
                  if (!isNaN(idVal)) {
                    const found = languagesList.find((l: any) => l.id === idVal);
                    return found ? found.name : `Language #${idVal}`;
                  }
                  return String(lang);
                }).join(", ") || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Pricing */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Country</span>
                <span className="text-text-main font-bold">{formData.country || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">City</span>
                <span className="text-text-main font-bold">{formData.city || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">State</span>
                <span className="text-text-main font-bold">{formData.state || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Pincode</span>
                <span className="text-text-main font-bold">{formData.pincode || "—"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted font-medium">Address</span>
                <span className="text-text-main font-bold">{formData.address || "—"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Service Pricing
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm font-medium">Hourly Rate</span>
              <span className="text-text-main text-lg font-black text-primary">
                ₹{formData.hourlyRate || "0"}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Bank details Card */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            Payout & Bank Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Account Holder</span>
              <span className="text-text-main font-bold">{formData.bankAccountHolderName || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Bank Name</span>
              <span className="text-text-main font-bold">{formData.bankName || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Account Number</span>
              <span className="text-text-main font-bold">{formData.bankAccountNumber || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">IFSC Code</span>
              <span className="text-text-main font-bold">{formData.bankIfscCode || "—"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted font-medium">UPI ID</span>
              <span className="text-text-main font-bold">{formData.upiId || "—"}</span>
            </div>
          </div>
        </div>

        {/* KYC Verification details */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            KYC Verification
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">KYC Appointment</span>
              <span className="text-text-main font-bold text-right">
                {selectedKycDate ? `${formatDate(selectedKycDate)}` : "Not scheduled"}
                {selectedKycSlot ? ` at ${selectedKycSlot}` : ""}
              </span>
            </div>
            <div>
              <span className="text-text-muted font-medium block mb-2">Uploaded Identity Proofs</span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="relative aspect-square border border-white/10 rounded-xl overflow-hidden bg-black/20">
                    {formData.idProofs[idx] ? (
                      <img
                        src={formData.idProofs[idx]!}
                        alt={getDocLabel(idx)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-red-500 text-center p-1">
                        Missing
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Box */}
      <div className="flex flex-col gap-2 w-full">
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
              checked={formData.termsAgreed}
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
