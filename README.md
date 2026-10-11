# ApplyTrack --- Job Application Tracker

ApplyTrack is a MERN-stack web application for tracking job applications
in one place. Users can register and log in, record jobs they have
applied for, update application details and statuses, and view an
overview of their progress.

## Features

-   User registration, login, logout, and protected routes
-   Create, view, update, and delete job applications
-   Dashboard statistics for application progress
-   Search and filter applications by status
-   Pagination for application records
-   MongoDB persistence
-   Responsive interface built with React and Tailwind CSS

## Technology Stack

**Frontend:** React, Vite, React Router, Redux Toolkit, Axios, Tailwind
CSS, Lucide React

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT authentication
using HTTP-only cookies, REST API

## Project Structure

Your exact structure may vary slightly.

``` text
JobTracker/
├── client/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── README.md
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── node_modules/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── README.md
```

## Getting Started

### Prerequisites

-   Node.js and npm
-   MongoDB Atlas account or another MongoDB instance
-   Git

### 1. Clone the repository

``` bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd ApplyTrack
```

Replace the placeholder with your public GitHub repository URL.

### 2. Configure and start the backend

``` bash
cd server
npm install
```

Create `server/.env` using the exact environment variable names your
backend reads. For example:

``` env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Check your backend code for the actual variable names and adjust this
example if necessary. Never commit real credentials or `.env` files.

Start the backend using a script available in `server/package.json`,
commonly:

``` bash
npm run dev
```

If `dev` is not defined, use the appropriate script from that package's
`scripts` section.

### 3. Configure and start the frontend

Open a second terminal:

``` bash
cd client
npm install
```

The Axios configuration may already use `http://localhost:3000/api`. If
the frontend reads an API URL from an environment variable, create
`client/.env` with the exact variable name expected by your code. For
example:

``` env
VITE_API_URL=http://localhost:3000/api
```

Only add this variable if your frontend is configured to read it.

Start the frontend:

``` bash
npm run dev
```

Open the local URL printed by Vite, commonly `http://localhost:5173`.

## Application Pages

  Route                      Purpose
  -------------------------- -----------------------------------------
  `/register`                Create an account
  `/login`                   Log in
  `/dashboard`               View application statistics
  `/applications`            Search, filter, and browse applications
  `/applications/new`        Add an application
  `/applications/:id`        View application details
  `/applications/:id/edit`   Edit an application

Application routes require authentication.

## Application Data

Application records can include company, role, location, source, status,
application date, interview date, follow-up date, job URL, notes, and
resume version.

Status values depend on backend validation and may include Applied,
Assessment, Interview, Offer, Rejected, and Withdrawn.

## API Overview

Endpoints are served under `/api`.

  Method     Endpoint                  Purpose
  ---------- ------------------------- --------------------------
  `GET`      `/api/health`             Check backend health
  `POST`     `/api/auth/register`      Register a user
  `POST`     `/api/auth/login`         Log in
  `POST`     `/api/auth/logout`        Log out
  `GET`      `/api/auth/me`            Get the current user
  `GET`      `/api/applications`       List applications
  `POST`     `/api/applications`       Create an application
  `GET`      `/api/applications/:id`   Get one application
  `PATCH`    `/api/applications/:id`   Update an application
  `DELETE`   `/api/applications/:id`   Delete an application
  `GET`      `/api/dashboard/stats`    Get dashboard statistics

Application and dashboard endpoints require authentication.
Authentication uses an HTTP-only cookie, and the frontend must send
credentials with API requests.

## Code0 Usage

Code0 was used to assist with selected development tasks during the
creation of ApplyTrack.

1.  **Backend API Development:** Used Code0 to assist with implementing
    REST API endpoints for user authentication and job application
    management, including creating, retrieving, updating, and deleting
    applications.
2.  **Frontend Development:** Used Code0 to assist with building React
    pages for the dashboard, application list, application creation, and
    application details, using Tailwind CSS for styling and Redux
    Toolkit for state management.
3.  **Debugging and Testing:** Used Code0 to investigate and resolve
    frontend and API integration issues, verify application data
    rendering, and test the core application workflow.

## AI-Assisted Development

AI assistance was used as a development aid for selected implementation
and debugging tasks. The main workflow was tested locally, including
authentication, application CRUD operations, application listing, and
dashboard statistics. Adjust this section if necessary to reflect your
actual development process.

## Testing Checklist

-   [ ] A new user can register and log in.
-   [ ] Protected pages require authentication.
-   [ ] Applications can be created, viewed, updated, and deleted.
-   [ ] Application records persist after a page refresh.
-   [ ] Search, status filtering, and pagination work.
-   [ ] Dashboard statistics reflect application data.
-   [ ] Logging out ends the authenticated session.
-   [ ] The project starts using the instructions above.

## Security Notes

-   Keep database connection strings, JWT secrets, and other credentials
    out of source control.
-   Use placeholder values in `.env.example` files; never commit real
    `.env` files.
-   Configure cookie security and allowed frontend origins appropriately
    before deploying.
-   This README documents local development; deployment instructions are
    not included.

