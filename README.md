# Job Application Tracker

A full-stack Kanban-style job application tracker with drag-and-drop status management, live search, and a stats dashboard. Built to actually use during a job search, not just as a demo.

**Live demo:** _add once deployed_
**Backend repo:** _this repo_

---

## Screenshots

> Add a screenshot of the board (light and dark mode) once available.

---

## Features

- **JWT authentication** — register and log in, with per-user data isolation
- **Drag-and-drop Kanban board** — move applications between Applied, Phone screen, Interview, Offer, Rejected, and Withdrawn columns; status persists instantly via `@dnd-kit`
- **Full CRUD** — add, edit, and delete applications with company, role, job URL, salary range, applied date, and notes
- **Stats dashboard** — total applications, response rate, active count, and average days waiting — computed client-side from live data
- **Live search** — filter the board by company or role name as you type
- **Light / dark mode** — theme toggle with localStorage persistence and OS-preference detection on first visit
- **Responsive board layout** — columns fill available width and gracefully scroll on narrow viewports

---

## Tech stack

**Frontend**
- React 18 + TypeScript (Vite)
- React Router — routing and protected routes
- Zustand — auth and theme state
- TanStack React Query — server state, caching, and mutations
- @dnd-kit — accessible drag-and-drop
- Axios — HTTP client with JWT interceptor

**Backend**
- Java 21
- Spring Boot
- Spring Security + JWT (jjwt)
- Spring Data JPA + Hibernate
- PostgreSQL

---

## Getting started

### Prerequisites

- Node.js 18+
- Java 21+
- PostgreSQL 16+
- Maven

### 1. Clone the repo

```bash
git clone https://github.com/hmailahn/job-tracker.git
cd job-tracker
```

### 2. Set up the database

```sql
CREATE DATABASE job_tracker;
```

### 3. Configure the backend

Open `backend/src/main/resources/application.properties` and set your database password:

```properties
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

API runs at `http://localhost:8080`.

### 5. Run the frontend

```bash
cd job-tracker-ui
npm install
npm run dev
```

Open `http://localhost:5173`.

### 6. Create an account

Go to `http://localhost:5173/register` to create your first account. You'll land on the board automatically.

---

## API endpoints

| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/applications` | Get all applications for the logged-in user | Yes |
| POST | `/api/applications` | Create a new application | Yes |
| PUT | `/api/applications/{id}` | Update an application | Yes |
| PATCH | `/api/applications/{id}/status` | Update only the status (used by drag-and-drop) | Yes |
| DELETE | `/api/applications/{id}` | Delete an application | Yes |

---

## Project structure

```
job-tracker/
  job-tracker-ui/              # React frontend
    src/
      api/                     # Axios client + API functions
      components/               # ApplicationCard, BoardColumn, ApplicationModal, StatsBar
      hooks/                    # useApplications, useStats, useFilteredApplications
      pages/                    # LoginPage, RegisterPage, BoardPage
      store/                    # authStore, themeStore (Zustand)
      types/                    # TypeScript interfaces
  backend/                      # Spring Boot backend
    src/main/java/com/jobtracker/
      config/                   # Security, JWT, CORS config
      controller/               # AuthController, ApplicationController
      model/                    # User, Application entities
      repository/               # Spring Data repositories
```

---

## Notable implementation details

- **Drag-and-drop persistence**: dropping a card calls a lightweight `PATCH /status` endpoint rather than re-sending the full application object, keeping the request minimal and the UI snappy via React Query's `invalidateQueries` refetch.
- **Client-derived stats**: response rate and average days waiting are computed with `useMemo` from the same cached application list React Query already holds — no extra backend endpoint needed.
- **Theme system**: CSS custom properties swapped via a `data-theme` attribute on `<html>`, driven by a small Zustand store that persists the choice to localStorage and falls back to the OS `prefers-color-scheme` on first visit.

---

## Roadmap

- [ ] Follow-up reminders with overdue highlighting
- [ ] Company logo via Clearbit API
- [ ] Toast notifications on save/delete
- [ ] Deploy to Vercel (frontend) + Railway (backend)

---

## Author

Heidi Mailahn — [github.com/hmailahn](https://github.com/hmailahn)
