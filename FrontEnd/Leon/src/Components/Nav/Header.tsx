import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type UserDetails from "../../Interfaces/UserDetails.model";

export default function Header() {
  // NAVIGATE
  const navigate = useNavigate();

  // STATE FOR BURGER MENU
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // RECUPERO TOKEN
  const token = localStorage.getItem("token");

  // VERIFICO SE LOGGATO
  const isLoggedIn = !!token;

  // FUNZIONE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/Home");
  };

  // USESTATE DETTAGLI UTENTE
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // FETCH UTENTE PER HEADER
  useEffect(() => {
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
        // GESTIONE RISPOSTA
        setUserDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        // SE TOKEN NON VALIDO, LOGOUT
        if (String(error).toLowerCase().includes("401")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/Login");
        }
      });
  }, [token, navigate]);

  return (
    <nav className="navbar navbar-expand-md navbar-light fixed-top bg-light-custom shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand" to={isLoggedIn ? "/Dashboard" : "/Home"}>
            <img src="/Leon.png" alt="Leon Logo" width="40" height="40" />
          </Link>
          {isLoggedIn && (
            <Link className="nav-link d-none d-md-block" to="/Dashboard">
              Dashboard
            </Link>
          )}
        </div>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
        >
          {/* THIS UL IS NOW A SPACER ON DESKTOP WHEN LOGGED IN */}
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/Home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/About">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/enterprise">
                    Enterprise
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <Link className="btn btn-outline-primary" to="/Login">
                Login
              </Link>
            ) : (
              <>
                {userDetails && (
                  <span className="navbar-text me-3">
                    Welcome, {userDetails.fullName}
                  </span>
                )}
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
