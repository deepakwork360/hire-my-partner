"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border-main select-none">
      {/* Left Column: Previous / Back Button */}
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3.5 border border-border-main hover:border-primary/30 rounded-xl font-bold text-xs uppercase tracking-wider text-text-muted hover:text-text-main transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div /> // Spacer
      )}

      {/* Right Column: Next / Submit Button */}
      <PremiumButton
        label="Submit"
        onClick={onNext}
        disabled={isSubmitting}
        variant="primary"
        size="md"
        icon={<ArrowRight className="w-4 h-4" />}
      />
    </div>
  );
}
