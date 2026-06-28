# Maintenance and Recovery

This guide covers routine maintenance, backup procedures, alerting, and recovery.

## Alerting

GovernOS integrates with PagerDuty, OpsGenie, and Slack for alerting. Alerts should be configured for:

- **High Queue Depth:** More than 100 pending executions in the Executor service queue.
- **High Error Rate:** More than 5% of API requests returning `5xx` errors.
- **Database CPU Utilization:** PostgreSQL CPU consistently above 80%.

## Backups

### Database (PostgreSQL)

We strongly recommend automated, continuous archiving of the PostgreSQL database using tools like WAL-G or pgBackRest.

- **Full Backups:** Daily full backups stored in an immutable S3 bucket.
- **Point-In-Time-Recovery (PITR):** Enable WAL archiving for PITR up to the last 5 minutes.

### Redis

Redis is used as a temporary cache and requires no persistent backups. Data loss here only affects transient session data.

## Recovery Procedures

### Database Failure

1. Provision a new PostgreSQL instance.
2. Restore the latest daily full backup.
3. Replay WAL logs to the target point-in-time.
4. Update the `DATABASE_URL` environment variable for all services.

### Executor Failure

The Executor service relies on a durable queue (NATS or Temporal). If an Executor node crashes during execution, the task will be automatically retried by another available node. Action plugins *must* be strictly idempotent to prevent unintended side effects during retries.

## Routine Maintenance

- **Log Rotation:** Ensure logs are rotated automatically and shipped to an external sink (e.g., Elasticsearch, Datadog).
- **Certificate Renewal:** API TLS certificates should be renewed automatically via Let's Encrypt / Cert-Manager.
