# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 0.9.x   | :x:                |

## Reporting a Vulnerability

We take the security of GovernOS very seriously. If you discover a vulnerability, please do NOT report it via public GitHub issues.

Instead, please send an email to **security@governos.io**.

We will acknowledge your report within 24 hours, and aim to provide a fix within 7 days for critical vulnerabilities.

### Threat Model Constraints

Please note our threat model as described in `docs/security/threat-model.md`:
- Action plugins only have access to explicitly provided credentials.
- Prompt injection in natural language intent is considered an accepted input, as all outputs are typed and strictly validated by the deterministic Policy Engine before any side-effects occur.
