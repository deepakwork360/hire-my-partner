"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  stepNames,
}: StepIndicatorProps) {
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

          return (
            <div key={name} className="flex flex-col items-center relative z-10 flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted
                    ? "var(--color-primary, #ec4899)"
                    : isActive
                    ? "var(--color-bg-base, #121212)"
                    : "var(--color-bg-secondary, #1a1a1a)",
                  borderColor: isCompleted || isActive ? "var(--color-primary, #ec4899)" : "var(--color-border-main, #333)",
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-colors ${
                  isCompleted
                    ? "text-white"
                    : isActive
                    ? "text-primary shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    : "text-text-muted border-border-main"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </motion.div>
              <span
                className={`text-[10px] mt-2 font-bold tracking-wide uppercase ${
                  isActive ? "text-primary" : isCompleted ? "text-text-main" : "text-text-muted"
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
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-primary" : isCompleted ? "w-2 bg-primary/60" : "w-1.5 bg-black/[0.08] dark:bg-white/[0.08]"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
