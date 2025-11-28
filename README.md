# WatchOut

WatchOut is a full-stack transparency portal that connects citizens, verified companies, and government auditors. It provides Firebase-backed authentication (email/password + Google OAuth), Cloudinary document uploads, Firestore persistence, and a government-only dashboard for approving or rejecting company vendors.

## Tech Stack

- **Backend:** Node.js, Express.js, Firebase Admin (Auth + Firestore), Cloudinary
- **Frontend:** React (Vite), Tailwind CSS, Firebase Web SDK, React Hook Form, react-hot-toast
- **Security:** JWT for government admins, CSRF protection, rate limiting, Helmet, CORS with allow-list

## Project Structure

```
watchOut/
├── Backend/          # Express API
└── Frontend/         # React single-page app
```

## Getting Started

### 1. Backend

```bash
cd Backend
cp .env.example .env   # fill in all secrets
npm install
npm run dev            # or `npm start` for production mode
```

Key environment variables (see `.env.example` for the full list):

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `FRONTEND_URL` | Comma-separated allow-list for CORS/CSRF (e.g. `http://localhost:5173`) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Admin credentials |
| `FIREBASE_API_KEY` | Used for Firebase Identity REST calls (email/password login) |
| `CLOUDINARY_*` | Cloudinary upload credentials |
| `GOVT_ADMIN_EMAIL`, `GOVT_ADMIN_PASSWORD` | Government admin login (plain text or bcrypt hash) |
| `JWT_SECRET` | Used to sign government dashboard tokens |

> **Note:** `FIREBASE_PRIVATE_KEY` must keep newline escapes (`\n`) if stored inline.

### 2. Frontend

```bash
cd Frontend
cp .env.example .env.local   # configure API + Firebase web keys
npm install
npm run dev                  # launches Vite dev server on 5173
```

Frontend environment variables:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL for the backend (e.g. `http://localhost:5000`) |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_APP_ID` | Firebase web config used for Google OAuth |

## Core Features

- **Role-based auth:** Regular users, companies, and government administrators.
- **Firebase Authentication:** Email/password + Google OAuth for both users and companies.
- **Company onboarding:** Cloudinary document uploads, Firestore `companies` collection with status tracking.
- **Government portal:** JWT-protected dashboard with analytics, pending approvals, approval/rejection actions, and an activity log.
- **Security:** Helmet, CORS allow-list, CSRF protection with double-submit cookie, rate limiting on auth routes, password hashing, and HTTPS-ready configuration.
- **React client:** Shared AuthContext with token persistence, protected routes, Google sign-in helpers, and Tailwind UI components.

## API Surface

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Email/password signup via Firebase |
| POST | `/api/auth/login` | Email/password login (returns Firebase ID token) |
| POST | `/api/auth/google-login` | Google OAuth bridge (verifies Firebase ID token) |
| POST | `/api/auth/government-login` | JWT login for government admin |
| GET | `/api/auth/verify-token` | Validates Firebase tokens |
| POST | `/api/companies/register` | Company profile + docs (Cloudinary) |
| GET | `/api/companies/profile` | Current company profile |
| GET | `/api/government/pending-companies` | Pending approvals list |
| GET | `/api/government/company/:id` | Company detail view |
| PUT | `/api/government/approve/:id` | Approve company |
| PUT | `/api/government/reject/:id` | Reject company with reason |
| GET | `/api/government/analytics` | Summary stats + activity |
| GET | `/api/government/status/:status` | Filtered companies (`pending|approved|rejected`) |

All mutating requests require a valid CSRF token (fetched via `/api/csrf-token`) and appropriate Authorization headers.

## Development Notes

- Frontend protected routes (`ProtectedRoute`, `GovernmentRoute`) guard access based on Firebase tokens or JWT.
- The company dashboard automatically fetches profile data and allows re-submission if a company was rejected.
- Government dashboard actions refresh analytics, pending queues, and the activity log in real time.
- Activity logs capture major events (signups, approvals, rejections) inside Firestore’s `activityLogs` collection.

## Testing Checklist

- [ ] Email/password signup & login (user + company)
- [ ] Google OAuth flows (user + company)
- [ ] Company registration with Cloudinary uploads
- [ ] Government login + approval/rejection actions
- [ ] CSRF token retrieval + form submissions
- [ ] Role-based route protection on the frontend

## Production Deployment

- Host the backend behind HTTPS (e.g., with a reverse proxy or managed platform).  
- Configure Firebase service credentials using secrets or workload identity.  
- Set `FRONTEND_URL` to the production origin(s).  
- Rotate `JWT_SECRET` and `GOVT_ADMIN_PASSWORD` frequently, storing them in a secure secret manager.  
- Ensure Cloudinary and Firebase rules restrict access per environment.

Happy auditing! 🎯
