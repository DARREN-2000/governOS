# Security

GovernOS is explicitly built to secure AI infrastructure. Security is the fundamental premise of the framework.

## Threat Model & Core Protections

### 1. Denial of Service (DoS) via File Buffering
**Risk:** An agent or external actor instructs the system to parse `/dev/urandom` or an exceptionally large artifact, exhausting memory.
**Mitigation:** All file reading operations implement hard constraints. We verify `os.path.isfile(filepath)` to prevent reading from device nodes, and we validate file sizes against `MAX_FILE_SIZE` prior to loading content into memory.

### 2. Destructive Side-Effects (The 'Blast Radius')
**Risk:** An LLM hallucinates an instruction to execute a destructive API call (e.g., dropping a database, terminating an instance).
**Mitigation:**
- **Preview First:** Workflows run a dry-run `preview()` step to determine impact.
- **Policy Engine:** Deterministic rules block unauthorized executions based on RBAC, spend limits, or restricted resource tags.
- **Human-in-the-Loop:** High-risk actions automatically pause the state machine and require cryptographic approval from an authorized human.

### 3. Multi-Tenant Data Leakage
**Risk:** Context intended for Tenant A is used to generate a plan for Tenant B.
**Mitigation:** Contextual Memory is strictly partitioned in the database. Node.js API queries enforce tenant IDs at the database level (`WHERE tenant_id = ?`).

### 4. Idempotency & Replay Attacks
**Risk:** A workflow fails midway through, and retrying the workflow causes a payment to be issued twice.
**Mitigation:** All `execute()` methods receive a cryptographically generated UUID v4 `idempotencyKey`. The underlying plugins must pass this key to downstream services (e.g., Stripe, AWS) to ensure the action only occurs once.

## Reporting Vulnerabilities
If you discover a vulnerability, **do not open a public GitHub issue**. Please email `security@governos.io`. We aim to review and respond to all reports within 48 hours.
