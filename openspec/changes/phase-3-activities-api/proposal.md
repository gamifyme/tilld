## Why

Users can now authenticate, but they still cannot define the habits and tasks that drive the rest of the app. Phase 3 adds the first real user-owned resource API so authenticated users can create and manage their activities.

## What Changes

- Add authenticated CRUD endpoints for activities
- Validate activity input for type and weight constraints
- Implement soft-delete behavior via `archivedAt` instead of hard deletion
- Ensure users can only read and modify their own activities

## Capabilities

### New Capabilities
- `activities-api`: Authenticated CRUD operations for user activities, including validation and soft-delete behavior

### Modified Capabilities
- `user-auth`: Authenticated request handling now supports user-owned application endpoints beyond auth bootstrap routes

## Impact

- Affects backend route registration, activity data access, and request validation
- Builds on the authenticated `userId` context introduced in Phase 2
- Establishes the backend contract needed by commitments, scoring, and frontend activity management
