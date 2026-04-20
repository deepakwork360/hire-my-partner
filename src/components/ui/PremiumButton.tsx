"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface PremiumButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function PremiumButton({
  label,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  disabled = false,
}: PremiumButtonProps) {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  const baseClasses =
    "relative inline-flex items-center justify-center font-black uppercase tracking-widest rounded-full transition-all duration-500 overflow-hidden group active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-linear-to-r from-primary-dark via-primary to-accent text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_35px_rgba(var(--primary-rgb),0.5)] hover:-translate-y-0.5",
    outline:
      "bg-white/5 border border-white/10 text-white hover:border-primary/50 hover:bg-primary/5",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
  };

  const content = (
    <span className="relative z-10 flex items-center gap-2">
      {label}
      {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
    </span>
  );

  const glowEffect = variant === "primary" && (
    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
  );

  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
      >
        {glowEffect}
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${className}`}
    >
      {glowEffect}
      {content}
    </button>
  );
}
