# Configuration

GovernOS can be configured via environment variables or a configuration file.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOVERNOS_ENV` | Environment (dev, staging, prod) | `dev` |
| `DATABASE_URL` | Postgres connection string | `postgres://localhost/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `NATS_URL` | NATS message broker URL | `nats://localhost:4222` |
| `LOG_LEVEL` | Logging verbosity (debug, info, warn, error) | `info` |
| `AUTH_SECRET` | Secret key for JWT signing | - |
| `MAX_FILE_SIZE` | Maximum file size for parser (bytes) | `10485760` |

## Configuration File (`governos.yaml`)

```yaml
server:
  port: 3001
  host: 0.0.0.0

database:
  pool_size: 20
  timeout_ms: 5000

auth:
  provider: jwt
  expires_in: 86400

features:
  audit_logging: true
  strict_policy_checks: true
```