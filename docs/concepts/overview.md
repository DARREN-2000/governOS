# Core Concepts

GovernOS is built around several foundational concepts that define how autonomous actions are orchestrated.

## Intent

An **Intent** is a declarative goal provided by a user. It can be natural language ("Provision a new staging database") or structured YAML. The system's job is to figure out *how* to achieve this intent.

## Execution Plan (Workflow Spec)

When an intent is parsed, it is converted into an **Execution Plan**. This is a deterministic, typed schema that outlines exactly what steps will be taken. Plans are always previewed before execution.

## Action Plugins

**Actions** are the atomic units of work. Every action must implement a strict contract:
1. `preview()`: Describe what will happen without making changes.
2. `execute()`: Perform the change idempotently.
3. `compensate()`: Revert the change if a subsequent step fails.

## Policies

**Policies** are rules evaluated against an Execution Plan before it is allowed to run. They enforce security, cost, and compliance boundaries.