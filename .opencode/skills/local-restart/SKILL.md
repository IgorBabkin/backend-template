---
name: local-restart
description: Restarts this backend project locally with PostgreSQL, migrations, generated OpenAPI artifacts, and the development server. Use when asked to restart, reload, or cleanly relaunch the local project.
---

# Restart local project

Run from the repository root.

1. Stop the foreground development server with `Ctrl-C` if it is running.
2. Restart the PostgreSQL service without removing its data:

```sh
docker compose down
docker compose up -d db
```

3. Apply migrations and regenerate project artifacts:

```sh
npm run db:migrate
npm run generate
```

4. Start the development server:

```sh
npm run start:dev
```

For a devcontainer, use "Rebuild and Reopen in Container" when the container configuration or dependencies changed. For an application-only restart inside an existing devcontainer, stop the current server and run:

```sh
npm run db:migrate
npm run generate
npm run start:dev
```

The named `database-data` volume is preserved. Use `local-down` when the project should be stopped without restarting it.
