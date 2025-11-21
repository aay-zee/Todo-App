## Todo App

Live Frontend: https://aayzee.netlify.app

This is a full‑stack (currently frontend-focused) Todo application built with a React + Vite + TailwindCSS frontend and an Express 5 + Mongoose backend. The deployed Netlify version presently uses browser `localStorage` for persistence; the API integration code is scaffolded and ready to be enabled.

### Table of Contents

1. Features
2. Tech Stack
3. Project Structure
4. Backend API
5. Environment & Configuration
6. Running Locally
7. Seeding Sample Data
8. Enabling API Integration in Frontend
9. Deployment Notes
10. Future Improvements

### 1. Features

- Add, edit, toggle complete, and delete todos (frontend UI)
- Clear all todos with confirmation modal
- Responsive, accessible UI with semantic controls
- Local persistence via `localStorage` (current live behavior)
- Backend REST API (CRUD) with MongoDB storage (ready but not wired in production build)
- Centralized Axios instance with environment-based base URL resolution

### 2. Tech Stack

Frontend:

- React 19 (Concurrent features ready via StrictMode)
- Vite 7 for dev & build tooling
- TailwindCSS 4 (via `@tailwindcss/vite` integration)
- Axios for HTTP abstraction
- ESLint (React hooks + Vite refresh plugins)

Backend:

- Express 5.1 (using modern async handlers)
- Mongoose 8 for ODM (MongoDB)
- CORS configured for local dev (`http://localhost:5173`)
- dotenv for environment variable management

### 3. Project Structure

```
backend/
	app.js              # Express server & routes
	model/todo.js       # Mongoose Todo schema/model
	init/index.js       # Script to seed sample todos
	init/sampleData.js  # Sample seed dataset
	package.json
frontend/
	src/
		App.jsx           # Main UI & todo logic (localStorage by default)
		main.jsx          # React root mounting
		api/axiosInstance.js # Axios pre-configured instance
		index.css         # Tailwind base import
	vite.config.js
	eslint.config.js
	package.json
README.md
```

### 4. Backend API

Base URL (local): `http://localhost:3000/api`

Endpoints:
| Method | Endpoint | Description | Body (JSON) |
|--------|---------------------|----------------------------------|------------------------------|
| GET | /todos | Fetch all todos | — |
| POST | /todos | Create a todo | `{ text: "string" }` |
| PATCH | /todos/:id | Update fields (text/completed) | Partial `{ text?, completed? }` |
| DELETE | /todos/:id | Delete a single todo | — |
| DELETE | /todos | Delete all todos | — |

Sample Create Request:

```
POST /api/todos
Content-Type: application/json
{
	"text": "Finish writing README"
}
```

Sample Response:

```
201 Created
{
	"_id": "665f...",
	"text": "Finish writing README",
	"completed": false
}
```

### 5. Environment & Configuration

Backend expects a `.env` file in `backend/` with:

```
DB_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

Frontend optional environment variable (for direct API use):

```
VITE_API_BASE_URL=http://localhost:3000/api
```

If unset, `axiosInstance.js` falls back to `/api` during dev (proxy scenario) or a placeholder production URL (update this before deploying backend).

### 6. Running Locally

Open two terminals (PowerShell examples):

Backend:

```powershell
cd backend
npm install
node app.js   # or: npx nodemon app.js
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

### 7. Seeding Sample Data

To seed MongoDB with sample todos:

```powershell
cd backend/init
node index.js
```

This connects using `DB_URL`, clears existing todos, then inserts entries from `sampleData.js`.

### 8. Enabling API Integration in Frontend

Currently, all network calls in `App.jsx` are commented out and replaced with localStorage logic. To switch to backend persistence:

1. Add `VITE_API_BASE_URL` in a `frontend/.env` file pointing to your backend.
2. Uncomment the `fetchTodos`, `api.post`, `api.patch`, and `api.delete` sections in `App.jsx`.
3. Remove or adapt localStorage code paths (or keep them as an offline fallback).
4. Rebuild / restart dev server.

Optional: Implement optimistic UI updates and error rollbacks for better UX.

### 9. Deployment Notes

Frontend is deployed to Netlify at `https://aayzee.netlify.app`.

If deploying the backend:

- Host on a service (Render, Railway, Heroku alternative, Fly.io, or Vercel serverless if adapted).
- Set CORS to the deployed frontend origin (e.g., `https://aayzee.netlify.app`).
- Provide a production MongoDB URI (Atlas recommended).
- Update `VITE_API_BASE_URL` in Netlify environment settings to point to the live backend (e.g., `https://api.yourdomain.com/api`).

### 10. Future Improvements

- Integrate live API in production build
- Add user authentication (JWT) & multi-user isolation
- Pagination or virtualized list for large datasets
- Search & filter todos (completed / active)
- Optimistic updates & skeleton loaders
- Unit / integration tests (Jest + React Testing Library / Supertest for API)
- Dark mode toggle & accessibility audits (ARIA roles refinement)
- Error boundary & retry logic for network failures

### 11. Troubleshooting

- 404s on API calls: verify `VITE_API_BASE_URL` and backend port.
- CORS errors: ensure `origin` in `cors()` matches deployed frontend.
- Empty list after seed: confirm `.env` is loaded and `init/index.js` ran without errors.

### 12. License

No explicit license provided (default: all rights reserved). Add one if you intend open-source distribution.

---

Feel free to enable the backend integration and evolve the app—scaffolding is in place to extend functionality quickly.
