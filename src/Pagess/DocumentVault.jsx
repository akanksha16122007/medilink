import React, { useEffect, useState } from "react";

const STORAGE_KEY = "medilink_vault";

const categories = [
  "Lab Report",
  "Prescription",
  "Diagnostic Scan",
  "Discharge Summary",
  "Other",
];

export default function DocumentVault() {
  // Load saved documents from localStorage.
  const [documents, setDocuments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("Lab Report");
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toast, setToast] = useState(null);

  // Automatically hide toast notifications after 3 seconds.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(text, type = "success") {
    setToast({ text, type });
  }

  // Validate and read the selected file.
  function handleFileChange(event) {
    const chosenFile = event.target.files[0];

    if (!chosenFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(chosenFile.type)) {
      showToast("Please select a JPG, PNG, or PDF file.", "error");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (chosenFile.size > 1.5 * 1024 * 1024) {
      showToast("File size must not exceed 1.5 MB.", "error");
      event.target.value = "";
      setFile(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: chosenFile.name,
        type: chosenFile.type,
        data: reader.result,
      });
    };

    reader.onerror = () => {
      showToast("Unable to read this file. Please try again.", "error");
      setFile(null);
    };

    reader.readAsDataURL(chosenFile);
  }

  // Add a new medical document.
  function handleSubmit(event) {
    event.preventDefault();

    if (!docName.trim() || !file) {
      showToast("Enter a document name and select a file.", "error");
      return;
    }

    const newDocument = {
      id: Date.now(),
      name: docName.trim(),
      category,
      fileName: file.name,
      fileType: file.type,
      dataUrl: file.data,
      date: new Date().toLocaleDateString(),
    };

    const updatedDocuments = [newDocument, ...documents];

    try {
      // Save before showing the success notification.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDocuments)
      );

      setDocuments(updatedDocuments);
      setDocName("");
      setCategory("Lab Report");
      setFile(null);
      event.target.reset();

      showToast("Medical document added successfully.");
    } catch {
      showToast(
        "Unable to save the document. Try a smaller file.",
        "error"
      );
    }
  }

  // Search by document name and filter by category.
  const filteredDocuments = documents.filter((document) => {
    const term = search.toLowerCase();

    const matchesSearch =
      document.name.toLowerCase().includes(term) ||
      document.category.toLowerCase().includes(term);

    const matchesCategory =
      filter === "All" || document.category === filter;

    return matchesSearch && matchesCategory;
  });

  // Remove a document.
  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this medical document?"
    );

    if (!confirmed) return;

    const updatedDocuments = documents.filter(
      (document) => document.id !== id
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDocuments)
      );

      setDocuments(updatedDocuments);

      if (selectedDoc && selectedDoc.id === id) {
        setSelectedDoc(null);
      }

      showToast("Medical document removed successfully.");
    } catch {
      showToast("Unable to remove the document. Please try again.", "error");
    }
  }

  return (
    <main className="vault-page">
      {/* Temporary success and error notifications */}
      {toast && (
        <div
          className={`vault-toast ${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
          <span className="vault-toast-icon" aria-hidden="true">
            {toast.type === "success" ? "✓" : "!"}
          </span>

          <p>{toast.text}</p>

          <button
            type="button"
            className="vault-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <header className="vault-heading">
        <div>
          <h1>Document Vault 🗂️</h1>
          <p className="vault-subtitle">
            Organize your medical reports, prescriptions, and
            diagnostic record files in one place.
          </p>
        </div>
      </header>

      <div className="vault-notice">
        <span className="notice-icon" aria-hidden="true">i</span>
        <p>
          Your medical documents are securely stored in this browser, keeping your health records organized and easily accessible on this device.
        </p>
      </div>

      <section className="vault-upload-panel">
        <div className="section-heading">
          <div>
            <h2>Add a medical document</h2>
            <p>Upload a file and assign it a record type.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="vault-form">
          <div className="vault-form-fields">
            <div className="vault-field">
              <label htmlFor="docName">Document name</label>
              <input
                id="docName"
                type="text"
                placeholder="e.g. Complete Blood Count Report"
                value={docName}
                onChange={(event) => setDocName(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="vault-field">
              <label htmlFor="docCategory">Record type</label>
              <select
                id="docCategory"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="vault-field">
            <label htmlFor="docFile">Choose a document</label>

            <div className="vault-file-box">
              <input
                id="docFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                required
              />

              <p>
                Accepted formats: JPG, PNG, and PDF.
                Maximum size: 1.5 MB.
              </p>

              {file && (
                <p className="selected-file">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="vault-primary-btn">
            Add to records
          </button>
        </form>
      </section>

      <section className="vault-library">
        <div className="section-heading library-heading">
          <div>
            <h2>Saved documents</h2>
            <p>Search, review, or remove your medical records.</p>
          </div>

          <div className="vault-count">
            <strong>{documents.length}</strong>
            <span>
              {documents.length === 1 ? "document" : "documents"}
            </span>
          </div>
        </div>

        <div className="vault-toolbar">
          <div className="vault-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              aria-label="Search medical documents"
              placeholder="Search by name or record type..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="vault-filter"
            aria-label="Filter by record type"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All record types</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="vault-empty">
            <div className="empty-icon" aria-hidden="true">▤</div>

            <h3>
              {documents.length === 0
                ? "No medical documents yet"
                : "No matching documents"}
            </h3>

            <p>
              {documents.length === 0
                ? "Documents you add will appear here."
                : "Try another search term or record type."}
            </p>
          </div>
        ) : (
          <div className="vault-grid">
            {filteredDocuments.map((document) => (
              <article className="vault-card" key={document.id}>
                <div className="vault-card-top">
                  <div className="document-icon">
                    {document.fileType === "application/pdf"
                      ? "PDF"
                      : "IMG"}
                  </div>

                  <span className="document-category">
                    {document.category}
                  </span>
                </div>

                <h3 title={document.name}>{document.name}</h3>
                <p className="document-filename">{document.fileName}</p>

                <p className="document-date">
                  <span aria-hidden="true">◷</span>
                  {" "}Added on {document.date}
                </p>

                <div className="vault-card-actions">
                  <button
                    type="button"
                    className="vault-view-btn"
                    onClick={() => setSelectedDoc(document)}
                  >
                    View document
                  </button>

                  <button
                    type="button"
                    className="vault-delete-btn"
                    onClick={() => handleDelete(document.id)}
                    aria-label={`Remove ${document.name}`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Document preview modal */}
      {selectedDoc && (
        <div
          className="vault-modal-backdrop"
          onClick={() => setSelectedDoc(null)}
        >
          <section
            className="vault-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vault-modal-heading">
              <div>
                <p className="vault-eyebrow">DOCUMENT DETAILS</p>
                <h2 id="preview-title">{selectedDoc.name}</h2>
              </div>

              <button
                type="button"
                className="vault-close-btn"
                aria-label="Close document preview"
                onClick={() => setSelectedDoc(null)}
              >
                ×
              </button>
            </div>

            <div className="vault-preview-content">
              {selectedDoc.fileType === "application/pdf" ? (
                <iframe
                  title={selectedDoc.name}
                  src={selectedDoc.dataUrl}
                  className="vault-pdf-preview"
                />
              ) : (
                <img
                  src={selectedDoc.dataUrl}
                  alt={selectedDoc.name}
                  className="vault-image-preview"
                />
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
