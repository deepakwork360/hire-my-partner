"use client";

import React from "react";
import Link from "next/link";
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
  style?: React.CSSProperties;
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
  style,
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
      "bg-gradient-to-br from-primary via-primary-dark to-primary text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1",
    outline:
      "bg-bg-secondary/80 border-2 border-border-main text-text-main shadow-inner hover:bg-bg-card hover:border-primary/30",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-bg-secondary",
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
        style={style}
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
      style={style}
    >
      {glowEffect}
      {content}
    </button>
  );
}
