import { useNavigate, useParams } from "react-router-dom";
import "../../../src/App.css";
import "../../../src/Style/styles.css";
import { useEffect, useState } from "react";
import type GetTicketsModel from "../../Interfaces/GetTickets.model";

export default function TicketNotes() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [noteContent, setNoteContent] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<GetTicketsModel | null>(
    null,
  );

  useEffect(() => {
    if (!ticketId || !token) {
      navigate("/Dashboard");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/Dashboard");
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch ticket details");
        }
        return res.json();
      })
      .then((data: GetTicketsModel) => {
        setTicketDetails(data);
        setNoteContent(data.ticketNoteContent || "No notes for this ticket.");
      })
      .catch((err) => console.error(err));
  }, [ticketId, token, navigate]);

  if (!ticketDetails) {
    return (
      <div className="loading-container">
        <p>Loading ticket notes...</p>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Ticket #{ticketId} Details & Notes</h2>
      </div>
      <div className="profile-content">
        <div className="update-form-grid">
          {/* Integrated Notes Section */}

          <div>
            <label
              className="notes-header"
              style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
            >
              Customer Notes:
            </label>
            <div className="notes-content-integrated">{noteContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
