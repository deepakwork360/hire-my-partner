import React from "react";
import Image from "next/image";

interface ThemeLogoProps {
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export default function ThemeLogo({
  width = 567,
  height = 481,
  className = "",
  imgClassName = "w-auto h-full object-contain",
  priority = false,
  style = { width: "auto", height: "100%" },
}: ThemeLogoProps) {
  return (
    <div className={`relative flex items-center shrink-0 ${className}`}>
      {/* Rose Theme Logo */}
      <Image
        src="/auth/rosego1.png"
        alt="Logo"
        width={width}
        height={height}
        className={`${imgClassName} theme-logo-rose`}
        priority={priority}
        style={style}
      />
      {/* Gold Theme Logo */}
      <Image
        src="/auth/goldgo.png"
        alt="Logo"
        width={width}
        height={height}
        className={`${imgClassName} theme-logo-gold`}
        priority={priority}
        style={style}
      />
      {/* Cyan Theme Logo */}
      <Image
        src="/auth/cyango.png"
        alt="Logo"
        width={width}
        height={height}
        className={`${imgClassName} theme-logo-cyan`}
        priority={priority}
        style={style}
      />
      {/* Violet Theme Logo */}
      <Image
        src="/auth/violetgo.png"
        alt="Logo"
        width={width}
        height={height}
        className={`${imgClassName} theme-logo-violet`}
        priority={priority}
        style={style}
      />
      {/* Emerald Theme Logo */}
      <Image
        src="/auth/emeraldgo.png"
        alt="Logo"
        width={width}
        height={height}
        className={`${imgClassName} theme-logo-emerald`}
        priority={priority}
        style={style}
      />
    </div>
  );
}
