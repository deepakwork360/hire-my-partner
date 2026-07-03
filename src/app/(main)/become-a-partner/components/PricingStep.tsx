"use client";

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

interface PricingStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function PricingStep({
  formData,
  onChange,
  showErrors,
  errors,
}: PricingStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">
          Hourly Rate
        </label>
        
        <InputWrapper>
          <div className="relative group">
            <div className={`absolute left-5 top-1/2 -translate-y-1/2 font-bold text-lg transition-colors ${showErrors && errors?.hourlyRate ? "text-red-500" : showErrors && !errors?.hourlyRate && !!formData.hourlyRate ? "text-emerald-500" : "text-text-muted group-focus-within:text-primary"}`}>
              ₹
            </div>
            <input
              type="number"
              placeholder="Hourly Rate"
              className={`${getInputClass(showErrors && !!errors?.hourlyRate, showErrors && !errors?.hourlyRate && !!formData.hourlyRate)} pl-14 md:pl-14`}
              value={formData.hourlyRate || ""}
              onChange={(e) => onChange({ hourlyRate: e.target.value })}
            />
          </div>
          {showErrors && errors?.hourlyRate && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.hourlyRate}
            </p>
          )}
          <span className="text-[10px] text-text-muted/70 block mt-2 ml-1 font-medium">
            Set your desired rate per hour. Standard rates range from ₹400 to ₹1500 per hour.
          </span>
        </InputWrapper>
      </div>
    </div>
  );
}
