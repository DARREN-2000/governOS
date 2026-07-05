# Enterprise Deployment

GovernOS is built to scale from local testing to global, multi-region production deployments.

## Render (Cloud)

GovernOS natively supports multi-service cloud deployment via Render using Blueprint definitions.

We include a `render.yaml` file at the repository root. This orchestrates:
1. **The Python API** (FastAPI)
2. **The Node API** (Express)
3. **The React Frontend** (Vite Static Site or SSR)

Simply link your repository to Render, and it will deploy the entire stack.

## Kubernetes / Helm

For enterprise deployments within Virtual Private Clouds (VPCs), we provide a Helm chart in the `infra/helm/governos/` directory.

```bash
# Add the chart
helm repo add governos https://charts.governos.io

# Install
helm install my-governos governos/governos -f my-values.yaml
```

The Helm chart scales the Node.js workers and the Python Core independently, allowing you to allocate GPU nodes to the Python engine (for local embedding generation) while keeping the API lightweight.

## Temporal Durability

By default, GovernOS utilizes Better-SQLite3 for state tracking. For production deployments with thousands of concurrent workflows or workflows that pause for days (waiting on human approval), we strongly recommend deploying [Temporal.io](https://temporal.io).

GovernOS is architecturally designed to swap its execution backend from SQLite to Temporal via the `WORKFLOW_BACKEND=temporal` environment variable.
