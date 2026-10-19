
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faFileCirclePlus,
  faPlus,
  faDownload,
  faTrashCan,
  faMagnifyingGlass,
  faClock,
  faFilePdf,
  faImage,
  faXmark,
  faFileLines,
  faCloudArrowUp,
  faCircleCheck,
  faCircleExclamation,
  faEye,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const STORAGE_KEY = "medilink_vault";

const categories = [
  "Lab Report",
  "Prescription",
  "Diagnostic Scan",
  "Discharge Summary",
  "Other",
];

export default function DocumentVault() {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
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
  const [animate, setAnimate] = useState(false);

  // Animate the heading icon at regular intervals.
  useEffect(() => {
    let timeout;

    const interval = setInterval(() => {
      setAnimate(true);

      timeout = setTimeout(() => {
        setAnimate(false);
      }, 900);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Automatically hide notifications.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Close the preview when Escape is pressed.
  useEffect(() => {
    if (!selectedDoc) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedDoc(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc]);

  function showToast(text, type = "success") {
    setToast({ text, type });
  }

  // Validate and read the selected file.
  function handleFileChange(event) {
    const chosenFile = event.target.files?.[0];

    if (!chosenFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(chosenFile.type)) {
      showToast("Choose a JPG, PNG, or PDF file.", "error");
      setFile(null);
      event.target.value = "";
      return;
    }

    if (chosenFile.size > 1.5 * 1024 * 1024) {
      showToast("The file must not exceed 1.5 MB.", "error");
      setFile(null);
      event.target.value = "";
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
      setFile(null);
      event.target.value = "";
      showToast("Unable to read the file. Please try again.", "error");
    };

    reader.readAsDataURL(chosenFile);
  }

  // Save a new document.
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDocuments)
      );

      setDocuments(updatedDocuments);
      setDocName("");
      setCategory("Lab Report");
      setFile(null);
      event.currentTarget.reset();

      showToast("Document added successfully.");
    } catch {
      showToast(
        "Unable to save the document. Try a smaller file.",
        "error"
      );
    }
  }

  // Search by name, category, or filename.
  const filteredDocuments = documents.filter((doc) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      doc.name.toLowerCase().includes(term) ||
      doc.category.toLowerCase().includes(term) ||
      doc.fileName.toLowerCase().includes(term);

    const matchesCategory =
      filter === "All" || doc.category === filter;

    return matchesSearch && matchesCategory;
  });

  // Delete a document.
  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this medical document?"
    );

    if (!confirmed) return;

    const updatedDocuments = documents.filter(
      (doc) => doc.id !== id
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDocuments)
      );

      setDocuments(updatedDocuments);

      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }

      showToast("Document removed successfully.");
    } catch {
      showToast("Unable to remove the document.", "error");
    }
  }

  // Download a saved document.
  function handleDownload(doc) {
    const link = window.document.createElement("a");
    link.href = doc.dataUrl;
    link.download = doc.fileName;
    link.style.display = "none";

    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function getFileIcon(doc) {
    return doc.fileType === "application/pdf" ? faFilePdf : faImage;
  }

  function formatFileSize(dataUrl) {
    if (!dataUrl) return "";

    const base64 = dataUrl.split(",")[1] || "";
    const bytes = Math.max(0, Math.floor((base64.length * 3) / 4));

    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return (
    <main className="vault-page">
      {/* Notifications */}
      {toast && (
        <div
          className={`vault-toast vault-toast-${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
          <FontAwesomeIcon
            icon={toast.type === "error" ? faCircleExclamation : faCircleCheck}
          />

          <span>{toast.text}</span>

          <button
            type="button"
            className="vault-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* Page header */}
      <header className="vault-heading">
        <div className="vault-heading-icon">
          <FontAwesomeIcon icon={faFolderOpen} flip360={animate} />
        </div>

        <div className="vault-heading-copy">
          <p className="vault-eyebrow">YOUR HEALTH RECORDS</p>
          <h1>Document Vault</h1>
          <p className="vault-subtitle">
            Keep your medical documents organized and easy to access.
          </p>
        </div>
      </header>

      {/* Storage information */}
      <div className="vault-notice">
        <span className="vault-notice-icon" aria-hidden="true">i</span>
        <div>
          <strong>Your records, organized.</strong>
          <p>
            Documents are saved in this browser and remain available
            on this device.
          </p>
        </div>
      </div>

      {/* Upload section */}
      <section className="vault-panel">
        <div className="vault-section-heading">
          <div className="vault-section-icon">
            <FontAwesomeIcon icon={faFileCirclePlus} />
          </div>

          <div>
            <h2>Add a medical document</h2>
            <p>Enter the document details and select a file to upload.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="vault-form">
          <div className="vault-form-fields">
            <div className="vault-field">
              <label htmlFor="docName">Document name</label>
              <input
                id="docName"
                type="text"
                placeholder="e.g. Complete Blood Count"
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
            <label htmlFor="docFile">Document file</label>

            <div className="vault-file-box">
              <div className="vault-upload-symbol">
                <FontAwesomeIcon icon={faCloudArrowUp} />
              </div>

              <div className="vault-file-content">
                <label className="vault-file-label" htmlFor="docFile">
                  {file ? "Choose a different file" : "Select a document"}
                </label>

                <p>JPG, PNG or PDF · Maximum file size 1.5 MB</p>

                {file && (
                  <div className="vault-selected-file">
                    <FontAwesomeIcon icon={getFileIcon(file)} />
                    <span title={file.name}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        const input = window.document.getElementById("docFile");
                        if (input) input.value = "";
                      }}
                      aria-label="Remove selected file"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}
              </div>

              <input
                id="docFile"
                className="vault-file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          <div className="vault-form-footer">
            <p className="vault-form-hint">
              <FontAwesomeIcon icon={faFileLines} />
              Only JPG, PNG and PDF files are supported.
            </p>

            <button type="submit" className="vault-primary-btn">
              <FontAwesomeIcon icon={faPlus} />
              Add to records
            </button>
          </div>
        </form>
      </section>

      {/* Document library */}
      <section className="vault-panel vault-library">
        <div className="vault-library-heading">
          <div className="vault-section-heading">
            <div className="vault-section-icon">
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>

            <div>
              <h2>Saved documents</h2>
              <p>Search, view, download, or remove your records.</p>
            </div>
          </div>

          <div className="vault-count">
            <strong>{documents.length}</strong>
            <span>{documents.length === 1 ? "document" : "documents"}</span>
          </div>
        </div>

        <div className="vault-toolbar">
          <div className="vault-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="search"
              aria-label="Search medical documents"
              placeholder="Search documents..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
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

        <div className="vault-results-line">
          <span>
            {filteredDocuments.length}{" "}
            {filteredDocuments.length === 1 ? "result" : "results"}
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="vault-empty">
            <div className="vault-empty-icon">
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>

            <h3>
              {documents.length === 0
                ? "Your document library is empty"
                : "No matching documents"}
            </h3>

            <p>
              {documents.length === 0
                ? "Add your first medical document using the form above."
                : "Try another search term or choose a different record type."}
            </p>

            {documents.length > 0 && (search || filter !== "All") && (
              <button
                type="button"
                className="vault-secondary-btn"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="vault-grid">
            {filteredDocuments.map((doc) => (
              <article className="vault-card" key={doc.id}>
                <div className="vault-card-top">
                  <div className="vault-document-icon">
                    <FontAwesomeIcon icon={getFileIcon(doc)} />
                  </div>

                  <span className="vault-category">
                    {doc.category}
                  </span>
                </div>

                <h3 className="vault-card-title" title={doc.name}>
                  {doc.name}
                </h3>

                <p className="vault-filename" title={doc.fileName}>
                  {doc.fileName}
                </p>

                <div className="vault-card-meta">
                  <span>
                    <FontAwesomeIcon icon={faClock} />
                    {doc.date}
                  </span>
                  <span>{formatFileSize(doc.dataUrl)}</span>
                </div>

                <div className="vault-card-actions">
                  <button
                    type="button"
                    className="vault-view-btn"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View
                  </button>

                  <button
                    type="button"
                    className="vault-icon-btn"
                    onClick={() => handleDownload(doc)}
                    title="Download document"
                    aria-label={`Download ${doc.name}`}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>

                  <button
                    type="button"
                    className="vault-icon-btn vault-delete-btn"
                    onClick={() => handleDelete(doc.id)}
                    title="Delete document"
                    aria-label={`Delete ${doc.name}`}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
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
            aria-labelledby="vault-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="vault-modal-header">
              <div className="vault-modal-file-icon">
                <FontAwesomeIcon icon={getFileIcon(selectedDoc)} />
              </div>

              <div className="vault-modal-title">
                <p className="vault-eyebrow">DOCUMENT PREVIEW</p>
                <h2 id="vault-preview-title">{selectedDoc.name}</h2>
                <p>{selectedDoc.category} · {selectedDoc.date}</p>
              </div>

              <button
                type="button"
                className="vault-modal-close"
                onClick={() => setSelectedDoc(null)}
                aria-label="Close document preview"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </header>

            <div className="vault-preview-details">
              <span title={selectedDoc.fileName}>
                <FontAwesomeIcon icon={faFileLines} />
                {selectedDoc.fileName}
              </span>

              <span>{formatFileSize(selectedDoc.dataUrl)}</span>
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

            <footer className="vault-modal-footer">
              <button
                type="button"
                className="vault-secondary-btn"
                onClick={() => setSelectedDoc(null)}
              >
                Close preview
              </button>

              <button
                type="button"
                className="vault-primary-btn"
                onClick={() => handleDownload(selectedDoc)}
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
                Download
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}