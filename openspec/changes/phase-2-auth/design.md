## Context

The backend currently exposes only a public `/health` route and has no route organization or authentication layer. Phase 2 needs to introduce account creation and login against the existing SQLite schema, then enforce authenticated access for future business endpoints.

The `users` table already exists with `email`, `password_hash`, and `display_name`, so this phase can build directly on the current database without altering the schema. The implementation should stay small and explicit: local auth only, signed JWTs, and Fastify hooks/plugins that later phases can reuse.

## Goals / Non-Goals

**Goals:**
- Implement `POST /auth/register` and `POST /auth/login`
- Hash passwords before storing them and verify hashes during login
- Issue JWTs that encode the authenticated user id
- Enforce auth on non-public routes by default and expose authenticated user context to handlers
- Keep the health endpoint publicly reachable

**Non-Goals:**
- Password reset, email verification, refresh tokens, or OAuth providers
- Role-based access control
- Frontend auth UI
- Session storage outside JWTs

## Decisions

### Use Fastify plugins for JWT and auth enforcement
Authentication should be centralized in Fastify plugins rather than reimplemented per route. One plugin can register JWT support and decorate requests with the authenticated user, while another can enforce auth in an `onRequest` or `preHandler` hook for protected routes.

Alternative considered: verify tokens manually inside each route. Rejected because it duplicates security-sensitive logic and will not scale as the route surface grows.

### Use bcrypt for password hashing
Passwords should be hashed with a standard adaptive hashing function rather than a simple digest. `bcryptjs` keeps setup simple in this codebase because it avoids native build complexity on top of the existing SQLite native module.

Alternative considered: Node crypto hashes. Rejected because they are not appropriate password hashes.

### Keep auth routes under `/auth` and treat `/health` as explicitly public
The public surface should stay very small and obvious. This phase only needs `/health`, `/auth/register`, and `/auth/login` as unauthenticated routes.

Alternative considered: opt-in protection per route. Rejected because future phases are user-specific by default, so protected-by-default is the safer baseline.

### JWT payload should contain only the user id
The token only needs to establish caller identity. Additional claims can be added later if there is a concrete need.

Alternative considered: include email and display name in the token. Rejected because it creates stale duplicated user data with no benefit in this phase.

## Risks / Trade-offs

- Protected-by-default routing can accidentally block operational endpoints -> Keep the public route list explicit and small, and verify `/health` plus both auth endpoints manually
- Weak JWT secret handling would undermine the whole auth layer -> Require `JWT_SECRET` from env and fail fast if it is missing
- Authentication code often grows ad hoc -> Keep DB access, hashing, token issuance, and route wiring in separate backend modules

## Migration Plan

1. Add auth dependencies and env expectations
2. Introduce database helpers for reading and creating users
3. Add JWT and auth enforcement plugins to Fastify
4. Register `/auth/register` and `/auth/login`
5. Verify register, login, and unauthorized/authorized access behavior

Rollback is simple at this phase: revert the auth modules and dependency changes. No schema migration is required.
