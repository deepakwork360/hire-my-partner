"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  onStepClick?: (step: number) => void;
  isClickable?: boolean;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  stepNames,
  onStepClick,
  isClickable = false,
}: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="w-full select-none">
      {/* Desktop view (horizontal step indicator list) */}
      <div className="hidden md:flex items-center justify-between relative w-full px-2">
        {/* Connection line background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-black/[0.08] dark:bg-white/[0.08] -z-10" />

        {stepNames.map((name, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isHovered = hoveredStep === stepNum;

          return (
            <div
              key={name}
              className={`flex flex-col items-center relative z-10 flex-1 ${
                isClickable ? "cursor-pointer group" : ""
              }`}
              onClick={() => {
                if (isClickable && onStepClick) {
                  onStepClick(stepNum);
                }
              }}
              onMouseEnter={() => {
                if (isClickable) setHoveredStep(stepNum);
              }}
              onMouseLeave={() => {
                if (isClickable) setHoveredStep(null);
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : isHovered ? 1.08 : 1,
                  backgroundColor: isCompleted
                    ? (isHovered && isClickable ? "var(--color-bg-base, #121212)" : "var(--color-primary, #ec4899)")
                    : isActive
                    ? "var(--color-bg-base, #121212)"
                    : "var(--color-bg-secondary, #1a1a1a)",
                  borderColor: isCompleted || isActive || (isHovered && isClickable)
                    ? "var(--color-primary, #ec4899)"
                    : "var(--color-border-main, #333)",
                }}
                transition={{
                  duration: isClickable && (isHovered || hoveredStep === null) ? 0 : 0.2
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${
                  isClickable ? "" : "transition-colors duration-200"
                } ${
                  isCompleted
                    ? (isHovered && isClickable ? "text-primary" : "text-white")
                    : isActive
                    ? "text-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    : "text-text-muted border-border-main"
                }`}
              >
                {isCompleted && !(isClickable && isHovered) ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </motion.div>
              <span
                className={`text-[10px] mt-2 font-bold tracking-wide uppercase transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : isHovered && isClickable
                    ? "text-primary"
                    : isCompleted
                    ? "text-text-main"
                    : "text-text-muted"
                }`}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile view (compact single-step indicator) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-bg-secondary border border-border-main rounded-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest uppercase text-primary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-text-main mt-0.5">
            {stepNames[currentStep - 1]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div
                key={i}
                onClick={() => {
                  if (isClickable && onStepClick) {
                    onStepClick(stepNum);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isClickable ? "cursor-pointer hover:bg-primary/80" : ""
                } ${
                  isActive
                    ? "w-6 bg-primary"
                    : isCompleted
                    ? "w-2 bg-primary/60"
                    : "w-1.5 bg-black/[0.08] dark:bg-white/[0.08]"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
