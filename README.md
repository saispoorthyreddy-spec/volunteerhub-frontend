# VolunteerHub — Frontend Application (React & Vite)

This repository contains the frontend web application for **VolunteerHub**, a volunteer shift scheduler for community events. Built with React 19, Vite, and Vanilla CSS, it provides interactive role-based portals for volunteers and organizers.

---

## Features
- **Public Event Discovery:** Search by keyword/location, filter by date, view real-time remaining spots, and sign up.
- **Volunteer Portal:** View upcoming confirmed shifts, waitlisted commitments, notifications, and single-click cancellation.
- **Organizer Dashboard:** Manage events, schedule shifts with custom capacities, inspect volunteer rosters (names and emails), and close/reopen registrations.
- **Authentication:** Compact and responsive registration and login forms with show/hide password toggle.
- **Design System:** Custom purple and lavender aesthetic with micro-animations and responsive mobile-first layouts.

---

## Local Setup

### Prerequisites
- Node.js 18+ and npm

### Installation & Running
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend Spring Boot API base URL | `http://localhost:8080` |

---

## Deployment to Vercel

1. In [Vercel](https://vercel.com/), click **Add New** → **Project** and select this repository.
2. Framework Preset: **Vite** (Root Directory: `./`).
3. Under **Environment Variables**, set:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com` (your deployed Render backend URL)
4. Click **Deploy**.
