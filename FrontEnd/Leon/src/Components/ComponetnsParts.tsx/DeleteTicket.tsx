import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type GetTicketsModel from "../../Interfaces/GetTickets.model";
import "../../App.css";
import "../../Style/styles.css";
import SuccessPopup from "./SuccessPopup"; // Import the new component

export default function DeleteTicket() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Stati per la gestione del componente
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<GetTicketsModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility

  // Caricamento dei dati del ticket
  useEffect(() => {
    if (!ticketId || !token) {
      navigate("/Dashboard");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/Dashboard");
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Ticket not found");
        }
        return res.json();
      })
      .then((data: GetTicketsModel) => {
        setTicket(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        // It will stop the loading state in both success and error cases and this is needed because if an error occurs we want to show the error message instead of the loading indicator.
        setLoading(false);
      });
  }, [ticketId, token, navigate]);

  // Gestione dell'aggiornamento del ticket
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Chiamata per cancellare il ticket
    fetch(`${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/Dashboard");
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to delete ticket");
        }
        setSuccess(
          "Ticket successfully deleted. You will be redirected to the dashboard soon.",
        );
        setShowSuccessPopup(true); // Show popup on success
        // Optional: redirect after a few seconds
        setTimeout(() => {
          navigate("/Dashboard");
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading ticket...</p>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="loading-container">
        <p>Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="content-section">
      {showSuccessPopup && (
        <SuccessPopup
          message={success || ""}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="section-header">
        <h2>Delete Ticket #{ticketId}</h2>
      </div>
      <div className="profile-content">
        {error && <p className="error-message">Error: {error}</p>}
        {ticket && (
          <form onSubmit={handleUpdate} className="delete-card-container">
            <div className="alert alert-danger">
              <strong>Warning:</strong> This action is irreversible! Are you
              sure you want to delete ticket #<strong>{ticket.id}</strong>?
            </div>{" "}
            <div className="delete-form-actions">
              <button type="submit" className="delete-button">
                Delete Permanently
              </button>
              <Link to="/Dashboard" className="cancel-button">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
