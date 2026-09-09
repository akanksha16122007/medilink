import React, { useEffect, useState } from "react";
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
  const [records] = useState(() => {
    const savedRecords = localStorage.getItem("medilinkRecords");

    return savedRecords ? JSON.parse(savedRecords) : initialRecords;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All Types");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

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

        {/* Add Record button - intentionally does nothing */}
        <button
          className="add-record-btn"
          type="button"
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

              // View button stays visible but does nothing
              onView={() => {}}

              // Delete button stays visible but does nothing
              onDelete={() => {}}
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

    </div>
  );
};

export default Records;