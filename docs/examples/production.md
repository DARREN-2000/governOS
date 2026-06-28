# Production Real-World Scenarios

GovernOS is used by enterprise teams to automate critical, high-stakes infrastructure operations.

## Scenario: Incident Remediation (Auto-Scaling)

During a traffic spike, an alert is triggered in Datadog. An automated webhook is sent to GovernOS to handle the remediation.

**Intent (via API):**
> "Scale up the Web API read-replicas by 3 due to high latency alert."

**Generated Plan:**
```json
{
  "steps": [
    {
      "action": "aws/rds/modify_cluster",
      "params": {
        "cluster_id": "prod-web-db",
        "add_replicas": 3
      }
    },
    {
      "action": "slack/send_message",
      "params": {
        "channel": "#ops-alerts",
        "text": "Automatically provisioned 3 additional read replicas for prod-web-db to mitigate latency."
      }
    }
  ]
}
```

Since the intent originated from a trusted internal Datadog webhook (verified via signature) and falls within predefined auto-scaling policies, the plan executes immediately without requiring human intervention.

## Scenario: Cross-Service User Data Deletion (GDPR)

A user requests account deletion under GDPR. The data is scattered across multiple SaaS tools.

**Intent:**
> "Delete all user data associated with email user@example.com across our systems."

**Generated Plan:**
```yaml
steps:
  - id: delete_stripe
    action: stripe/customer/delete
    params: { email: "user@example.com" }

  - id: delete_auth0
    action: auth0/user/delete
    params: { email: "user@example.com" }

  - id: delete_zendesk
    action: zendesk/user/delete
    params: { email: "user@example.com" }

policies:
  require_approval: true
  approver_role: "legal_admin"
```

The system generates a comprehensive deletion plan and strictly requires sign-off from the Legal team before permanently removing the data from the external services.
