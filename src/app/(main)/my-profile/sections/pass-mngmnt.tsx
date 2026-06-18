"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import { Lock, ShieldCheck, Key, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });

export default function PassMngmnt() {
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const validate = () => {
    if (!passData.current || !passData.new || !passData.confirm) {
        return "All fields are required";
    }
    if (passData.new.length < 8) {
        return "New password must be at least 8 characters";
    }
    if (passData.new !== passData.confirm) {
        return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
        setError(validationError);
        return;
    }

    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setPassData({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const updateField = (field: keyof typeof passData, value: string) => {
    setPassData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const isFormFilled = passData.current && passData.new && passData.confirm;

  return (
    <section className={`px-4 md:px-8 py-10 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-bg-card border border-border-main rounded-[32px] p-6 md:p-10 flex flex-col gap-10 shadow-xl shadow-black/5"
        >
          {/* Section Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
               <ShieldCheck size={13} className="text-primary" />
               <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Security Settings</span>
            </div>
            <h2 className={`${rochester.className} text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-wide leading-tight`}>
              Password Management
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-6">
              {/* Current Password */}
              <div className="flex flex-col gap-3">
                <label className="text-text-main text-xs md:text-sm font-bold uppercase tracking-wider ml-1">Current Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={passData.current}
                    onChange={(e) => updateField("current", e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-14 pl-14 pr-14 bg-bg-secondary border border-border-main rounded-2xl text-text-main text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="h-px bg-border-main my-2" />

              {/* New Passwords Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Password */}
                <div className="flex flex-col gap-3">
                  <label className="text-text-main text-xs md:text-sm font-bold uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={passData.new}
                      onChange={(e) => updateField("new", e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full h-14 pl-14 pr-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                    />
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-3">
                  <label className="text-text-main text-xs md:text-sm font-bold uppercase tracking-wider ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={passData.confirm}
                      onChange={(e) => updateField("confirm", e.target.value)}
                      placeholder="Repeat new password"
                      className={`w-full h-14 pl-14 pr-5 bg-bg-secondary border rounded-2xl text-text-main text-sm font-medium focus:outline-none transition-all placeholder:text-text-muted/50 ${
                        passData.confirm && passData.new !== passData.confirm 
                        ? "border-primary/50" 
                        : "border-border-main focus:border-primary/50"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-red-500 text-xs font-semibold bg-red-500/5 p-4 rounded-xl border border-red-500/10"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isSubmitting || !isFormFilled}
              className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] relative overflow-hidden transition-all duration-300 ${
                success 
                  ? "bg-emerald-600 text-white" 
                  : isFormFilled 
                    ? "bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5" 
                    : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : success ? (
                  <><Check size={16} /> Password Updated</>
                ) : (
                  <>Update Password</>
                )}
              </div>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
