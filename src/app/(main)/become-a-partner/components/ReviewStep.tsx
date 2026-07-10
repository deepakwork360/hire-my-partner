"use client";

import { ShieldCheck, User, MapPin, DollarSign, Landmark, Check, Image, Film, Edit3, XCircle, Clock, HelpCircle, QrCode } from "lucide-react";
import SecureImage from "@/components/ui/SecureImage";

interface ReviewStepProps {
  formData: any;
  selectedKycDate: string;
  selectedKycSlot: string;
  showErrors: boolean;
  onChange: (data: any) => void;
  errors?: Record<string, string>;
  languagesList?: any[];
  onEditStep?: (step: number) => void;
  kycStatus?: string;
}

export default function ReviewStep({
  formData,
  selectedKycDate,
  selectedKycSlot,
  showErrors,
  onChange,
  errors,
  languagesList = [],
  onEditStep,
  kycStatus = "NOT_SCHEDULED",
}: ReviewStepProps) {

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

  const getKycStatusIcon = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "DOCUMENT_APPROVED" || s === "COMPLETED" || s === "VERIFIED" || s === "APPROVED" || s === "ACTIVE") {
      return <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />;
    }
    if (s === "DOCUMENT_REJECTED" || s === "REJECTED" || s === "FAILED") {
      return <XCircle className="w-3 h-3 mr-1 text-rose-400" />;
    }
    if (s === "PENDING" || s === "UNDER_REVIEW" || s === "SCHEDULED") {
      return <Clock className="w-3 h-3 mr-1 text-amber-400 animate-pulse" />;
    }
    return <HelpCircle className="w-3 h-3 mr-1 text-text-muted" />;
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;
    const s = status.toUpperCase();
    
    let bg = "bg-white/5 border-white/10 text-text-muted hover:bg-white/10";
    let icon = <HelpCircle className="w-3.5 h-3.5 text-text-muted" />;
    
    if (s === "APPROVED" || s === "ACTIVE" || s === "VERIFIED") {
      bg = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20";
      icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    } else if (s === "REJECTED" || s === "FAILED") {
      bg = "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20";
      icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    } else if (s === "PENDING") {
      bg = "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20";
      icon = <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
    }
    
    return (
      <div className={`mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 ${bg}`}>
        {icon}
        Status: {status.replace(/_/g, " ")}
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-main">Recieved Your Application</h3>
        <p className="text-text-muted text-xs mt-1">Your Application is under review. You will be notified once it is approved.</p>
        {getStatusBadge(formData.partnerStatus)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Details
            </h4>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all cursor-pointer"
                title="Edit Personal Details"
              >
                <Edit3 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
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
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Details
              </h4>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep(1)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all cursor-pointer"
                  title="Edit Location & Pricing"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
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


        {/* Payout & Bank/UPI Details Card */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              {formData.paymentMode === "upi" ? <QrCode className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
              Payout Details ({formData.paymentMode === "upi" ? "UPI ID" : "Bank Account"})
            </h4>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all cursor-pointer"
                title="Edit Payout Details"
              >
                <Edit3 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {formData.paymentMode === "upi" ? (
              <div className="flex justify-between py-1">
                <span className="text-text-muted font-medium">UPI ID</span>
                <span className="text-text-main font-bold">{formData.upiId || "—"}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted font-medium">Account Holder</span>
                  <span className="text-text-main font-bold">{formData.bankAccountHolderName || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted font-medium">Bank Name</span>
                  <span className="text-text-main font-bold">{formData.bankName || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted font-medium">Branch Name</span>
                  <span className="text-text-main font-bold">{formData.branchName || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted font-medium">Account Number</span>
                  <span className="text-text-main font-bold">{formData.bankAccountNumber || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted font-medium">Currency</span>
                  <span className="text-text-main font-bold">{formData.currency || "—"}</span>
                </div>
                {formData.bankIfscCode && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-text-muted font-medium">IFSC Code</span>
                    <span className="text-text-main font-bold">{formData.bankIfscCode}</span>
                  </div>
                )}
                {formData.iban && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-text-muted font-medium">IBAN</span>
                    <span className="text-text-main font-bold">{formData.iban}</span>
                  </div>
                )}
                {formData.swiftCode && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-text-muted font-medium">SWIFT Code</span>
                    <span className="text-text-main font-bold">{formData.swiftCode}</span>
                  </div>
                )}
                {formData.routingNumber && (
                  <div className="flex justify-between py-1">
                    <span className="text-text-muted font-medium">Routing Number</span>
                    <span className="text-text-main font-bold">{formData.routingNumber}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* KYC Verification details */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              KYC Verification
            </h4>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all cursor-pointer"
                title="Edit KYC Verification"
              >
                <Edit3 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
          <div className="space-y-4 text-sm">
            {/* Commented out as scheduling is postponed
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">KYC Appointment</span>
              <span className="text-text-main font-bold text-right">
                {selectedKycDate ? `${formatDate(selectedKycDate)}` : "Not scheduled"}
                {selectedKycSlot ? ` at ${selectedKycSlot}` : ""}
              </span>
            </div>
            */}
            <div className="flex justify-between py-1 border-b border-white/5 items-center">
              <span className="text-text-muted font-medium">KYC Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm transition-all duration-300 ${
                (() => {
                  const s = (kycStatus || "").toUpperCase();
                  if (s === "DOCUMENT_APPROVED" || s === "COMPLETED" || s === "VERIFIED" || s === "APPROVED" || s === "ACTIVE") {
                    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20";
                  }
                  if (s === "DOCUMENT_REJECTED" || s === "REJECTED" || s === "FAILED") {
                    return "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20";
                  }
                  if (s === "PENDING" || s === "UNDER_REVIEW" || s === "SCHEDULED") {
                    return "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20";
                  }
                  return "bg-white/5 border-white/10 text-text-muted hover:bg-white/10";
                })()
              }`}>
                {getKycStatusIcon(kycStatus)}
                {kycStatus.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <span className="text-text-muted font-medium block mb-2">Uploaded Identity Proofs</span>
              <div className={`grid gap-2 ${(formData.kycDocInputs || []).length > 2 ? "grid-cols-4" : "grid-cols-2"}`}>
                {formData.kycDocInputs && formData.kycDocInputs.length > 0 ? (
                  formData.kycDocInputs.map((doc: any, idx: number) => (
                    <div key={idx} className="relative aspect-square border border-white/10 rounded-xl overflow-hidden bg-black/20 flex flex-col justify-end">
                      {formData.idProofs && formData.idProofs[idx] ? (
                        <>
                          <SecureImage
                            src={formData.idProofs[idx]!}
                            alt={doc.name}
                            className="w-full h-full object-cover absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                            <span className="text-[8px] font-black text-white uppercase tracking-wider truncate w-full">{doc.name}</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                          <span className="text-[8px] font-black text-red-500 uppercase tracking-wider mb-1">Missing</span>
                          <span className="text-[7px] text-text-muted font-bold truncate max-w-full">{doc.name}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-xs text-text-muted font-bold">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="bg-bg-secondary/40 border border-border-main p-6 rounded-3xl space-y-4 md:col-span-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Image className="w-4 h-4" />
              Media Gallery & Uploads
            </h4>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-all cursor-pointer"
                title="Edit Media Gallery"
              >
                <Edit3 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-text-muted font-medium text-xs block mb-2">Gallery Photos</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {formData.gallery && formData.gallery.filter(Boolean).length > 0 ? (
                  formData.gallery.filter(Boolean).map((photo: string, idx: number) => (
                    <div key={idx} className="relative aspect-square border border-white/10 rounded-2xl overflow-hidden bg-black/20 group">
                      <SecureImage
                        src={photo}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 text-center text-xs text-text-muted font-bold bg-black/10 rounded-2xl border border-dashed border-white/5">
                    No gallery images uploaded.
                  </div>
                )}
              </div>
            </div>
            
            {/* Show videos if present */}
            {formData.videos && formData.videos.filter(Boolean).length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <span className="text-text-muted font-medium text-xs block mb-2 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-primary" />
                  Uploaded Videos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formData.videos.filter(Boolean).map((video: string, idx: number) => (
                    <div key={idx} className="relative aspect-video border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
