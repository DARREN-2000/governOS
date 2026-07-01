# Installation Guide

GovernOS is designed to be easily deployable in various environments, from local development to full-scale enterprise production.

## Prerequisites

- Node.js >= 20
- npm >= 10
- Python >= 3.10
- Poetry (for backend services)
- Docker & Docker Compose (for full stack)

## Local Development (Source)

1. **Clone the repository**
   ```bash
   git clone https://github.com/organization/governos.git
   cd governos
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Install Python Dependencies**
   ```bash
   poetry install
   ```

4. **Start Local Services**
   ```bash
   docker compose up -d
   ```

5. **Start Development Servers**
   ```bash
   # In one terminal
   npm run dev &

   # In another terminal (for python services)
   poetry run python -m governos.api &
   ```

## Docker Deployment

For a production-ready setup, we recommend using Docker Compose or Kubernetes.

### Docker Compose

```yaml
version: '3.8'
services:
  api:
    image: governos/api:latest
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/governos
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=governos
```

## Helm/Kubernetes

We provide a Helm chart for Kubernetes deployment:

```bash
helm repo add governos https://charts.governos.io
helm install my-governos governos/governos
```