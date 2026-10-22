import QRCode from "react-qr-code";
import { useLocation, Link } from "react-router-dom";

const EmergencyHealthID = () => {
  const handleDownloadQR = () => {
    const svg = document.querySelector(".qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = "Emergency-Health-ID-QR.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };
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
          <Link to="/profile">
            <i className="fa-solid fa-link"></i>
            Linked to your secure Health Profile
          </Link>
        </p>
      </div>
      <div className="qr-buttons">
        <button type="button" onClick={handleDownloadQR}>
          <i class="fa-solid fa-circle-arrow-down"></i> Download QR Code
        </button>
        <button
          type="button"
          onClick={() => window.open("/emergency-id?print=true", "_blank")}
        >
          <i class="fa-solid fa-print"></i> Print ID
        </button>
      </div>
    </div>
  );
};

export default EmergencyHealthID;
