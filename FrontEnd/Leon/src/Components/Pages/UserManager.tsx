import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { translateErrorMessage } from "../../Utils/errorTranslations";
import "../../Style/styles.css";
import ListOfAgents from "../ComponetnsParts.tsx/ListOfAgents";
import UpdateAgents from "../ComponetnsParts.tsx/UpdateAgents";
import SoftDeleteAgents from "../ComponetnsParts.tsx/SoftDeleteAgents";
import ListOfDeletedAgents from "../ComponetnsParts.tsx/ListOfDeletedAgents";
import RestoreSoftDeletedAgents from "../ComponetnsParts.tsx/RestoreSoftDeletedAgents";
import HardDeleteAgents from "../ComponetnsParts.tsx/HardDeleteAgents";
import SuccessPopup from "../ComponetnsParts.tsx/SuccessPopup"; // Import SuccessPopup

export default function UserManager() {
  // STATO PER LA SEZIONE ATTIVA
  const [activeSection, setActiveSection] = useState("list");

  // STATI PER I CAMPI DEL FORM DI REGISTRAZIONE
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [agentType, setAgentType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // STATI PER MESSAGGI DI ERRORE E SUCCESSO (per il popup)
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // PRENDE IL TOKEN DAL LOCAL STORAGE
  const token = localStorage.getItem("token");

  // URL API
  const registerApiUrl = import.meta.env.VITE_API_URL + "/api/Auth/Register";
  const rolesApiUrl = import.meta.env.VITE_API_URL + "/api/Auth/roles";
  const departmentsApiUrl = import.meta.env.VITE_API_URL + "/api/Enums/departments";

  // STATI PER RUOLI E DIPARTIMENTI
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    [],
  );

  // Carica ruoli e dipartimenti all'avvio
  useEffect(() => {
    const fetchRolesAndDepartments = async () => {
      if (!token) return;
      try {
        const rolesRes = await fetch(rolesApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rolesData = await rolesRes.json();
        setAvailableRoles(rolesData);

        const departmentsRes = await fetch(departmentsApiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const departmentsData = await departmentsRes.json();
        setAvailableDepartments(departmentsData);
      } catch (err) {
        console.error("Error fetching roles or departments:", err);
      }
    };
    fetchRolesAndDepartments();
  }, [token, rolesApiUrl, departmentsApiUrl]);

  // HANDLE AGENT REGISTRATION
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // PULISCE I MESSAGGI DI ERRORE PRECEDENTI

    fetch(registerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullname: fullname,
        email: email,
        password: password,
        role: role,
        agentType: agentType,
        phoneNumber: phoneNumber,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          let errorMessage = errorData.message || "Registration failed";

          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += ": " + errorData.errors.join(", ");
          } else if (errorData.errors && typeof errorData.errors === "object") {
            const errorMessages = Object.values(errorData.errors)
              .flat()
              .join(", ");
            if (errorMessages) {
              errorMessage += ": " + errorMessages;
            }
          }

          throw new Error(errorMessage);
        }

        // REGISTRAZIONE RIUSCITA - RESET FORM E MOSTRA POPUP DI SUCCESSO
        setFullname("");
        setEmail("");
        setPassword("");
        setRole("");
        setAgentType("");
        setPhoneNumber("");
        setError("");
        setPopupMessage(
          "Agent registered successfully! You will be redirected to the list of agents soon.",
        );
        setShowSuccessPopup(true);

        // AUTO-NAVIGA ALLA LISTA AGENTI DOPO 2 SECONDI (DOPO IL POPUP)
        setTimeout(() => {
          setActiveSection("list");
          setShowSuccessPopup(false);
        }, 2000);
      })
      .catch((error) => {
        const errorMessage =
          error.message || "Registration failed. Please try again.";
        const translatedError = translateErrorMessage(errorMessage);
        setError(translatedError);
      });
  };

  return (
    <div className="dashboard-container">
      {showSuccessPopup && (
        <SuccessPopup
          message={popupMessage}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="dashboard-layout">
        {/* SIDEBAR */}
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
              className={`nav-item ${activeSection === "list" ? "active" : ""}`}
              onClick={() => setActiveSection("list")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
              </svg>
              <span>List of Agents</span>
            </button>

            <button
              className={`nav-item ${activeSection === "register" ? "active" : ""}`}
              onClick={() => setActiveSection("register")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5Z"
                />
              </svg>
              <span>Register Agents</span>
            </button>

            <button
              className={`nav-item ${activeSection === "update" ? "active" : ""}`}
              onClick={() => setActiveSection("update")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
              <span>Update Agents</span>
            </button>

            <button
              className={`nav-item ${activeSection === "DeleteAgentsFromList" ? "active" : ""}`}
              onClick={() => setActiveSection("DeleteAgentsFromList")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span>Delete Agents From List</span>
            </button>

            <button
              className={`nav-item ${activeSection === "ListOfDeletedAgents" ? "active" : ""}`}
              onClick={() => setActiveSection("ListOfDeletedAgents")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span>List of Deleted Agents</span>
            </button>

            <button
              className={`nav-item ${activeSection === "restore" ? "active" : ""}`}
              onClick={() => setActiveSection("restore")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span>Restore Deleted Agents</span>
            </button>

            <button
              className={`nav-item ${activeSection === "DeletedAgentsPermanently" ? "active" : ""}`}
              onClick={() => setActiveSection("DeletedAgentsPermanently")}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span>Delete Agents Permanently</span>
            </button>

            <div className="sidebar-divider"></div>

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

        {/* CONTENUTO PRINCIPALE */}
        <main className="dashboard-main">
          {/* SEZIONE LISTA */}
          {activeSection === "list" && (
            <div className="content-section">
              <div className="section-header">
                <h2>List of Agents</h2>
              </div>
              <div className="profile-content">
                <ListOfAgents />
              </div>
            </div>
          )}

          {/* SEZIONE REGISTRAZIONE */}
          {activeSection === "register" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Register New Agent</h2>
              </div>

              <div className="profile-content">
                <div className="profile-card" style={{ width: "100%" }}>
                  {error && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>Error:</strong> {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                      ></button>
                    </div>
                  )}

                  {/* Remove existing success message display */}

                  <form onSubmit={handleRegister}>
                    <div className="profile-row-column">
                      <div className="profile-item">
                        <label>Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          required
                        />
                      </div>
                      <div className="profile-item">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="profile-row-column my-3">
                      <div className="profile-item">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="profile-item">
                        <label>Role</label>
                        <select
                          className="form-control"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                        >
                          <option value="">Select a role</option>
                          {availableRoles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="profile-row-column">
                      <div className="profile-item">
                        <label>Agent Department</label>
                        <select
                          className="form-control"
                          value={agentType}
                          onChange={(e) => setAgentType(e.target.value)}
                          required
                        >
                          <option value="">Select a department</option>
                          {availableDepartments.map((dep) => (
                            <option key={dep} value={dep}>
                              {dep}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="profile-item">
                        <label>Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                      <button type="submit" className="btn btn-primary w-100">
                        Register Agent
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SEZIONE AGGIORNAMENTO */}
          {activeSection === "update" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Update Agent</h2>
              </div>
              <div className="profile-content">
                <UpdateAgents />
              </div>
            </div>
          )}

          {/* SEZIONE ELIMINAZIONE */}
          {activeSection === "DeleteAgentsFromList" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Delete Agents from List of Agents</h2>
              </div>
              <div className="profile-content">
                <SoftDeleteAgents />
              </div>
            </div>
          )}

          {activeSection === "ListOfDeletedAgents" && (
            <div className="content-section">
              <div className="section-header">
                <h2>List of deleted Agents</h2>
              </div>
              <div className="profile-content">
                <ListOfDeletedAgents />
              </div>
            </div>
          )}

          {activeSection === "restore" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Restore Agents</h2>
              </div>
              <div className="profile-content">
                <RestoreSoftDeletedAgents />
              </div>
            </div>
          )}

          {activeSection === "DeletedAgentsPermanently" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Delete Agents Permanently</h2>
              </div>
              <div className="profile-content">
                <HardDeleteAgents />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
