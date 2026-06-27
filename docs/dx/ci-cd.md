# CI/CD and Release Process

GovernOS uses GitHub Actions for continuous integration and deployment.

## GitHub Actions Workflows

- `ci.yml`: Runs on every PR. Executes unit tests, linting, and type checking for both Python and TS.
- `security.yml`: Runs daily and on PRs. Performs dependency scanning and static analysis.
- `docker-build.yml`: Builds and pushes container images on merge to `main`.
- `release.yml`: Automates versioning and changelog generation using Semantic Release.

## Branch Strategy

We use a simplified Git Flow:

- `main`: The stable branch. All commits here should be deployable.
- `feature/*`: For new features. Merge via PR to `main`.
- `fix/*`: For bug fixes. Merge via PR to `main`.

## Versioning

We adhere to [Semantic Versioning](https://semver.org/). Version bumps are handled automatically by our release pipeline based on commit messages (Conventional Commits).