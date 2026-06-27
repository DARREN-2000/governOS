# Advanced Examples

These examples demonstrate the full power of GovernOS when dealing with dynamic scopes, contextual memory, and compensation logic.

## 1. Rolling Back a Failed Deployment

This scenario demonstrates the `compensate()` contract.

**Intent:**
> "Deploy version 2.0.0 of the billing service. If it fails health checks, roll back to 1.9.0."

**Generated Plan:**
```yaml
steps:
  - id: deploy_v2
    action: kubernetes/deploy
    params:
      namespace: "production"
      image: "billing:2.0.0"

  - id: run_health_checks
    action: http/check
    params:
      url: "https://billing.internal/health"
      timeout_ms: 5000
```

**Execution Flow:**
1. The `kubernetes/deploy` action succeeds and updates the deployment.
2. The `http/check` action fails (e.g., returns 503).
3. The Executor automatically runs the `compensate()` method of the `kubernetes/deploy` plugin, which reverts the deployment back to `1.9.0`.

## 2. Dynamic Policy Evaluation

**Intent:**
> "Provision a large EC2 instance for the data science team."

**Policy Engine Rules:**
```yaml
rules:
  - id: limit_ec2_size
    condition: "action.type == 'aws/ec2/create' and action.params.instance_type in ['p3.8xlarge', 'p4d.24xlarge']"
    enforcement: require_approval
    role: "finance_admin"
```

In this scenario, because the requested EC2 instance type is very expensive, the Policy Engine dynamically flags the Execution Plan and pauses it until a user with the `finance_admin` role approves the cost.
