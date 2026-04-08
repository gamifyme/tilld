## ADDED Requirements

### Requirement: Root docker-compose.yml boots both services
A `docker-compose.yml` SHALL exist at the repository root and define both `backend` and `frontend` services. Running `docker compose up` SHALL start both services successfully.

#### Scenario: Backend service starts via Docker
- **WHEN** `docker compose up` is run
- **THEN** the backend container starts and `GET http://localhost:3002/health` returns `{ "ok": true }`

#### Scenario: Frontend service starts via Docker
- **WHEN** `docker compose up` is run
- **THEN** the frontend container starts and `http://localhost:3000` returns HTTP 200

### Requirement: SQLite data directory is volume-mounted
The `docker-compose.yml` SHALL mount the host `/data/` directory into the backend container so that the SQLite database file persists across container restarts.

#### Scenario: Database file persists after container restart
- **WHEN** the backend container is stopped and restarted
- **THEN** any SQLite file written to `/data/` on the host is still present and accessible
