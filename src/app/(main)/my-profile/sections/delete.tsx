"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Outfit, Rochester } from "next/font/google";
import { AlertCircle, Trash2, X, AlertTriangle, ShieldAlert } from "lucide-react";
import { useState } from "react";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const rochester = Rochester({ subsets: ["latin"], weight: ["400"] });

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
              className="px-10 h-14 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>

          <AnimatePresence>
            {showConfirm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border-main pt-8 mt-2"
              >
                <div className="max-w-md mx-auto flex flex-col gap-5">
                  <div className="flex items-start gap-4 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                     <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
                     <div>
                       <h4 className="text-text-main text-xs font-bold uppercase tracking-wider">Irreversible Action</h4>
                       <p className="text-text-muted text-[11px] mt-1 leading-relaxed">
                         This will permanently delete your companion profile, bookings history, active notifications, and disable account access.
                       </p>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-text-main text-xs md:text-sm font-bold uppercase tracking-wider ml-1">
                      Type <span className="text-accent">{confirmText}</span> to confirm
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={typedConfirm}
                        onChange={(e) => setTypedConfirm(e.target.value)}
                        placeholder="Type standard confirmation text"
                        className="w-full h-14 px-5 bg-bg-secondary border border-border-main rounded-2xl text-text-main text-sm font-medium focus:outline-none focus:border-red-500/50 transition-all placeholder:text-text-muted/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                     <button
                       onClick={() => {
                          setShowConfirm(false);
                          setTypedConfirm("");
                       }}
                       disabled={isDeleting}
                       className="flex-1 h-14 rounded-2xl border border-border-main text-text-muted text-[10px] font-black uppercase tracking-widest hover:bg-bg-secondary hover:text-text-main transition-all"
                     >
                       Cancel
                     </button>
                     <button
                       onClick={handleDelete}
                       disabled={typedConfirm !== confirmText || isDeleting}
                       className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${
                         typedConfirm === confirmText
                           ? "bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
                           : "bg-bg-secondary border border-border-main text-text-muted cursor-not-allowed"
                       }`}
                     >
                       {isDeleting ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       ) : (
                         <>Confirm Delete</>
                       )}
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
