import React from "react";
import QRCode from "react-qr-code";

export default function Form({
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  cancelEdit,
  isSubmitting,
  resetForm,
}) {
  const serialStr = String(formData.serial_no ?? "").trim();
  const nameStr = String(formData.name ?? "").trim();
  const companyStr = String(formData.company ?? "").trim();
  const nidStr = String(formData.nid ?? "").trim();
  const previewBarcodeString = serialStr
    ? `Serial:${serialStr}_Name:${nameStr || "Worker"}_Company:${companyStr || "General"}_NID:${nidStr}`
    : "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-7 sticky top-6">
      {/* Form Card Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isEditing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                }`}
            />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isEditing ? "Edit Worker Details" : "Register Worker"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing
              ? "Modify worker records and update barcode credentials"
              : "Generate barcode and save worker to food registry"}
          </p>
        </div>

        {isEditing && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Edit Mode
          </span>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Worker Name Field */}
        <div>
          <label
            htmlFor="worker-name"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Worker Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              id="worker-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahim Ahmed"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Serial No Field */}
        <div>
          <label
            htmlFor="worker-serial"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Worker Serial No / ID <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
            <input
              id="worker-serial"
              type="text"
              name="serial_no"
              value={formData.serial_no}
              onChange={handleChange}
              placeholder="e.g. WRK-1049"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400 font-mono"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Used as the primary key for the barcode identification.
          </span>
        </div>
        {/* Nid No Field */}
        <div>
          <label
            htmlFor="worker-nid"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Worker Nid <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
            </div>
            <input
              id="worker-nid"
              type="text"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              placeholder="e.g. 1234567890"
              required
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400 font-mono"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            NID number must be unique.
          </span>
        </div>

        {/* Company Field */}
        <div>
          <label
            htmlFor="worker-company"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Company / Unit
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <input
              id="worker-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Apex Foods Ltd"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Real-time Dynamic Barcode Preview */}
        {previewBarcodeString && (
          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Barcode Preview
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                Code128
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 inline-block max-w-full overflow-hidden shadow-2xs">
              <div className="[&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto">
                <QRCode
                  value={previewBarcodeString}
                  size={200}
                  level={"H"}
                  fgColor={"#0f172a"}
                  bgColor={"#ffffff"}
                  renderAs="svg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${isEditing
              ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 shadow-amber-600/20 hover:shadow-md"
              : "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 shadow-sky-600/20 hover:shadow-md"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isEditing ? "Updating..." : "Saving..."}</span>
              </>
            ) : isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create & Generate Barcode</span>
              </>
            )}
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="w-full py-2 px-4 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel Editing
            </button>
          ) : (
            (formData.name || formData.serial_no || formData.company) && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-1.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear Fields
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}
