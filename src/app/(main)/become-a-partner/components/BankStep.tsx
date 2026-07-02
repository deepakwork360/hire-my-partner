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

const currencies = ["INR", "USD", "EUR", "GBP", "AUD", "AED", "SGD", "QAR", "NPR", "BDT", "LKR"];

interface BankStepProps {
  formData: any;
  onChange: (data: any) => void;
  showErrors: boolean;
  errors?: Record<string, string>;
}

export default function BankStep({
  formData,
  onChange,
  showErrors,
  errors,
}: BankStepProps) {
  const [currencyOpen, setCurrencyOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Account Holder Name */}
        <InputWrapper className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Account Holder Name"
            className={getInputClass(showErrors && !!errors?.bankAccountHolderName)}
            value={formData.bankAccountHolderName || ""}
            onChange={(e) => onChange({ bankAccountHolderName: e.target.value })}
          />
          {showErrors && errors?.bankAccountHolderName && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.bankAccountHolderName}
            </p>
          )}
        </InputWrapper>

        {/* Bank Name */}
        <InputWrapper>
          <input
            type="text"
            placeholder="Bank Name"
            className={getInputClass(showErrors && !!errors?.bankName)}
            value={formData.bankName || ""}
            onChange={(e) => onChange({ bankName: e.target.value })}
          />
          {showErrors && errors?.bankName && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.bankName}
            </p>
          )}
        </InputWrapper>

        {/* Branch Name */}
        <InputWrapper>
          <input
            type="text"
            placeholder="Branch Name"
            className={getInputClass(showErrors && !!errors?.branchName)}
            value={formData.branchName || ""}
            onChange={(e) => onChange({ branchName: e.target.value })}
          />
          {showErrors && errors?.branchName && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.branchName}
            </p>
          )}
        </InputWrapper>

        {/* Account Number */}
        <InputWrapper>
          <input
            type="text"
            placeholder="Account Number"
            className={getInputClass(showErrors && !!errors?.bankAccountNumber)}
            value={formData.bankAccountNumber || ""}
            onChange={(e) => onChange({ bankAccountNumber: e.target.value })}
          />
          {showErrors && errors?.bankAccountNumber && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.bankAccountNumber}
            </p>
          )}
        </InputWrapper>

        {/* Currency Dropdown */}
        <InputWrapper>
          <button
            type="button"
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className={`${getInputClass(showErrors && !!errors?.currency)} flex items-center justify-between cursor-pointer`}
          >
            <span className={!formData.currency || formData.currency === "Select Currency" || formData.currency === "" ? "text-text-muted" : "text-text-main"}>
              {formData.currency || "Select Currency"}
            </span>
            <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${currencyOpen ? "rotate-180" : ""}`} />
          </button>
          {showErrors && errors?.currency && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.currency}
            </p>
          )}

          <AnimatePresence>
            {currencyOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setCurrencyOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-bg-base border border-border-main rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl custom-scrollbar flex flex-col"
                >
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        onChange({ currency: curr });
                        setCurrencyOpen(false);
                      }}
                      className={`w-full cursor-pointer p-4 text-left text-text-main hover:bg-primary/20 hover:text-text-main transition-colors font-medium border-b border-border-main last:border-0 hover:pl-6 duration-300 ${
                        formData.currency === curr ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </InputWrapper>

        {/* IFSC Code */}
        <InputWrapper>
          <input
            type="text"
            placeholder="IFSC Code"
            className={getInputClass(showErrors && !!errors?.bankIfscCode)}
            value={formData.bankIfscCode || ""}
            onChange={(e) => onChange({ bankIfscCode: e.target.value })}
          />
          {showErrors && errors?.bankIfscCode && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.bankIfscCode}
            </p>
          )}
        </InputWrapper>

        {/* IBAN (Optional) */}
        <InputWrapper>
          <input
            type="text"
            placeholder="IBAN (Optional)"
            className={getInputClass(showErrors && !!errors?.iban)}
            value={formData.iban || ""}
            onChange={(e) => onChange({ iban: e.target.value })}
          />
          {showErrors && errors?.iban && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.iban}
            </p>
          )}
        </InputWrapper>

        {/* SWIFT Code (Optional) */}
        <InputWrapper>
          <input
            type="text"
            placeholder="SWIFT Code (Optional)"
            className={getInputClass(showErrors && !!errors?.swiftCode)}
            value={formData.swiftCode || ""}
            onChange={(e) => onChange({ swiftCode: e.target.value })}
          />
          {showErrors && errors?.swiftCode && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.swiftCode}
            </p>
          )}
        </InputWrapper>

        {/* Routing Number (Optional) */}
        <InputWrapper>
          <input
            type="text"
            placeholder="Routing Number (Optional)"
            className={getInputClass(showErrors && !!errors?.routingNumber)}
            value={formData.routingNumber || ""}
            onChange={(e) => onChange({ routingNumber: e.target.value })}
          />
          {showErrors && errors?.routingNumber && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.routingNumber}
            </p>
          )}
        </InputWrapper>

        {/* UPI ID (Optional) */}
        <InputWrapper className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="UPI ID (Optional)"
            className={getInputClass(showErrors && !!errors?.upiId)}
            value={formData.upiId || ""}
            onChange={(e) => onChange({ upiId: e.target.value })}
          />
          {showErrors && errors?.upiId && (
            <p className="text-red-500 text-xs mt-1.5 ml-2 font-semibold">
              {errors.upiId}
            </p>
          )}
        </InputWrapper>
      </div>
    </div>
  );
}
