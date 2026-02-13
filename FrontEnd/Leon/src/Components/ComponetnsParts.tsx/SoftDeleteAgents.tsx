import { useState } from "react";
import SuccessPopup from "./SuccessPopup"; // Import SuccessPopup

export default function SoftDeleteAgents() {
  const [emailToDelete, setEmailToDelete] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message

  const token = localStorage.getItem("token");

  const handleSoftDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPopupMessage("");
    setShowSuccessPopup(false);

    if (!emailToDelete) {
      setError("Please enter an email address.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/Auth/soft-delete-user/${emailToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Soft delete failed");
        }
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then(() => {
        setPopupMessage(
          `User ${emailToDelete} has been soft deleted. The page will refresh soon.`,
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
        console.error("Error during soft delete:", err);
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
      <form onSubmit={handleSoftDelete}>
        <div className="mb-3">
          <input
            id="emailToDelete"
            type="email"
            className="form-control"
            placeholder="Enter agent email to delete"
            value={emailToDelete}
            onChange={(e) => setEmailToDelete(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">
          Soft Delete Agent
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
