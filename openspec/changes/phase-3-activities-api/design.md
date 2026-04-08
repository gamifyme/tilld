## Context

The backend now supports registration, login, and authenticated requests, and the database already includes an `activities` table. Phase 3 needs to expose that table through authenticated CRUD endpoints while preserving per-user isolation and the soft-delete semantics expected by later phases.

Activities are a foundational entity for commitments, entries, scoring, and frontend management screens. The API should be conservative: thin handlers, explicit validation, and repository/service helpers that keep ownership checks and archived filtering consistent.

## Goals / Non-Goals

**Goals:**
- Implement `GET /activities`, `POST /activities`, `PATCH /activities/:id`, and `DELETE /activities/:id`
- Restrict all activity access to the authenticated user
- Validate `type` as `habit` or `task` and `weight` in the range `1..5`
- Soft-delete activities by setting `archivedAt`
- Exclude archived activities from the default list response

**Non-Goals:**
- Commitments or recurrence expansion behavior
- Bulk activity operations
- Restoring archived activities
- Frontend activity screens

## Decisions

### Keep activity access in a dedicated repository/service layer
Activity persistence and ownership checks should live outside route handlers so later phases can reuse them for commitments and scoring.

Alternative considered: write Drizzle queries directly inside each route. Rejected because ownership checks and patch behavior would be duplicated across handlers.

### Use partial updates for `PATCH /activities/:id`
The patch route should only update mutable fields that are present in the request body. This matches the Phase 3 requirement and keeps clients from resending the full record unnecessarily.

Alternative considered: replace the whole activity record on update. Rejected because it creates unnecessary coupling to server-managed fields.

### Treat delete as archival
Deleting an activity should set `archivedAt` and leave the record in place. Later history and score features depend on past relationships staying intact.

Alternative considered: hard delete. Rejected because it would break historical integrity for commitments and entries.

## Risks / Trade-offs

- Patch validation can become inconsistent across fields -> Centralize validation in a service-level helper and keep allowed fields explicit
- Ownership bugs would leak user data -> Require `userId` on every repository lookup and update path, and verify with request-level probes
- Soft-deleted activities can accidentally remain visible -> Filter archived records out in the list query by default

## Migration Plan

1. Add activity repository/service helpers on top of the existing schema
2. Register authenticated activity routes
3. Validate CRUD behavior with seeded or newly created users
4. Verify archived activities disappear from list results while remaining stored in the database

No schema migration is required for this phase because the `activities` table already supports the needed fields.
