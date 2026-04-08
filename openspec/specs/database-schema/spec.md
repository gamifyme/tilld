# database-schema Specification

## Purpose
TBD - created by archiving change phase-1-database-schema. Update Purpose after archive.
## Requirements
### Requirement: Initial application tables are defined in Drizzle schema
The backend SHALL define the initial SQLite schema in Drizzle for `users`, `activities`, `commitments`, `entries`, `passive_wins`, and `friendships`, with columns and constraints that match the Tilld Phase 1 schema reference.

#### Scenario: Schema file includes all required tables
- **WHEN** the backend schema source is inspected
- **THEN** it defines Drizzle tables for `users`, `activities`, `commitments`, `entries`, `passive_wins`, and `friendships`

#### Scenario: Friendship and completion relationships are expressible
- **WHEN** the schema is used to model user friendships and commitment completion data
- **THEN** it includes fields for friendship status, commitment-to-activity linkage, and entry-to-commitment linkage

### Requirement: Database migrations can be generated and applied
The backend SHALL provide a repeatable Drizzle migration workflow that generates migration files from the schema and applies them to the SQLite database at `data/tilld.db`.

#### Scenario: Migration generation succeeds
- **WHEN** the migration generation command is run from the backend
- **THEN** Drizzle creates migration artifacts that reflect the current schema definitions

#### Scenario: Migration application succeeds
- **WHEN** the migration application command is run against a local development database
- **THEN** the SQLite database is created or updated with all required Phase 1 tables

### Requirement: Seed data is available for local development
The backend SHALL provide a seed script that populates the local database with two test users, activities, commitments, and entries covering a full week of representative data.

#### Scenario: Seed script inserts representative records
- **WHEN** the seed script is run against an empty local development database
- **THEN** it creates two users and associated activities, commitments, and entries spanning seven days

#### Scenario: Seed data can support manual verification
- **WHEN** developers inspect the seeded database with a SQLite or Drizzle inspection tool
- **THEN** the dataset is sufficient to verify planned commitments, completed entries, and relationship integrity

