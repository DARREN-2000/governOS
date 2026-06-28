# Release Process

GovernOS uses automated semantic versioning and changelog generation via Semantic Release.

## How to Trigger a Release

1. **Merge to Main:** Ensure your feature or fix is merged into the `main` branch.
2. **Conventional Commits:** Your PR title or merge commit must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Types

- `feat:` Triggers a minor release (e.g., `1.0.0` -> `1.1.0`).
- `fix:` Triggers a patch release (e.g., `1.0.0` -> `1.0.1`).
- `perf:` Triggers a patch release.
- `BREAKING CHANGE:` Triggers a major release (e.g., `1.0.0` -> `2.0.0`).

## Automated Workflow

When a commit lands on `main`:
1. The `.github/workflows/release.yml` GitHub Action triggers.
2. It analyzes the commit history since the last tag.
3. It determines the next version number.
4. It updates the `CHANGELOG.md`.
5. It creates a new Git tag and GitHub Release.
6. It triggers downstream builds (e.g., Docker image push to GHCR, npm package publish).

## Manual Overrides

If a release needs to be triggered manually or an automated run fails, administrators can manually dispatch the `Release` workflow from the Actions tab in GitHub.
