## 1. Activity Data Access

- [ ] 1.1 Add backend repository helpers for listing, creating, updating, and archiving activities scoped to an authenticated user
- [ ] 1.2 Add service-level validation for activity `type`, `weight`, and patchable fields

## 2. Activity Routes

- [ ] 2.1 Register `GET /activities` to return the authenticated user's non-archived activities
- [ ] 2.2 Register `POST /activities` to create an activity for the authenticated user
- [ ] 2.3 Register `PATCH /activities/:id` to update owned activities and return `404` for non-owned records
- [ ] 2.4 Register `DELETE /activities/:id` to soft-delete owned activities by setting `archivedAt`

## 3. Verification

- [ ] 3.1 Verify `tsc --noEmit` passes in `backend/`
- [ ] 3.2 Verify activity create, list, update, and archive flows with authenticated HTTP requests
- [ ] 3.3 Verify invalid type/weight payloads are rejected with a client error
- [ ] 3.4 Verify a user cannot update or delete another user's activity and receives `404`
