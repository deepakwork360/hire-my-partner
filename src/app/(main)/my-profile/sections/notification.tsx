"use client";

import { motion } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import { Bell, Mail, MessageSquare, Monitor, Check, Save } from "lucide-react";
import { useState, useMemo } from "react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });

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
            <h2 className={`${rochester.className} text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-primary to-text-main tracking-wide leading-tight`}>
              Notification <span className="text-primary">Settings</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NotificationToggle 
               label="Email Alerts"
               description="Receive daily status emails, recommendations and booking logs."
               icon={Mail}
               enabled={prefs.email}
               onToggle={() => setPrefs(prev => ({ ...prev, email: !prev.email }))}
            />
            <NotificationToggle 
               label="SMS Notifications"
               description="Direct mobile text alerts for critical security events and bookings."
               icon={MessageSquare}
               enabled={prefs.sms}
               onToggle={() => setPrefs(prev => ({ ...prev, sms: !prev.sms }))}
            />
            <div className="md:col-span-2">
              <NotificationToggle 
                 label="Browser Push Notifications"
                 description="Get real-time updates and interactive notifications in your browser window."
                 icon={Monitor}
                 enabled={prefs.push}
                 onToggle={() => setPrefs(prev => ({ ...prev, push: !prev.push }))}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-4 border-t border-border-main pt-6 mt-4">
             <button
               onClick={handleUpdate}
               disabled={isUpdating || !hasChanges}
               className={`px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] relative overflow-hidden transition-all duration-300 ${
                 success 
                   ? "bg-emerald-600 text-white" 
                   : hasChanges 
                     ? "bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5" 
                     : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
               }`}
             >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : success ? (
                  <><Check size={16} /> Saved</>
                ) : (
                  <><Save size={16} /> Save Settings</>
                )}
              </div>
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
