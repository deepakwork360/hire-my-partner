"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rochester, Outfit } from "next/font/google";
import { AlertCircle, Trash2, X, AlertTriangle, ShieldAlert } from "lucide-react";
import { useState } from "react";

const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [typedConfirm, setTypedConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmText = "DELETE ACCOUNT";

  const handleDelete = () => {
    if (typedConfirm !== confirmText) return;
    setIsDeleting(true);
    // Simulate deletion
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <section className={`px-4 md:px-8 py-10 mb-12 ${outfit.className}`}>
      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-bg-card border border-accent/20 rounded-[32px] p-6 md:p-10 flex flex-col gap-10 shadow-xl shadow-black/5"
        >
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle size={13} className="text-accent" />
                 <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">Danger Zone</span>
              </div>
              <h2 className={`${rochester.className} text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-main via-accent to-text-main tracking-wide leading-tight`}>
                Delete Account
              </h2>
              <p className="text-text-muted text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                Once you delete your account, there is no going back. Please be certain before proceeding.
              </p>
            </div>

            <button 
              onClick={() => setShowConfirm(true)}
              className="px-10 h-14 rounded-2xl bg-accent/10 border border-accent/30 text-accent font-black tracking-widest uppercase text-[10px] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>

          {/* Points illustrating what happens after deletion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 opacity-60">
            <div className="flex items-start gap-3">
              <ShieldAlert size={14} className="text-accent mt-1 shrink-0" />
              <p className="text-text-muted text-xs font-medium leading-relaxed">Personal data will be permanently wiped.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert size={14} className="text-accent mt-1 shrink-0" />
              <p className="text-text-muted text-xs font-medium leading-relaxed">Active bookings will be cancelled instantly.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert size={14} className="text-accent mt-1 shrink-0" />
              <p className="text-text-muted text-xs font-medium leading-relaxed">Subscription benefits will be terminated.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowConfirm(false)}
               className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
            />
            
            <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-bg-secondary border border-border-main rounded-[32px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-text-main transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <AlertCircle size={32} />
                </div>
                
                <div>
                  <h3 className="text-text-main text-xl font-black uppercase tracking-wider mb-2">Are you sure?</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    This action is irreversible. To confirm, please type <span className="text-text-main font-bold">"{confirmText}"</span> below.
                  </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <input 
                    type="text" 
                    value={typedConfirm}
                    onChange={(e) => setTypedConfirm(e.target.value)}
                    placeholder="Type confirmation here..."
                    className="w-full h-14 px-5 bg-bg-secondary border border-accent/20 rounded-2xl text-text-main text-center text-sm font-black tracking-widest focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/50 placeholder:font-medium placeholder:tracking-normal"
                  />
                  
                  <button 
                    onClick={handleDelete}
                    disabled={typedConfirm !== confirmText || isDeleting}
                    className={`w-full h-14 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 ${
                      typedConfirm === confirmText
                        ? isDeleting ? "bg-accent/50 text-accent/30 cursor-wait" : "bg-accent text-white shadow-lg shadow-accent/20 active:scale-95"
                        : "bg-bg-secondary text-text-muted cursor-not-allowed border border-border-main"
                    }`}
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}



