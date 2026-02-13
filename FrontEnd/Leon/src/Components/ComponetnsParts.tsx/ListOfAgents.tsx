import { useEffect, useState } from "react";
import type UserDetails from "../../Interfaces/UserDetails.model";

export default function ListOfAgents() {
  const [agents, setAgents] = useState<UserDetails[] | null>(null);

  // RECUPERO TOKEN DAL LOCAL STORAGE
  const token = localStorage.getItem("token");

  //RECUPERO RUOLO DAL LOCAL STORAGE
  const role = localStorage.getItem("role");

  const adminRole = role === "Admin";

  // URL API TUTTI GLI AGENTI
  const apiUrl = import.meta.env.VITE_API_URL + "/api/Auth/all-users";

  useEffect(() => {
    if (!adminRole) {
      console.error("Access denied. Admins only.");
      return;
    }
    if (!token) {
      console.error("No token available");
      return;
    }
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Request failed");
        }
        return res.json();
      })
      .then((data) => {
        setAgents(data);
      })
      .catch((err) => {
        console.error("Error fetching agents:", err);
      });
  }, [apiUrl, token, adminRole]);

  if (!adminRole) {
    return (
      <>
        <div>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>FullName</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {agents && agents.length > 0 ? (
              agents.map((agent) => (
                <tr key={agent.email}>
                  <td>
                    <div className="ticket-info">
                      <div className="agent-info">
                        <div className="agent-avatar">
                          {agent.fullName.charAt(0).toUpperCase()}
                        </div>
                        {agent.fullName}
                      </div>
                    </div>
                  </td>
                  <td>{agent.email}</td>
                  <td>{agent.agentType || "N/A"}</td>
                  <td>{agent.phoneNumber || "N/A"}</td>
                  <td>{agent.role || "N/A"}</td>
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
    </>
  );
}
