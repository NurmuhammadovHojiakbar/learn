# Observability Examples

The full stack from [Lesson 08](../08-production-stack-with-docker.mdx): an instrumented
Node app emitting **metrics, logs, and traces**, scraped by **Prometheus**, visualized in
**Grafana**, and traced in **Jaeger** — all wired with Docker Compose and provisioned as
code.

```
examples/
  docker-compose.yml        # app + redis + prometheus + grafana + jaeger
  app/
    app.js                  # Express: pino logs, prom-client /metrics, /api/flaky demo
    tracing.js              # OpenTelemetry setup (loaded via --import)
    Dockerfile, package.json
  prometheus/
    prometheus.yml          # scrape config (targets the app)
    alert.rules.yml         # error-rate / latency / target-down alerts
  grafana/provisioning/
    datasources/datasource.yml   # Prometheus data source (as code)
    dashboards/dashboards.yml    # dashboard provider
    dashboards/red-dashboard.json # a ready RED dashboard
```

## Run it
```bash
docker compose up -d

# generate some traffic (mix of normal + flaky/slow requests)
for i in $(seq 1 300); do curl -s localhost:3000/api/ >/dev/null; curl -s localhost:3000/api/flaky >/dev/null; done
```

Then explore:
| Service | URL | What to look at |
|---------|-----|-----------------|
| App metrics | http://localhost:3000/metrics | raw Prometheus exposition |
| Prometheus | http://localhost:9090 | Status → Targets (`app` UP); try a PromQL query; Alerts tab |
| Grafana | http://localhost:3001 | login `admin`/`admin`; open "Orders API — RED" (auto-provisioned) |
| Jaeger | http://localhost:16686 | pick service `orders-api`, search traces, open a slow one |

```bash
docker compose down       # stop everything
```

## What each piece demonstrates
- **app/app.js** — structured pino logs with a per-request `reqId`, RED metrics
  (`http_requests_total`, `http_request_duration_seconds`, in-flight gauge) plus default
  Node metrics, and a `/api/flaky` endpoint that is randomly slow and ~10% errors so the
  dashboards, alerts, and traces have something to show.
- **tracing.js** — OpenTelemetry auto-instrumentation; HTTP/Express/Redis spans are created
  automatically and exported to Jaeger. The app image starts with
  `node --import ./tracing.js app.js`.
- **prometheus/** — scrapes the app every 15s and evaluates the alert rules.
- **grafana/provisioning/** — data source and the RED dashboard load automatically on
  startup; nothing to click.

## Try the full incident drill (Lesson 08)
1. Watch the **error ratio** and **p95 latency** panels react as `/api/flaky` misbehaves.
2. When `HighLatencyP95` or `HighErrorRate` shows in Prometheus → **Alerts**, note the time.
3. Open a slow request's **trace** in Jaeger and find which span dominates.

## Run the app locally without Docker (optional)
```bash
cd app && npm install
# needs Redis on localhost:6379 (and Jaeger on :4318 if you want traces)
npm run start:traced          # or: npm start  (metrics + logs, no traces)
```
