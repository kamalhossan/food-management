import React, { useMemo } from "react";
import Barcode from "react-barcode";

export default function WorkerList({
  workers = [],
  isLoading,
  searchQuery,
  setSearchQuery,
  selectedCompany,
  setSelectedCompany,
  onViewBarcode,
  onEdit,
  onDelete,
  onRefresh,
}) {
  // Extract unique companies for dropdown filter
  const companies = useMemo(() => {
    const set = new Set();
    workers.forEach((w) => {
      const comp = String(w.company ?? "").trim();
      if (comp) {
        set.add(comp);
      }
    });
    return Array.from(set).sort();
  }, [workers]);

  // Filtered workers based on search and company
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const q = searchQuery.toLowerCase().trim();
      const name = String(worker.name ?? "").toLowerCase();
      const serial = String(worker.serial_no ?? "").toLowerCase();
      const company = String(worker.company ?? "").toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        serial.includes(q) ||
        company.includes(q);

      const matchesCompany =
        !selectedCompany ||
        company === selectedCompany.toLowerCase().trim();

      return matchesSearch && matchesCompany;
    });
  }, [workers, searchQuery, selectedCompany]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar with Search & Filters */}
      <div className="p-5 lg:p-6 border-b border-slate-100 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Worker Registry
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {filteredWorkers.length} {filteredWorkers.length === 1 ? "Worker" : "Workers"}
            </span>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            title="Reload from Supabase"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-600" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-8 relative rounded-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, serial ID, company..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Company Filter Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-700"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && workers.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <div className="inline-block animate-spin w-8 h-8 rounded-full border-3 border-sky-600 border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">
            Loading worker directory...
          </p>
        </div>
      ) : filteredWorkers.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-slate-800">
            {searchQuery || selectedCompany
              ? "No matching workers found"
              : "No workers registered yet"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || selectedCompany
              ? "Try adjusting your search query or reset the filter to view all workers."
              : "Use the form on the left to add your first worker and generate their food barcode."}
          </p>
          {(searchQuery || selectedCompany) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCompany("");
              }}
              className="px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors"
            >
              Reset Search & Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Worker</th>
                  <th className="py-3 px-4">Serial ID</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4 text-center">Barcode</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredWorkers.map((worker) => {
                  const initial = worker.name ? worker.name.charAt(0).toUpperCase() : "W";
                  const barcodeStr =
                    worker.barcode ||
                    `Serial:${worker.serial_no}_Name:${worker.name}_Company:${worker.company}`;

                  return (
                    <tr
                      key={worker.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Worker Column */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block group-hover:text-sky-600 transition-colors">
                              {worker.name || "Unnamed"}
                            </span>
                            <span className="text-xs text-slate-400">
                              ID: #{worker.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Serial ID Column */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          {worker.serial_no || "N/A"}
                        </span>
                      </td>

                      {/* Company Column */}
                      <td className="py-3.5 px-4">
                        {worker.company ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {worker.company}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Barcode Mini Preview */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onViewBarcode(worker)}
                          className="inline-block p-1 bg-white rounded border border-slate-200 hover:border-sky-400 transition-all shadow-2xs cursor-pointer group-hover:scale-105"
                          title="Click to view full barcode"
                        >
                          <div className="h-6 w-24 overflow-hidden flex items-center justify-center pointer-events-none [&_svg]:max-w-full [&_svg]:h-full">
                            <Barcode
                              value={barcodeStr}
                              width={1}
                              height={24}
                              displayValue={false}
                              margin={0}
                            />
                          </div>
                        </button>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Barcode Modal Button */}
                          <button
                            type="button"
                            onClick={() => onViewBarcode(worker)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors shadow-2xs"
                            title="View & Download Barcode"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                              />
                            </svg>
                            <span>Barcode</span>
                          </button>

                          {/* Edit Worker Button */}
                          <button
                            type="button"
                            onClick={() => onEdit(worker)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors"
                            title="Edit Worker Details"
                            aria-label={`Edit ${worker.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Delete Worker Button with Delete Icon */}
                          <button
                            type="button"
                            onClick={() => onDelete(worker)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                            title="Delete Worker"
                            aria-label={`Delete ${worker.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredWorkers.map((worker) => {
              const initial = worker.name ? worker.name.charAt(0).toUpperCase() : "W";
              return (
                <div key={worker.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {worker.name || "Unnamed"}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] font-semibold text-slate-600">
                            ID: {worker.serial_no || "N/A"}
                          </span>
                          {worker.company && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                              {worker.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Icon on top right */}
                    <button
                      type="button"
                      onClick={() => onDelete(worker)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete Worker"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Actions row for mobile */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onViewBarcode(worker)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      <span>View Barcode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(worker)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
