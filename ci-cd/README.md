# CI/CD for Developers — A Practical Course

A hands-on course on Continuous Integration and Continuous Delivery using **GitHub
Actions**, with real **Node.js** examples. By the end you'll be able to automatically lint,
test, build, and ship an app — including building and publishing the Docker image from the
[Docker course](../docker/README.md) and testing against the Redis app from the
[Redis course](../redis/README.md).

## Who this is for
Developers who want to **stop deploying by hand** — automate quality checks on every push
and ship safely and repeatably.

## The mental model
```
  push / PR ──▶ ┌──────── CI ────────┐ ──▶ ┌──────── CD ────────┐
                │ lint · test · build │     │ publish image       │
                │ (catch bugs early)  │     │ deploy · rollback   │
                └─────────────────────┘     └─────────────────────┘
```
- **CI (Continuous Integration):** every change is automatically built and tested, so bugs
  surface in minutes, not in production.
- **CD (Continuous Delivery/Deployment):** every change that passes CI is automatically
  prepared for release — and, if you choose, deployed.

## How to use this course
1. Read the lessons in order.
2. Copy the workflows from [`examples/`](./examples) into a repo's `.github/workflows/`
   folder and watch them run in the **Actions** tab on GitHub.

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction to CI/CD](./01-introduction.mdx) | CI vs CD vs Deployment, why it matters, pipeline stages |
| 02 | [GitHub Actions Basics](./02-github-actions-basics.mdx) | Workflows, jobs, steps, runners, triggers, YAML |
| 03 | [CI: Build & Test](./03-ci-build-and-test.mdx) | Checkout, setup-node, install, lint, test, caching |
| 04 | [Matrix & Service Containers](./04-matrix-and-services.mdx) | Test across versions + a Redis service for integration tests |
| 05 | [Secrets & Environments](./05-secrets-and-environments.mdx) | Secrets, variables, environments, OIDC |
| 06 | [Build & Publish Docker Images](./06-docker-build-and-publish.mdx) | Build in CI, push to GHCR, tags & cache |
| 07 | [CD: Deploy](./07-cd-deploy.mdx) | Deploy strategies, approvals, rollbacks |
| 08 | [Pipeline Best Practices](./08-best-practices.mdx) | Fast, reliable, secure, reusable pipelines |

## Quick reference — a minimal workflow
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
```
Put a file like this in `.github/workflows/`, push it, and GitHub runs it automatically.
