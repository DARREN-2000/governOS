# Enterprise Examples

These examples show how GovernOS handles complex, multi-step orchestrated workflows with approvals.

## 1. Employee Offboarding Workflow

**Intent:**
> "Offboard employee jsmith@company.com. Revoke AWS access, lock their GitHub account, and notify HR."

**Generated Plan:**
```yaml
steps:
  - id: revoke_aws
    action: aws/iam/deactivate_user
    params:
      username: "jsmith"

  - id: lock_github
    action: github/org/remove_member
    params:
      username: "jsmith"

  - id: notify_hr
    action: slack/send_message
    params:
      channel: "#hr-notifications"
      text: "Offboarding completed for jsmith"

policies:
  require_approval: true
  approver_role: "it_admin"
```

In this scenario, GovernOS will pause execution and require an `it_admin` to approve the action before it proceeds.