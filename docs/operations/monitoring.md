# Monitoring & Observability

Observability is critical for managing GovernOS in production. We export telemetry data using OpenTelemetry.

## Metrics

GovernOS exposes Prometheus metrics at `/metrics` on all internal services. Key metrics to monitor:

- `governos_intent_plan_duration_seconds`: Time taken to plan an intent.
- `governos_action_execution_duration_seconds`: Time taken by individual plugins.
- `governos_queue_depth`: Number of pending executions.
- `governos_policy_evaluations_total`: Pass/fail rates for policies.

## Logging

All logs are structured as JSON for easy ingestion into Elasticsearch, Splunk, or Datadog.

**Example Log:**

```json
{
  "level": "info",
  "service": "executor",
  "intent_id": "int_123",
  "action": "aws/s3/create",
  "status": "success",
  "duration_ms": 450,
  "timestamp": "2023-10-27T10:00:00Z"
}
```

## Tracing

Distributed tracing is enabled for all API requests. We propagate `traceparent` headers between the API Gateway, Planner, and Executor. Configure your OTEL endpoint via the `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable.