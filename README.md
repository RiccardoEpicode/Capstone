# 🎟️ LEON - Sistema di Gestione Ticket

A modern, full-stack ticket management platform built to help support teams organize, track, and resolve customer requests efficiently.

### 🌐 Link to hosted website
https://leon-ticketingsystem.netlify.app/Home

## 🚀 Project Overview

**LEON** is a complete support ticket management system designed to replace scattered emails and manual tracking with a structured, secure, and easy-to-use solution.

With LEON, teams can:

- 🎫 Create and manage support tickets
- 🏢 Assign tickets to departments (CallCenter, TechSupport, Billing, Security)
- 🔄 Track ticket status through its full lifecycle
- 👥 Manage users with role-based permissions (Admin, Agent, User)
- 📊 View statistics and ticket distribution visually

---

## 🛠️ Tech Stack

### 🔙 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| ASP.NET Core | 9.0 | REST API Framework |
| Entity Framework Core | 9.0.11 | ORM & Database Access |
| SQL Server | SQLEXPRESS | Relational Database |
| JWT Bearer | 9.0.11 | Authentication |
| ASP.NET Core Identity | 9.0.11 | User & Role Management |
| Swagger | 9.0.6 | API Documentation |

---

### 🔜 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | 7.2.5 | Dev Server & Build Tool |
| React Router DOM | 7.12.0 | Routing |
| Bootstrap | 5.3.8 | Styling |
| React-Bootstrap | 2.10.10 | UI Components |
| jwt-decode | 4.0.0 | JWT Handling |

---

## 🔄 Ticket Status Flow

Open → InProgress → WaitingDepartment → Resolved → Closed
↘ Rejected


This structured lifecycle ensures transparency and accountability.

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| 👑 **Admin** | Full access, manage users, all ticket operations |
| 🧑‍💻 **Agent** | Create, view, and update tickets |
| 👤 **User** | Create and track personal tickets |

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js (v18+)
- npm
- .NET SDK 9.0
- SQL Server (SQLEXPRESS)

---

### 1️⃣ Backend Setup

```
cd "BackEnd/LEON - Sistema di gestione ticket"

dotnet restore
dotnet ef database update
dotnet run
Backend will run at:

API Base URL: https://localhost:7041

Swagger UI: https://localhost:7041/swagger

2️⃣ Frontend Setup
bash

cd FrontEnd/Leon

npm install
npm run dev
Frontend runs at:

http://localhost:5173

📜 Available Scripts
Frontend
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run preview	Preview production build
npm run lint	Run ESLint

Backend
Command	Description
dotnet run	Start API
dotnet build	Build project
dotnet ef database update	Apply migrations

```
🔐 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/Auth/login	Login
POST	/api/Auth/register	Register user (Admin only)

Tickets
Method	Endpoint	Description
GET	/api/Tickets	Get all tickets
GET	/api/Tickets/{id}	Get ticket by ID
POST	/api/Tickets	Create ticket
PUT	/api/Tickets/{id}	Update ticket
PUT	/api/Tickets/{id}/status	Update status
DELETE	/api/Tickets/{id}	Delete ticket
GET	/api/Tickets/{id}/history	View status history

🔧 Configuration
appsettings.json
json

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


🌐 CORS
Backend allows requests from:

http://localhost:5173

http://localhost:4200

🎓 About This Project
LEON was developed as a Capstone project for Epicode, but it follows real-world architecture principles:

Clean separation of concerns

RESTful API design

Role-based security

Scalable structure

Maintainable codebase

📄 License
Created as a Capstone Project for Epicode.
