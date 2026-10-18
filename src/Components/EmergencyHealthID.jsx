import React from "react";
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import EmergencyHealthPage from "./EmergencyHealthPage";
const EmergencyHealthID = () => {
  return (
    <div className="EmergencyHealthID">
      <div className="header-id">
        <h1>Your Emergency Health ID</h1>
      </div>
      <div className="qr-code">
        <QRCode size={180} value={`${window.location.origin}/emergency-id`} />
      </div>
      <div className="qr-info">
        <p>Scan this QR Code to view your Emergency Health ID</p>
      </div>
      <div className="qr-link">
        <p>
          <i class="fa-solid fa-link"></i> Linked to your secure Health Profile
        </p>
      </div>
      <div className="qr-buttons">
        <button type="button">
          <i class="fa-solid fa-circle-arrow-down"></i> Download QR Code
        </button>
        <button type="button">
          <i class="fa-solid fa-print"></i> Print ID
        </button>
      </div>
    </div>
  );
};

export default EmergencyHealthID;
