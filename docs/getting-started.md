# Quickstart

Get GovernOS up and running locally in under 5 minutes.

## 1. Prerequisites
- Docker Compose
- Ensure ports `80`, `3001`, and `8000` are free on your machine.

## 2. Start the Stack
Clone the repository and spin up the services:

```bash
git clone https://github.com/organization/governos.git
cd governos
docker-compose up --build
```

## 3. Explore the Dashboard
Navigate to `http://localhost:80` (or `http://localhost:5173` if running natively without Docker).

Log in using the default credentials:
- **Email:** `admin@governos.io`
- **Password:** `password`

## 4. Trigger a Workflow
Using curl or an API tool like Postman, trigger an intent:

```bash
export TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@governos.io","password":"password"}' | jq -r .token)

curl -X POST http://localhost:3001/api/v1/intents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "Provision a new secure S3 bucket"}'
```

Watch the dashboard update in real-time as the workflow enters the `PLANNING`, `PREVIEWING`, and ultimately `WAITING_APPROVAL` states.
