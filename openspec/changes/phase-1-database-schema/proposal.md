## Why

The scaffolded backend can start, but it has no persistent data model yet. Phase 1 establishes the SQLite schema and migration flow so later API and auth phases have a stable source of truth to build on.

## What Changes

- Define the initial Drizzle schema for users, activities, commitments, entries, passive wins, and friendships
- Add a migration workflow that generates and applies the SQLite schema to `data/tilld.db`
- Add a seed script that creates two representative users with a week of related data for local development and manual verification
- Document the minimal backend scripts and file layout needed to run schema generation, migration, and seeding

## Capabilities

### New Capabilities
- `database-schema`: Drizzle schema definitions, migrations, and seed data for the app's initial relational model

### Modified Capabilities

## Impact

- Affects backend schema files, migration configuration, and package scripts
- Introduces generated migration artifacts and a seed entrypoint in the backend
- Creates the initial SQLite database structure used by all later backend features
