## ADDED Requirements

### Requirement: Authenticated users can list their active activities
The backend SHALL provide a `GET /activities` endpoint that returns the authenticated user's activities and excludes archived records by default.

#### Scenario: List returns only the caller's active activities
- **WHEN** an authenticated user requests `GET /activities`
- **THEN** the backend returns only that user's activities whose `archivedAt` is null

### Requirement: Authenticated users can create activities
The backend SHALL provide a `POST /activities` endpoint that creates an activity for the authenticated user.

#### Scenario: Valid activity is created
- **WHEN** an authenticated user submits a valid activity with `name`, `type`, `weight`, recurrence data, and privacy flag
- **THEN** the backend creates the activity for that user and returns the created record

#### Scenario: Invalid type or weight is rejected
- **WHEN** an authenticated user submits an activity whose `type` is not `habit` or `task`, or whose `weight` is outside `1..5`
- **THEN** the backend responds with a client error and does not create the activity

### Requirement: Authenticated users can update their own activities
The backend SHALL provide a `PATCH /activities/:id` endpoint that updates mutable activity fields for the authenticated owner only.

#### Scenario: Owner updates activity fields
- **WHEN** an authenticated user sends a valid patch for one of their activities
- **THEN** the backend updates the requested fields and returns the updated activity

#### Scenario: Non-owner activity access returns 404
- **WHEN** an authenticated user attempts to update an activity they do not own
- **THEN** the backend responds with HTTP 404

### Requirement: Authenticated users can archive activities
The backend SHALL provide a `DELETE /activities/:id` endpoint that soft-deletes the authenticated user's activity by setting `archivedAt`.

#### Scenario: Delete archives the activity
- **WHEN** an authenticated user deletes one of their activities
- **THEN** the backend sets `archivedAt` and does not hard-delete the row

#### Scenario: Archived activity no longer appears in list results
- **WHEN** an activity has been archived
- **THEN** subsequent `GET /activities` requests for that user do not include it
