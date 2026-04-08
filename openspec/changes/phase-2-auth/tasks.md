## 1. Auth Dependencies and Configuration

- [ ] 1.1 Add backend dependencies for JWT signing/verification and password hashing
- [ ] 1.2 Validate required auth environment variables and document any new backend config expectations

## 2. User Auth Implementation

- [ ] 2.1 Add backend data access helpers for creating users and loading users by email/id
- [ ] 2.2 Implement `POST /auth/register` with validation, password hashing, duplicate-email rejection, and JWT issuance
- [ ] 2.3 Implement `POST /auth/login` with credential verification and JWT issuance

## 3. Request Authentication

- [ ] 3.1 Add a Fastify auth plugin that verifies Bearer JWTs and decorates requests with `userId`
- [ ] 3.2 Register auth/public routes so `/health`, `/auth/register`, and `/auth/login` stay public while other routes are protected by default
- [ ] 3.3 Add at least one protected probe route or equivalent verification path to confirm anonymous requests are rejected and authenticated requests succeed

## 4. Verification

- [ ] 4.1 Verify `tsc --noEmit` passes in `backend/`
- [ ] 4.2 Verify register, login, and protected-route access with HTTP requests
- [ ] 4.3 Verify invalid credentials and missing/invalid tokens return HTTP 401 or a clear client error
