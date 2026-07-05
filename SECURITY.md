# GovernOS Security Policy

GovernOS is built to secure AI infrastructure. We take vulnerabilities in our own codebase extremely seriously.

## Reporting a Vulnerability

**DO NOT report security vulnerabilities via public GitHub issues.**

If you discover a vulnerability, please email `security@governos.io` with a detailed report. We aim to respond within 48 hours.

## Security Posture
- **Input Validation:** File ingestion pipelines enforce `MAX_FILE_SIZE` and standard file-type verification to prevent DoS attacks.
- **Least Privilege:** All plugins and action executors are sandboxed and operate with the minimum required scopes.
- **Audit Logging:** Every state change in a workflow is cryptographically signed and stored in an immutable audit ledger.

## Supported Versions
Currently, only the `main` branch and the latest stable release tag receive security updates.
