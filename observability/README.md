# Observability for Developers — A Practical Course

A hands-on course on making systems **observable** — so when something breaks (or slows
down) in production, you can actually tell what, where, and why. Built around the standard
open-source stack — **Prometheus**, **Grafana**, **OpenTelemetry** — with real **Node.js**
instrumentation. By the end you'll emit metrics, logs, and traces from an app and visualize,
query, and alert on them.

## Who this is for
Developers who've shipped an app (see the [Docker](../docker/README.md),
[Nginx](../nginx/README.md), and [CI/CD](../ci-cd/README.md) courses) and now need to
**operate** it — answer "is it healthy?", "why is it slow?", and "what broke?" with data
instead of guesses.

> This is the **operate** stage that follows build → containerize → front → ship.

## The three pillars
```
            ┌──────────── Observability ────────────┐
   Metrics  │  numbers over time (rate, latency,    │  "how much / how fast?"
            │  errors, saturation) → Prometheus     │
   Logs     │  discrete events with context →       │  "what exactly happened?"
            │  structured JSON → Loki/ELK           │
   Traces   │  one request across services →        │  "where did the time go?"
            │  spans → OpenTelemetry → Jaeger/Tempo │
            └────────────────────────────────────────┘
```

## How to use this course
1. Read the lessons in order — each adds a layer to the same example app.
2. Run the [`examples/`](./examples) stack (app + Prometheus + Grafana) with Docker Compose
   and watch real metrics and dashboards light up.

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction](./01-introduction.mdx) | Observability vs monitoring, the three pillars, golden signals |
| 02 | [Structured Logging](./02-structured-logging.mdx) | JSON logs with pino, levels, correlation IDs |
| 03 | [Metrics with Prometheus](./03-metrics-with-prometheus.mdx) | Metric types, `prom-client`, a `/metrics` endpoint |
| 04 | [Prometheus & PromQL](./04-prometheus-and-promql.mdx) | Scraping, PromQL, rates, percentiles, recording rules |
| 05 | [Dashboards with Grafana](./05-dashboards-with-grafana.mdx) | Data sources, panels, RED/USE dashboards |
| 06 | [Alerting & SLOs](./06-alerting-and-slos.mdx) | Alert rules, Alertmanager, SLOs & error budgets |
| 07 | [Distributed Tracing](./07-distributed-tracing.mdx) | OpenTelemetry, spans, context propagation, Jaeger |
| 08 | [Production Stack with Docker](./08-production-stack-with-docker.mdx) | Wiring the full stack; best practices |

## Quick reference
```promql
# Request rate (per second) over the last 5 minutes
rate(http_requests_total[5m])

# Error ratio
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# 95th percentile latency from a histogram
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

## The stack at a glance
| Tool | Pillar | Role |
|------|--------|------|
| **prom-client / OpenTelemetry** | metrics/traces | Instrument the Node app |
| **pino** | logs | Structured JSON logging |
| **Prometheus** | metrics | Scrape & store metrics, evaluate alerts |
| **Grafana** | all | Dashboards & visualization |
| **Alertmanager** | metrics | Route & dedupe alerts |
| **Jaeger / Tempo** | traces | Store & explore traces |
| **Loki** | logs | Aggregate logs (Grafana-native) |
