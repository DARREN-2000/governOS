# Scaling and Performance

GovernOS is designed to scale horizontally. This guide covers scaling the core components.

## Stateless Services

The API Gateway, Planner, and Policy Engine are entirely stateless. They can be scaled dynamically based on CPU utilization (e.g., using Kubernetes HPA).

## Stateful Services

The **Executor Service** pulls work from a NATS or Temporal queue. To process more concurrent actions, scale the number of Executor pods.

**Important:** Action plugins must be idempotent. If an Executor crashes mid-execution, another worker will retry the step.

## Database Tuning

PostgreSQL is the primary datastore for intent state, approvals, and the audit log.

- **Connection Pooling**: Use PgBouncer. GovernOS services can quickly exhaust connections during traffic spikes.
- **Indexes**: Ensure indexes on `status` and `created_at` are maintained, as the Web UI heavily queries the approval queue.