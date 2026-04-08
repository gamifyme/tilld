## ADDED Requirements

### Requirement: Users can register with email and password
The backend SHALL provide a `POST /auth/register` endpoint that accepts `email`, `password`, and `displayName`, creates a user record, and returns a JWT for the new user.

#### Scenario: Successful registration returns a token
- **WHEN** a client submits valid registration data for an email that is not already in use
- **THEN** the backend creates the user, stores a hashed password, and returns a JWT

#### Scenario: Duplicate email is rejected
- **WHEN** a client submits registration data for an email that already exists
- **THEN** the backend responds with an error and does not create another user

### Requirement: Users can log in with existing credentials
The backend SHALL provide a `POST /auth/login` endpoint that accepts `email` and `password`, validates the credentials, and returns a JWT for the matching user.

#### Scenario: Successful login returns a token
- **WHEN** a client submits valid credentials for an existing user
- **THEN** the backend responds with a JWT for that user

#### Scenario: Invalid credentials are rejected
- **WHEN** a client submits an unknown email or incorrect password
- **THEN** the backend responds with an authentication error

### Requirement: Protected routes receive authenticated user context
The backend SHALL validate Bearer JWTs on protected routes and attach the authenticated `userId` to the request context for downstream handlers.

#### Scenario: Protected route with valid token succeeds
- **WHEN** a client sends a valid Bearer token to a protected route
- **THEN** the backend allows the request and makes the authenticated `userId` available to the handler

#### Scenario: Protected route without token is rejected
- **WHEN** a client sends a request to a protected route without a valid Bearer token
- **THEN** the backend responds with HTTP 401
