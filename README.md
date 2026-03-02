# Orma Playground

A full-stack developer tool for interactively building, testing, and converting [Orma](https://github.com/mendeljacks/orma) queries and mutations against a live database.

## Architecture

```
orma_demo/
├── frontend/    # React + MUI + MobX + Monaco Editor (Vite dev server, port 3000)
├── backend/     # Express + Orma + PostgreSQL/MySQL (port 3001)
└── common/      # Shared orma_schema.ts (auto-generated via introspection)
```

## Features

- **Query Builder** — Visual UI for constructing Orma queries with select, where, group by, order by, pagination, and nested subqueries
- **JSON → SQL** — Live preview of generated SQL from Orma JSON queries and mutations
- **SQL → JSON** — Reverse conversion from raw SQL to Orma JSON format
- **Mutation Editor** — Spreadsheet-style data editor for building Orma mutations
- **Database Connection** — Connect to PostgreSQL or MySQL and introspect the database schema into Orma format
- **Live Execution** — Execute queries and mutations directly against the connected database

## Prerequisites

- Node.js 16+
- Docker (for PostgreSQL) or an existing PostgreSQL/MySQL instance

## Quick Start

### 1. Start PostgreSQL

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 3. Run database migrations

```bash
cd backend
npx db-migrate up --env dev
```

This creates the demo schema (users, roles, permissions, groups, and join tables).

### 4. Start the backend

```bash
cd backend
PGSSLMODE=disable pg=postgresql://postgres:postgres@localhost:5432/postgres npm run start
```

The backend starts on `http://localhost:3001` and introspects the database to generate `common/orma_schema.ts`.

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend starts on `http://localhost:3000`.

## Usage

### Connect Tab

Connect to a PostgreSQL or MySQL database and introspect its schema. The resulting Orma schema is used by the query builder for autocomplete, validation, and SQL generation.

![Connect Tab](screenshots/connect-tab.png)

### Query Tab

Build Orma queries using the visual query builder or edit JSON directly. Convert between JSON and SQL with explicit buttons. Execute queries against the database and see results.

![Query Tab](screenshots/query-tab.png)

Example query:
```json
{
  "users": {
    "id": true,
    "first_name": true,
    "last_name": true
  }
}
```

### Mutate Tab

Build mutations using the spreadsheet editor or JSON editor. Convert between JSON and SQL, then execute mutations.

![Mutate Tab](screenshots/mutate-tab.png)

Example mutation:
```json
{
  "$operation": "create",
  "users": [
    {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "password": "password"
    }
  ]
}
```

## API Endpoints

| Method | Path          | Description                        |
| ------ | ------------- | ---------------------------------- |
| GET    | `/`           | Health check                       |
| POST   | `/login`      | Authenticate a user                |
| POST   | `/query`      | Execute an Orma query              |
| POST   | `/mutate`     | Execute an Orma mutation           |
| POST   | `/introspect` | Introspect database schema (Connect tab) |

All endpoints accept `database_type`, `pg`, and `mysql` as query parameters for database connection configuration.

## Tech Stack

**Frontend**: React 18, MUI 5, MobX 6, Monaco Editor, Vite, TypeScript

**Backend**: Express, Orma, PostgreSQL (pg), MySQL (promise-mysql), TypeScript

**Shared**: Orma schema (auto-generated TypeScript)


Database migrations are managed with `db-migrate`. Configuration is in `backend/database.json`.

## License

ISC
