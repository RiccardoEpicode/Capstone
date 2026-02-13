import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type GetTicketsModel from "../../Interfaces/GetTickets.model";
import type UserDetails from "../../Interfaces/UserDetails.model";
import "../../App.css";
import "../../Style/styles.css";
import DeleteTicket from "../ComponetnsParts.tsx/DeleteTicket";
import TicketNotes from "../ComponetnsParts.tsx/TicketNotes";
import SuccessPopup from "../ComponetnsParts.tsx/SuccessPopup";

export default function UpdateTicket() {
  // PARAMETRI E VARIABILI DI NAVIGAZIONE DALLA URL E DALLO STORAGE LOCALE
  const { ticketId } = useParams<{ ticketId: string }>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const allUsersApiUrl = import.meta.env.VITE_API_URL + "/api/Auth/all-users";

  // STATI PER LA GESTIONE DEL COMPONENTE
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<GetTicketsModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // STATI PER LA GESTIONE DEGLI AGENTI E DEL LORO CARICAMENTO
  const [availableAgents, setAvailableAgents] = useState<UserDetails[] | null>(
    null,
  );
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [priorities, setPriorities] = useState<string[]>([]);

  const [activeSection, setActiveSection] = useState<
    "UpdateTicket" | "DeleteTicket" | "TicketNotes"
  >("TicketNotes");

  // STATI PER I CAMPI DEL FORM
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [targetDepartment, setTargetDepartment] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [status, setStatus] = useState<string>("");
  const [ticketNoteContent, setTicketNoteContent] = useState<string | null>(
    null,
  );

  // CARICAMENTO DEI DATI DEL TICKET
  useEffect(() => {
    if (!ticketId || !token) {
      navigate("/Dashboard");
      return;
    }

    const fetchTicketAndAgentsAndPriorities = async () => {
      try {
        // Fetch ticket details
        const ticketRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (ticketRes.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/Dashboard");
          throw new Error("Unauthorized");
        }
        if (!ticketRes.ok) {
          throw new Error("Ticket not found");
        }
        const ticketData: GetTicketsModel = await ticketRes.json();

        // Fetch agents
        const agentsRes = await fetch(allUsersApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!agentsRes.ok) {
          throw new Error(`Failed to fetch agents: ${agentsRes.statusText}`);
        }
        const agentsData: UserDetails[] = await agentsRes.json();
        setAvailableAgents(agentsData);

        // Fetch priorities
        const prioritiesRes = await fetch(
          import.meta.env.VITE_API_URL + "/api/Enums/priorities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!prioritiesRes.ok) {
          throw new Error(
            `Failed to fetch priorities: ${prioritiesRes.statusText}`,
          );
        }
        const prioritiesData: string[] = await prioritiesRes.json();
        setPriorities(prioritiesData);

        setTicket(ticketData);
        setTitle(ticketData.title);
        setDescription(ticketData.description);
        setTicketNoteContent(ticketData.ticketNoteContent || null);
        setTargetDepartment(ticketData.targetDepartment);
        setStatus(ticketData.status);
        setPriority(ticketData.priority || "");

        // Set assigned agent ID based on fetched name
        const assignedAgentObj = agentsData.find(
          (agent) => agent.fullName === ticketData.assignedAgent,
        );
        setAssignedAgent(assignedAgentObj?.id || "");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
        setLoadingAgents(false);
      }
    };

    fetchTicketAndAgentsAndPriorities();
  }, [ticketId, token, navigate, allUsersApiUrl]);

  // GESTIONE DELL'AGGIORNAMENTO DEL TICKET
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // DATI INVIATI PER L'AGGIORNAMENTO
    const updatePayload = {
      title,
      description,
      priority,
      targetDepartment,
      AssignedAgent: assignedAgent,
    };

    // CHIAMATA PER AGGIORNARE I DATI DEL TICKET
    fetch(`${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePayload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to update ticket");
        }
        // CHIAMATA PER AGGIORNARE LO STATO
        return fetch(
          `${import.meta.env.VITE_API_URL}/api/Tickets/${ticketId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newStatus: status }),
          },
        );
      })
      .then(async (statusRes) => {
        if (!statusRes.ok) {
          const errorText = await statusRes.text();
          throw new Error(errorText || "Failed to update status");
        }
        setSuccess(
          "Ticket and status updated successfully! You will be redirected to the dashboard soon.",
        );
        setShowSuccessPopup(true);
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
    <div className="dashboard-container">
      {showSuccessPopup && (
        <SuccessPopup
          message={success || ""}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo-section">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="logo-icon"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <span className="logo-text">Leon</span>
            </div>
          </div>

          {/*BARRA DI NAVIGAZIONE LATERALE*/}

          <nav className="sidebar-nav">
            {/*BOTTONE PER VEDERE LE NOTE DEL TICKET*/}

            <button
              className={`nav-item ${activeSection === "TicketNotes" ? "active" : ""}`}
              onClick={() => setActiveSection("TicketNotes")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span>View Ticket Notes</span>
            </button>

            {/*BOTTONE PER AGGIORNARE IL TICKET*/}

            <button
              className={`nav-item ${activeSection === "UpdateTicket" ? "active" : ""}`}
              onClick={() => setActiveSection("UpdateTicket")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span>Update Ticket</span>
            </button>

            {/*BOTTONE PER ELIMINARE IL TICKET*/}

            <button
              className={`nav-item ${activeSection === "DeleteTicket" ? "active" : ""}`}
              onClick={() => setActiveSection("DeleteTicket")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span>Delete Ticket</span>
            </button>

            <Link className="nav-item nav-item-admin" to="/Dashboard">
              <div className="admin-btn-background">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
                <span>Back to Dashboard</span>
              </div>
            </Link>
          </nav>
        </aside>

        {/*CONTENUTO PRINCIPALE DOVE SI VISUALIZZA IL TICKET*/}

        <main className="dashboard-main">
          {activeSection === "TicketNotes" && <TicketNotes />}
          {activeSection === "UpdateTicket" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Update Ticket #{ticket?.id}</h2>
              </div>
              <div className="profile-content">
                {error && (
                  <p
                    className="text-danger"
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                    }}
                  >
                    {error}
                  </p>
                )}

                <form onSubmit={handleUpdate}>
                  <div className="update-form-grid">
                    <div className="update-form-group full-width">
                      <label>Title</label>
                      <input
                        className="update-form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="update-form-group full-width">
                      <label>Description</label>
                      <textarea
                        className="update-form-input"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="update-form-group full-width">
                      <label>Notes</label>
                      <textarea
                        className="update-form-input"
                        rows={5}
                        value={ticketNoteContent || ""}
                        onChange={(e) => setTicketNoteContent(e.target.value)}
                      />
                    </div>
                    <div className="update-form-group">
                      <label>Priority</label>
                      <select
                        className="update-form-input"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="">Select Priority</option>
                        {priorities.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="update-form-group">
                      <label>Target Department</label>
                      <input
                        className="update-form-input"
                        value={targetDepartment}
                        onChange={(e) => setTargetDepartment(e.target.value)}
                      />
                    </div>
                    <div className="update-form-group">
                      <label htmlFor="assignedAgent" className="form-label">
                        Assigned Agent
                      </label>
                      {loadingAgents ? (
                        <p>Loading Agents...</p>
                      ) : (
                        <select
                          id="assignedAgent"
                          name="assignedAgent"
                          className="update-form-input"
                          value={assignedAgent}
                          onChange={(e) => setAssignedAgent(e.target.value)}
                        >
                          <option value="">Select Agent</option>
                          {availableAgents &&
                            availableAgents.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.fullName} - {agent.agentType}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>
                    <div className="update-form-group">
                      <label>Status</label>
                      <select
                        className="update-form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="WaitingDepartment">
                          Waiting Department
                        </option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
                      <button type="submit" className="update-form-button">
                        Update Ticket & Status
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeSection === "DeleteTicket" && <DeleteTicket />}
        </main>
      </div>
    </div>
  );
}
