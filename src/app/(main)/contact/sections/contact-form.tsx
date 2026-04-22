"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";
import {
  User,
  Mail,
  MessageSquare,
  ChevronDown,
  Send,
  CheckCircle2,
} from "lucide-react";
import MapContainer from "./Map-container";
import ContactSuccess from "./contact-success";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const subjects = [
    "General Inquiry",
    "Booking Support",
    "Partnership",
    "Technical Issue",
    "Elite Membership",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setIsSent(true);
    // Clear form
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  return (
    <section
      className={`py-12 md:py-16 px-4 bg-bg-base relative overflow-hidden ${outfit.className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight">
                Send us a <span className="text-primary">Message</span>
              </h2>
              <p className="text-text-muted font-light text-lg">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full h-14 bg-bg-secondary border border-border-main rounded-2xl pl-12 pr-4 text-text-main placeholder:text-text-muted/40 outline-hidden focus:border-primary/30 transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full h-14 bg-bg-secondary border border-border-main rounded-2xl pl-12 pr-4 text-text-main placeholder:text-text-muted/40 outline-hidden focus:border-primary/30 transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                  Subject
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-14 bg-bg-secondary border border-border-main rounded-2xl px-5 text-left text-text-main flex items-center justify-between hover:bg-bg-secondary/80 transition-all"
                  >
                    <span>{formData.subject}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 top-16 left-0 w-full bg-bg-base/95 backdrop-blur-2xl border border-border-main rounded-2xl overflow-hidden shadow-2xl"
                      >
                        {subjects.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, subject: sub });
                              setIsDropdownOpen(false);
                            }}
                            className="w-full h-12 px-5 text-left text-text-main hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                  Message
                </label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <textarea
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="w-full bg-bg-secondary border border-border-main rounded-2xl pl-12 pr-4 pt-5 text-text-main placeholder:text-text-muted/40 outline-hidden focus:border-primary/30 transition-all resize-none"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSent}
                className={`w-full h-16 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 ${
                  isSent
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-linear-to-r from-primary-dark to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
                }`}
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Message Sent</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Side: Information Placeholder */}
          <MapContainer />
        </div>
      </div>

      <ContactSuccess 
        isOpen={isSent} 
        onClose={() => setIsSent(false)} 
        autoCloseMs={6000} 
      />
    </section>
  );
}

// Sparkles icon for the placeholder
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}



