# Quick Start

Get up and running with GovernOS in less than 5 minutes.

## 1. Initialize GovernOS

First, initialize a new GovernOS project in your directory:

```bash
npx governos init my-project
cd my-project
```

## 2. Define Your First Intent

Create an `intent.yaml` file:

```yaml
name: "Provision Dev Environment"
description: "Creates an S3 bucket and DynamoDB table for a new developer"
approvals:
  required: true
  role: "admin"
actions:
  - id: create-s3
    type: aws/s3/create
    params:
      bucket_name: "dev-assets-${user}"
```

## 3. Plan the Execution

GovernOS will preview the execution plan before making any changes:

```bash
governos plan intent.yaml
```

*Expected Output:*
```
✓ Parsed intent successfully
✓ Evaluated policies: 1 passed, 0 failed
ℹ Planning to execute:
  1. aws/s3/create (bucket: dev-assets-alice)

Waiting for approval...
```

## 4. Execute the Plan

Once approved, execute the plan:

```bash
governos apply
```

Congratulations! You've just orchestrated your first trusted workflow with GovernOS.