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
    <div className={`${outfit.className} bg-bg-base`}>
      <div
        className={`relative bg-cover min-h-[420px] flex items-center justify-center overflow-hidden rounded-b-[60px] md:rounded-b-[100px]`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: bgPosition,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Subtle Bottom Border Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent z-20" />

        {/* Left & right subtle vignette */}
        <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-30 text-center px-4 pb-10">
          <h1
            className={`${rochester.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white! tracking-wide drop-shadow-2xl py-4 px-4 leading-[1.2]`}
            style={{ color: "white" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-300 mt-4 text-sm md:text-base font-medium tracking-wide max-w-xl mx-auto drop-shadow-lg">
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
