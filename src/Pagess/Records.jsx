import React, { useEffect, useState } from "react";
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
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem("medilinkRecords");

    return savedRecords
      ? JSON.parse(savedRecords)
      : initialRecords;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

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

  return (
    <div className="records-page">

      {/* Page Header */}
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

      {/* Search and Filter */}
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

      {/* Records */}
      <div className="records-list">

        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
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

            <h3>No records found</h3>

            <p>
              Try changing your search or filter.
            </p>
          </div>
        )}

      </div>

     

      {/* ================= ADD RECORD MODAL ================= */}

      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >

          <div
            className="add-record-modal"
            onClick={(e) => e.stopPropagation()}
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
          onClick={() => setShowViewModal(false)}
        >

          <div
            className="view-record-modal"
            onClick={(e) => e.stopPropagation()}
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
                <h3>{selectedRecord.type}</h3>
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