# Docker for Developers — A Practical Course

A hands-on Docker course that takes you from "what is a container?" to shipping a
production-ready image, with real **Node.js** examples. By the end you'll be able to
containerize an app, run multi-service stacks with Docker Compose, and follow the
security/best-practice habits that keep images small and safe.

## Who this is for
Developers who want to **learn Docker and actually use it** — package apps, run
dependencies locally, and prepare images for CI/CD and deployment.

> Pairs with the [Redis course](../redis/README.md) (we containerize a Node + Redis app)
> and the [CI/CD course](../ci-cd/README.md) (which builds and ships these images).

## How to use this course
1. Read the lessons in order — they build on each other.
2. Keep a terminal open and run every command as you go.
3. Build and run the [`examples/`](./examples) Node app and Compose stack.

### Install Docker
- **Mac / Windows:** install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Linux:** install Docker Engine (`curl -fsSL https://get.docker.com | sh`).

```bash
docker --version          # verify the CLI
docker run hello-world    # pulls a tiny image and runs it -> success message
```

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction & Setup](./01-introduction.mdx) | Containers vs VMs, why Docker, first commands |
| 02 | [Images & Containers](./02-images-and-containers.mdx) | The image/container model, registries, lifecycle |
| 03 | [Writing a Dockerfile](./03-dockerfile.mdx) | Instructions, layers & caching, CMD vs ENTRYPOINT |
| 04 | [Dockerize a Node App](./04-dockerize-node-app.mdx) | .dockerignore, multi-stage builds, slim & non-root |
| 05 | [Volumes & Networking](./05-volumes-and-networking.mdx) | Persistence and container-to-container comms |
| 06 | [Docker Compose](./06-docker-compose.mdx) | Multi-service apps (Node + Redis) in one file |
| 07 | [Best Practices & Security](./07-best-practices-and-security.mdx) | Small, fast, safe images |
| 08 | [Production & Orchestration](./08-production-and-orchestration.mdx) | Registries, limits, logging, Kubernetes/Swarm |

## Quick reference cheat sheet
```bash
docker build -t myapp .          # build an image from the Dockerfile here
docker run -p 3000:3000 myapp    # run it, mapping host:container ports
docker ps                        # running containers (add -a for all)
docker logs -f <container>       # tail a container's logs
docker exec -it <container> sh   # shell into a running container
docker images                    # list images
docker stop/rm <container>       # stop / remove a container
docker rmi <image>               # remove an image
docker compose up -d             # start a multi-service stack
docker system prune              # reclaim space (dangling images, stopped containers)
```
