# API Reference

The GovernOS API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.

## Base URL

```text
https://api.governos.io/v1
```

## Authentication

Authenticate requests by including your API key in the `Authorization` header.

```http
Authorization: Bearer <your-api-key>
```

## Rate Limits

By default, the API enforces a rate limit of 100 requests per minute per API key. If you exceed this limit, you will receive a `429 Too Many Requests` response.

---

## Endpoints

### Create an Intent

**Purpose:** Submit a new intent for planning. This does not execute the action.

**Request:** `POST /intents`

```json
{
  "description": "Create a new S3 bucket named 'my-data-bucket'",
  "scope": "project_123"
}
```

**Response:** `201 Created`

```json
{
  "id": "int_8a9b2c",
  "status": "planned",
  "plan": {
    "steps": [
      {
        "action": "aws/s3/create",
        "params": { "bucket_name": "my-data-bucket" }
      }
    ]
  }
}
```

**Example cURL:**

```bash
curl -X POST https://api.governos.io/v1/intents \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{"description": "Create a new S3 bucket named my-data-bucket"}'
```

**Python Example:**
```python
from governos import Client
client = Client(api_key="sk_test_123")
intent = client.intents.create(description="Create a new S3 bucket named 'my-data-bucket'")
print(intent.id)
```

**TypeScript Example:**
```typescript
import { GovernOS } from '@governos/sdk';
const client = new GovernOS('sk_test_123');
const intent = await client.intents.create({ description: 'Create a new S3 bucket named "my-data-bucket"' });
console.log(intent.id);
```

**Error Codes:**
- `400 Bad Request`: Invalid request body.
- `401 Unauthorized`: Invalid API key.
- `429 Too Many Requests`: Rate limit exceeded.

**Best Practices:**
- Always provide a clear and descriptive `description` for your intent to ensure the LLM planner generates the correct execution plan.
- Use explicit `scope` boundaries to restrict the intent to specific projects or environments.

---

### Approve an Execution

**Purpose:** Approve a planned intent for execution.

**Request:** `POST /intents/{intent_id}/approve`

```json
{
  "comment": "Approved for Q3 deployment"
}
```

**Response:** `200 OK`

```json
{
  "id": "int_8a9b2c",
  "status": "executing",
  "execution_id": "exec_5f4e3d"
}
```

**Example cURL:**

```bash
curl -X POST https://api.governos.io/v1/intents/int_8a9b2c/approve \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Approved for Q3 deployment"}'
```

**Python Example:**
```python
from governos import Client
client = Client(api_key="sk_test_123")
execution = client.intents.approve("int_8a9b2c", comment="Approved for Q3 deployment")
print(execution.id)
```

**TypeScript Example:**
```typescript
import { GovernOS } from '@governos/sdk';
const client = new GovernOS('sk_test_123');
const execution = await client.intents.approve('int_8a9b2c', { comment: 'Approved for Q3 deployment' });
console.log(execution.id);
```

**Error Codes:**
- `400 Bad Request`: Intent is not in a plannable state.
- `401 Unauthorized`: Invalid API key.
- `403 Forbidden`: User lacks permission to approve this action.
- `404 Not Found`: Intent ID does not exist.
- `429 Too Many Requests`: Rate limit exceeded.

**Best Practices:**
- Always provide a `comment` when approving risky actions for audit logging purposes.
- Ensure only authorized administrators have the permission to approve intents.
