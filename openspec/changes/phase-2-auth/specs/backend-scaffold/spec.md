## MODIFIED Requirements

### Requirement: Backend service starts on port 3002
The backend SHALL be a Fastify + TypeScript project that starts successfully on port 3002 with no errors, keeps `GET /health` public, and requires authentication for non-public application routes.

#### Scenario: Health endpoint returns 200
- **WHEN** a GET request is made to `/health`
- **THEN** the server responds with HTTP 200 and body `{ "ok": true }`

#### Scenario: TypeScript compiles without errors
- **WHEN** `tsc --noEmit` is run in the `backend/` directory
- **THEN** no TypeScript errors are reported

#### Scenario: Protected route rejects anonymous request
- **WHEN** a request is made to a protected backend route without a valid Bearer token
- **THEN** the backend responds with HTTP 401
