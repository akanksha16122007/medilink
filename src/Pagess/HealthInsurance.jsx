import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash, faCircleInfo , faFileShield, faFolderOpen,faXmark,} from "@fortawesome/free-solid-svg-icons";
const STORAGE_KEY = "medilinkHealthPolicy";

const EMPTY_POLICY = {
  provider: "",
  planName: "",
  coverageAmount: "",
  policyHolderName: "",
  startDate: "",
  expiryDate: "",
  customerCare: "",
  tpaName: "",
  claimedAmount: "",
  availableAmount: "",
  policyType: "",
  claimHelpline: "",
  policyNumberLast4: "",
  policyNumber: "",
};

const isPolicyObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const readSavedPolicies = () => {
  try {
    const savedValue = localStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    // New format: an array of policies
    if (Array.isArray(parsedValue)) {
      return parsedValue
        .filter(isPolicyObject)
        .map((policy, index) => ({
          ...EMPTY_POLICY,
          ...policy,
          id: policy.id || `saved-policy-${index + 1}`,
        }));
    }

    // Old format: one policy object. Keep it when upgrading to the new format.
    if (isPolicyObject(parsedValue)) {
      return [
        {
          ...EMPTY_POLICY,
          ...parsedValue,
          id: parsedValue.id || "saved-policy-1",
        },
      ];
    }

    return [];
  } catch {
    return [];
  }
};

const createPolicyId = () =>
  `policy-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getPolicyStatus = (expiryDate) => {
  if (!expiryDate) {
    return "Date needed";
  }

  return expiryDate >= getTodayDate() ? "Active" : "Expired";
};

const formatDate = (date) => {
  if (!date) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const formatCoverage = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Not provided";
  }

  return `₹${numericAmount.toLocaleString("en-IN")}`;
};
const normalizePolicyNumber = (value = "") =>
  value.trim().toUpperCase();

const isValidOptionalPhone = (value = "") => {
  const phone = value.trim();

  // Optional phone field blank ho sakta hai
  if (!phone) {
    return true;
  }

  // Digits ke saath common formatting allow: +, spaces, hyphens, parentheses, dots
  if (!/^\+?[0-9\s().-]+$/.test(phone)) {
    return false;
  }

  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
};

const HealthInsurance = () => {
  const [policies, setPolicies] = useState(readSavedPolicies);
  const policyCounts = policies.reduce(
  (counts, policy) => {
    counts.total += 1;

    const status = getPolicyStatus(policy.expiryDate);

    if (status === "Active") counts.active += 1;
    if (status === "Expired") counts.expired += 1;

    return counts;
  },
  { total: 0, active: 0, expired: 0 }
);
  const [editMode, setEditMode] = useState(null);
  const [editingPolicyId, setEditingPolicyId] = useState(null);
  const [draft, setDraft] = useState({ ...EMPTY_POLICY });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);
  const [showPolicyNumber, setShowPolicyNumber] = useState(false);
  const policyInformationRef = useRef(null);
  const [flippedPolicyId, setFlippedPolicyId] = useState(null);

  const showToast = (message) => {
    setToast(message);

    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast("");
    }, 3000);
  };
  const dismissToast = () => {
  window.clearTimeout(toastTimerRef.current);
  setToast("");
  };

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current);
  }, []);
  useEffect(() => {
  if (editMode) {
    policyInformationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [editMode]);

  const startAddingPolicy = () => {
    setShowPolicyNumber(false);
    setDraft({ ...EMPTY_POLICY });
    setEditingPolicyId(null);
    setError("");
    setFlippedPolicyId(null);
    setEditMode("add");
  };

  const startEditingPolicy = (policy) => {
    setShowPolicyNumber(false);
    setDraft({ ...EMPTY_POLICY, ...policy });
    setEditingPolicyId(policy.id);
    setError("");
    setFlippedPolicyId(null);
    setEditMode("edit");
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setDraft((previousDraft) => ({
      ...previousDraft,
      [name]: value,
    }));
  };

  const cancelEditing = () => {
    setDraft({ ...EMPTY_POLICY });
    setEditingPolicyId(null);
    setError("");
    setEditMode(null);
  };

  const handleSavePolicy = (event) => {
    event.preventDefault();
    setError("");
  // YAHAN: required text/date fields check
  const requiredTextFields = [
    draft.provider,
    draft.planName,
    draft.policyHolderName,
    draft.startDate,
    draft.expiryDate,
    draft.policyNumber,
  ];

  if (requiredTextFields.some((value) => !String(value ?? "").trim())) {
    setError("Please complete all required policy fields.");
    return;
  }

  // Iske baad coverage check

   const coverageAmount = Number(draft.coverageAmount);

    if (
      !draft.coverageAmount ||
      !Number.isFinite(coverageAmount) ||
      coverageAmount <= 0
    ) {
      setError("Coverage amount should be greater than zero.");
      return;
    }

    if (draft.expiryDate < draft.startDate) {
      setError("Expiry date cannot be before the start date.");
      return;
    }
    // YAHAN: optional Claimed aur Available amount checks
    const optionalAmounts = [
      ["Claimed amount", draft.claimedAmount],
      ["Available amount", draft.availableAmount],
    ];

    const invalidAmount = optionalAmounts.find(([, value]) => {
      const enteredValue = String(value ?? "").trim();

      return (
        enteredValue !== "" &&
        (!Number.isFinite(Number(enteredValue)) || Number(enteredValue) < 0)
      );
    });

    if (invalidAmount) {
      setError(`${invalidAmount[0]} must be zero or greater.`);
      return;
    }
    if (!isValidOptionalPhone(draft.customerCare)) {
      setError(
        "Customer-care number must contain 7 to 15 digits. You may use +, spaces, hyphens, or parentheses."
      );
      return;
    }

    if (!isValidOptionalPhone(draft.claimHelpline)) {
      setError(
        "Claim helpline must contain 7 to 15 digits. You may use +, spaces, hyphens, or parentheses."
      );
      return;
    }
      const policyNumber = draft.policyNumber.trim();

    if (!/^[A-Za-z0-9]{7,17}$/.test(policyNumber)) {
      setError("Policy number must contain 7 to 17 letters or numbers.");
      return;
    }

    const normalizedPolicyNumber = normalizePolicyNumber(policyNumber);

    const duplicatePolicy = policies.some(
      (policy) =>
        policy.id !== editingPolicyId &&
        normalizePolicyNumber(policy.policyNumber) === normalizedPolicyNumber
    );

    if (duplicatePolicy) {
      setError("A policy with this policy number already exists.");
      return;
    }

    const cleanedPolicy = {
      ...draft,
      provider: draft.provider.trim(),
      planName: draft.planName.trim(),
      policyHolderName: draft.policyHolderName.trim(),
      customerCare: draft.customerCare.trim(),
      tpaName: draft.tpaName.trim(),
      claimHelpline: draft.claimHelpline.trim(),
      policyNumberLast4: draft.policyNumberLast4.trim(),
      policyNumber: draft.policyNumber.trim(),
    };

    let updatedPolicies;
    let successMessage;

    if (editMode === "edit") {
      updatedPolicies = policies.map((policy) =>
        policy.id === editingPolicyId
          ? { ...cleanedPolicy, id: editingPolicyId }
          : policy
      );
      successMessage = "Policy updated successfully.";
    } else {
      updatedPolicies = [
        ...policies,
        { ...cleanedPolicy, id: createPolicyId() },
      ];
      successMessage = "Policy added successfully.";
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPolicies));
    } catch {
      setError("This browser could not save the policy details.");
      return;
    }

    setPolicies(updatedPolicies);
    setDraft({ ...EMPTY_POLICY });
    setEditingPolicyId(null);
    setEditMode(null);
    showToast(successMessage);
  };

  const handleDeletePolicy = (policyToDelete) => {
  const confirmed = window.confirm(
    `Delete the policy from ${policyToDelete.provider}?`
  );

  if (!confirmed) {
    return;
  }

  const updatedPolicies = policies.filter(
    (policy) => policy.id !== policyToDelete.id
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPolicies));
  } catch {
    setError("This browser could not delete the policy.");
    return;
  }

  setPolicies(updatedPolicies);

  if (editingPolicyId === policyToDelete.id) {
    setDraft({ ...EMPTY_POLICY });
    setEditingPolicyId(null);
    setEditMode(null);
    setError("");
    setShowPolicyNumber(false);
  }

  showToast("Policy deleted.");
};
  return (
    <main className="health-insurance-page">
      <header className="insurance-page-heading">
        <div>
          <p className="insurance-eyebrow">POLICY DETAILS</p>
          <h1 className="insurance-title">
            Health Insurance
            <FontAwesomeIcon
              icon={faHeartCircleCheck}
              className="insurance-title-icon"
              aria-hidden="true"
            />
          </h1>
          <p className="insurance-subtitle">
            Keep your policy information organized in one place.
          </p>
        </div>
        <div className="policy-counts" aria-label="Policy counts">
          <div className="policy-count-item">
            <span>Total</span>
            <strong>{policyCounts.total}</strong>
          </div>

          <div className="policy-count-item">
            <span>Active</span>
            <strong>{policyCounts.active}</strong>
          </div>

          <div className="policy-count-item">
            <span>Expired</span>
            <strong>{policyCounts.expired}</strong>
          </div>
        </div>
      </header>

        <div className="insurance-notice" role="note">
          <span className="insurance-notice-icon" aria-hidden="true">
            i
          </span>
        <div>
          <strong>Policy details, easy to find</strong>
          <p>
            Details are entered by you. MediLink does not verify policy
            coverage with an insurer.
          </p>
        </div>
      </div>

      {toast && (
        <div className="insurance-toast" role="status" aria-live="polite">
          <FontAwesomeIcon icon={faCircleInfo} />
          <span>{toast}</span>
          <button
            className="insurance-toast-close"
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            title="Dismiss notification"
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="insurance-layout">
        <section
          className="policy-cards-column"
          aria-label="Saved policy summaries"
        >
          {policies.length > 0 ? (
            <div className="policy-cards-grid">
              {policies.map((policy) => {
                const policyStatus = getPolicyStatus(policy.expiryDate);
                const lastFourDigits = policy.policyNumber
                ? normalizePolicyNumber(policy.policyNumber).slice(-4)
                : policy.policyNumberLast4;
              const claimFields = [
              ["TPA", policy.tpaName],
              [
                "Claimed amount",
                policy.claimedAmount !== "" && policy.claimedAmount != null
                  ? formatCoverage(policy.claimedAmount)
                  : "",
              ],
              [
                "Available amount",
                policy.availableAmount !== "" && policy.availableAmount != null
                  ? formatCoverage(policy.availableAmount)
                  : "",
              ],
              ["Policy type", policy.policyType],
              ["24/7 claim helpline", policy.claimHelpline],
            ];

            const hasClaimDetails = claimFields.some(
              ([, value]) => String(value ?? "").trim() !== ""
            );

            const isFlipped = flippedPolicyId === policy.id;
                return (
                  <article className="policy-card-flip-container" key={policy.id}>
                    <div className={`policy-summary-card policy-card-inner${isFlipped ? " is-flipped" : ""}`}>
                      <div className="policy-card-face policy-card-front">
                        <div className="policy-summary-top">
                          <div>
                            <p className="policy-label">INSURANCE PROVIDER</p>
                            <h2>{policy.provider}</h2>
                            <p className="policy-plan-name">{policy.planName}</p>
                          </div>

                          <div className="policy-summary-tools">
                            <span
                              className={`policy-status-badge ${
                                policyStatus === "Expired" ? "is-expired" : "is-active"
                              }`}
                            >
                              {policyStatus}
                            </span>


                          </div>
                        </div>

                        <div className="policy-coverage">
                          <p className="policy-label">TOTAL COVERAGE</p>
                          <strong>{formatCoverage(policy.coverageAmount)}</strong>
                        </div>

                        <dl className="policy-summary-details">
                          <div>
                            <dt>Policy holder</dt>
                            <dd>{policy.policyHolderName || "Not provided"}</dd>
                          </div>

                          <div>
                            <dt>Valid until</dt>
                            <dd>{formatDate(policy.expiryDate)}</dd>
                          </div>

                          {lastFourDigits && (
                            <div className="policy-number-summary">
                              <dt>Policy number</dt>
                              <dd>•••• {lastFourDigits}</dd>
                            </div>
                          )}
                        </dl>

                        <div className="policy-card-actions">
                          {/* Apne existing Edit aur Delete buttons yahin same rakho */}
                          <button
                            className="policy-icon-button"
                            type="button"
                            onClick={() => startEditingPolicy(policy)}
                            aria-label={`Edit ${policy.provider} policy`}
                            title="Edit policy"
                          >
                            <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                          </button>
                          <button
                            className="policy-icon-button"
                            type="button"
                            onClick={() => setFlippedPolicyId(isFlipped ? null : policy.id)}
                            aria-label={`Show claim details for ${policy.provider} policy`}
                            title="Show claim details"
                          >
                            <i className="fa-solid fa-rotate" aria-hidden="true"></i>
                          </button>

                          <button
                            className="policy-icon-button is-danger"
                            type="button"
                            onClick={() => handleDeletePolicy(policy)}
                            aria-label={`Delete ${policy.provider} policy`}
                            title="Delete policy"
                          >
                            <i className="fa-solid fa-trash-can" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>

                      <div className="policy-card-face policy-card-back">
                        <div className="policy-claim-card-heading">
                          <div>
                            <p className="policy-label">POLICY CLAIM INFORMATION</p>
                            <h3>Claim details</h3>
                          </div>

                          <button
                            className="policy-icon-button"
                            type="button"
                            onClick={() => setFlippedPolicyId(null)}
                            aria-label={`Back to ${policy.provider} policy summary`}
                            title="Back to policy summary"
                          >
                            <i className="fa-solid fa-rotate" aria-hidden="true"></i>
                          </button>
                        </div>

                        {hasClaimDetails ? (
                          <dl className="policy-claim-details">
                            {claimFields.map(([label, value]) => (
                              <div key={label}>
                                <dt>{label}</dt>
                                <dd>{value || "Not provided"}</dd>
                              </div>
                            ))}
                          </dl>
                        ) : (
                          <p className="policy-claim-empty">No claim details yet.</p>
                        )}

                        <p className="policy-claim-disclaimer">
                          Details are entered by you and are not verified by MediLink.
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="policy-list-empty">
              <span className="policy-empty-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
              </span>
              <h2>No policy summaries yet</h2>
              <p>Your saved health policies will appear here.</p>
            </div>
          )}
        </section>

        <section className="policy-information-card" ref={policyInformationRef}>
          {editMode ? (
            <>
              <div className="policy-information-heading">
                <div>
                  <p className="insurance-eyebrow">
                    {editMode === "edit" ? "EDIT DETAILS" : "NEW POLICY"}
                  </p>
                  <h2>
                    {editMode === "edit"
                      ? "Update policy information"
                      : "Add policy information"}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSavePolicy}>
                <div className="policy-form-grid">
                  <div className="insurance-form-field">
                    <label htmlFor="policy-provider">Insurance provider</label>
                    <input
                      id="policy-provider"
                      name="provider"
                      type="text"
                      value={draft.provider}
                      onChange={handleFieldChange}
                      placeholder="e.g. Star Health Insurance"
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-plan-name">Plan name</label>
                    <input
                      id="policy-plan-name"
                      name="planName"
                      type="text"
                      value={draft.planName}
                      onChange={handleFieldChange}
                      placeholder="e.g. Standard Health Plan"
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-holder-name">Policy holder</label>
                    <input
                      id="policy-holder-name"
                      name="policyHolderName"
                      type="text"
                      value={draft.policyHolderName}
                      onChange={handleFieldChange}
                      placeholder="Enter policy holder name"
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-coverage">Coverage amount (₹)</label>
                    <input
                      id="policy-coverage"
                      name="coverageAmount"
                      type="number"
                      min="1"
                      step="1"
                      value={draft.coverageAmount}
                      onChange={handleFieldChange}
                      placeholder="e.g. 500000"
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-start-date">Start date</label>
                    <input
                      id="policy-start-date"
                      name="startDate"
                      type="date"
                      value={draft.startDate}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-expiry-date">Expiry date</label>
                    <input
                      id="policy-expiry-date"
                      name="expiryDate"
                      type="date"
                      value={draft.expiryDate}
                      onChange={handleFieldChange}
                      required
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-customer-care">
                      Customer-care number <span className="insurance-field-optional">(optional)</span>
                    </label>
                    <input
                      id="policy-customer-care"
                      name="customerCare"
                      type="tel"
                      inputMode="tel"
                      maxLength={20}
                      value={draft.customerCare}
                      onChange={handleFieldChange}
                      placeholder="Enter customer-care number"
                    />
                  </div>

                  <div className="insurance-form-field">
                    <label htmlFor="policy-number">Policy number</label>

                    <div className="policy-number-input-wrap">
                      <input
                        id="policy-number"
                        name="policyNumber"
                        type={showPolicyNumber ? "text" : "password"}
                        value={draft.policyNumber || ""}
                        onChange={handleFieldChange}
                        autoComplete="off"
                        pattern="[A-Za-z0-9]{7,17}"
                        minLength={7}
                        maxLength={17}
                        title="Enter 7 to 17 letters or numbers"
                        placeholder="Enter policy number"
                        required
                      />

                      <button
                        className="policy-number-toggle"
                        type="button"
                        onClick={() =>
                          setShowPolicyNumber((previousValue) => !previousValue)
                        }
                        aria-label={
                          showPolicyNumber ? "Hide policy number" : "Show policy number"
                        }
                        title={showPolicyNumber ? "Hide policy number" : "Show policy number"}
                      >
                        <FontAwesomeIcon icon={showPolicyNumber ? faEye : faEyeSlash} />
                      </button>
                    </div>
                  </div>
                </div>
                <section
                  className="policy-claim-section"
                  aria-labelledby="claim-details-heading"
                >
                  <div className="policy-claim-heading">
                    <h3 id="claim-details-heading">Claim Details</h3>
                    <p>Optional information from your policy documents.</p>
                  </div>

                  <div className="policy-form-grid">
                    <div className="insurance-form-field">
                      <label htmlFor="policy-tpa">
                        TPA (Third-Party Administrator)
                        <span
                          className="claim-info-icon"
                          title="A TPA may help an insurer administer claims and related services. Check your policy documents for the listed TPA."
                          aria-label="A TPA may help an insurer administer claims and related services."
                          role="img"
                        >
                          <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                        </span>
                        <span className="insurance-field-optional">(optional)</span>
                      </label>
                      <input
                        id="policy-tpa"
                        name="tpaName"
                        type="text"
                        value={draft.tpaName}
                        onChange={handleFieldChange}
                        placeholder="Enter TPA name"
                      />
                    </div>

                    <div className="insurance-form-field">
                      <label htmlFor="policy-claimed-amount">
                        Claimed amount (₹) <span className="insurance-field-optional">(optional)</span>
                      </label>
                      <input
                        id="policy-claimed-amount"
                        name="claimedAmount"
                        type="number"
                        min="0"
                        step="1"
                        value={draft.claimedAmount}
                        onChange={handleFieldChange}
                        placeholder="Enter claimed amount"
                      />
                    </div>

                    <div className="insurance-form-field">
                      <label htmlFor="policy-available-amount">
                        Available amount (₹) <span className="insurance-field-optional">(optional)</span>
                      </label>
                      <input
                        id="policy-available-amount"
                        name="availableAmount"
                        type="number"
                        min="0"
                        step="1"
                        value={draft.availableAmount}
                        onChange={handleFieldChange}
                        placeholder="Enter amount available for future claims"
                      />
                    </div>

                   <div className="insurance-form-field">
                      <label htmlFor="policy-type">
                        Policy type <span className="insurance-field-optional">(optional)</span>
                      </label>

                      <select
                        id="policy-type"
                        name="policyType"
                        value={draft.policyType}
                        onChange={handleFieldChange}
                      >
                        <option value="">Select policy type</option>
                        <option value="Individual">Individual</option>
                        <option value="Family Floater">Family Floater</option>
                        <option value="Group">Group</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="insurance-form-field">
                      <label htmlFor="policy-claim-helpline">
                        24/7 claim helpline number <span className="insurance-field-optional">(optional)</span>
                      </label>
                      <input
                        id="policy-claim-helpline"
                        name="claimHelpline"
                        type="tel"
                        inputMode="tel"
                        maxLength={20}
                        value={draft.claimHelpline}
                        onChange={handleFieldChange}
                        placeholder="Enter claim helpline number"
                      />
                    </div>
                  </div>
                </section>

                {error && (
                  <p className="insurance-error" role="alert">
                    {error}
                  </p>
                )}

                <p className="insurance-storage-note">
                 Enter policy details for your reference.
                </p>

                <div className="policy-form-actions">
                  <button
                    className="insurance-secondary-button"
                    type="button"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>

                  <button className="insurance-primary-button" type="submit">
                    {editMode === "edit" ? "Update Changes" : "Save Policy"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            policies.length === 0 ? (
              <div className="policy-information-empty">
                <span className="policy-empty-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFileShield} aria-hidden="true" />
                </span>

                <p className="insurance-eyebrow">POLICY INFORMATION</p>
                <h2>No policies added</h2>
                <p>Keep your policy details in one place. Add a policy to view its coverage, validity, and claim support here.</p>

                <button
                  className="insurance-primary-button"
                  type="button"
                  onClick={startAddingPolicy}
                >
                  + Add Policy
                </button>

              </div>
            ) : (
              <div className="policy-information-heading">
                <div>
                  <p className="insurance-eyebrow">POLICY INFORMATION</p>
                  <h2>Manage your policy details</h2>
                  <p>Select “Add Policy” to save another policy details.</p>
                </div>

                <button
                  className="insurance-primary-button"
                  type="button"
                  onClick={startAddingPolicy}
                >
                  + Add Policy
                </button>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
};

export default HealthInsurance;