## 1. Auth Dependencies and Configuration

- [x] 1.1 Add backend dependencies for JWT signing/verification and password hashing
- [x] 1.2 Validate required auth environment variables and document any new backend config expectations

## 2. User Auth Implementation

- [x] 2.1 Add backend data access helpers for creating users and loading users by email/id
- [x] 2.2 Implement `POST /auth/register` with validation, password hashing, duplicate-email rejection, and JWT issuance
- [x] 2.3 Implement `POST /auth/login` with credential verification and JWT issuance

## 3. Request Authentication

- [x] 3.1 Add a Fastify auth plugin that verifies Bearer JWTs and decorates requests with `userId`
- [x] 3.2 Register auth/public routes so `/health`, `/auth/register`, and `/auth/login` stay public while other routes are protected by default
- [x] 3.3 Add at least one protected probe route or equivalent verification path to confirm anonymous requests are rejected and authenticated requests succeed

## 4. Verification

- [x] 4.1 Verify `tsc --noEmit` passes in `backend/`
- [x] 4.2 Verify register, login, and protected-route access with HTTP requests
- [x] 4.3 Verify invalid credentials and missing/invalid tokens return HTTP 401 or a clear client error
