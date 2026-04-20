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
  <div className="flex items-center justify-between p-6 bg-black/20 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
        enabled ? "bg-pink-500/10 text-pink-500" : "bg-white/5 text-slate-800"
      }`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-white font-bold text-sm tracking-wide">{label}</h4>
        <p className="text-slate-500 text-[11px] font-medium mt-0.5">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        enabled ? "bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.3)]" : "bg-white/10"
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
           className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-10 flex flex-col gap-10"
        >
          {/* Section Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
               <Bell size={13} className="text-pink-500" />
               <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">Preferences</span>
            </div>
            <h2 className={`${rochester.className} text-4xl text-white tracking-wide`}>
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
            
            <div className="flex items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl opacity-50">
               <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest">More options coming soon</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 text-[10px] font-medium italic">
              * Select your preferred channels to stay updated with your bookings.
            </p>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {hasChanges && !success && (
                    <button 
                        onClick={() => setPrefs(initialPrefs)}
                        className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
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
                        ? "bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-lg active:scale-95"
                        : "bg-white/5 text-slate-800 border border-white/5 cursor-not-allowed"
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
