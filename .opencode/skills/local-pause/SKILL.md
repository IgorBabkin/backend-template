---
name: local-pause
description: Pauses or resumes this backend project's local Docker Compose services without removing containers or PostgreSQL data. Use when asked to pause, suspend, resume, or continue local development infrastructure.
---

# Pause local project

Run from the repository root.

Pause PostgreSQL while preserving its container and data:

```sh
docker compose pause db
```

Resume PostgreSQL:

```sh
docker compose unpause db
```

For a devcontainer Compose environment, pause or resume all services with:

```sh
docker compose -f docker-compose.yml -f .devcontainer/docker-compose.devcontainer.yml pause
docker compose -f docker-compose.yml -f .devcontainer/docker-compose.devcontainer.yml unpause
```

Check service state with:

```sh
docker compose ps
```

Use `local-down` instead when the containers should be stopped rather than paused.
