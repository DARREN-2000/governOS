# Installation

GovernOS can be installed either natively or via Docker.

## Docker (Recommended)
```bash
docker-compose up --build
```
This spins up:
- The React Frontend (Port 80)
- The Node API (Port 3001)
- The Python Core (Port 8000)

## Native Installation
Requires: Node 20+, Python 3.10+, pnpm, Poetry.

```bash
# Python
poetry install
poetry run python -m uvicorn governos.api:app --host 0.0.0.0 --port 8000

# Node API
cd apps/api
pnpm install
pnpm run build
node dist/index.js

# Frontend
cd apps/web
pnpm install
pnpm run dev
```
