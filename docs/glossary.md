# Glossary

This glossary clarifies terminology used throughout the GovernOS documentation and architecture.

- **Action Contract:** The rigid interface (`preview`, `execute`, `compensate`) that every plugin must implement to ensure system safety and idempotency.
- **DAG (Directed Acyclic Graph):** A mathematical structure used by GovernOS to represent dependencies between workflow steps, ensuring cyclical dependencies do not cause infinite loops.
- **HITL (Human-in-the-Loop):** A security paradigm where an automated workflow pauses execution to request manual validation from an authorized user before proceeding.
- **Idempotency Key:** A unique string (usually a UUID) passed to an `execute()` function. It guarantees that even if the function is called multiple times (e.g., due to a network retry), the side-effect only occurs once.
- **Intent:** The natural language string representing the user's ultimate goal (e.g., "Add Alice to the admin group").
- **Planner:** An LLM or heuristic engine that converts an *Intent* into a deterministic *Workflow Spec*. GovernOS is not a planner; it orchestrates the output of a planner.
- **Rollback / Compensate:** The act of reverting a system to its previous state after a workflow failure, ensuring atomicity.
- **Trust Layer:** The core value proposition of GovernOS. It acts as middleware between intelligent agents and critical APIs, enforcing rules, policies, and human approvals.
