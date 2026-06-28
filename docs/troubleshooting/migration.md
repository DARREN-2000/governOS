# Migration Guide

## Upgrading from v0.x to v1.0

GovernOS v1.0 introduces breaking changes to the Intent API and Action Plugin contract to improve reliability.

### 1. Action Contract Changes

In v0.x, plugins only required an `execute()` method. In v1.0, all plugins *must* implement `preview()` and `compensate()`.

**Old:**
```typescript
class MyAction {
  async execute(params) { ... }
}
```

**New:**
```typescript
class MyAction {
  async preview(params) { ... }
  async execute(params) { ... }
  async compensate(params) { ... }
}
```

### 2. API Endpoint Changes

The `/api/v1/plan` endpoint now returns a strongly typed schema. Ensure your integrations are updated to handle the new `ExecutionPlan` structure.

### 3. Database Migrations

Run the provided migration scripts to update your PostgreSQL schema:

```bash
npm run migrate:v1
```