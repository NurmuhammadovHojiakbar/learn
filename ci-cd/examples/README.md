# CI/CD Workflow Examples

Ready-to-adapt GitHub Actions workflows referenced by the lessons.

| File | Lesson | What it does |
|------|--------|--------------|
| [ci.yml](./ci.yml) | 03, 04 | Lint + test across a Node matrix with a Redis service container |
| [docker-publish.yml](./docker-publish.yml) | 06 | Build the Docker image and push it to GHCR with SHA/semver tags |
| [deploy.yml](./deploy.yml) | 07 | Promote one image to staging (auto) → production (manual approval); supports rollback |

## How to use them
1. Copy the file(s) into your repository's **`.github/workflows/`** folder
   (create it at the repo root if it doesn't exist).
2. Commit and push — GitHub runs them automatically and shows results in the **Actions** tab.
3. Adapt to your project:
   - `ci.yml` — set the Node versions you support; remove the Redis service if you don't
     need integration tests.
   - `docker-publish.yml` — works as-is for GHCR using the built-in `GITHUB_TOKEN`. For
     Docker Hub, swap the login to use `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN`.
   - `deploy.yml` — replace `scripts/deploy.sh` and the health-check URL with your target
     (SSH + Compose, Fly.io, Render, ECS, Kubernetes, …). Configure `staging` and
     `production` **Environments** in repo settings, and add a **required reviewer** to
     `production` for the approval gate.

## Prerequisites in the repo
- A `package-lock.json` (so `npm ci` works) and a `test` script.
- A `Dockerfile` at the repo root for `docker-publish.yml`
  (see the [Docker course example](../../docker/examples/Dockerfile)).
- Secrets/environments configured per [Lesson 05](../05-secrets-and-environments.mdx):
  deploy hosts/keys, and any registry credentials if not using GHCR.

## Validate before pushing (optional)
```bash
# Lint workflow files locally
brew install actionlint   # or: go install github.com/rhysd/actionlint/cmd/actionlint@latest
actionlint examples/*.yml
```
