import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// DEFINIZIONE TIPO TOKEN DECODIFICATO
type DecodedToken = {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  [key: string]: unknown;
};

export default function Login() {
  const navigate = useNavigate();

  // USESTATE PER CAMPI LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // FUNZIONE LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // EFFETTUA LOGIN
    fetch(import.meta.env.VITE_API_URL + "/api/Auth/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }

        const data = await res.json();

        // SALVA TOKEN
        const token = data.token;
        localStorage.setItem("token", token);
        // DECODIFICA TOKEN
        const decoded = jwtDecode<DecodedToken>(token);

        // SALVA NEL LOCALSTORAGE IL RUOLO
        const role =
          decoded.role ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (role) {
          localStorage.setItem("role", role);
        }

        // VA ALLA DASHBOARD
        navigate("/Dashboard");
      })
      .catch(() => {
        setError("Email o password non corrette");
      });
  };

  // FUNZIONE PER POPOLARE I CAMPI CON CREDENZIALI ADMIN DI ESEMPIO

  const fillAdminCredentials = () => {
    setEmail(import.meta.env.VITE_DEMO_ADMIN_EMAIL);
    setPassword(import.meta.env.VITE_DEMO_ADMIN_PASSWORD);
  };

  // FUNZIONE PER POPOLARE I CAMPI CON CREDENZIALI AGENT DI ESEMPIO

  const fillAgentCredentials = () => {
    setEmail(import.meta.env.VITE_DEMO_AGENT_EMAIL);
    setPassword(import.meta.env.VITE_DEMO_AGENT_PASSWORD);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 80px)", paddingTop: "60px" }}
    >
      <div className="container" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="badge text-bg-danger mb-4">Test it!</span>
          <button
            className="btn btn-secondary w-100 mb-2"
            onClick={fillAdminCredentials}
          >
            Login as Admin
          </button>
          <button
            className="btn btn-secondary w-100"
            onClick={fillAgentCredentials}
          >
            Login as Agent
          </button>
        </div>
      </div>
    </div>
  );
}
