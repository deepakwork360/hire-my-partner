import { Rochester, Outfit } from "next/font/google";

type BannerProps = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
  bgPosition?: string;
};

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Banner2({
  title,
  subtitle,
  backgroundImage,
  children,
  bgPosition = "bg-center",
}: BannerProps) {
  return (
    <div className={outfit.className}>
      <div
        className={`relative bg-cover min-h-[420px] flex items-center justify-center overflow-hidden`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: bgPosition,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />

        {/* Left & right subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 text-center px-4">
          <h1
            className={`${rochester.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide drop-shadow-2xl`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-300 mt-4 text-sm md:text-base font-medium tracking-wide max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="container mx-auto px-4 py-8">{children}</div>
      )}
    </div>
  );
}
