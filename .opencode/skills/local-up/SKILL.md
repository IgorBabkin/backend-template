---
name: local-up
description: Starts this backend project locally or in a devcontainer with PostgreSQL, Prisma migrations, generated OpenAPI artifacts, and the development server. Use when asked to run the project locally, start the app, bring up local infrastructure, or set up a devcontainer environment.
---

# Local project startup

Run from the repository root.

## Prerequisites

- Node.js 18.19.x
- npm
- Docker with Compose
- nvm when switching to the repository Node version

## Devcontainer

Instead of running Docker on the host, open the repository in a devcontainer:

- VS Code: Dev Containers extension, then "Reopen in Container"
- `npm ci --ignore-scripts && npm run generate` runs automatically on container creation
- PostgreSQL is available from the `db` service at `db:5432`; skip the Docker steps below

## Startup

1. Ensure local environment files exist without overwriting existing files:

```sh
[ -f .env ] || cp .env.example .env
[ -f database.env ] || cp database.env.example database.env
```

The devcontainer already overrides `DATABASE_URL` in `.env` to point at the `db` service.

2. Install dependencies when `node_modules` is absent:

```sh
npm ci --ignore-scripts
```

3. Start PostgreSQL in the background (skip inside a devcontainer):

```sh
docker compose up -d db
```

4. Apply database migrations:

```sh
npm run db:migrate
```

5. Generate Prisma, OpenAPI server/client, validators, and generated formatting:

```sh
npm run generate
```

6. Start the development server:

```sh
npm run start:dev
```

The server listens on `http://localhost:3000` by default. Use `npm run watch:start:dev` when generated artifacts should be regenerated automatically during development.

## Troubleshooting

- Check PostgreSQL status with `docker compose ps`.
- Stop local infrastructure with `docker compose down`.
- Check the configured port and database connection in `.env`.
- Run `npm run db:generate` if Prisma types are unavailable.
- Run `npm run generate` if OpenAPI generated files are unavailable.
