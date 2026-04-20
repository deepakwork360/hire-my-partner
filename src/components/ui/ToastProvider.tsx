'use client';

import React from 'react';
import { useToastStore } from './toastStore';

export function ToastProvider() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 min-w-[320px] max-w-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] border backdrop-blur-xl animate-slideIn ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : toast.type === 'error'
              ? 'bg-[#CF0000]/20 border-[#CF0000]/30 text-rose-400'
              : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-200'
          }`}
        >
          {toast.type === 'success' && (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          )}
          {toast.type === 'error' && (
             <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.type === 'info' && (
            <svg className="w-5 h-5 shrink-0 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-zinc-400 hover:text-white transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
