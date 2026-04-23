"use client";

import { motion } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { Bell, Mail, MessageSquare, Monitor, Check, Save } from "lucide-react";
import { useState, useMemo } from "react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

type ToggleProps = {
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  onToggle: () => void;
};

const NotificationToggle = ({ label, description, icon: Icon, enabled, onToggle }: ToggleProps) => (
  <div className="flex items-center justify-between p-6 bg-bg-secondary border border-border-main rounded-2xl transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
        enabled ? "bg-primary/10 text-primary" : "bg-bg-card text-text-muted"
      }`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-text-main font-bold text-sm tracking-wide">{label}</h4>
        <p className="text-text-muted text-[11px] font-medium mt-0.5">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 border ${
        enabled ? "bg-primary border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" : "bg-bg-card border-border-main"
      }`}
    >
      <motion.div 
        animate={{ x: enabled ? 26 : 4 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
      />
    </button>
  </div>
);

const initialPrefs = {
  email: true,
  sms: false,
  push: true
};

export default function Notification() {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(prefs) !== JSON.stringify(initialPrefs);
  }, [prefs]);

  const handleUpdate = () => {
    if (!hasChanges) return;
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSuccess(true);
      // In real life, initialPrefs would be updated here
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

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
               <Bell size={13} className="text-primary" />
               <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Preferences</span>
            </div>
            <h2 className={`${rochester.className} text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-wide leading-tight`}>
              Notification Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NotificationToggle 
              icon={Mail}
              label="Email Notifications"
              description="Receive booking updates and platform news via email."
              enabled={prefs.email}
              onToggle={() => setPrefs(p => ({...p, email: !p.email}))}
            />
            <NotificationToggle 
              icon={MessageSquare}
              label="SMS Alerts"
              description="Get instant text messages for urgent booking changes."
              enabled={prefs.sms}
              onToggle={() => setPrefs(p => ({...p, sms: !p.sms}))}
            />
            <NotificationToggle 
              icon={Monitor}
              label="Push Notifications"
              description="Browser alerts for new messages and app activity."
              enabled={prefs.push}
              onToggle={() => setPrefs(p => ({...p, push: !p.push}))}
            />
            
            <div className="flex items-center justify-center p-6 border border-dashed border-border-main rounded-2xl opacity-50">
               <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest">More options coming soon</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-text-muted text-[10px] font-medium italic">
              * Select your preferred channels to stay updated with your bookings.
            </p>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {hasChanges && !success && (
                    <button 
                        onClick={() => setPrefs(initialPrefs)}
                        className="text-text-muted text-[10px] font-black uppercase tracking-widest hover:text-text-main transition-colors"
                    >
                        Reset
                    </button>
                )}
                <button 
                    onClick={handleUpdate}
                    disabled={isUpdating || !hasChanges}
                    className={`flex-1 sm:flex-none px-8 h-12 rounded-xl font-black tracking-widest uppercase text-[10px] flex items-center justify-center gap-2 transition-all duration-300 ${
                        success 
                        ? "bg-emerald-600 text-white"
                        : hasChanges 
                        ? "bg-linear-to-r from-primary to-primary-dark text-white shadow-lg active:scale-95"
                        : "bg-bg-secondary text-text-muted border border-border-main cursor-not-allowed"
                    }`}
                >
                    {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : success ? (
                        <><Check size={14} strokeWidth={3} /> Preferences Updated</>
                    ) : (
                        <><Save size={14} /> Update Preferences</>
                    )}
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



