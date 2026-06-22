# Acme — Fullstack Authentication & Dashboard App

A full-stack web application built as part of an intern assignment. It features a complete authentication flow (sign-up, email verification, onboarding) and a protected dashboard, built with **NestJS** on the backend and **React + Vite** on the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TypeScript |
| **Styling** | Tailwind CSS v4, ShadCN UI |
| **State Management** | Zustand |
| **Form Handling** | React Hook Form + Zod |
| **Data Fetching** | TanStack Query (React Query) + Axios |
| **Routing** | React Router v7 |
| **Backend** | NestJS 11, TypeScript |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 7 |
| **Auth** | JWT (access + refresh tokens) + Passport |
| **File Storage** | Cloudinary (avatar uploads) |
| **Email** | Nodemailer + Gmail SMTP |

---

## Features

- ✅ Sign Up with email verification (link sent via email)
- ✅ Sign In with JWT-based session (access + refresh tokens)
- ✅ Token refresh flow (silent re-authentication)
- ✅ Protected routes — unauthenticated users are redirected to `/signin`
- ✅ Onboarding flow — new users set up their name and avatar before accessing the dashboard
- ✅ Avatar upload to Cloudinary
- ✅ Organization management on the dashboard
- ✅ Dark/Light mode toggle
- ✅ Route transition indicator

---

## Project Structure

```
intern_assignment/
├── client/          # React frontend (Vite)
├── server/          # NestJS backend
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) (for running PostgreSQL)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for SMTP

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd intern_assignment
```

### 2. Start the database

The project uses Docker Compose to spin up a PostgreSQL instance:

```bash
docker-compose up -d
```

This will start PostgreSQL on port `5432` with the following defaults:
- **User:** `huaquangdat`
- **Password:** `dat123321`
- **Database:** `mydb`

### 3. Configure the backend

```bash
cd server
```

Create a `.env` file (copy from the example below and fill in your values):

```env
# Database
DATABASE_URL="postgresql://huaquangdat:dat123321@localhost:5432/mydb?schema=public"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Onboarding token
ONBOARDING_SECRET="your-onboarding-secret"
ONBOARDING_EXPIRES_IN="1d"

# App URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
MAIL_FROM_EMAIL="your-email@gmail.com"
MAIL_FROM_NAME="Demo"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Install backend dependencies and run migrations

```bash
cd server
npm install
npx prisma migrate dev
npm run start:dev
```

The server will start at **http://localhost:3000**.

#### (Optional) Seed the database

```bash
npx prisma db seed
```

### 5. Configure and start the frontend

```bash
cd ../client
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Sign in, returns access & refresh tokens |
| `POST` | `/auth/verify-email` | ❌ | Verify email with token (from request body) |
| `GET` | `/auth/verify-email?token=` | ❌ | Verify email via link (redirect) |
| `POST` | `/auth/resend-verification` | ❌ | Resend verification email |
| `POST` | `/auth/complete-onboarding` | ❌ | Complete profile setup after email verification |
| `POST` | `/auth/refresh` | 🔑 Refresh token | Obtain a new access token |
| `GET` | `/auth/me` | 🔑 Access token | Get the current authenticated user |

---

## Assumptions & Trade-offs

### Assumptions

1. **Email verification is required before login.** A user who signs up but has not verified their email cannot log in. This adds friction but significantly reduces fake accounts.

2. **Onboarding is mandatory.** After email verification, a user must complete the onboarding step (name + optional avatar) before accessing the dashboard. The `onboardingCompleted` flag on the `User` model controls this gate.

3. **Gmail SMTP is used for emails.** The project assumes you have a Gmail account and an App Password configured. Any SMTP provider can be substituted by updating the `.env` variables.

4. **A single Cloudinary account handles all uploads.** Avatar images are uploaded directly from the backend to Cloudinary. This means the backend must have valid Cloudinary credentials.

5. **Tokens are stored in `localStorage` (via Zustand).** This was chosen for simplicity during development. `HttpOnly` cookies would be more secure in a production environment.

### Trade-offs

| Decision | Trade-off |
|---|---|
| **JWT stored in `localStorage`** | Simple to implement; but vulnerable to XSS attacks. An `HttpOnly` cookie-based approach would be safer for production. |
| **Access token expires in 15 minutes** | Short-lived tokens limit damage if stolen, but require a refresh flow that adds complexity. |
| **Cloudinary for avatar storage** | Offloads file storage concerns and CDN delivery, but introduces an external service dependency and requires credentials to be configured. |
| **No rate limiting on auth endpoints** | Not implemented to keep the scope minimal. In production, endpoints like `/auth/login` and `/auth/resend-verification` should be rate-limited to prevent brute force and abuse. |
| **No role-based access control (RBAC)** | The current `User` model has no roles. Organizations have a single owner. Extending to multi-role teams would require a more complex permission model. |
| **Email verification token is single-use and expires in 1 day** | Balances security and usability — tokens cannot be reused after consumption, but users have a full day to verify. |
| **Prisma with `generated/` output outside `node_modules`** | The Prisma client is generated to `../generated/prisma` to make it easier to inspect types. This is a minor deviation from the default setup but keeps generated code visible. |
