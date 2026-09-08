# JWT Authentication App (MERN)

A complete JWT-based authentication project — Register, Login, Protected Dashboard, Logout.
Frontend: React + Vite + Tailwind CSS. Backend: Node.js + Express + MongoDB.

## Features
- ✓ Secure JWT token-based authentication
- ✓ Three role levels: User, Manager, and Admin
- ✓ Protected routes with role-based authorization
- ✓ Responsive design with Tailwind CSS
- ✓ Role-specific dashboards:
  - **User** — personal task tracker (add/update/delete tasks, completed vs pending count)
  - **Manager** — team overview (total members, total tasks, per-user task completion breakdown)
  - **Admin** — user management (total users/managers/admins, change any user's role, delete users)

## Authentication Flow

### Register
1. **Client:** Submit form → AuthContext → `POST /api/auth/register`
2. **Server:**
   - Hash password (bcrypt)
   - Create user
   - Generate JWT token
   - Return token + user data

### Login
1. **Client:** Submit credentials → `POST /api/auth/login`
2. **Server:**
   - Find user + compare passwords
   - Generate JWT token
   - Return token + user data

### Token Storage & Usage
- **Storage:** localStorage (key: `'token'`)
- **Auto-attach:** Axios interceptors add `Authorization: Bearer <token>` to all requests

### Protection
**Client-side:**
```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

**Server-side:**
```js
router.get('/admin', protect, authorize('admin'), controller);
```

### Security
- Tokens signed with secret key + expiration
- Passwords hashed with bcrypt
- Role validation on both client & server

### Logout
Remove token from localStorage + clear auth state + remove headers

> Complete stateless authentication suitable for production MERN apps.

---

## 1. Run Locally First (test before deploying)

### Backend
```
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL=http://localhost:5000/api
npm run dev
```
Open http://localhost:5173 — register a user, login, view dashboard, logout.

---

## 2. Get a Free MongoDB Database (MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas and sign up (free).
2. Create a free "M0" cluster.
3. Under "Database Access" create a user with a password.
4. Under "Network Access" add `0.0.0.0/0` (allow from anywhere).
5. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jwtauth`
6. Paste this into `MONGO_URI` in your backend `.env`.

> **Using MongoDB Compass:** You can use the same connection string in Compass (Atlas dashboard → Connect → "Compass" option) to visually browse your `jwtauth` database. After you register a user through the app, refresh Compass — you'll see the new document in the `users` collection with the hashed password, confirming the backend is connected correctly.

---

## 3. Deploy the Backend (Render — free)
1. Push this project to a GitHub repository.
2. Go to https://render.com → Sign up/login → "New +" → "Web Service".
3. Connect your GitHub repo, select the `backend` folder as the root directory.
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (same as your `.env`): `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.
6. Deploy. Render will give you a live URL like `https://your-app.onrender.com`.

(Netlify/Vercel mainly host static/frontend sites — for an Express server, Render or Railway free tier works best. If your assignment specifically wants Vercel for the backend too, it can be deployed as Vercel Serverless Functions, but Render is simpler for a plain Express app.)

---

## 4. Deploy the Frontend (Vercel or Netlify — free)

### Option A: Vercel
1. Go to https://vercel.com → Sign up/login → "Add New" → "Project".
2. Import your GitHub repo, set the root directory to `frontend`.
3. Framework Preset: Vite.
4. Add Environment Variable: `VITE_API_URL` = your Render backend URL + `/api` (e.g. `https://your-app.onrender.com/api`).
5. Deploy. You'll get a live link like `https://your-app.vercel.app`.

### Option B: Netlify
1. Go to https://netlify.com → "Add new site" → "Import an existing project".
2. Connect GitHub repo, set base directory to `frontend`.
3. Build command: `npm run build`, Publish directory: `frontend/dist`.
4. Add Environment Variable: `VITE_API_URL` (same as above).
5. Deploy.

---

## 5. Test the Live App & Take Screenshots
Once both are deployed, open your live frontend link and capture screenshots of:
1. Register page (with a filled form)
2. Successful registration → redirected to Dashboard
3. Login page
4. Successful login → Dashboard showing user name/email/role
5. Logout action (redirected back to Login)
6. (Optional) Browser DevTools → Application tab → showing JWT token stored in localStorage
7. (Optional) Network tab showing `Authorization: Bearer <token>` header on a request

Paste these screenshots into a Word document with a short caption under each one — that becomes your Q4 submission.

---

## Project Structure
```
jwt-auth-app/
├── backend/
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── middleware/auth.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/ (Login, Register, Dashboard)
    │   ├── context/AuthContext.jsx
    │   ├── components/ProtectedRoute.jsx
    │   └── api/axios.js
    └── package.json
```
