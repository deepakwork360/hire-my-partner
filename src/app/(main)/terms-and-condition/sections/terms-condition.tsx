"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { 
  FileText, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle, 
  CreditCard, 
  Scale, 
  FileWarning, 
  Handshake, 
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

interface TermSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: string[];
  className: string;
}

const terms: TermSection[] = [
  {
    id: "acceptance",
    icon: <Handshake className="w-8 h-8" />,
    title: "1. Acceptance of Terms",
    className: "lg:col-span-2",
    content: [
      "By accessing or using our platform, you agree to be bound by these Terms and Conditions.",
      "The service is intended for users who are at least 18 years of age.",
      "If you do not agree with any part of these terms, you must not use our services."
    ]
  },
  {
    id: "user-accounts",
    icon: <UserPlus className="w-6 h-6" />,
    title: "2. User Accounts",
    className: "lg:col-span-1",
    content: [
      "You are responsible for maintaining account confidentiality.",
      "You must provide accurate and complete information.",
      "Unauthorized use of your account must be reported immediately."
    ]
  },
  {
    id: "platform-use",
    icon: <FileText className="w-6 h-6" />,
    title: "3. Use of the Platform",
    className: "lg:col-span-1",
    content: [
      "The platform is for personal, non-commercial use.",
      "Users must not engage in illegal or harmful activities.",
      "Spamming, harassment, or data scraping is strictly prohibited."
    ]
  },
  {
    id: "payments",
    icon: <CreditCard className="w-6 h-6" />,
    title: "4. Payments & Refunds",
    className: "lg:col-span-1",
    content: [
      "All payments are handled through secure third-party processors.",
      "Refund policies vary by service type and are clearly stated.",
      "Disputes must be raised through our support channel within 30 days."
    ]
  },
  {
    id: "liability",
    icon: <Scale className="w-6 h-6" />,
    title: "5. Limitation of Liability",
    className: "lg:col-span-1",
    content: [
      "We provide the platform 'as is' without warranties.",
      "We are not liable for user interactions or third-party content.",
      "Total liability is limited to the amount paid in the last 12 months."
    ]
  },
  {
    id: "termination",
    icon: <FileWarning className="w-6 h-6" />,
    title: "6. Account Termination",
    className: "lg:col-span-1",
    content: [
      "We reserve the right to suspend accounts for policy violations.",
      "Users may close their accounts at any time through settings.",
      "Survival of terms: some provisions remain active after termination."
    ]
  },
  {
    id: "support",
    icon: <Mail className="w-6 h-6" />,
    title: "7. Support & Communication",
    className: "lg:col-span-1",
    content: [
      "Support is available at support@email.com.",
      "Official notices will be sent to your registered email.",
      "Response times may vary based on ticket volume."
    ]
  }
];

export default function TermsCondition() {
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
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] right-[20%] w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`${rochester.className} text-6xl md:text-8xl text-white mb-6`}
          >
            User <span className="text-primary">Agreement</span>
          </motion.h2>
          <div className="w-32 h-1 bg-linear-to-r from-primary-dark to-accent rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {terms.map((term) => (
            <motion.div
              key={term.id}
              variants={item}
              className={`group relative ${term.className}`}
            >
              <div className="h-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 transition-all duration-700 hover:bg-white/[0.04] hover:border-primary/30 hover:shadow-[0_30px_60px_rgba(var(--primary-rgb),0.08)] flex flex-col">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.4)] transition-all duration-500">
                      {term.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {term.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  {term.content.map((text, i) => (
                    <div key={i} className="flex gap-4">
                      <ChevronRight className="w-4 h-4 text-primary mt-1.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed tracking-wide">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
