## Why

Tilld has no runnable code yet. Before any feature work can begin, the monorepo skeleton must exist — both services need to start cleanly so that every subsequent phase has a working foundation to build on.

## What Changes

- Create `tilld/` monorepo with `backend/` and `frontend/` subdirectories
- Initialise `backend/` as a Fastify + TypeScript project on port 3002 with a `/health` route
- Initialise `frontend/` as a Next.js + TypeScript project (App Router) on port 3000
- Install Drizzle ORM + `better-sqlite3` in the backend
- Add `drizzle.config.ts`
- Create `/data/` directory (git-ignored content, folder retained)
- Add `.env.example` for both backend and frontend
- Create root `docker-compose.yml` with backend and frontend services

## Capabilities

### New Capabilities

- `backend-scaffold`: Fastify + TypeScript service with health endpoint, Drizzle ORM installed, and environment config
- `frontend-scaffold`: Next.js App Router project with TypeScript, minimal root page, and environment config
- `docker-compose`: Root compose file that boots both services together

### Modified Capabilities

## Impact

- Creates the entire project directory structure from scratch
- No existing code affected (greenfield)
- Dependencies introduced: Fastify, TypeScript, Drizzle ORM, better-sqlite3, Next.js
- Docker Compose added at the repo root
