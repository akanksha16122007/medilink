import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecordCard from "../Components/RecordCard";

const initialRecords = [
  {
    id: 1,
    type: "🩸 Blood Test",
    doctor: "Sharma",
    date: "02 Sep 2026",
    notes: "Routine blood test",
  },
  {
    id: 2,
    type: "🩻 X-Ray Chest",
    doctor: "Mehta",
    date: "28 Aug 2026",
    notes: "Chest X-ray for infection",
  },
  {
    id: 3,
    type: "❤️ ECG Report",
    doctor: "Verma",
    date: "18 Aug 2026",
    notes: "ECG for regular checkup",
  },
  {
    id: 4,
    type: "🧠 MRI Brain",
    doctor: "Kapoor",
    date: "10 Aug 2026",
    notes: "MRI for headache evaluation",
  },
];

const Records = () => {

  // Gets the records from localStorage when the component loads
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem("medilinkRecords");

    return savedRecords
      ? JSON.parse(savedRecords)
      : initialRecords;
  });

  // Reads query parameters from the URL.
  // Example: /records?view=2
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAddModal, setShowAddModal] = useState(false);

  const [newRecord, setNewRecord] = useState({
    type: "",
    doctor: "",
    date: "",
    notes: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // Stores the record currently being viewed
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);
  useEffect(() => {
  const viewId = searchParams.get("view");

  // If there is no "view" parameter, do nothing.
  if (!viewId) return;

  // Find the record whose id matches the id from the URL.
  const recordToView = records.find(
    (record) => record.id.toString() === viewId
  );

  // If the record exists, open it in the View modal.
  if (recordToView) {
    setSelectedRecord(recordToView);
  }
}, [searchParams, records]);
useEffect(() => {
  localStorage.setItem(
    "medilinkRecords",
    JSON.stringify(records)
  );
}, [records]);
  // ================= SEARCH + FILTER =================

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      record.type.toLowerCase().includes(search) ||
      record.doctor.toLowerCase().includes(search) ||
      record.notes.toLowerCase().includes(search);

    const cleanType = record.type.replace(
      /^[^\w\s]+\s*/,
      ""
    );

    const matchesFilter =
      filterType === "All Types" || cleanType === filterType;

    return matchesSearch && matchesFilter;
  });

  // ================= PAGINATION =================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / recordsPerPage)
  );

  const startIndex = (currentPage - 1) * recordsPerPage;

  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ================= VIEW RECORD =================

  const handleView = (record) => {
    setSelectedRecord(record);
  };
const handleDelete = (id) => {
  setRecords((prevRecords) =>
    prevRecords.filter((record) => record.id !== id)
  );
};
const handleAddRecord = (e) => {
  e.preventDefault();

  const record = {
    id: Date.now(),
    type: newRecord.type,
    doctor: newRecord.doctor,
    date: newRecord.date,
    notes: newRecord.notes,
  };

  setRecords((prevRecords) => [record, ...prevRecords]);

  setNewRecord({
    type: "",
    doctor: "",
    date: "",
    notes: "",
  });

  setShowAddModal(false);
};
  const closeModal = () => {
    setSelectedRecord(null);
      setSearchParams({});
  };

  return (
    <div className="records-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="records-header">
        <div>
          <h1>Medical Records</h1>

          <p>
            View and manage all your medical reports.
          </p>
        </div>

        {/* Add Record button */}
        <button
  className="add-record-btn"
  type="button"
  onClick={() => setShowAddModal(true)}
>
  + Add Record
</button>
      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="records-toolbar">

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>All Types</option>
          <option>Blood Test</option>
          <option>X-Ray Chest</option>
          <option>ECG Report</option>
          <option>MRI Brain</option>
        </select>

      </div>

      {/* ================= RECORDS LIST ================= */}

      <div className="records-list">

        {paginatedRecords.length > 0 ? (

          paginatedRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}

              // Opens modal for this particular record
              onView={() => handleView(record)}

              
              onDelete={() => handleDelete(record.id)}
            />
          ))

        ) : (

          <div className="no-records">

            <div className="no-records-icon">
              📄
            </div>

            <h3>No records available</h3>

            <p>
              There are no records available on this page.
            </p>

          </div>
        )}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="pagination">

        <button
          className="pagination-arrow"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        <div className="pagination-pages">

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (

            <button
              key={page}
              className={`page-number ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>

          ))}

        </div>

        <button
          className="pagination-arrow"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          →
        </button>

      </div>
      {/* ================= ADD RECORD MODAL ================= */}

{showAddModal && (

  <div
    className="record-modal-overlay"
    onClick={() => setShowAddModal(false)}
  >

    <div
      className="record-modal add-record-form-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Modal Header */}

      <div className="record-modal-header">

        <h2>Add Medical Record</h2>

        <button
          className="modal-close-btn"
          type="button"
          onClick={() => setShowAddModal(false)}
          aria-label="Close modal"
        >
          ×
        </button>

      </div>


      {/* Add Record Form */}

      <form onSubmit={handleAddRecord}>

        {/* Record Type */}

        <div className="form-group">

          <label>Record Type</label>

          <select
            value={newRecord.type}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                type: e.target.value,
              })
            }
            required
          >

            <option value="">
              Select record type
            </option>

            <option value="🩸 Blood Test">
              🩸 Blood Test
            </option>

            <option value="🩻 X-Ray Chest">
              🩻 X-Ray Chest
            </option>

            <option value="❤️ ECG Report">
              ❤️ ECG Report
            </option>

            <option value="🧠 MRI Brain">
              🧠 MRI Brain
            </option>

          </select>

        </div>


        {/* Doctor */}

        <div className="form-group">

          <label>Doctor Name</label>

          <input
            type="text"
            placeholder="Enter doctor name"
            value={newRecord.doctor}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                doctor: e.target.value,
              })
            }
            required
          />

        </div>


        {/* Date */}

        <div className="form-group">

          <label>Date</label>

          <input
            type="date"
            value={newRecord.date}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                date: e.target.value,
              })
            }
            required
          />

        </div>


        {/* Notes */}

        <div className="form-group">

          <label>Notes</label>

          <textarea
            placeholder="Enter notes about this medical record"
            value={newRecord.notes}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                notes: e.target.value,
              })
            }
            rows="4"
            required
          />

        </div>


        {/* Buttons */}

        <div className="modal-buttons">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-record-btn"
          >
            Save Record
          </button>

        </div>

      </form>

    </div>

  </div>

)}

      {/* ================= VIEW RECORD MODAL ================= */}

      {selectedRecord && (

        <div
          className="record-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="record-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="record-modal-header">

              <h2>Medical Record</h2>

              <button
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>

            </div>

            {/* Record Details */}
            <div className="record-modal-body">

              <div className="record-detail">
                <span>Record Type</span>
                <strong>{selectedRecord.type}</strong>
              </div>

              <div className="record-detail">
                <span>Doctor</span>
                <strong>{selectedRecord.doctor}</strong>
              </div>

              <div className="record-detail">
                <span>Date</span>
                <strong>{selectedRecord.date}</strong>
              </div>

              <div className="record-detail">
                <span>Notes</span>
                <strong>{selectedRecord.notes}</strong>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="record-modal-footer">

              <button
                className="modal-close-button"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Records;
