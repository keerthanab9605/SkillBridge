# SkillBridge — Full-Stack Career Portal

A beginner-friendly MERN-style implementation of the supplied major-project brief. It includes a responsive React + TypeScript frontend, Express REST API, MongoDB models, JWT authentication, role-based access (student/recruiter/admin), job search/filtering, saved jobs, application tracking, profile editing, resume upload, recruiter job management, admin overview, dark mode, and demo mode.

## Important
- **Demo mode works without MongoDB** so you can explore the UI immediately. It uses local browser storage for demo accounts/jobs/applications.
- **Real backend mode** uses MongoDB, bcrypt password hashing, JWT, and protected API routes. Do not commit `.env` or real credentials.
- Admin registration is intentionally not open to the public. Create an admin by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend `.env`, then run the seed command. Run `npm run seed:jobs` once to add sample listings to your database.
- Use Node.js 20+ and npm.

## 1. Run the frontend first (easy mode)
1. Install Node.js LTS from https://nodejs.org/.
2. Open this `skillbridge` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
5. Open the URL printed in the terminal (usually http://localhost:5173).
6. Choose **Explore demo** on the login page. No database is needed for demo mode.

## 2. Start the real backend + MongoDB
1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/atlas/database (or use local MongoDB).
2. In Atlas, create a database user, allow your current IP in Network Access, and copy the connection string. Replace `<password>` with the database user's password. Do not share this string.
3. Copy `backend/.env.example` to `backend/.env` and fill in the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER/skillbridge?retryWrites=true&w=majority
   JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
   CLIENT_URL=http://localhost:5173
   ADMIN_EMAIL=admin@skillbridge.local
   ADMIN_PASSWORD=change-this-admin-password
   ```
4. In a new terminal:
   ```bash
   cd backend
   npm install
   npm run seed:admin
   npm run seed:jobs
   npm run dev
   ```
5. In the frontend create `frontend/.env` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_DEMO_MODE=false
   ```
6. Restart the frontend (`Ctrl+C`, then `npm run dev`). Register as Student or Recruiter. Sign in to the admin account using the values from your backend `.env`.

## 3. Common MongoDB connection fixes
- `bad auth : authentication failed`: use the **database user** from Atlas, not your MongoDB website login; reset that user's password if needed.
- If the password contains `@`, `:`, `/`, `#`, or other reserved characters, URL-encode it.
- `IP not whitelisted`: Atlas → Network Access → add your current IP. Avoid `0.0.0.0/0` except as a temporary development-only diagnostic.
- Check that `MONGO_URI` is in `backend/.env`, not `frontend/.env`; never put database credentials in a `VITE_` variable.
- Restart the backend after changing `.env`.

## 4. Main features
- Student: explore/search/filter jobs, save jobs, apply, track application status, edit profile, upload a PDF/DOC/DOCX resume.
- Recruiter: create/edit/delete own listings and review applications.
- Admin: overview dashboard and user/job management endpoints.
- Authentication: bcrypt password hashes, JWT, protected routes and role checks.
- UI: responsive layout, dark mode, dashboard metrics, search, pagination, status badges.

## 5. Folder structure
```
skillbridge/
├── frontend/                 # React + TypeScript + Vite + Tailwind
│   └── src/                  # UI, API client, demo-mode data
├── backend/                  # Express + Mongoose REST API
│   └── src/                  # models, routes, auth middleware, server
├── .gitignore
└── README.md
```

## 6. GitHub and deployment checklist
- Push code to a GitHub repository, but **never commit `.env` or uploaded resumes**.
- Deploy backend to Render/Railway with `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and admin variables configured in the hosting dashboard.
- Deploy frontend to Vercel with `VITE_API_URL=https://YOUR-BACKEND/api` and `VITE_DEMO_MODE=false`.
- Configure the backend CORS `CLIENT_URL` to your deployed frontend URL.
- A Figma design file, deployed URL, demo video, and final report are separate deliverables listed in the project brief; this code bundle does not pretend those have already been published.

## 7. API endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PATCH /api/jobs/:id`, `DELETE /api/jobs/:id`
- `POST /api/jobs/:id/save`, `POST /api/jobs/:id/apply`
- `GET /api/applications/mine`, `GET /api/applications/recruiter`, `PATCH /api/applications/:id/status`
- `GET /api/profile`, `PATCH /api/profile`, `POST /api/profile/resume`
- `GET /api/admin/overview`, `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`, `DELETE /api/admin/jobs/:id`
- `GET /api/health`

## Optional: run the full stack with Docker
Install Docker Desktop, then from the project root run `docker compose up --build`. Open `http://localhost:8080`. This compose setup uses a local MongoDB container and development-only credentials; do not use those credentials in production. The frontend is built with real API mode. For a fresh Docker database, seed the admin/sample listings by running a one-off backend container command or use the local backend instructions above.
