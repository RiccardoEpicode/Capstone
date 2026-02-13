import { useState } from "react";
import SuccessPopup from "./SuccessPopup"; // Import SuccessPopup

export default function HardDeleteAgents() {
  const [emailToDelete, setEmailToDelete] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  const token = localStorage.getItem("token");

  const handleHardDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPopupMessage("");
    setShowSuccessPopup(false);

    if (!emailToDelete) {
      setError("Please enter an email address to permanently delete.");
      return;
    }

    // AGGIUNGO UNA CONFERMA PER UN'AZIONE COSÌ DISTRUTTIVA
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the agent with email: ${emailToDelete}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/Auth/hard-delete-user/${emailToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Hard delete failed");
        }
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then(() => {
        setPopupMessage(
          `User ${emailToDelete} has been permanently deleted. The page will refresh soon.`,
        );
        setShowSuccessPopup(true);
        setEmailToDelete("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
        setPopupMessage("");
        setShowSuccessPopup(false);
        console.error("Error during hard delete:", err);
      });
  };

  return (
    <div className="container mt-2">
      {showSuccessPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="alert alert-danger">
        <strong>Warning:</strong> This action is irreversible. The agent's data
        will be permanently removed from the system.
      </div>
      <form onSubmit={handleHardDelete}>
        <div className="mb-3">
          <label htmlFor="emailToDelete" className="form-label">
            Agent Email
          </label>
          <input
            id="emailToDelete"
            type="email"
            className="form-control"
            placeholder="Enter agent email to permanently delete"
            value={emailToDelete}
            onChange={(e) => setEmailToDelete(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">
          Hard Delete Agent
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
