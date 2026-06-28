# Authentication & Authorization

GovernOS secures endpoints using standard identity protocols and role-based access control (RBAC).

## Authentication

The API supports:
1. **Bearer Tokens (JWT)**: For user-facing Web Dashboard access.
2. **API Keys**: For programmatic access via CLI or SDKs.

## Authorization

Access is governed by RBAC. Permissions are evaluated by the Policy Engine.

### Roles

- `Viewer`: Can view plans and audit logs.
- `Operator`: Can plan and execute non-risky actions.
- `Admin`: Can approve risky actions, manage users, and configure policies.

## Boundary Scopes

All intents are executed within a specific context memory boundary:
- Personal Scope
- Project Scope
- Organization Scope

An Operator cannot execute an intent that modifies resources outside their assigned Project Scope.