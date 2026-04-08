## 1. Schema Structure

- [x] 1.1 Move the placeholder backend schema into `backend/src/db/schema.ts` and update `drizzle.config.ts` to reference it
- [x] 1.2 Define the `users`, `activities`, `commitments`, `entries`, `passive_wins`, and `friendships` tables with the Phase 1 columns and SQLite-compatible types
- [x] 1.3 Add core indexes, uniqueness constraints, and foreign-key relationships needed for ownership, commitment linkage, and friendship status

## 2. Database Runtime and Migration Workflow

- [x] 2.1 Add a backend database client/migration module targeting `data/tilld.db`
- [x] 2.2 Add backend package scripts for `db:generate`, `db:migrate`, and `db:seed`
- [x] 2.3 Generate the initial Drizzle migration files from the Phase 1 schema
- [x] 2.4 Apply the generated migration to a local development database and verify all tables are created

## 3. Seed Data

- [x] 3.1 Create a deterministic seed script that inserts 2 test users
- [x] 3.2 Extend the seed script to insert a full week of activities, commitments, entries, passive wins, and friendship data for those users
- [x] 3.3 Run the seed script against the migrated local database and verify the records are present

## 4. Validation

- [x] 4.1 Verify `tsc --noEmit` passes in `backend/` after the database changes
- [x] 4.2 Verify the migration and seed workflow can be rerun cleanly on a fresh `data/tilld.db`
- [x] 4.3 Inspect the resulting database with Drizzle or SQLite tooling to confirm the schema matches the Phase 1 reference
