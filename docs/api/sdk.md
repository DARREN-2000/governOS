# SDK Guide

GovernOS provides official SDKs for Python and TypeScript to make integrating with our API seamless.

## Python SDK

**Installation:**

```bash
pip install governos-sdk
```

**Usage:**

```python
from governos import Client

client = Client(api_key="sk_test_123")

# Create an intent
intent = client.intents.create(
    description="Provision a new Redis cluster"
)

print(f"Created intent: {intent.id}")
print(f"Plan: {intent.plan.steps}")

# Approve execution
execution = client.intents.approve(intent.id)
print(f"Executing: {execution.id}")
```

## TypeScript SDK

**Installation:**

```bash
npm install @governos/sdk
```

**Usage:**

```typescript
import { GovernOS } from '@governos/sdk';

const client = new GovernOS('sk_test_123');

async function run() {
  const intent = await client.intents.create({
    description: 'Provision a new Redis cluster'
  });

  console.log(`Created intent: ${intent.id}`);

  const execution = await client.intents.approve(intent.id);
  console.log(`Executing: ${execution.id}`);
}

run();
```