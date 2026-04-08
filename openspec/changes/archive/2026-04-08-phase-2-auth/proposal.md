## Why

The backend has a database and seed data, but every request is still effectively anonymous. Phase 2 establishes account creation, login, and request authentication so later user-specific APIs can trust the caller identity and keep data isolated.

## What Changes

- Add registration and login endpoints that create users and issue JWTs
- Add password hashing and JWT signing/verification to the backend
- Introduce a Fastify authentication plugin that validates Bearer tokens and attaches `userId` to protected requests
- Make non-auth routes protected by default while preserving public access for health and auth endpoints

## Capabilities

### New Capabilities
- `user-auth`: User registration, login, JWT issuance, and request authentication for the backend

### Modified Capabilities
- `backend-scaffold`: Backend routing behavior changes from an open scaffold to a service with protected routes by default and explicit public endpoints

## Impact

- Affects backend dependencies, route registration, Fastify plugins, and database access for users
- Introduces password hashing and JWT configuration requirements
- Changes the request contract for all future non-auth backend routes
