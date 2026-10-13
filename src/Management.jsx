import React, { useEffect, useState, useCallback } from "react";
import Form from "./components/Form";
import WorkerList from "./components/WorkerList";
import Modal from "./components/Modal";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import { supabase } from "./utils/supabase";

export default function Management() {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    serial_no: "",
    company: "",
  });
  const [editingWorker, setEditingWorker] = useState(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Modals State
  const [barcodeModalWorker, setBarcodeModalWorker] = useState(null);
  const [editModalWorker, setEditModalWorker] = useState(null);
  const [deleteModalWorker, setDeleteModalWorker] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Helper to format friendly RLS error messages
  const handleSupabaseError = (error, defaultMsg) => {
    console.error("Supabase error:", error);
    if (error?.code === "42501" || error?.message?.toLowerCase().includes("row-level security")) {
      showToast("RLS Policy Error: Please ensure Supabase policies allow this action for 'anon' role", "error");
    } else {
      showToast(`${defaultMsg}: ${error?.message || "Unknown error"}`, "error");
    }
  };

  // Fetch Workers from Supabase
  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        handleSupabaseError(error, "Failed to fetch workers");
      } else {
        setWorkers(data || []);
      }
    } catch (err) {
      console.error("Network error:", err);
      showToast("Network error while connecting to Supabase", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Handle Input Changes for Left Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Left Form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      serial_no: "",
      company: "",
    });
    setEditingWorker(null);
  };

  // Cancel Edit Mode
  const cancelEdit = () => {
    resetForm();
    showToast("Edit mode cancelled", "info");
  };

  // Submit Handler (Create or Update from left form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameStr = String(formData.name ?? "").trim();
    const serialStr = String(formData.serial_no ?? "").trim();
    const companyStr = String(formData.company ?? "").trim();

    if (!serialStr) {
      showToast("Please provide a Serial Number / Worker ID", "error");
      return;
    }

    const uniqueBarcode = `Serial:${serialStr}_Name:${nameStr || "Worker"}_Company:${companyStr || "General"}`;

    setIsSubmitting(true);

    try {
      if (editingWorker) {
        // UPDATE Existing Worker (RLS-friendly query)
        const updatedPayload = {
          name: nameStr,
          serial_no: serialStr,
          company: companyStr,
          barcode: uniqueBarcode,
        };

        const { data, error } = await supabase
          .from("workers")
          .update(updatedPayload)
          .eq("id", editingWorker.id)
          .select();

        if (error) {
          handleSupabaseError(error, "Failed to update");
        } else {
          const updatedRecord = data && data.length > 0
            ? data[0]
            : { ...editingWorker, ...updatedPayload };

          setWorkers((prev) =>
            prev.map((w) => (w.id === editingWorker.id ? updatedRecord : w))
          );
          showToast(`Worker ${updatedRecord.name || serialStr} updated successfully!`, "success");
          resetForm();
        }
      } else {
        // CREATE New Worker (RLS-friendly query)
        const newWorker = {
          name: nameStr,
          serial_no: serialStr,
          company: companyStr,
          barcode: uniqueBarcode,
        };

        const { data, error } = await supabase
          .from("workers")
          .insert([newWorker])
          .select();

        if (error) {
          handleSupabaseError(error, "Failed to register worker");
        } else {
          const createdRecord = data && data.length > 0
            ? data[0]
            : { ...newWorker, id: Date.now() };

          setWorkers((prev) => [createdRecord, ...prev]);
          showToast(`Worker ${createdRecord.name || serialStr} registered successfully!`, "success");
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save changes from Edit Modal (RLS-friendly query)
  const handleEditModalSave = async (updatedWorker) => {
    const nameStr = String(updatedWorker.name ?? "").trim();
    const serialStr = String(updatedWorker.serial_no ?? "").trim();
    const companyStr = String(updatedWorker.company ?? "").trim();

    const uniqueBarcode = `Serial:${serialStr}_Name:${nameStr || "Worker"}_Company:${companyStr || "General"}`;
    const payload = {
      name: nameStr,
      serial_no: serialStr,
      company: companyStr,
      barcode: uniqueBarcode,
    };

    const { data, error } = await supabase
      .from("workers")
      .update(payload)
      .eq("id", updatedWorker.id)
      .select();

    if (error) {
      handleSupabaseError(error, "Failed to update");
      throw error;
    } else {
      const updatedRecord = data && data.length > 0
        ? data[0]
        : { ...updatedWorker, ...payload };

      setWorkers((prev) =>
        prev.map((w) => (w.id === updatedWorker.id ? updatedRecord : w))
      );
      if (editingWorker && editingWorker.id === updatedWorker.id) {
        resetForm();
      }
      showToast(`Worker ${updatedRecord.name || serialStr} updated successfully!`, "success");
    }
  };

  // Delete worker from Supabase (RLS-friendly query)
  const handleConfirmDelete = async (workerId) => {
    const { error } = await supabase
      .from("workers")
      .delete()
      .eq("id", workerId);

    if (error) {
      handleSupabaseError(error, "Failed to delete");
      throw error;
    } else {
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
      if (editingWorker && editingWorker.id === workerId) {
        resetForm();
      }
      showToast("Worker removed successfully", "success");
    }
  };

// When clicking Edit in WorkerList:
// We populate the left form for immediate in-page editing AND support modal
const handleEdit = (worker) => {
  setEditingWorker(worker);
  setFormData({
    id: worker.id,
    name: worker.name != null ? String(worker.name) : "",
    serial_no: worker.serial_no != null ? String(worker.serial_no) : "",
    company: worker.company != null ? String(worker.company) : "",
  });

  // Also offer quick edit modal option on mobile or if triggered
  if (window.innerWidth < 1024) {
    setEditModalWorker(worker);
  } else {
    // Scroll smoothly to the form on desktop
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

return (
  <div className="w-full">
    {/* Responsive Two-Column Layout: Form on Left, Worker List on Right */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Side: Form */}
      <div className="lg:col-span-5 xl:col-span-4 w-full">
        <Form
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEditing={!!editingWorker}
          cancelEdit={cancelEdit}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
        />
      </div>

      {/* Right Side: Worker List */}
      <div className="lg:col-span-7 xl:col-span-8 w-full">
        <WorkerList
          workers={workers}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          onViewBarcode={(worker) => setBarcodeModalWorker(worker)}
          onEdit={handleEdit}
          onDelete={(worker) => setDeleteModalWorker(worker)}
          onRefresh={fetchWorkers}
        />
      </div>
    </div>

    {/* View Barcode Modal with Download Button */}
    {barcodeModalWorker && (
      <Modal
        worker={barcodeModalWorker}
        handleModal={() => setBarcodeModalWorker(null)}
        onToast={showToast}
      />
    )}

    {/* Edit Worker Modal */}
    {editModalWorker && (
      <EditModal
        isOpen={!!editModalWorker}
        worker={editModalWorker}
        onClose={() => setEditModalWorker(null)}
        onSave={handleEditModalSave}
      />
    )}

    {/* Delete Confirmation Modal */}
    {deleteModalWorker && (
      <DeleteModal
        isOpen={!!deleteModalWorker}
        worker={deleteModalWorker}
        onClose={() => setDeleteModalWorker(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    )}

    {/* Global Toast Notification */}
    <Toast toast={toast} onClose={() => setToast(null)} />
  </div>
);
}
