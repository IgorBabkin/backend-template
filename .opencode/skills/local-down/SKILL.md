---
name: local-down
description: Stops this backend project's local development infrastructure without deleting PostgreSQL data. Use when asked to stop, shut down, or tear down the local project.
---

# Stop local project

Run from the repository root.

1. Stop the foreground development server with `Ctrl-C` if it is running.
2. Stop the PostgreSQL Compose service and network:

```sh
docker compose down
```

This preserves the named `database-data` volume. Do not use `docker compose down -v` unless database data should be deleted.

When using the devcontainer, close or stop the devcontainer to stop the app and database services together. To stop only PostgreSQL while keeping the workspace container running, use:

```sh
docker compose stop db
```

Check the result with:

```sh
docker compose ps
```
