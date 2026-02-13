 ---
  # LEON — Ticket Management System (Frontend)

  A modern support ticket management system built for internal support teams.
  Agents and administrators can create, track, and resolve customer tickets across multiple departments, manage users, and send SMS
  notifications via Twilio.

  **Live backend:** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net]
   ---
  **Live backend with swagger terminal:** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger/index.html]
   ---
  **Live FrontEnd:** [https://leon-ticketingsystem.netlify.app]

  ---

  ## Tech Stack

  - **React 19** + **TypeScript**
  - **Vite** (rolldown-vite)
  - **React Router DOM v7**
  - **Bootstrap 5** + **React Bootstrap**
  - **JWT** authentication (via `jwt-decode`)
  - **React Icons** / **Font Awesome**
  - **React Toastify**

  ---

  ## Features

  - JWT-based login with role-based access (Admin / Agent)
  - Ticket dashboard with status filtering and pagination
  - Create, update, and delete support tickets
  - Ticket status workflow: Open → In Progress → Waiting → Resolved / Rejected / Closed
  - Ticket notes / activity log
  - Customer management
  - User management (Admin only)
  - SMS notification system via Twilio
  - Fully responsive layout

  ---

  ## Getting Started

  ### Prerequisites

  Make sure you have the following installed on your machine:

  - [Node.js](https://nodejs.org/) (v18 or higher recommended)
  - npm (comes with Node.js)
  - [Git](https://git-scm.com/)

  ---

  ### Installation

  ```bash
  1. Clone the repository
  git clone https://github.com/RiccardoEpicode/Leon-FrontEnd

  ---
  2. Navigate to the frontend folder and open it with console/powershell

  ---
  3. Install dependencies

  npm install

  ---
  4. Set up environment variables

  Copy the example env file and fill in the values:

  cp .env.example .env

  Then open .env and fill in:

  VITE_API_URL=https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net

  # Optional — demo login buttons on the login page
  VITE_DEMO_ADMIN_EMAIL=your-admin-email
  VITE_DEMO_ADMIN_PASSWORD=your-admin-password
  VITE_DEMO_AGENT_EMAIL=your-agent-email
  VITE_DEMO_AGENT_PASSWORD=your-agent-password

  The backend is already deployed on Azure — you do not need to run it locally unless you want to.
  If you leave the demo credentials empty, the quick-login buttons on the login page simply won't fill anything in.

  ---
  5. Start the development server

  npm run dev

  The app will be available at http://localhost:5173

  ---
  Available Scripts
  ┌─────────────────┬──────────────────────────────────────┐
  │     Command     │             Description              │
  ├─────────────────┼──────────────────────────────────────┤
  │ npm run dev     │ Start the local development server   │
  ├─────────────────┼──────────────────────────────────────┤
  │ npm run build   │ Build for production                 │
  ├─────────────────┼──────────────────────────────────────┤
  │ npm run preview │ Preview the production build locally │
  ├─────────────────┼──────────────────────────────────────┤
  │ npm run lint    │ Run ESLint                           │
  └─────────────────┴──────────────────────────────────────┘
  ---
  Project Structure

  src/
  ├── Components/
  │   ├── Pages/              # Route-level page components
  │   │   ├── Authentication/ # Login page
  │   │   ├── Dashboard.tsx   # Main ticket dashboard
  │   │   ├── UpdateTicket.tsx
  │   │   ├── UserManager.tsx # Admin-only user management
  │   │   ├── ChatSystem.tsx  # SMS notification system
  │   │   └── AboutPage.tsx
  │   ├── Nav/
  │   │   └── Header.tsx
  │   └── ComponetnsParts.tsx/ # Reusable components (CreateTicket, Notes, etc.)
  ├── Interfaces/             # TypeScript type definitions
  ├── Style/                  # CSS stylesheets
  ├── App.tsx                 # Router configuration
  └── main.tsx                # Entry point

  ---
  Authentication

  The app uses JWT tokens stored in localStorage.
  Tokens are issued by the backend on login and expire after 60 minutes.

  Two roles are available:
  ┌───────┬──────────────────────────────────────────────┐
  │ Role  │                    Access                    │
  ├───────┼──────────────────────────────────────────────┤
  │ Admin │ Full access — tickets, users, SMS, dashboard │
  ├───────┼──────────────────────────────────────────────┤
  │ Agent │ Tickets, SMS, dashboard — no user management │
  └───────┴──────────────────────────────────────────────┘
  ---
  Demo Access

  Use the quick-login buttons on the login page to try both roles without typing credentials.
  No registration required — accounts are pre-seeded on the backend.

  ---
  Backend

  The backend is a separate ASP.NET Core 9.0 Web API hosted on Azure.
  Source code and setup instructions are in the /BackEnd folder of this repository.

  API base URL: https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net
  Swagger docs: https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger

  ---

  This project was built as a capstone project and is intended for portfolio/demonstration purposes.

  ---
