# CampusHub

CampusHub is a full-stack campus management and information platform built to bring common student and administrative activities into one centralized web application.

The project provides a role-based environment where students can browse campus information while administrators can create, update, and manage campus content.

## Live Demo

**Frontend:** https://campus-hub-pi-six.vercel.app/

**Backend API:** https://campushub-api-k9ug.onrender.com/

The frontend is deployed on Vercel, the Express backend is deployed on Render, and the production PostgreSQL database is hosted on Neon.

---

# Features

## Student Features

* Student registration and login
* JWT-based authentication
* Role-based access
* Browse announcements
* Browse upcoming events
* Browse academic and campus resources
* Explore student clubs
* View Lost & Found listings
* Student-focused dashboard
* Responsive interface for desktop and mobile

## Administrator Features

* Secure administrator authentication
* Administrator dashboard
* Campus content statistics
* Create announcements
* Edit announcements
* Delete announcements
* Create events
* Edit events
* Delete events
* Create resources
* Edit resources
* Delete resources
* Create clubs
* Edit clubs
* Delete clubs
* Create Lost & Found listings
* Edit Lost & Found listings
* Delete Lost & Found listings

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* JavaScript

## Backend

* Node.js
* Express.js
* REST API
* JWT
* bcryptjs
* CORS

## Database

* PostgreSQL
* Neon PostgreSQL

## Development & Tools

* Git
* GitHub
* VS Code
* Postman
* pgAdmin

## Deployment

* Vercel — Frontend
* Render — Backend API
* Neon — Production PostgreSQL database

---

# System Architecture

CampusHub follows a full-stack client-server architecture.

```text
                         CAMPUSHUB
                             │
                 ┌───────────┴───────────┐
                 │                       │
             Frontend                Backend API
          React + Vite             Node + Express
          Tailwind CSS              REST API
          React Router                  │
                 │                       │
                 └────── HTTP/JSON ─────┘
                                         │
                                         ▼
                                  PostgreSQL
                                     Neon
```

### Production Architecture

```text
                         GitHub
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          Vercel                     Render
        React Frontend            Express Backend
              │                         │
              └──────── HTTP ───────────┘
                                        │
                                        ▼
                                      Neon
                                  PostgreSQL DB
```

The frontend communicates with the Express backend through HTTP requests.

The backend processes requests, performs authentication and authorization checks, and communicates with PostgreSQL.

---

# Application Workflow

A typical request follows this flow:

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Request
 ▼
Express Backend
 │
 ├── Authentication
 │
 ├── Authorization
 │
 └── Business Logic
 │
 ▼
PostgreSQL
 │
 ▼
Database Response
 │
 ▼
Express API
 │
 ▼
React Frontend
 │
 ▼
Updated UI
```

## Example: Loading Announcements

```text
Student opens Announcements
        │
        ▼
React sends GET /announcements
        │
        ▼
Express receives request
        │
        ▼
PostgreSQL queries announcements
        │
        ▼
Database returns records
        │
        ▼
Express returns JSON
        │
        ▼
React displays announcements
```

---

# Authentication & Authorization

CampusHub uses JWT-based authentication with role-based authorization.

## Registration

A new user registers through the frontend.

```text
Registration Form
       │
       ▼
POST /register
       │
       ▼
Express
       │
       ▼
Password hashed with bcryptjs
       │
       ▼
User stored in PostgreSQL
```

Passwords are never stored as plain text.

---

## Login

When a user logs in:

```text
Login Form
    │
    ▼
POST /login
    │
    ▼
Express verifies credentials
    │
    ▼
JWT generated
    │
    ▼
Token returned to frontend
    │
    ▼
Stored in localStorage
```

The frontend uses the token when accessing protected endpoints.

---

## Role-Based Access

CampusHub has two roles:

```text
Student
   │
   ├── View campus content
   ├── Access dashboard
   └── Cannot perform admin CRUD actions

Admin
   │
   ├── View campus content
   ├── Access admin dashboard
   └── Create / Update / Delete content
```

Protected requests use authentication middleware.

Administrator-only requests additionally use admin authorization middleware.

Example:

```text
Request
   │
   ▼
JWT Authentication
   │
   ├── Invalid → 401/403
   │
   ▼
Check User Role
   │
   ├── Student → 403
   │
   ▼
Admin
   │
   ▼
Perform Action
```

---

# Database Design

CampusHub uses PostgreSQL as its relational database.

The main entities are:

```text
users
announcements
events
resources
clubs
lost_found
```

## Users

Stores registered CampusHub accounts.

```text
users
├── id
├── name
├── email
├── password
├── role
└── created_at
```

Roles include:

* student
* admin

---

## Announcements

Stores campus announcements.

```text
announcements
├── id
├── title
├── description
└── date
```

---

## Events

Stores campus events.

```text
events
├── id
├── title
├── description
├── date
└── location
```

---

## Resources

Stores useful academic and campus resources.

```text
resources
├── id
├── title
├── description
├── category
└── link
```

---

## Clubs

Stores student club information.

```text
clubs
├── id
├── name
├── description
└── members
```

---

## Lost & Found

Stores campus Lost & Found listings.

```text
lost_found
├── id
├── item
├── type
├── description
├── location
├── date
└── contact
```

---

# REST API

The Express backend provides REST endpoints for the application.

## Authentication

| Method | Endpoint    | Access        | Purpose          |
| ------ | ----------- | ------------- | ---------------- |
| POST   | `/register` | Public        | Register a user  |
| POST   | `/login`    | Public        | Login            |
| GET    | `/profile`  | Authenticated | Get current user |

## Announcements

| Method | Endpoint             | Access | Purpose             |
| ------ | -------------------- | ------ | ------------------- |
| GET    | `/announcements`     | Public | Get announcements   |
| POST   | `/announcements`     | Admin  | Create announcement |
| PUT    | `/announcements/:id` | Admin  | Update announcement |
| DELETE | `/announcements/:id` | Admin  | Delete announcement |

## Events

| Method | Endpoint      | Access | Purpose      |
| ------ | ------------- | ------ | ------------ |
| GET    | `/events`     | Public | Get events   |
| POST   | `/events`     | Admin  | Create event |
| PUT    | `/events/:id` | Admin  | Update event |
| DELETE | `/events/:id` | Admin  | Delete event |

## Resources

| Method | Endpoint         | Access | Purpose         |
| ------ | ---------------- | ------ | --------------- |
| GET    | `/resources`     | Public | Get resources   |
| POST   | `/resources`     | Admin  | Create resource |
| PUT    | `/resources/:id` | Admin  | Update resource |
| DELETE | `/resources/:id` | Admin  | Delete resource |

## Clubs

| Method | Endpoint     | Access | Purpose     |
| ------ | ------------ | ------ | ----------- |
| GET    | `/clubs`     | Public | Get clubs   |
| POST   | `/clubs`     | Admin  | Create club |
| PUT    | `/clubs/:id` | Admin  | Update club |
| DELETE | `/clubs/:id` | Admin  | Delete club |

## Lost & Found

| Method | Endpoint          | Access | Purpose        |
| ------ | ----------------- | ------ | -------------- |
| GET    | `/lost-found`     | Public | Get listings   |
| POST   | `/lost-found`     | Admin  | Create listing |
| PUT    | `/lost-found/:id` | Admin  | Update listing |
| DELETE | `/lost-found/:id` | Admin  | Delete listing |

---

# Frontend Structure

The frontend is organized using React components and pages.

```text
client/
│
├── src/
│   │
│   ├── components/
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Announcement.jsx
│   │   ├── Events.jsx
│   │   ├── Resources.jsx
│   │   ├── Clubs.jsx
│   │   ├── LostFound.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

React Router handles navigation between pages without requiring full page reloads.

---

# Backend Structure

```text
server/
│
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
│
├── db.js
├── server.js
├── package.json
└── .env
```

### Authentication Middleware

`authMiddleware.js` verifies JWT tokens before allowing access to protected routes.

### Admin Middleware

`adminMiddleware.js` verifies that the authenticated user has the administrator role.

### Database Connection

`db.js` manages the PostgreSQL connection used by the Express server.

Sensitive configuration such as database credentials and JWT secrets is stored in environment variables.

The production PostgreSQL connection uses SSL for the Neon database.

---

# Project Structure

The complete project is divided into frontend and backend applications:

```text
CampusHub/
│
├── client/
│   ├── React
│   ├── Vite
│   ├── Tailwind CSS
│   └── React Router
│
├── server/
│   ├── Node.js
│   ├── Express.js
│   ├── JWT
│   ├── bcryptjs
│   └── PostgreSQL connection
│
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following before running CampusHub locally:

* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/AaryanGhimire/CampusHub.git
cd CampusHub
```

---

## 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory.

Example:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=campushub
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

Do not commit the `.env` file to GitHub.

---

## 3. Setup PostgreSQL

Create the database:

```sql
CREATE DATABASE campushub;
```

Create the required tables:

* users
* announcements
* events
* resources
* clubs
* lost_found

Add the required seed data if desired.

---

## 4. Start Backend

From the `server` directory:

```bash
npm start
```

The local backend runs on:

```text
http://localhost:5000
```

The production backend is available at:

```text
https://campushub-api-k9ug.onrender.com
```

---

## 5. Setup Frontend

Open another terminal:

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# Production Deployment

CampusHub is deployed using separate frontend, backend, and database services.

```text
                     GitHub
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
         Vercel                 Render
       Frontend              Backend API
            │                     │
            │      HTTP/JSON      │
            └─────────────────────┘
                                  │
                                  ▼
                                Neon
                             PostgreSQL
```

### Frontend

The React/Vite application is deployed on Vercel.

```text
https://campus-hub-pi-six.vercel.app/
```

### Backend

The Node/Express API is deployed on Render.

```text
https://campushub-api-k9ug.onrender.com/
```

### Database

The production PostgreSQL database is hosted on Neon.

The backend connects to Neon using environment variables for database credentials and JWT configuration.

Sensitive credentials are not stored in the repository.

---

# Development Workflow

During development, the project followed this workflow:

```text
1. Build React UI
        ↓
2. Create Express API
        ↓
3. Connect API to PostgreSQL
        ↓
4. Test API with Postman
        ↓
5. Connect React to API
        ↓
6. Add authentication
        ↓
7. Add role-based authorization
        ↓
8. Add admin CRUD
        ↓
9. Build dashboards
        ↓
10. Responsive UI
        ↓
11. Production database
        ↓
12. Deploy backend
        ↓
13. Deploy frontend
        ↓
14. Test complete application
```

---

# Testing

The application was tested across different user states.

## Logged Out

* Public pages accessible
* Login available
* Registration available
* Protected dashboard requires authentication

## Student

* Can access campus content
* Can access dashboard
* Can view announcements, events, resources, clubs and Lost & Found
* Cannot perform administrator CRUD actions

## Administrator

* Can access dashboard
* Can view content statistics
* Can create content
* Can edit content
* Can delete content
* Administrator-only endpoints are protected

Unauthorized administrator actions return an appropriate authorization error.

The deployed application was also tested using the production frontend, backend API, and production database.

---

# Responsive Design

CampusHub uses Tailwind CSS responsive utilities to support:

* Desktop
* Laptop
* Tablet
* Mobile

The interface was checked using responsive browser/device simulation.

---

# Security

The project includes several basic security practices:

* Password hashing using bcryptjs
* JWT-based authentication
* Protected API routes
* Role-based authorization
* Environment variables for sensitive configuration
* `.env` excluded from version control
* CORS configuration
* SSL connection for the production PostgreSQL database

---

# Learning Outcomes

This project was built to gain practical experience with full-stack web development.

Key concepts covered:

* React component development
* React Router
* Vite
* Tailwind CSS
* REST API design
* Express.js
* Node.js
* PostgreSQL
* SQL CRUD operations
* Authentication
* JWT
* Password hashing
* Middleware
* Role-based authorization
* Frontend/backend integration
* API testing with Postman
* Responsive web design
* Git and GitHub
* Environment variables
* Production database configuration
* Full-stack deployment
* Vercel deployment
* Render deployment
* Neon PostgreSQL

---

# Future Improvements

Possible future improvements include:

* User profile management
* Student-specific saved content
* Event registration
* Club membership
* Notifications
* Search and filtering
* Image uploads
* Pagination
* More granular permissions
* Admin user management
* Automated testing
* Improved error handling
* Performance optimization

These features are outside the current completed scope of the project.

---

# Project Status

```text
Frontend              ✅ Complete
Backend               ✅ Complete
PostgreSQL            ✅ Complete
Authentication        ✅ Complete
Authorization         ✅ Complete
CRUD Operations       ✅ Complete
Student Dashboard     ✅ Complete
Admin Dashboard       ✅ Complete
Responsive UI         ✅ Complete
Production Database   ✅ Complete
Backend Deployment    ✅ Complete
Frontend Deployment   ✅ Complete
Documentation         ✅ Complete
```

**CampusHub is complete and deployed as a full-stack web application.**

---

# Author

**Aaryan Ghimire**

BE Information Technology Student
Nepal

GitHub: https://github.com/AaryanGhimire

---

# License

This project was created as a learning and portfolio project.
