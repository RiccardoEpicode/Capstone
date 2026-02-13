import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "./SuccessPopup"; // Import SuccessPopup

export default function UpdateAgents() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [agentType, setAgentType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState<string | null>(""); // State for popup message
  const [newEmail, setNewEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch roles
    fetch(import.meta.env.VITE_API_URL + "/api/Auth/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error("Error fetching roles:", err));

    // Fetch departments
    fetch(import.meta.env.VITE_API_URL + "/api/Enums/departments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, [token]);

  const handleUpdateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter the email of the agent to update.");
      return;
    }

    const updatedAgentData = {
      fullName,
      email: newEmail,
      agentType,
      phoneNumber,
      role,
      password,
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/Auth/update-user/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedAgentData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Request failed");
        }
        // HANDLE NO CONTENT RESPONSE
        return res.status === 204 ? null : res.json();
      })
      .then(() => {
        setPopupMessage(
          `Agent ${email} updated successfully! You will be redirected to the user manager soon.`,
        );
        setShowSuccessPopup(true);
        setError(null);
        // OPTIONALLY CLEAR THE FORM
        setFullName("");
        setEmail("");
        setNewEmail("");
        setAgentType("");
        setPhoneNumber("");
        setRole("");
        setPassword("");
        setTimeout(() => {
          navigate("/UserManager"); // Redirect to UserManager dashboard
          setShowSuccessPopup(false);
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
        setPopupMessage(null);
        setShowSuccessPopup(false);
        console.error("Error updating agent:", err);
      });
  };

  return (
    <>
      {showSuccessPopup && (
        <SuccessPopup
          message={popupMessage || ""}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="container" style={{ marginBottom: "100px" }}>
        <form onSubmit={handleUpdateAgent}>
          <div className="mb-3">
            <label className="form-label">Email of Agent to Update</label>
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email of the agent you want to update"
            />
          </div>
          <hr />
          <div className="mb-3">
            <label className="form-label">New Full Name</label>
            <input
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Email</label>
            <input
              className="form-control"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Department</label>
            <select
              className="form-control"
              value={agentType}
              onChange={(e) => setAgentType(e.target.value)}
            >
              <option value="">Select a department</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">New Phone Number</label>
            <input
              className="form-control"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">New Password (optional)</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Update Agent Info
          </button>
          {error && (
            <p className="mt-3" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
