# Developer Onboarding

Welcome to the GovernOS codebase! This guide will help you get your local environment set up and explain our development practices.

## Repository Layout

GovernOS is a monorepo managed with npm workspaces and Poetry.

- `apps/`: Deployable applications (Web, API gateway).
- `packages/`: Shared libraries and action connectors.
- `services/`: Backend microservices (Planner, Executor).
- `intentgraph/`: Core Python library for code analysis.
- `docs/`: System documentation.

## Coding Conventions

- **TypeScript**: Strict mode enabled. Use interfaces over types where possible. Always handle errors explicitly.
- **Python**: Strict type hinting is enforced via `mypy`. Format code with `ruff`.

## Quality Gates

Before submitting a PR, ensure all checks pass:

```bash
# TypeScript
npm run typecheck
npm run lint
npm run test

# Python
poetry run mypy .
poetry run ruff check .
poetry run pytest
```