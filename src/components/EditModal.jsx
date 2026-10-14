import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function EditModal({ isOpen, onClose, worker, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    serial_no: "",
    company: "",
    nid: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name != null ? String(worker.name) : "",
        serial_no: worker.serial_no != null ? String(worker.serial_no) : "",
        company: worker.company != null ? String(worker.company) : "",
        nid: worker.nid != null ? String(worker.nid) : "",
      });
    }
  }, [worker]);

  if (!isOpen || !worker) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameStr = String(formData.name ?? "").trim();
    const serialStr = String(formData.serial_no ?? "").trim();
    const companyStr = String(formData.company ?? "").trim();
    const nidStr = String(formData.nid ?? "").trim();

    if (!serialStr) {
      alert("Please provide a Serial Number / ID");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        ...worker,
        name: nameStr,
        serial_no: serialStr,
        company: companyStr,
        nid: nidStr,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serialStr = String(formData.serial_no ?? "").trim();
  const nameStr = String(formData.name ?? "").trim();
  const companyStr = String(formData.company ?? "").trim();
  const nidStr = String(formData.nid ?? "").trim();
  const previewBarcode = serialStr
    ? `Serial:${serialStr}_Name:${nameStr || "Worker"}_Nid:${nidStr || "N/A"}_Company:${companyStr || "General"}`
    : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Worker Information
              </h3>
              <p className="text-xs text-slate-500">
                Updating record for ID: #{worker.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Worker Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Serial No / ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="serial_no"
              value={formData.serial_no}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Worker Nid <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Company / Department
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
            />
          </div>

          {previewBarcode && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center mt-3">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Updated Barcode Preview:
              </span>
              <div className="bg-white p-2 rounded-lg border border-slate-200 inline-block max-w-full overflow-hidden">
                <div className="[&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto">
                  <QRCode value={previewBarcode} size={200} />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-xs transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
