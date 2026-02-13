import { useEffect, useState } from "react";
import type UserDetails from "../../Interfaces/UserDetails.model";

export default function ListOfDeletedAgents() {
  const [deletedAgents, setDeletedAgents] = useState<UserDetails[] | null>(
    null,
  );
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";
  const initialError = !isAdmin
    ? "Access denied. You do not have permission to view this page."
    : !token
      ? "Authentication token not found. Please log in."
      : null;
  const [error, setError] = useState<string | null>(initialError);

  const apiUrl = import.meta.env.VITE_API_URL + "/api/Auth/deleted-users";

  useEffect(() => {
    if (!isAdmin || !token) {
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
        setDeletedAgents(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching deleted agents:", err);
      });
  }, [apiUrl, token, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <div className="table-wrapper">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone Number</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {deletedAgents && deletedAgents.length > 0
              ? deletedAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td>
                      <div className="agent-info">
                        <div className="agent-avatar">
                          {agent.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span>{agent.fullName}</span>
                      </div>
                    </td>
                    <td>{agent.email}</td>
                    <td>{agent.agentDepartmen || "N/A"}</td>
                    <td>{agent.phoneNumber || "N/A"}</td>
                    <td>{agent.role || "N/A"}</td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
}
