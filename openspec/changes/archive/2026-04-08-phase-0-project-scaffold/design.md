## Context

Tilld is a new greenfield project with no existing code. The stack is fixed by design: Fastify (backend), Next.js App Router (frontend), Drizzle ORM + better-sqlite3 (data), TypeScript throughout. Both services will eventually run in Docker behind Caddy on a VPS alongside another app (Pothos).

## Goals / Non-Goals

**Goals:**
- Monorepo with `backend/` and `frontend/` directories, each as an independent Node.js package
- Backend boots on port 3002, serves `GET /health → { ok: true }`, TypeScript compiles cleanly
- Frontend boots on port 3000, renders without errors (blank/stub page is fine)
- Drizzle ORM + better-sqlite3 installed in backend; `drizzle.config.ts` present
- `/data/` directory committed (empty placeholder), contents git-ignored
- `.env.example` for each service documenting required variables
- Root `docker-compose.yml` that starts both services

**Non-Goals:**
- No database schema or migrations (Phase 1)
- No auth, routes, or business logic (Phase 2+)
- No Caddy config or production deployment (Phase 13)
- No frontend API integration

## Decisions

### Monorepo structure: simple directories, no workspace tooling
Using `backend/` and `frontend/` as separate `package.json` roots without pnpm/npm workspaces. They share nothing at this phase and adding workspace plumbing would be premature overhead.

### TypeScript: `ts-node-esm` for backend dev, `tsc` for type-checking
Fastify works well with ts-node. No transpile step at dev time — `ts-node --esm` or `tsx` for hot reload. `tsc --noEmit` is the quality gate.

### SQLite file location: `/data/tilld.db`
Consistent with the production layout described in CLAUDE.md. The `/data/` directory is created locally, its contents git-ignored via `.gitignore`, but the directory itself is tracked via a `.gitkeep`.

### Docker: simple `node:20-alpine` images, no multi-stage at this phase
Multi-stage builds (compile → run) are correct for production but add complexity before there is any real code. A single stage that mounts source and runs `tsx` is sufficient for Phase 0. Production optimisation is Phase 13's job.

## Risks / Trade-offs

- **better-sqlite3 is a native module** → may need rebuild in Docker. Mitigation: use the `node:20-alpine` image and ensure the Dockerfile runs `npm install` inside the container (not copying a host `node_modules`).
- **Diverging TypeScript configs** between backend and frontend → Mitigation: each service has its own `tsconfig.json`; no root-level TypeScript config to avoid confusion.

## Migration Plan

Greenfield — no migration needed. Bootstrap order:

1. Create directory structure
2. Initialise each package (`npm init`, install deps)
3. Add TypeScript configs and entry points
4. Verify services start locally
5. Add Docker Compose
6. Verify services start via Docker
