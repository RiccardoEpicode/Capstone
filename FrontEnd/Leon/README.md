# LEON — Your Ultimate Ticket Management System (Frontend) ✨

Welcome to LEON, a sleek and powerful support ticket management system designed to empower internal support teams! This frontend application provides a seamless experience for agents and administrators to handle customer tickets with ease, from creation and tracking to resolution. Plus, it comes packed with user management features and even SMS notifications via Twilio! 🚀

---

## See it in Action! 🌐

Curious to see LEON live? Here are the links to explore:

*   **Live Frontend Application:** [https://leon-ticketingsystem.netlify.app](https://leon-ticketingsystem.netlify.app)
*   **Live Backend API:** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net](https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net)
*   **Backend API with interactive Swagger documentation:** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger/index.html](https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger/index.html)

---

## What's Under the Hood? 🛠️

LEON's frontend is built with a modern, robust, and popular tech stack, ensuring a smooth and responsive user experience:

*   **React 19 + TypeScript:** The latest and greatest for building dynamic user interfaces with type safety.
*   **Vite:** A lightning-fast build tool for a snappy development experience.
*   **React Router DOM v7:** For intuitive navigation throughout the application.
*   **Bootstrap 5 + React Bootstrap:** Creating a beautiful, responsive, and consistent design across all devices.
*   **JWT Authentication:** Secure user authentication and authorization.
*   **React Icons / Font Awesome:** A rich library of icons to enhance the visual appeal.
*   **React Toastify:** For elegant and informative notifications.

---

## Key Features at a Glance 🌟

LEON offers a comprehensive suite of features to streamline support operations:

*   **Secure Login & Role-Based Access:** 🚪 Users log in with JWT authentication, and access is tailored to their role (Admin or Agent).
*   **Dynamic Ticket Dashboard:** 📊 A central hub for all tickets, featuring filtering by status and easy pagination for smooth navigation.
*   **Effortless Ticket Management:** ✍️ Create new tickets, update existing ones, and resolve or close them with a simple click.
*   **Intuitive Ticket Workflow:** 🔄 Tickets seamlessly move through statuses: Open → In Progress → Waiting → Resolved / Rejected / Closed, keeping everyone informed.
*   **Detailed Activity Log:** 📝 Every interaction and note on a ticket is logged, providing a complete history.
*   **Comprehensive Customer Management:** 🧑‍🤝‍🧑 Keep track of your customers and their details.
*   **Administrator User Management:** 👑 Admins have full control to manage users and their roles.
*   **SMS Notifications via Twilio:** ✉️ Send quick updates and alerts directly to customers' phones.
*   **Fully Responsive Design:** 📱💻 Whether on desktop, tablet, or mobile, LEON looks and works great.

---

## Getting Started for Developers 🧑‍💻

Want to get this project up and running on your machine? It's straightforward!

### Prerequisites

Before you begin, make sure you have:

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm (comes bundled with Node.js)
*   [Git](https://git-scm.com/)

### Installation

Follow these simple steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/RiccardoEpicode/Leon-FrontEnd
    ```
2.  **Navigate to the Frontend Folder:**
    Open your console or PowerShell and change directory into `FrontEnd/Leon`.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Set Up Environment Variables:**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Then, open the newly created `.env` file and fill in the `VITE_API_URL` with the provided backend URL. Optionally, you can add demo login credentials for quick testing:

    ```ini
    VITE_API_URL=https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net

    # Optional — demo login buttons on the login page
    VITE_DEMO_ADMIN_EMAIL=your-admin-email
    VITE_DEMO_ADMIN_PASSWORD=your-admin-password
    VITE_DEMO_AGENT_EMAIL=your-agent-email
    VITE_DEMO_AGENT_PASSWORD=your-agent-password
    ```
    *(Note: The backend is already deployed, so you don't need to run it locally unless you're making backend changes.)*
5.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    Your LEON frontend application will now be running locally at `http://localhost:5173`! 🎉

---

## Project Structure: Where to Find Everything 🗺️

Navigating the codebase is a breeze. Here's a quick guide to the `src/` folder:

*   `src/App.tsx`: This is the **heart of the application's navigation**. 💖 It contains the main routing configuration, directing users to different pages.
*   `src/main.tsx`: The **entry point** of our React application. 🚀 This file kicks everything off!
*   `src/Components/`: This folder houses all the building blocks of our UI. 🧱
    *   `src/Components/Pages/`: Here you'll find the **main page components** that correspond to different routes in the application.
        *   `src/Components/Pages/Authentication/Login.tsx`: The **login page** where users start their journey. 🔑
        *   `src/Components/Pages/Dashboard.tsx`: The **main ticket dashboard** where agents manage tickets. 🎫
        *   `src/Components/Pages/UpdateTicket.tsx`: The page for **updating ticket details**. ✏️
        *   `src/Components/Pages/UserManager.tsx`: The **admin-only section** for managing users. 🧑‍💻
        *   `src/Components/Pages/ChatSystem.tsx`: This handles the **SMS notification system**. 💬
        *   `src/Components/Pages/AboutPage.tsx`: Information about the application. ℹ️
    *   `src/Components/Nav/Header.tsx`: The **navigation bar** at the top of every page. ⬆️
    *   `src/Components/ComponetnsParts.tsx/`: A collection of **reusable smaller components** like `CreateTicket.tsx`, `TicketNotes.tsx`, `SuccessPopup.tsx`, and more, used across different pages to build a consistent UI. 🧩
*   `src/Interfaces/`: Here you'll find **TypeScript type definitions** (e.g., `GetTickets.model.ts`, `UserDetails.model.ts`) that ensure our data structures are consistent and prevent common errors. 📝
*   `src/Style/`: All our **CSS stylesheets** (e.g., `styles.css`, `enterpriseform.css`) for a polished look and feel. 🎨
*   `src/Utils/`: Utility functions, such as `errorTranslations.ts`, to help with common tasks and error handling. 🔧

---

## Authentication & Roles 🔒

LEON employs robust JWT (JSON Web Token) authentication. Tokens are securely stored in `localStorage` upon login and expire after 60 minutes, requiring a fresh login for security.

We have two distinct roles, each with specific access privileges:

| Role   | Access                                                  |
| :----- | :------------------------------------------------------ |
| Admin  | Full control — manages tickets, users, SMS, and dashboard |
| Agent  | Manages tickets, SMS, and dashboard — no user management |

---

## Quick Demo Access ⚡

To quickly explore the application without typing credentials, simply use the "quick-login" buttons available on the login page! Pre-seeded accounts on the backend mean no registration is required to try out both Admin and Agent roles.

---

## The Backend Story 📡

LEON's powerful backend is a separate ASP.NET Core 9.0 Web API, efficiently hosted on Azure. You can find its source code and setup instructions in the `/BackEnd` folder of this repository.

*   **API Base URL:** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net](https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net)
*   **Interactive API Documentation (Swagger):** [https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger](https://leon-sistemadigestioneticket20260211-e0cbfrgseug7hrfb.italynorth-01.azurewebsites.net/swagger)

---

This project is a testament to modern web development practices and serves as a comprehensive portfolio piece demonstrating full-stack capabilities. Enjoy exploring LEON! 😊
