# Beginner Examples

These examples demonstrate basic usage of the GovernOS platform.

## 1. Creating a GitHub Repository

This intent creates a new private repository.

**Intent (Natural Language):**
> "Create a new private GitHub repository called 'my-new-project' and initialize it with a README."

**Generated Plan:**
```json
{
  "action": "github/create_repository",
  "params": {
    "name": "my-new-project",
    "private": true,
    "auto_init": true
  }
}
```

## 2. Sending a Slack Notification

**Intent:**
> "Send a message to the #engineering channel announcing the deploy is complete."

**Generated Plan:**
```json
{
  "action": "slack/send_message",
  "params": {
    "channel": "#engineering",
    "text": "The deploy is complete."
  }
}
```