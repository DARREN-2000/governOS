# Contributing to GovernOS

First off, thank you for considering contributing to GovernOS! It's people like you that make GovernOS such a great tool.

GovernOS is positioned as the standard trust layer for autonomous agents in the enterprise. We expect all contributions to maintain a high bar of engineering excellence, security, and documentation.

## How Can I Contribute?

### 1. Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one.
- Use the provided Bug Report issue template.

### 2. Suggesting Enhancements
- Open a new issue with the Feature Request template.
- Provide a clear and detailed explanation of the feature and the problem it solves.

### 3. Pull Requests
- Fork the repo and create your branch from `main`.
- If you've added code that should be tested, add tests.
- Ensure the test suite passes (`poetry run pytest tests/`).
- Ensure your code lints correctly (`poetry run ruff check .`).
- Ensure type hints are accurate (`poetry run mypy .`).
- If you change `pyproject.toml`, run `poetry lock`.
- Frontend changes must strictly use `pnpm`. No `npm` or `yarn`.

## Development Environment Setup

Please see our [Installation Guide](docs/getting-started/installation.md) and [Quickstart](docs/getting-started/quickstart.md) for detailed setup instructions.

## Development Constraints and Rules
- **UI/UX**: Strictly React 19, Vite, Tailwind CSS, shadcn/ui.
- **Python**: Strict type hints. Fast serialization inside tight loops (avoid `Pydantic.model_dump()` in loops).
- **Security**: Validate paths and file sizes before parsing. Read `SECURITY.md`.
- **Architecture**: Actions must implement `preview()`, `execute()`, and `compensate()`.

By participating in this project, you agree to abide by the GovernOS [Code of Conduct](CODE_OF_CONDUCT.md).
