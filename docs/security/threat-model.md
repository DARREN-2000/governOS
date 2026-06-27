# Threat Model

GovernOS is designed with a defense-in-depth approach, assuming parts of the system may be compromised.

## LLM Threats

**Risk:** Prompt Injection leading to unauthorized actions.
**Mitigation:** LLMs *never* execute actions directly. They output typed JSON schemas (Execution Plans) which are strictly validated. The Policy Engine runs deterministic, non-LLM checks on the plan before execution.

## Action Execution Threats

**Risk:** A compromised Action plugin accessing arbitrary system resources.
**Mitigation:** Action plugins are sandboxed. They have access only to the credentials explicitly passed to them for their specific task.

## Data Exfiltration

**Risk:** Memory Service leaking sensitive data across tenants.
**Mitigation:** Row-level security (RLS) in PostgreSQL isolates tenant data. Context memory is strictly scoped and validated on every request.