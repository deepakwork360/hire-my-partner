"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-xs font-semibold text-text-muted">
        <span>Completion Progress</span>
        <span className="text-primary font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-black/[0.08] dark:bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
