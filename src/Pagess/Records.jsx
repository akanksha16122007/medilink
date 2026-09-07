import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecordCard from "../Components/RecordCard";

const initialRecords = [
  {
    id: 1,
    type: "Blood Test",
    doctor: "Sharma",
    date: "02 Sep 2026",
    notes: "Routine blood test",
  },
  {
    id: 2,
    type: "X-Ray Chest",
    doctor: "Mehta",
    date: "28 Aug 2026",
    notes: "Chest X-ray for infection",
  },
  {
    id: 3,
    type: "ECG Report",
    doctor: "Verma",
    date: "18 Aug 2026",
    notes: "ECG for regular checkup",
  },
  {
    id: 4,
    type: "MRI Brain",
    doctor: "Kapoor",
    date: "10 Aug 2026",
    notes: "MRI for headache evaluation",
  },
];

const Records = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem("medilinkRecords");

    return savedRecords
      ? JSON.parse(savedRecords)
      : initialRecords;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [newRecord, setNewRecord] = useState({
    type: "Blood Test",
    doctor: "",
    date: "",
    notes: "",
  });


// Save records whenever they change
useEffect(() => {
  localStorage.setItem(
    "medilinkRecords",
    JSON.stringify(records)
  );
}, [records]);

// Open the exact record sent from Dashboard
useEffect(() => {
  const recordId = searchParams.get("view");

  if (!recordId) return;

  const recordToView = records.find(
    (record) => String(record.id) === recordId
  );

  if (recordToView) {
    setSelectedRecord(recordToView);
    setShowViewModal(true);

    setSearchParams({}, { replace: true });
  }
}, [records, searchParams, setSearchParams]);

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new record
  const handleAddRecord = (e) => {
    e.preventDefault();

    if (
      !newRecord.type ||
      !newRecord.doctor ||
      !newRecord.date ||
      !newRecord.notes
    ) {
      alert("Please fill all fields.");
      return;
    }

    const formattedDate = new Date(
      newRecord.date
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const recordToAdd = {
      id: Date.now(),
      type: newRecord.type,
      doctor: newRecord.doctor,
      date: formattedDate,
      notes: newRecord.notes,
    };

    setRecords((prev) => [recordToAdd, ...prev]);

    setNewRecord({
      type: "Blood Test",
      doctor: "",
      date: "",
      notes: "",
    });

    setShowAddModal(false);

    // Go back to first page after adding a record
    setCurrentPage(1);
  };

  // Delete record
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmDelete) return;

    setRecords((prev) =>
      prev.filter((record) => record.id !== id)
    );
  };

  // View record
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // Search + filter
  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      record.type.toLowerCase().includes(search) ||
      record.doctor.toLowerCase().includes(search) ||
      record.notes.toLowerCase().includes(search);

    const matchesFilter =
      filterType === "All Types" ||
      record.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // ================= PAGINATION =================

 const totalPages = Math.max(2, Math.ceil(filteredRecords.length / recordsPerPage));

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const endIndex =
    startIndex + recordsPerPage;

  const paginatedRecords =
    filteredRecords.slice(startIndex, endIndex);

  // Move to previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Move to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
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

        <button
          className="add-record-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Record
        </button>
      </div>

      {/* ================= SEARCH AND FILTER ================= */}

      <div className="records-toolbar">

        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value)
          }
        >
          <option>All Types</option>
          <option>Blood Test</option>
          <option>X-Ray Chest</option>
          <option>ECG Report</option>
          <option>MRI Brain</option>
        </select>

      </div>

      {/* ================= RECORDS ================= */}

      <div className="records-list">

        {paginatedRecords.length > 0 ? (

          paginatedRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onView={handleView}
              onDelete={handleDelete}
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

        {/* Previous Arrow */}

        <button
          className="pagination-arrow"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        {/* Page Numbers */}

        <div className="pagination-pages">

          {Array.from(
            {
              length: Math.max(totalPages, 1),
            },
            (_, index) => index + 1
          ).map((page) => (

            <button
              key={page}
              className={`page-number ${
                currentPage === page
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(page)
              }
            >
              {page}
            </button>

          ))}

        </div>

        {/* Next Arrow */}

        <button
          className="pagination-arrow"
          onClick={handleNextPage}
          disabled={
            totalPages === 0 ||
            currentPage >= totalPages
          }
          aria-label="Next page"
        >
          →
        </button>

      </div>

      {/* ================= ADD RECORD MODAL ================= */}

      {showAddModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >

          <div
            className="add-record-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <h2>Add Medical Record</h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleAddRecord}>

              <div className="form-row">

                <div className="form-group">

                  <label>Record Type</label>

                  <select
                    name="type"
                    value={newRecord.type}
                    onChange={handleInputChange}
                  >
                    <option>Blood Test</option>
                    <option>X-Ray Chest</option>
                    <option>ECG Report</option>
                    <option>MRI Brain</option>
                  </select>

                </div>

                <div className="form-group">

                  <label>Doctor Name</label>

                  <input
                    type="text"
                    name="doctor"
                    placeholder="Enter doctor name"
                    value={newRecord.doctor}
                    onChange={handleInputChange}
                  />

                </div>

              </div>

              <div className="form-group">

                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={newRecord.date}
                  onChange={handleInputChange}
                />

              </div>

              <div className="form-group">

                <label>Notes</label>

                <textarea
                  name="notes"
                  placeholder="Enter notes about this record"
                  value={newRecord.notes}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>

              </div>

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
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

      {showViewModal && selectedRecord && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowViewModal(false)
          }
        >

          <div
            className="view-record-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <h2>Medical Record</h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowViewModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="record-detail">

              <div className="detail-icon">
                📄
              </div>

              <div>

                <h3>
                  {selectedRecord.type}
                </h3>

                <p>
                  Medical report information
                </p>

              </div>

            </div>

            <div className="detail-item">

              <span>Doctor</span>

              <strong>
                Dr. {selectedRecord.doctor}
              </strong>

            </div>

            <div className="detail-item">

              <span>Date</span>

              <strong>
                {selectedRecord.date}
              </strong>

            </div>

            <div className="detail-item">

              <span>Notes</span>

              <strong>
                {selectedRecord.notes}
              </strong>

            </div>

            <button
              className="close-detail-btn"
              onClick={() =>
                setShowViewModal(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Records;
