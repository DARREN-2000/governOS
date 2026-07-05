# API Reference

The GovernOS Node.js Backend API orchestrates workflow execution, state transitions, and approvals. The API is REST-based and utilizes standard JSON payloads.

## Authentication

All secured endpoints require authentication via JSON Web Tokens (JWT).

### Login
Authenticates a user and issues a token.

**Endpoint:** `POST /api/v1/login`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "user@governos.io",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Intents & Workflows

### Submit an Intent
Submits a natural language intent to the Planner. The LLM Planner compiles this into a Workflow Specification.

**Endpoint:** `POST /api/v1/intents`
**Headers:**
- `Authorization: Bearer <your-jwt-token>`
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "description": "Provision a new secure S3 bucket for project Alpha and attach the read-only IAM policy."
}
```

**Response (202 Accepted):**
```json
{
  "workflow_id": "wf-1234-5678",
  "status": "PLANNING",
  "estimated_time": 2500
}
```

### Get Workflow Status
Poll the status of a previously submitted workflow.

**Endpoint:** `GET /api/v1/workflows/:id`
**Headers:**
- `Authorization: Bearer <your-jwt-token>`

**Response (200 OK):**
```json
{
  "workflow_id": "wf-1234-5678",
  "status": "WAITING_APPROVAL",
  "policy_violations": [],
  "steps": [
    {
      "step_id": "step-1",
      "action": "aws:s3:createBucket",
      "preview": "Create S3 Bucket 'alpha-secure-bucket-xyz'",
      "status": "PENDING"
    }
  ]
}
```

## Future SDKs
Official SDKs for TypeScript and Python are on our [Roadmap](../ROADMAP.md).
