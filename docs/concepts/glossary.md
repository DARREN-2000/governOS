# Glossary

- **Action**: An atomic operation executed by the system (e.g., `github/create_repo`).
- **Audit Log**: An immutable, append-only record of all actions taken by GovernOS.
- **Compensation**: The process of undoing a previously executed action to maintain system consistency when a workflow fails.
- **Connector**: A package that implements one or more Actions for a specific external service (e.g., AWS Connector).
- **Execution Plan**: The deterministic DAG (Directed Acyclic Graph) of steps generated from an Intent.
- **Intent**: The desired end-state requested by the user.
- **Memory**: Scoped context provided to the Planner to understand the user's environment.
- **Planner**: The component responsible for translating Intents into Execution Plans.