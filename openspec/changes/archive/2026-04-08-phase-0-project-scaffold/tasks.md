## 1. Directory Structure

- [x] 1.1 Create `backend/` and `frontend/` directories at the repo root
- [x] 1.2 Create `/data/` directory with a `.gitkeep` file
- [x] 1.3 Add `/data/*.db` and `/data/*.db-*` to `.gitignore` (keep the directory itself tracked)

## 2. Backend Initialisation

- [x] 2.1 Run `npm init -y` in `backend/`
- [x] 2.2 Install Fastify, TypeScript, ts-node/tsx, and type definitions (`@types/node`)
- [x] 2.3 Install Drizzle ORM (`drizzle-orm`, `drizzle-kit`) and `better-sqlite3` + `@types/better-sqlite3`
- [x] 2.4 Create `backend/tsconfig.json` with strict mode enabled
- [x] 2.5 Create `backend/src/index.ts` — Fastify server that listens on port 3002 and exposes `GET /health → { ok: true }`
- [x] 2.6 Create `backend/drizzle.config.ts` pointing to `../data/tilld.db`
- [x] 2.7 Add `dev` script to `backend/package.json` (e.g., `tsx src/index.ts`)
- [x] 2.8 Verify `npm run dev` starts the server and `curl localhost:3002/health` returns `{ "ok": true }`
- [x] 2.9 Verify `tsc --noEmit` passes with no errors

## 3. Backend Environment Config

- [x] 3.1 Create `backend/.env.example` with `DATABASE_URL`, `JWT_SECRET`, and `PORT`
- [x] 3.2 Create `backend/.env` from `.env.example` for local dev (add to `.gitignore`)

## 4. Frontend Initialisation

- [x] 4.1 Scaffold Next.js project in `frontend/` with `npx create-next-app@latest --typescript --app --no-src-dir --no-tailwind --no-eslint --import-alias "@/*" .`
- [x] 4.2 Verify the default `app/page.tsx` renders without errors at `http://localhost:3000`
- [x] 4.3 Verify `tsc --noEmit` passes in `frontend/`

## 5. Frontend Environment Config

- [x] 5.1 Create `frontend/.env.example` with `NEXT_PUBLIC_API_URL`
- [x] 5.2 Create `frontend/.env.local` from `.env.example` for local dev (add to `.gitignore`)

## 6. Docker Compose

- [x] 6.1 Create root `docker-compose.yml` with `backend` service (port 3002, volume mount for `/data/`)
- [x] 6.2 Add `frontend` service to `docker-compose.yml` (port 3000)
- [x] 6.3 Create `backend/Dockerfile` (node:20-alpine, installs deps, runs tsx)
- [x] 6.4 Create `frontend/Dockerfile` (node:20-alpine, installs deps, runs next dev or next start)
- [x] 6.5 Run `docker compose up` and verify both services are reachable
- [x] 6.6 Restart containers and verify `/data/` volume persists any written files
