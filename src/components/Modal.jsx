import React, { useState } from "react";
// import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import {
  downloadBarcodePNG,
  downloadBarcodeSVG,
  printBarcode,
} from "../utils/barcodeDownload";

export default function Modal({ handleModal, worker, onToast }) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!worker) return null;

  const barcodeValue =
    worker.barcode ||
    `Serial:${worker.serial_no || ""}_Name:${worker.name || ""}_Nid:${worker.nid || "N/A"}_Company:${worker.company || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(barcodeValue);
    setCopied(true);
    if (onToast) {
      onToast("Barcode data copied to clipboard!", "success");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    setIsDownloading(true);
    const filename = `${worker.name || "worker"}_${worker.company || "barcode"}`;
    const success = downloadBarcodePNG("#modal-barcode-container svg", filename);
    if (success && onToast) {
      onToast("Barcode PNG downloaded successfully!", "success");
    }
    setIsDownloading(false);
  };

  const handleDownloadSVG = () => {
    const filename = `${worker.name || "worker"}_${worker.company || "barcode"}`;
    const success = downloadBarcodeSVG("#modal-barcode-container svg", filename);
    if (success && onToast) {
      onToast("Barcode SVG downloaded successfully!", "success");
    }
  };

  const handlePrint = () => {
    printBarcode(worker, "#modal-barcode-container svg");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-xs transition-opacity animate-fade-in"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Worker Food Barcode
              </h3>
              <p className="text-xs text-slate-500">
                Scan or download this identification barcode
              </p>
            </div>
          </div>

          <button
            onClick={handleModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Worker Badge Summary Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/80 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Worker Name
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-tight">
                  {worker.name || "Unnamed Worker"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  ID: {worker.serial_no || "N/A"}
                </span>
                {worker.company && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {worker.company}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Barcode Display Container */}
          <div
            id="modal-barcode-container"
            className="p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center shadow-xs flex flex-col items-center justify-center transition-all hover:border-slate-300"
          >
            <div className="max-w-full overflow-hidden [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto">
              <QRCode
                value={barcodeValue}
                size={300}
                level={"H"}
                fgColor="#0f172a"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Barcode String & Copy */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="truncate text-slate-600 font-mono">
              <span className="text-slate-400 select-none mr-1.5 font-sans">Raw:</span>
              <span className="select-all">{barcodeValue}</span>
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium shadow-2xs"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions with Download Barcode Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          {/* Download & Print Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Primary Download PNG button */}
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl shadow-xs transition-all hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Barcode</span>
            </button>

            {/* Download SVG button */}
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
              title="Download as Vector SVG"
            >
              <span>SVG</span>
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
              title="Print Barcode Badge"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print</span>
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleModal}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-200/60 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
