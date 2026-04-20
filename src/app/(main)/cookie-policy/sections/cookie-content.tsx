"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import {
  Cookie,
  Layers,
  MousePointer2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Mail,
  ChevronRight,
} from "lucide-react";

const rochester = Rochester({
  subsets: ["latin"],
  weight: ["400"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

type ContentSection = string | string[] | { label: string; text: string }[];

interface CookieSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: ContentSection;
  className: string;
}

const sections: CookieSection[] = [
  {
    id: "what-is",
    icon: <Cookie className="w-8 h-8" />,
    title: "1. What Are Cookies?",
    className: "lg:col-span-2",
    content:
      "Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.",
  },
  {
    id: "types",
    icon: <Layers className="w-8 h-8" />,
    title: "2. Types of Cookies",
    className: "lg:col-span-3",
    content: [
      {
        label: "Essential",
        text: "Required for the operation of our platform, such as login and security features. These cannot be disabled.",
      },
      {
        label: "Performance",
        text: "Allow us to recognize and count the number of visitors and see how visitors move around our platform. This helps us improve the way our platform works.",
      },
      {
        label: "Functional",
        text: "Used to recognize you when you return to our platform. This enables us to personalize our content for you and remember your preferences (e.g., language).",
      },
      {
        label: "Advertising",
        text: "Record your visit to our platform, the pages you have visited, and the links you have followed. We use this to make our platform more relevant to your interests.",
      },
    ],
  },
  {
    id: "how-use",
    icon: <MousePointer2 className="w-6 h-6" />,
    title: "3. How We Use Cookies",
    className: "lg:col-span-1",
    content: [
      "Keeping you logged in",
      "Saving your site preferences",
      "Analyzing traffic patterns",
      "Improving platform features",
      "Securing user accounts",
    ],
  },
  {
    id: "third-party",
    icon: <ExternalLink className="w-6 h-6" />,
    title: "4. Third-Party Cookies",
    className: "lg:col-span-1",
    content: [
      "Google Analytics for usage tracking",
      "Stripe or other payment processors",
      "Social media integration tools",
      "Content delivery networks",
    ],
  },
  {
    id: "managing",
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "5. Managing Cookies",
    className: "lg:col-span-1",
    content:
      "You can set your browser to refuse all or some cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this platform may become inaccessible or not function properly.",
  },
  {
    id: "consent",
    icon: <UserCheck className="w-6 h-6" />,
    title: "6. Your Consent",
    className: "lg:col-span-1",
    content:
      "By continuing to use our application, you are agreeing to our use of cookies as described in this policy. You can change your preferences at any time.",
  },
  {
    id: "updates",
    icon: <RefreshCw className="w-6 h-6" />,
    title: "7. Policy Updates",
    className: "lg:col-span-1",
    content:
      "We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons.",
  },
  {
    id: "contact",
    icon: <Mail className="w-6 h-6" />,
    title: "8. Contact Us",
    className: "lg:col-span-1",
    content:
      "If you have any questions about our use of cookies, please email us at: support@meetme.com",
  },
];

export default function CookieContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      className={`pt-8 pb-12 md:pb-24 bg-[#050505] relative overflow-hidden ${outfit.className}`}
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[30%] left-[15%] w-[350px] h-[350px] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`${rochester.className} text-6xl md:text-8xl text-white mb-6`}
          >
            Cookie <span className="text-primary">Guidelines</span>
          </motion.h2>
          <div className="w-32 h-1 bg-linear-to-r from-primary to-rose-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={item}
              className={`group relative ${section.className}`}
            >
              <div className="h-full bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-700 hover:bg-white/5 hover:border-primary/30 hover:shadow-[0_30px_60px_rgba(236,72,153,0.08)] flex flex-col">
                {/* Section Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(236,72,153,0.4)] transition-all duration-500">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {section.title}
                    </h3>
                  </div>
                </div>

                {/* Section Content */}
                <div className="flex-1 space-y-5">
                  {Array.isArray(section.content) ? (
                    <div className="space-y-4">
                      {section.content.map((c, i) => (
                        <div key={i} className="flex gap-4">
                          {typeof c === "string" ? (
                            <>
                              <ChevronRight className="w-4 h-4 text-primary mt-1.5 flex-shrink-0" />
                              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                {c}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="w-1 h-auto bg-linear-to-b from-primary to-rose-600/30 rounded-full flex-shrink-0 opacity-60" />
                              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                <span className="text-white font-bold mr-2 uppercase text-[9px] tracking-widest">
                                  {c.label}:
                                </span>
                                {c.text}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed font-light">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
