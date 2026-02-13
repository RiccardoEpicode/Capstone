# 🌟 LEON — Your Full-Stack Ticket Management System

Welcome to **LEON**, a modern and comprehensive full-stack ticket management platform designed to revolutionize how support teams handle customer requests. Say goodbye to scattered emails and manual tracking! LEON provides a structured, secure, and intuitive solution to organize, track, and resolve support tickets efficiently. 🚀

---

## See it in Action! 🌐

Experience LEON live:

*   **Live Application:** [https://leon-ticketingsystem.netlify.app/Home](https://leon-ticketingsystem.netlify.app/Home)

---

## Project Overview: What LEON Does ✨

**LEON** is built to streamline the entire support process. With LEON, your team can:

*   🎫 **Create & Manage Tickets:** Easily submit, update, and close support requests.
*   🏢 **Departmental Assignment:** Assign tickets to specific departments like Call Center, Tech Support, Billing, or Security for efficient routing.
*   🔄 **Transparent Lifecycle Tracking:** Monitor ticket status from creation through its full resolution lifecycle.
*   👥 **Robust User Management:** Administer users with flexible role-based permissions (Admin, Agent, User).
*   📊 **Visual Statistics:** Gain insights with visual statistics and ticket distribution overviews.

---

## Under the Hood: The Tech Stack 🛠️

LEON leverages a powerful and industry-standard tech stack for both its backend API and a dynamic frontend application.

### Backend (ASP.NET Core) 🔙

Our robust backend API powers all the core functionalities:

*   **ASP.NET Core 9.0:** A high-performance framework for building secure and scalable RESTful APIs.
*   **Entity Framework Core 9.0.11:** An elegant Object-Relational Mapper (ORM) for seamless database interactions.
*   **SQL Server (SQLEXPRESS):** A reliable relational database to store all your critical ticket and user data.
*   **JWT Bearer 9.0.11:** Secure JSON Web Token authentication for protecting API endpoints.
*   **ASP.NET Core Identity 9.0.11:** Comprehensive user and role management system.
*   **Swagger 9.0.6:** Automatically generated, interactive API documentation for easy testing and understanding.

### Frontend (React) 🔜

Our modern and responsive frontend provides an intuitive user experience:

*   **React 19.2.0:** A leading JavaScript library for building dynamic and interactive user interfaces.
*   **TypeScript ~5.9.3:** Adds type safety to JavaScript, enhancing code quality and developer experience.
*   **Vite 7.2.5:** A fast development server and build tool for a smooth workflow.
*   **React Router DOM 7.12.0:** For declarative routing and seamless navigation within the single-page application.
*   **Bootstrap 5.3.8 & React-Bootstrap 2.10.10:** A powerful combination for creating responsive and aesthetically pleasing UI components.
*   **jwt-decode 4.0.0:** A utility for decoding JWT tokens on the client side.

---

## Ticket Journey: Status Flow 🔄

LEON implements a clear and structured ticket lifecycle to ensure transparency and accountability:

`Open` → `InProgress` → `WaitingDepartment` → `Resolved` → `Closed`

`↘ Rejected`

---

## User Permissions: Who Can Do What 👑

LEON defines distinct roles with specific permissions to manage access effectively:

| Role         | Permissions                                                                        |
| :----------- | :--------------------------------------------------------------------------------- |
| 👑 **Admin** | Full access to all features, including comprehensive user and ticket management. |
| 🧑‍💻 **Agent** | Can create, view, and update tickets, focusing on resolution tasks.                  |
| 👤 **User**  | Able to create new tickets and track the status of their personal requests.        |

---

## Getting Started: For Developers ⚙️

Ready to dive into the code? Here's how to get LEON up and running on your local machine.

### Prerequisites ✅

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v18+ recommended) and `npm`
*   [.NET SDK 9.0](https://dotnet.microsoft.com/download)
*   [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (SQLEXPRESS is suitable for local development)

### 1️⃣ Backend Setup

Navigate to the backend directory and follow these steps:

```bash
cd "BackEnd/LEON - Sistema di gestione ticket"

# Restore project dependencies
dotnet restore

# Apply any pending database migrations
dotnet ef database update

# Start the backend API
dotnet run
```

The backend API will typically run at:

*   **API Base URL:** `https://localhost:7041`
*   **Swagger UI (API Documentation):** `https://localhost:7041/swagger`

### 2️⃣ Frontend Setup

Open a new terminal, navigate to the frontend directory, and proceed:

```bash
cd FrontEnd/Leon

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend application will be accessible at: `http://localhost:5173`

### Available Scripts 📜

**Frontend (`FrontEnd/Leon`)**

| Command          | Description                             |
| :--------------- | :-------------------------------------- |
| `npm run dev`    | Starts the local development server     |
| `npm run build`  | Builds the project for production       |
| `npm run preview`| Previews the production build locally   |
| `npm run lint`   | Runs ESLint for code quality checks     |

**Backend (`BackEnd/LEON - Sistema di gestione ticket`)**

| Command                  | Description                     |
| :----------------------- | :------------------------------ |
| `dotnet run`             | Starts the backend API          |
| `dotnet build`           | Compiles the backend project    |
| `dotnet ef database update`| Applies database migrations   |

---

## API Endpoints: A Quick Reference 🔐

Here are some key API endpoints:

### Authentication

| Method | Endpoint              | Description                      |
| :----- | :-------------------- | :------------------------------- |
| `POST` | `/api/Auth/login`     | User login and JWT token issuance  |
| `POST` | `/api/Auth/register`  | Register a new user (Admin only) |

### Tickets

| Method   | Endpoint                     | Description                                    |
| :------- | :--------------------------- | :--------------------------------------------- |
| `GET`    | `/api/Tickets`               | Retrieve all tickets                             |
| `GET`    | `/api/Tickets/{id}`          | Get a specific ticket by its ID                  |
| `POST`   | `/api/Tickets`               | Create a new support ticket                      |
| `PUT`    | `/api/Tickets/{id}`          | Update an existing ticket's details            |
| `PUT`    | `/api/Tickets/{id}/status`   | Change the status of a ticket                    |
| `DELETE` | `/api/Tickets/{id}`          | Soft delete a ticket (marks as inactive)       |
| `GET`    | `/api/Tickets/{id}/history`  | View the historical status changes of a ticket |

---

## Configuration Insights 🔧

The `appsettings.json` file in the backend contains essential configurations:

```json
{
  "ConnectionStrings": {
    "SqlServer": "Data Source=(local)\\SQLEXPRESS;Database=Leon;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Issuer": "LeonAPI",
    "Audience": "LeonAPIClient",
    "DurationInMinutes": 60
  }
}
```

### Cross-Origin Resource Sharing (CORS) 🌐

The backend is configured to allow requests from the following origins, crucial for local development:

*   `http://localhost:5173` (Frontend development server)
*   `http://localhost:4200` (Potentially for other local development clients)

---

## About This Project 🎓

LEON was proudly developed as a Capstone project for Epicode. It's more than just an academic exercise; it adheres to real-world architectural principles, demonstrating:

*   **Clean Separation of Concerns:** Organized codebase with distinct responsibilities.
*   **RESTful API Design:** Adherence to industry best practices for API development.
*   **Role-Based Security:** Robust security model preventing unauthorized access.
*   **Scalable Structure:** Designed with future expansion and growth in mind.
*   **Maintainable Codebase:** Clean, readable, and well-structured code for easy collaboration and updates.

---

## License 📄

Created as a Capstone Project for Epicode. All rights reserved. 😊
