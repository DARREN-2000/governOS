# Configuration

GovernOS follows the [Twelve-Factor App](https://12factor.net/) methodology for configuration. All configuration is read from the environment or `.env` files.

## Environment Variables

### Core Application
| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `PORT` | No | Integer | `3001` | The port the Node.js API will listen on. |
| `JWT_SECRET` | **Yes** | String | - | Cryptographic key used to sign and verify JWT authentication tokens. **Do not hardcode in production.** |
| `NODE_ENV` | No | String | `development` | Determines logging density and caching. Set to `production` for real deployments. |

### Database & Storage
| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `DATABASE_URL` | No | String | `file:./data/governos.db` | Connection string for the SQLite database. |
| `MAX_FILE_SIZE` | No | Integer | `10485760` (10MB) | Maximum file size permitted during parsing pipelines. |

### Upstream Services
| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `PYTHON_ENGINE_URL` | No | String | `http://localhost:8000` | The network location of the FastAPI Python Core. |

## Feature Flags
In future releases, feature flags for enabling Temporal integration and advanced analytics will be managed via the database, allowing hot-swapping without restarts.
