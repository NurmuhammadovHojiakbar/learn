// OpenTelemetry tracing setup (Lesson 07).
// Load this BEFORE the app so auto-instrumentation can patch http/express/redis:
//   node --import ./tracing.js app.js
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME || 'orders-api',
  traceExporter: new OTLPTraceExporter({
    // OTLP HTTP endpoint — Jaeger all-in-one listens on :4318.
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
process.on('SIGTERM', () => sdk.shutdown().finally(() => process.exit(0)));
