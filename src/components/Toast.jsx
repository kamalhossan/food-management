import React, { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success" || !toast.type;
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-up bg-white/95 border-slate-200">
      {isSuccess && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      {!isSuccess && !isError && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-600 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      <div className="text-sm font-medium text-slate-800 pr-2">
        {toast.message}
      </div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
