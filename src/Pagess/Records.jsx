import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecordCard from "../Components/RecordCard";

const initialRecords = [
  { id: 1, type: "🩸 Blood Test", doctor: "Sharma", doctorPhone: "9456789123", date: "02 Sep 2026", notes: "Routine blood test" },
  { id: 2, type: "🩻 X-Ray Chest", doctor: "Mehta", doctorPhone: "4567890023", date: "28 Aug 2026", notes: "Chest X-ray for infection" },
  { id: 3, type: "❤️ ECG Report", doctor: "Verma", doctorPhone: "7890010023", date: "18 Aug 2026", notes: "ECG for regular checkup" },
  { id: 4, type: "🧠 MRI Brain", doctor: "Kapoor", doctorPhone: "9000000004", date: "10 Aug 2026", notes: "MRI for headache evaluation" },
];

const emptyRecord = {
  type: "",
  doctor: "",
  doctorPhone: "",
  date: "",
  notes: "",
};

const cleanRecordType = (type = "") => type.replace(/^[^\w\s]+\s*/, "").trim();
const recordTypes = ["Blood Test", "X-Ray Chest", "ECG Report", "MRI Brain"];
// Demo-only numbers for the four sample records. Replace these with real numbers.
const demoPhonesByType = {
  "Blood Test": "9456789123",
  "X-Ray Chest": "4567890023",
  "ECG Report": "7890010023",
  "MRI Brain": "9000000004",
};

// Display dates consistently as DD MMM YYYY without changing the saved records.
const formatDisplayDate = (value) => {
  if (!value) return "";
  const input = String(value).trim();
  let year, month, day;

  // Native date input format: YYYY-MM-DD. Parse manually to avoid timezone shifts.
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    [, year, month, day] = match;
  } else {
    // Already formatted date: DD MMM YYYY (also accepts full month names).
    match = input.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      day = match[1];
      year = match[3];
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      month = monthNames.findIndex((name) => name === match[2].slice(0, 3).toLowerCase()) + 1;
      if (!month) return input;
    } else {
      // Legacy numeric formats such as DD/MM/YYYY or DD-MM-YYYY.
      match = input.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
      if (match) {
        day = match[1]; month = match[2]; year = match[3];
      } else {
        const parsed = new Date(input);
        if (Number.isNaN(parsed.getTime())) return input;
        year = parsed.getFullYear(); month = parsed.getMonth() + 1; day = parsed.getDate();
      }
    }
  }

  const y = Number(year), m = Number(month), d = Number(day);
  const date = new Date(y, m - 1, d);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31 || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return input;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d).padStart(2, "0")} ${monthNames[m - 1]} ${y}`;
};

// Convert any supported legacy display format back to YYYY-MM-DD for <input type="date">.
const toDateInput = (value) => {
  if (!value) return "";
  const input = String(value).trim();
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const [, y, m, d] = match;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  match = input.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames.findIndex((name) => name === match[2].slice(0, 3).toLowerCase()) + 1;
    if (month) return `${match[3]}-${String(month).padStart(2, "0")}-${String(match[1]).padStart(2, "0")}`;
  }
  match = input.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (match) return `${match[3]}-${String(match[2]).padStart(2, "0")}-${String(match[1]).padStart(2, "0")}`;
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
};

const Records = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("medilinkRecords");
      if (!saved) return initialRecords;
      const parsed = JSON.parse(saved);
      // Migrate older saved records that have missing or previous demo numbers.
      // Only replace known placeholder values; preserve other user-entered numbers.
      const oldDemoPhones = new Set([
        "9876543210", "9876543211", "9876543212", "9876543213",
        "9000000001", "9000000002", "9000000003",
      ]);
      return parsed.map((record) => {
        const type = cleanRecordType(record.type);
        const currentPhone = (record.doctorPhone || "").trim();
        const shouldUseDemoPhone = !currentPhone || oldDemoPhones.has(currentPhone);
        return {
          ...record,
          doctorPhone: shouldUseDemoPhone
            ? (demoPhonesByType[type] || currentPhone)
            : currentPhone,
        };
      });
    } catch {
      return initialRecords;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formRecord, setFormRecord] = useState(emptyRecord);
  const [selectedTypeChoice, setSelectedTypeChoice] = useState("");
  const [customRecordType, setCustomRecordType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    localStorage.setItem("medilinkRecords", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    const recordId = searchParams.get("view");
    if (!recordId) return;
    const found = records.find((record) => String(record.id) === recordId);
    if (found) {
      setSelectedRecord(found);
      setShowViewModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [records, searchParams, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const filteredRecords = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch =
        record.type.toLowerCase().includes(search) ||
        (record.doctor || "").toLowerCase().includes(search) ||
        (record.doctorPhone || "").toLowerCase().includes(search) ||
        (record.notes || "").toLowerCase().includes(search);
      const matchesFilter = filterType === "All Types" || cleanRecordType(record.type) === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [records, searchTerm, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / recordsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRecords = filteredRecords.slice(
    (safePage - 1) * recordsPerPage,
    safePage * recordsPerPage
  );

  const openAddModal = () => {
    setEditingRecord(null);
    setFormRecord(emptyRecord);
    setSelectedTypeChoice("");
    setCustomRecordType("");
    setShowFormModal(true);
  };

  const openEditModal = (record) => {
    const cleanedType = cleanRecordType(record.type || "");
    const isPresetType = recordTypes.includes(cleanedType);
    setEditingRecord(record);
    setSelectedTypeChoice(isPresetType ? cleanedType : "Other");
    setCustomRecordType(isPresetType ? "" : cleanedType);
    setFormRecord({
      type: record.type || "",
      doctor: record.doctor || "",
      doctorPhone: record.doctorPhone || "",
      date: toDateInput(record.date),
      notes: record.notes || "",
    });
    setShowFormModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormRecord((previous) => ({ ...previous, [name]: value }));
  };

  const handleTypeChoiceChange = (event) => {
    const value = event.target.value;
    setSelectedTypeChoice(value);
    if (value !== "Other") {
      setCustomRecordType("");
      setFormRecord((previous) => ({ ...previous, type: value }));
    } else {
      setFormRecord((previous) => ({ ...previous, type: "" }));
    }
  };

  const handleSaveRecord = (event) => {
    event.preventDefault();
    const chosenType = selectedTypeChoice === "Other"
      ? customRecordType.trim()
      : selectedTypeChoice;
    if (!chosenType || !formRecord.doctor.trim() ||
        !formRecord.doctorPhone.trim() || !formRecord.date || !formRecord.notes.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const phone = formRecord.doctorPhone.trim();
    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      alert("Please enter a valid doctor's phone number.");
      return;
    }

    const recordData = {
      ...(editingRecord || {}),
      id: editingRecord ? editingRecord.id : Date.now(),
      type: chosenType,
      doctor: formRecord.doctor.trim(),
      doctorPhone: phone,
      date: formRecord.date,
      notes: formRecord.notes.trim(),
    };

    if (editingRecord) {
      setRecords((previous) =>
        previous.map((record) => record.id === editingRecord.id ? recordData : record)
      );
      if (selectedRecord?.id === editingRecord.id) setSelectedRecord(recordData);
    } else {
      setRecords((previous) => [recordData, ...previous]);
    }

    setShowFormModal(false);
    setEditingRecord(null);
    setFormRecord(emptyRecord);
    setSelectedTypeChoice("");
    setCustomRecordType("");
    setCurrentPage(1);
    setToastType("success");
    setToastMessage(editingRecord ? "Medical record updated successfully." : "Medical record added successfully.");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this medical record? This action cannot be undone.")) return;
    setRecords((previous) => previous.filter((record) => record.id !== id));
    setToastType("delete");
    setToastMessage("Medical record deleted successfully.");
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
      setShowViewModal(false);
      setShowPrintModal(false);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handlePrintPreview = (record) => {
    setSelectedRecord(record);
    setShowPrintModal(true);
  };

  const closeView = () => {
    setShowViewModal(false);
    setSelectedRecord(null);
  };

  const closePrint = () => setShowPrintModal(false);

  const handlePrint = () => {
    // Print only the document preview, not the rest of the MediLink page.
    window.print();
  };

  return (
    <div className="records-page">
      {toastMessage && (
        <div
          className={`records-toast ${toastType}`}
          role="status"
          aria-live="polite"
        >
          <span className="records-toast-check">
            {toastType === "delete" ? "🗑" : "✓"}
          </span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      <div className="records-header">
        <div>
          <h1>Medical Records</h1>
          <p>View and manage all your medical reports.</p>
        </div>
        <button className="add-record-btn" onClick={openAddModal}>+ Add Record</button>
      </div>

      <div className="records-toolbar">
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by record, doctor, phone or notes..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search medical records"
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(event) => setFilterType(event.target.value)}
          aria-label="Filter by record type"
        >
          <option>All Types</option>
          {Array.from(new Set([...recordTypes, ...records.map((record) => cleanRecordType(record.type))]))
            .filter(Boolean).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
        </select>
      </div>

      <div className="records-list">
        {paginatedRecords.length > 0 ? paginatedRecords.map((record) => (
          <RecordCard
            key={record.id}
            record={record}
            onView={handleView}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onPrint={handlePrintPreview}
          />
        )) : (
          <div className="no-records">
            <div className="no-records-icon">📄</div>
            <h3>No records available</h3>
            <p>Try changing your search or filter, or add a new record.</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button className="pagination-arrow" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safePage === 1} aria-label="Previous page">←</button>
        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} className={`page-number ${safePage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
        </div>
        <button className="pagination-arrow" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={safePage >= totalPages} aria-label="Next page">→</button>
      </div>

      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="add-record-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRecord ? "Edit Medical Record" : "Add Medical Record"}</h2>
              <button className="modal-close" onClick={() => setShowFormModal(false)} aria-label="Close">×</button>
            </div>
            <form onSubmit={handleSaveRecord}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="record-type-choice">Record Type</label>
                  <select
                    id="record-type-choice"
                    value={selectedTypeChoice}
                    onChange={handleTypeChoiceChange}
                    required
                  >
                    <option value="">Select a record type</option>
                    {recordTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {selectedTypeChoice === "Other" && (
                    <input
                      id="custom-record-type"
                      name="customRecordType"
                      value={customRecordType}
                      onChange={(event) => setCustomRecordType(event.target.value)}
                      placeholder="Enter record type manually"
                      aria-label="Enter custom record type"
                      required
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="doctor-name">Doctor Name</label>
                  <input id="doctor-name" name="doctor" value={formRecord.doctor}
                    onChange={handleInputChange} placeholder="Enter doctor name" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="doctor-phone">Doctor Phone Number</label>
                <input id="doctor-phone" name="doctorPhone" type="tel" inputMode="tel"
                  value={formRecord.doctorPhone} onChange={handleInputChange}
                  placeholder="Enter doctor's phone number" pattern="[0-9+() -]{7,20}" required />
              </div>
              <div className="form-group">
                <label htmlFor="record-date">Date</label>
                <input id="record-date" name="date" type="date" value={formRecord.date}
                  onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="record-notes">Notes</label>
                <textarea id="record-notes" name="notes" rows="4" value={formRecord.notes}
                  onChange={handleInputChange} placeholder="Enter notes about this record" required />
              </div>
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowFormModal(false)}>Cancel</button>
                <button type="submit" className="save-record-btn">{editingRecord ? "Save Changes" : "Save Record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedRecord && (
        <div className="modal-overlay" onClick={closeView}>
          <div className="view-record-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Medical Record</h2>
              <button className="modal-close" onClick={closeView} aria-label="Close">×</button>
            </div>
            <div className="record-detail">
              <div className="detail-icon">📄</div>
              <div><h3>{selectedRecord.type}</h3><p>Medical report information</p></div>
            </div>
            <div className="detail-item"><span>Doctor</span><strong>Dr. {selectedRecord.doctor}</strong></div>
            <div className="detail-item"><span>Doctor phone</span><strong>{selectedRecord.doctorPhone || "Not provided"}</strong></div>
            <div className="detail-item"><span>Date</span><strong>{formatDisplayDate(selectedRecord.date)}</strong></div>
            <div className="detail-item"><span>Notes</span><strong>{selectedRecord.notes}</strong></div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeView}>Close</button>
              <button className="edit-record-btn" onClick={() => { setShowViewModal(false); openEditModal(selectedRecord); }}>Edit</button>
              <button className="save-record-btn" onClick={() => { setShowViewModal(false); handlePrintPreview(selectedRecord); }}>Print Preview</button>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && selectedRecord && (
        <div className="modal-overlay print-overlay" onClick={closePrint}>
          <div className="print-preview-modal" onClick={(event) => event.stopPropagation()}>
            <div className="print-preview-toolbar no-print">
              <span>Print Preview</span>
              <div>
                <button className="cancel-btn" onClick={closePrint}>Close</button>
                <button className="save-record-btn" onClick={handlePrint}>🖨 Print Document</button>
              </div>
            </div>
            <article className="print-document" id="medical-record-print">
              <header className="print-document-header">
                <div className="print-logo">✚ <span>MediLink</span></div>
                <p>PERSONAL MEDICAL RECORD</p>
              </header>
              <h1>{selectedRecord.type}</h1>
              <p className="print-subtitle">Medical record summary</p>
              <div className="print-document-rule" />
              <div className="print-detail"><span>Record type</span><strong>{selectedRecord.type}</strong></div>
              <div className="print-detail"><span>Doctor's name</span><strong>Dr. {selectedRecord.doctor}</strong></div>
              <div className="print-detail"><span>Doctor's phone number</span><strong>{selectedRecord.doctorPhone || "Not provided"}</strong></div>
              <div className="print-detail"><span>Date</span><strong>{formatDisplayDate(selectedRecord.date)}</strong></div>
              <section className="print-notes">
                <h2>Notes / Report Summary</h2>
                <p>{selectedRecord.notes}</p>
              </section>
              <footer className="print-document-footer">
                <span>Generated from MediLink</span>
                <span>Keep this document with your medical records.</span>
              </footer>
            </article>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
