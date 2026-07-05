# GovernOS Architecture

GovernOS is a multi-tenant action orchestration system built to insert a deterministic trust layer between Large Language Models (LLMs) and potentially destructive enterprise infrastructure APIs.

## High-Level Topology

The system is broken down into three distinct tiers:

1. **Python Core Engine (`governos/`)**:
   - Built on FastAPI.
   - Provides a machine-queryable context graph using NetworkX.
   - Parses code boundaries using Python's native `ast` module.
   - Evaluates intents against hardcoded security policies.

2. **Node.js API (`apps/api`)**:
   - Built on Express.js and Better-SQLite3.
   - Orchestrates the asynchronous workflows.
   - Maintains the persistent human-in-the-loop (HITL) state machine.
   - Communicates with the Python Core for graph computations.

3. **React Web Frontend (`apps/web`)**:
   - Built on React 19, Vite, Tailwind CSS, and shadcn/ui.
   - Presents a premium developer-first interface.
   - Used for visualizing workflow DAGs and approving/rejecting proposed plans.

## The Action Contract

Every side-effecting action in the GovernOS ecosystem MUST implement the following interface:

- `preview()`: Emits a strictly-typed description of what the action intends to do, without mutating state.
- `execute()`: Performs the side-effect. Must utilize idempotency keys to ensure safety during retries.
- `compensate()`: The rollback mechanism. If a workflow fails downstream, earlier actions have their `compensate()` methods called to restore the system to its original state.

## Memory and State

- State transitions are recorded as immutable audit events.
- To maintain multi-tenant safety, memory context is strictly scoped by tenant hierarchy (Personal, Project, Organization).
