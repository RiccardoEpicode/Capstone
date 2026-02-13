import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import Login from "./Components/Pages/Authentication/Login";
import Header from "./Components/Nav/Header";
import UserManager from "./Components/Pages/UserManager";
import Dashboard from "./Components/Pages/Dashboard";
import AboutPage from "./Components/Pages/AboutPage";
import UpdateTicket from "./Components/Pages/UpdateTicket";
import ChatSystem from "./Components/Pages/ChatSystem";
import Enterprise from "./Components/Enterprise";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/UserManager" element={<UserManager />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/update-ticket/:ticketId" element={<UpdateTicket />} />
          <Route path="/ChatSystem" element={<ChatSystem />} />
          <Route path="/enterprise" element={<Enterprise />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
