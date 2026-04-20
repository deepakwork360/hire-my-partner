"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { 
  Database, 
  Settings, 
  MapPin, 
  Share2, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  ShieldAlert, 
  RefreshCw, 
  Mail,
  ChevronRight
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

interface PrivacySection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: ContentSection;
  className: string;
}

const sections: PrivacySection[] = [
  {
    id: "info-collect",
    icon: <Database className="w-8 h-8" />,
    title: "1. Information We Collect",
    className: "lg:col-span-2",
    content: [
      { label: "Personal Information", text: "Name/Username, Email, Phone number, Gender, Date of birth, Profile photos, Bio and interests." },
      { label: "Sensitive Information", text: "Location data, Relationship preferences, Messages and interactions." },
      { label: "Automatically Collected", text: "IP address, Device information, Browser type, Usage data." }
    ]
  },
  {
    id: "how-use",
    icon: <Settings className="w-6 h-6" />,
    title: "2. How We Use Your Information",
    className: "lg:col-span-1",
    content: [
      "Create and manage your account",
      "Match you with other users",
      "Improve user experience",
      "Ensure safety and prevent fraud",
      "Send notifications and updates"
    ]
  },
  {
    id: "location",
    icon: <MapPin className="w-6 h-6" />,
    title: "3. Location Data",
    className: "lg:col-span-1",
    content: [
      "Show nearby profiles",
      "Improve matchmaking",
      "You can disable location access in settings."
    ]
  },
  {
    id: "sharing",
    icon: <Share2 className="w-6 h-6" />,
    title: "4. Sharing of Information",
    className: "lg:col-span-1",
    content: [
      "We do not sell your personal data.",
      "Shared with service providers (hosting, analytics).",
      "Shared with law enforcement if legally required.",
      "Shared with other users (profile info you choose)."
    ]
  },
  {
    id: "user-content",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "5. User Content & Messages",
    className: "lg:col-span-1",
    content: [
      "Messages may be monitored for safety.",
      "We are not responsible for user-generated content."
    ]
  },
  {
    id: "retention",
    icon: <Calendar className="w-6 h-6" />,
    title: "6. Data Retention",
    className: "lg:col-span-1",
    content: "We keep your data as long as your account is active or as required by law. You can request deletion anytime."
  },
  {
    id: "rights",
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "7. Your Rights",
    className: "lg:col-span-1",
    content: [
      "Access your data",
      "Update your information",
      "Delete your account",
      "Withdraw consent"
    ]
  },
  {
    id: "security",
    icon: <Lock className="w-6 h-6" />,
    title: "8. Security",
    className: "lg:col-span-1",
    content: "We use encryption, secure servers, and authentication. Note: no system is 100% secure."
  },
  {
    id: "age",
    icon: <ShieldAlert className="w-6 h-6" />,
    title: "9. Age Restrictions",
    className: "lg:col-span-1",
    content: "You must be 18+ to use this app."
  },
  {
    id: "changes",
    icon: <RefreshCw className="w-6 h-6" />,
    title: "10. Changes to Policy",
    className: "lg:col-span-1",
    content: "We may update this policy from time to time."
  },
  {
    id: "contact",
    icon: <Mail className="w-6 h-6" />,
    title: "11. Contact Us",
    className: "lg:col-span-1",
    content: "For any questions: your@email.com"
  }
];

export default function PrivacyContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className={`py-12 md:py-24 bg-[#050505] relative overflow-hidden ${outfit.className}`}>
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-pink-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[30%] right-[15%] w-[350px] h-[350px] bg-rose-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`${rochester.className} text-6xl md:text-8xl text-white mb-6`}
          >
            Policy <span className="text-pink-500">Details</span>
          </motion.h2>
          <div className="w-32 h-1 bg-linear-to-r from-pink-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
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
              <div className="h-full bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-700 hover:bg-white/5 hover:border-pink-500/30 hover:shadow-[0_30px_60px_rgba(236,72,153,0.08)] flex flex-col">
                
                {/* Section Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(236,72,153,0.4)] transition-all duration-500">
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
                          {typeof c === 'string' ? (
                            <>
                              <ChevronRight className="w-4 h-4 text-pink-500 mt-1.5 flex-shrink-0" />
                              <p className="text-slate-400 text-sm md:text-base leading-relaxed">{c}</p>
                            </>
                          ) : (
                            <>
                              <div className="w-1 h-auto bg-linear-to-b from-pink-500 to-rose-600/30 rounded-full flex-shrink-0 opacity-60" />
                              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                <span className="text-white font-bold mr-2 uppercase text-[9px] tracking-widest">{c.label}:</span>
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
