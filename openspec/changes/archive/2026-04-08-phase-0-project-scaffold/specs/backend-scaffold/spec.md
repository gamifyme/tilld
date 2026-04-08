## ADDED Requirements

### Requirement: Backend service starts on port 3002
The backend SHALL be a Fastify + TypeScript project that starts successfully on port 3002 with no errors.

#### Scenario: Health endpoint returns 200
- **WHEN** a GET request is made to `/health`
- **THEN** the server responds with HTTP 200 and body `{ "ok": true }`

#### Scenario: TypeScript compiles without errors
- **WHEN** `tsc --noEmit` is run in the `backend/` directory
- **THEN** no TypeScript errors are reported

### Requirement: Drizzle ORM is installed and configured
The backend SHALL have Drizzle ORM and `better-sqlite3` installed, with a `drizzle.config.ts` pointing to the SQLite database file at `/data/tilld.db`.

#### Scenario: drizzle.config.ts is present
- **WHEN** the backend directory is inspected
- **THEN** `drizzle.config.ts` exists and references the correct database path

### Requirement: Data directory is initialised
The `/data/` directory SHALL exist in the repository root with a `.gitkeep` file. The contents of `/data/` SHALL be listed in `.gitignore` so database files are never committed.

#### Scenario: Data directory is tracked but contents are ignored
- **WHEN** `git status` is run on a fresh clone
- **THEN** the `/data/` directory exists and `.gitkeep` is tracked, but `*.db` files in `/data/` are not tracked

### Requirement: Backend environment variables are documented
A `.env.example` file SHALL exist in `backend/` listing all required environment variables with placeholder values.

#### Scenario: .env.example contains required keys
- **WHEN** `backend/.env.example` is read
- **THEN** it contains entries for `DATABASE_URL`, `JWT_SECRET`, and `PORT`
