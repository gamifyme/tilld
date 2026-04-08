## MODIFIED Requirements

### Requirement: Protected routes receive authenticated user context
The backend SHALL validate Bearer JWTs on protected routes and attach the authenticated `userId` to the request context for downstream handlers, including user-owned application routes such as activities.

#### Scenario: Protected route with valid token succeeds
- **WHEN** a client sends a valid Bearer token to a protected route
- **THEN** the backend allows the request and makes the authenticated `userId` available to the handler

#### Scenario: Protected route without token is rejected
- **WHEN** a client sends a request to a protected route without a valid Bearer token
- **THEN** the backend responds with HTTP 401
