# Acme Full-stack Practice Task

A full-stack authentication and dashboard app built for the intern assignment. The project includes sign up, sign in, email verification, onboarding, organization management, and a protected analytics dashboard.

## Live Demo

- Frontend demo: https://intern-assignment-alpha-puce.vercel.app/
- Demo video: https://drive.google.com/file/d/1qx9KFq-_Cl8I6HUMhjpD7AKs-9RQGKfV/view?usp=drive_link

## Tech Stack

- Frontend: React, Vite, TypeScript
- UI: Tailwind CSS, shadcn/ui, lucide-react, Recharts
- State and data: Zustand, TanStack Query, Axios
- Forms: React Hook Form, Zod
- Backend: NestJS, TypeScript
- Database: PostgreSQL, Prisma
- Auth: JWT access and refresh tokens, Passport
- Uploads: Cloudinary
- Email: verification email service

## Deployment

- Frontend: Vercel
- Backend API: Render
- Database: Supabase Postgres
- Email delivery: Resend
- File uploads: Cloudinary

## Features

- Sign up and sign in
- Email verification flow
- Protected routes
- Profile onboarding with name and avatar upload
- Organization listing and creation
- Dashboard with metric cards, line charts, and bar charts
- Loading, empty, and error states
- Reusable UI components and shared copy constants

## Project Structure

```txt
intern_assignment/
  client/              React frontend
  server/              NestJS backend
  docker-compose.yml   Local PostgreSQL
  README.md
```

## Getting Started

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Run the backend

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The backend runs at `http://localhost:3000`.

### 3. Run the frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://huaquangdat:dat123321@localhost:5432/mydb?schema=public"

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

ONBOARDING_SECRET="your-onboarding-secret"
ONBOARDING_EXPIRES_IN="1d"

FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3000"

RESEND_API_KEY="your-resend-api-key"
MAIL_FROM_EMAIL="onboarding@your-domain.com"
MAIL_FROM_NAME="Acme Demo"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Useful Scripts

Backend:

```bash
npm run start:dev
npm run build
npm run seed
npm run test
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

## Demo Seed

Seed creates a verified demo user and sample organizations:

```bash
cd server
npm run seed
```

If Prisma seed is unavailable in your environment, run:

```bash
node --loader ts-node/esm prisma/seed.ts
```

## Notes

- The app uses JWT tokens stored on the client for simplicity.
- Onboarding is required before accessing protected app screens.
- Organizations currently use a single-owner model.
- Dashboard data is mock analytics data returned by the backend.

## Assumptions and Trade-offs

- The app uses JWT tokens stored on the client for a simpler demo implementation. This keeps the auth flow straightforward, but is less robust than cookie approach for production.
- Organizations currently use a single-owner model. This reduces backend and UI complexity, but advanced collaboration features such as memberships, roles, and invitations are not included.
- Dashboard analytics are seeded and mock data designed to support the required screens and interactions. This keeps the assignment focused on product flow and UI, but the metrics are not connected to a real analytics pipeline.
- Email verification is handled through Resend. This avoids SMTP networking issues during deployment, but it requires a verified sending domain in order to work in production.
- The onboarding flow continues directly from email verification into profile setup, then into the app without forcing the user to log in again. This improves UX, but adds a custom onboarding token flow that would need extra hardening in a production system.

---

## Backend Unit Tests

Tests are written with **Jest** + **@nestjs/testing** and run in ESM mode.

```bash
cd server
npm test
```

### What is tested

| File | Covers |
|---|---|
| `auth/dto/auth.service.spec.ts` | `signUp`, `login`, `verifyEmail`, `refreshTokens`, `completeOnboarding` |
| `auth/token.service.spec.ts` | `issueTokens`, `verifyOnboardingToken` |

**`AuthService`** — all external dependencies (Prisma, mail, storage, TokenService) are mocked. Key cases:
- `signUp`: duplicate email → `ConflictException`; new email → creates user + sends verification mail
- `login`: user not found / wrong password / unverified email → `UnauthorizedException`; valid credentials → returns tokens + user
- `verifyEmail`: invalid token → `BadRequestException`; valid token → marks email verified
- `refreshTokens`: user not found → issues tokens directly; found → returns full auth response
- `completeOnboarding`: bad onboarding token / user not found / email not verified → throws; happy path with and without avatar upload

**`TokenService`** — `JwtService` and `ConfigService` are mocked:
- `issueTokens`: calls `jwt.sign` twice, returns `{ accessToken, refreshToken }`
- `verifyOnboardingToken`: valid token → returns payload; invalid/expired token → throws

### Total: 21 tests, 3 suites — all passing ✅

