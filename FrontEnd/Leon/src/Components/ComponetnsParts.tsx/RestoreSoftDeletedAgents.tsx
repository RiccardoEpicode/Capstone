import { useState } from "react";
import SuccessPopup from "./SuccessPopup"; // Import SuccessPopup

export default function RestoreSoftDeletedAgents() {
  const [emailToRestore, setEmailToRestore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  const token = localStorage.getItem("token");

  const handleRestore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPopupMessage("");
    setShowSuccessPopup(false);

    if (!emailToRestore) {
      setError("Please enter an email address to restore.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/Auth/restore-user/${emailToRestore}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Restore failed");
        }
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then(() => {
        setPopupMessage(
          `User ${emailToRestore} has been restored. The page will refresh soon.`,
        );
        setShowSuccessPopup(true);
        setEmailToRestore("");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
        setPopupMessage("");
        setShowSuccessPopup(false);
        console.error("Error during restore:", err);
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
      <form onSubmit={handleRestore}>
        <div className="mb-3">
          <input
            id="emailToRestore"
            type="email"
            className="form-control"
            placeholder="Enter agent email to restore"
            value={emailToRestore}
            onChange={(e) => setEmailToRestore(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Restore Agent
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
