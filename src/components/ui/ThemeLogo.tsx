import React from "react";
import Image from "next/image";

interface ThemeLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ThemeLogo({
  width = 100,
  height = 55,
  className = "",
  priority = false,
}: ThemeLogoProps) {
  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      {/* Rose Theme Logo */}
      <Image
        src="/auth/rose1.png"
        alt="Logo"
        width={width}
        height={height}
        className="w-auto h-full object-contain theme-logo-rose"
        priority={priority}
      />
      {/* Gold Theme Logo */}
      <Image
        src="/auth/gold1.png"
        alt="Logo"
        width={width}
        height={height}
        className="w-auto h-full object-contain theme-logo-gold"
        priority={priority}
      />
      {/* Cyan Theme Logo */}
      <Image
        src="/auth/cyan1.png"
        alt="Logo"
        width={width}
        height={height}
        className="w-auto h-full object-contain theme-logo-cyan"
        priority={priority}
      />
      {/* Violet Theme Logo */}
      <Image
        src="/auth/violet1.png"
        alt="Logo"
        width={width}
        height={height}
        className="w-auto h-full object-contain theme-logo-violet"
        priority={priority}
      />
      {/* Emerald Theme Logo */}
      <Image
        src="/auth/emerald1.png"
        alt="Logo"
        width={width}
        height={height}
        className="w-auto h-full object-contain theme-logo-emerald"
        priority={priority}
      />
    </div>
  );
}
