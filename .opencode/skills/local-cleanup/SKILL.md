---
name: local-cleanup
description: Cleans this backend project's local Docker resources, dependencies, build output, and generated artifacts. Use when asked to reset, clean, or remove local project state.
---

# Clean local project

Run from the repository root.

This operation is destructive. Before deleting anything, show the user the cleanup targets and ask for confirmation. Never run global Docker pruning commands.

Cleanup targets:

- Project Compose containers, network, and the `database-data` volume
- `node_modules`
- `build`
- `src/.generated`

After confirmation:

1. Stop and remove project infrastructure, including the database volume:

```sh
docker compose down --volumes --remove-orphans
```

2. Remove local dependency, build, and generated-artifact directories:

```sh
rm -rf node_modules build src/.generated
```

3. Recreate the local environment files only when they are missing:

```sh
[ -f .env ] || cp .env.example .env
[ -f database.env ] || cp database.env.example database.env
```

4. Restore the project to a runnable state:

```sh
npm ci --ignore-scripts
npm run generate
```

5. Recreate the database and migrations when local development should resume:

```sh
docker compose up -d db
npm run db:migrate
```

Do not delete `.env`, `database.env`, source files, or Docker resources outside this project unless explicitly requested.
