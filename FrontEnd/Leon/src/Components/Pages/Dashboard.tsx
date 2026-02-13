import { useEffect, useState } from "react";
import "../../App.css";
import "../../Style/styles.css";
import type GetTickets from "../../Interfaces/GetTickets.model";
import { Link, useNavigate } from "react-router-dom";
import type UserDetails from "../../Interfaces/UserDetails.model";
import CreateTicket from "../ComponetnsParts.tsx/CreateTicket";

function Dashboard() {
  // HOOK PER LA NAVIGAZIONE
  const navigate = useNavigate();

  // STATE PER GESTIRE LA SEZIONE ATTIVA
  const [activeSection, setActiveSection] = useState<
    "ProfileInfo" | "TicketsList" | "CreateTicket" | "Stats"
  >("TicketsList");

  // STATE PER I TICKET
  const [tickets, setTickets] = useState<GetTickets[] | null>(null);

  // STATE PER IL FILTRO STATUS
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // STATE PER LA PAGINAZIONE
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // NUMBER OF ITEMS PER PAGE

  //STATE PER USER DETAILS
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // RECUPERA TOKEN E ROLE DAL LOCALSTORAGE
  const token = localStorage.getItem("token");

  //RECUPERO ROLE
  const role = localStorage.getItem("role");

  //VERIFICO SE ADMIN
  const isAdmin = role === "Admin";

  // EFFETTUA IL FETCH DEI TICKET ALL'AVVIO DEL COMPONENTE E QUANDO LA PAGINA DIVENTA VISIBILE
  useEffect(() => {
    const fetchTickets = () => {
      if (!token) {
        navigate("/Login");
        return;
      }

      fetch(import.meta.env.VITE_API_URL + "/api/Tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (response.status === 401) {
            // Unauthorized
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/Login");
            throw new Error("Unauthorized");
          }
          if (!response.ok) throw new Error("Error fetching tickets");
          return response.json();
        })
        .then((data) => {
          setTickets(data.reverse()); // MOSTRA I TICKET PIÙ RECENTI PER PRIMI
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchTickets(); // Fetch on initial load

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTickets(); // Re-fetch when tab becomes active
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, navigate]);

  //FETCH DEI DETTAGLI UTENTE PER LA SEZIONE PROFILE INFO
  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return;
    }

    fetch(import.meta.env.VITE_API_URL + "/api/Auth/User-Details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error fetching user details");
        return response.json();
      })
      .then((data) => {
        console.log("User Details:", data);
        setUserDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        if (String(error).toLowerCase().includes("401")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/Login");
        }
      });
  }, [token, navigate]);

  // FILTRA I TICKET IN BASE ALLO STATUS SELEZIONATO
  const filteredTickets = selectedStatus
    ? tickets?.filter((ticket) => ticket.status === selectedStatus)
    : tickets;

  // CALCOLA LA PAGINAZIONE SUI TICKET FILTRATI
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets =
    filteredTickets?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = filteredTickets
    ? Math.ceil(filteredTickets.length / itemsPerPage)
    : 0;

  // CAMBIA PAGINA
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log("Changed to page:", pageNumber);
  };

  // GESTISCE IL CAMBIO DI FILTRO
  const handleFilterChange = (status: string | null) => {
    setSelectedStatus(status);
    setCurrentPage(1); // RESET ALLA PRIMA PAGINA QUANDO SI CAMBIA FILTRO
    console.log("Filter changed to:", status || "All");
  };

  //COUNTER PER I TICKET IN BASE ALLO STATUS

  const counts = {
    Open: tickets?.filter((t) => t.status === "Open").length || 0,
    InProgress: tickets?.filter((t) => t.status === "InProgress").length || 0,
    WaitingDepartment:
      tickets?.filter((t) => t.status === "WaitingDepartment").length || 0,
    Resolved: tickets?.filter((t) => t.status === "Resolved").length || 0,
    Closed: tickets?.filter((t) => t.status === "Closed").length || 0,
    Rejected: tickets?.filter((t) => t.status === "Rejected").length || 0,
  };

  const colors: Record<string, string> = {
    Open: "#2ecc71",
    InProgress: "#f1c40f",
    WaitingDepartment: "#9b59b6",
    Resolved: "#3498db",
    Closed: "#95a5a6",
    Rejected: "#e74c3c",
  };
  const pieBg = buildConicGradient(counts, colors);

  function buildConicGradient(
    countsObj: Record<string, number>,
    colorMap: Record<string, string>,
  ) {
    const total = Object.values(countsObj).reduce((a, b) => a + b, 0);

    // if there are no tickets -> empty circle
    if (total === 0) return "conic-gradient(#ecf0f1 0% 100%)";

    let start = 0;
    const parts: string[] = [];

    for (const [status, value] of Object.entries(countsObj)) {
      if (value <= 0) continue;

      const pct = (value / total) * 100;
      const end = start + pct;
      const color = colorMap[status] ?? "#bdc3c7";

      // e.g., "#2ecc71 0% 40%"
      parts.push(`${color} ${start}% ${end}%`);
      start = end;
    }

    // if rounding leaves a small gap, close it
    if (start < 100) parts.push(`#ecf0f1 ${start}% 100%`);

    return `conic-gradient(${parts.join(", ")})`;
  }

  return (
    <div className="dashboard-container">
      {tickets ? (
        <div className="dashboard-layout">
          {/*SIDEBAR*/}
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

            <nav className="sidebar-nav">
              <button
                className={`nav-item ${activeSection === "TicketsList" ? "active" : ""}`}
                onClick={() => setActiveSection("TicketsList")}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
                <span>Dashboard</span>
              </button>

              <button
                className={`nav-item ${activeSection === "ProfileInfo" ? "active" : ""}`}
                onClick={() => setActiveSection("ProfileInfo")}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                <span>Profile Info</span>
              </button>

              <button
                className={`nav-item ${activeSection === "Stats" ? "active" : ""}`}
                onClick={() => setActiveSection("Stats")}
              >
                <svg
                  viewBox="0 0 200 200"
                  width="220"
                  height="220"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer circle*/}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#fff"
                    stroke-width="4"
                  />

                  {/* Dividing lines (spokes) */}
                  {/* Center to top */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="10"
                    stroke="#fff"
                    stroke-width="4"
                    stroke-linecap="round"
                  />

                  {/* Center to ~30 degrees */}
                  <line
                    x1="100"
                    y1="100"
                    x2="177.94"
                    y2="55"
                    stroke="#fff"
                    stroke-width="4"
                    stroke-linecap="round"
                  />

                  {/* Center to ~240 degrees */}
                  <line
                    x1="100"
                    y1="100"
                    x2="55"
                    y2="177.94"
                    stroke="#fff"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </svg>
                <span>Stats</span>
              </button>

              <button
                className={`nav-item nav-item-create ${activeSection === "CreateTicket" ? "active" : ""}`}
                onClick={() => setActiveSection("CreateTicket")}
              >
                <div className="create-btn-background">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <span>Create Ticket</span>
                </div>
              </button>

              {isAdmin ? (
                <Link className="nav-item nav-item-admin" to="/UserManager">
                  <div className="admin-btn-background">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                    </svg>
                    <span>User Manager</span>
                  </div>
                </Link>
              ) : (
                <Link
                  className="nav-item nav-item-create"
                  to="/ChatSystem"
                  target="_blank"
                >
                  <div className="phone-btn-background">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                    </svg>
                    <span>Chat System</span>
                  </div>
                </Link>
              )}
            </nav>
          </aside>

          {/*MAIN CONTENT*/}
          <main className="dashboard-main">
            {/*TICKETS LIST*/}

            {activeSection === "TicketsList" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Ticket Management</h2>
                </div>

                {/*TICKETS TABLE*/}
                <div className="tickets-table-container">
                  <div className="table-header">
                    <div className="table-filters">
                      <button
                        className={`filter-btn ${selectedStatus === null ? "active" : ""}`}
                        onClick={() => handleFilterChange(null)}
                      >
                        All
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "Open" ? "active" : ""}`}
                        onClick={() => handleFilterChange("Open")}
                      >
                        Open
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "InProgress" ? "active" : ""}`}
                        onClick={() => handleFilterChange("InProgress")}
                      >
                        In Progress
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "WaitingDepartment" ? "active" : ""}`}
                        onClick={() => handleFilterChange("WaitingDepartment")}
                      >
                        WaitingDepartment
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "Resolved" ? "active" : ""}`}
                        onClick={() => handleFilterChange("Resolved")}
                      >
                        Resolved
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "Closed" ? "active" : ""}`}
                        onClick={() => handleFilterChange("Closed")}
                      >
                        Closed
                      </button>
                      <button
                        className={`filter-btn ${selectedStatus === "Rejected" ? "active" : ""}`}
                        onClick={() => handleFilterChange("Rejected")}
                      >
                        Rejected
                      </button>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="tickets-table">
                      <thead>
                        <tr>
                          <th>Ticket</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Customer</th>
                          <th>Assigned Agent</th>
                          <th>Date Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTickets.length > 0 ? (
                          currentTickets.map((ticket) => (
                            <tr key={ticket.id}>
                              <td>
                                <div className="ticket-info">
                                  <span className="ticket-id">
                                    #{ticket.id}
                                  </span>
                                  <span className="ticket-desc">
                                    {ticket.description}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`status-badge status-${ticket.status.toLowerCase()}`}
                                >
                                  {ticket.status}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`priority-badge priority-${ticket.priority?.toLowerCase()}`}
                                >
                                  {ticket.priority}
                                </span>
                              </td>
                              <td>{ticket.customerName || "N/A"}</td>
                              <td>
                                <div className="agent-info">
                                  <div className="agent-avatar">
                                    {ticket.assignedAgent
                                      ? ticket.assignedAgent
                                          .charAt(0)
                                          .toUpperCase()
                                      : "?"}
                                  </div>
                                  <span>
                                    {ticket.assignedAgent || "Unassigned"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                {ticket.createdAt
                                  ? new Date(
                                      ticket.createdAt,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td>
                                <Link
                                  className="action-btn"
                                  to={`/update-ticket/${ticket.id}`}
                                >
                                  Manage
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No tickets found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/*PAGINATION*/}
                  {filteredTickets && filteredTickets.length > 0 && (
                    <div className="table-pagination">
                      <div className="pagination-info">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, filteredTickets.length)} of{" "}
                        {filteredTickets.length} entries
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="pagination-btn"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
                            onClick={() => paginate(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          className="pagination-btn"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/*PROFILE INFO*/}

            {activeSection === "ProfileInfo" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                </div>

                <div className="profile-content">
                  {userDetails ? (
                    <div className="profile-main-card">
                      <div className="profile-header-section">
                        <div className="profile-avatar">
                          {userDetails.fullName
                            ? userDetails.fullName.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <h3 className="profile-name">{userDetails.fullName}</h3>
                        <p className="profile-role">
                          {userDetails.role || "N/A"}
                        </p>
                      </div>

                      <div className="profile-details-grid">
                        <div className="profile-detail-item">
                          <label>Email</label>
                          <p>{userDetails.email}</p>
                        </div>
                        <div className="profile-detail-item">
                          <label>Phone Number</label>
                          <p>{userDetails.phoneNumber}</p>
                        </div>
                        <div className="profile-detail-item">
                          <label>Department</label>
                          <p>{userDetails.agentType}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Loading profile...</p>
                  )}
                </div>
              </div>
            )}

            {/*STATS SECTION*/}

            {activeSection === "Stats" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Statistics</h2>
                </div>

                <div className="stats-content">
                  <div className="stats-chart-area">
                    {/* DONUT CHART */}
                    <div className="stats-chart-wrapper">
                      <div className="pie-chart" style={{ background: pieBg }}>
                        <div className="pie-chart-inner">
                          <span className="pie-chart-total">
                            {tickets?.length ?? 0}
                          </span>
                          <span className="pie-chart-label">Tickets</span>
                        </div>
                      </div>
                    </div>

                    {/* LEGEND */}
                    <div className="stats-legend">
                      {Object.entries(counts).map(([status, count]) => (
                        <div className="legend-item" key={status}>
                          <div
                            className="legend-dot"
                            style={{ backgroundColor: colors[status] }}
                          />
                          <div className="legend-info">
                            <span className="legend-status">
                              {status === "WaitingDepartment"
                                ? "Waiting Dept."
                                : status}
                            </span>
                            <span className="legend-count">
                              {count} ticket{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <span className="legend-pct">
                            {tickets?.length
                              ? Math.round((count / tickets.length) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/*CREATE TICKET SECTION*/}

            {activeSection === "CreateTicket" && (
              <div className="content-section">
                <div className="create-ticket-content">
                  <CreateTicket />
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="loading-container">
          <p>Loading tickets...</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
