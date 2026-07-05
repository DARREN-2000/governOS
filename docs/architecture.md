# System Architecture

GovernOS implements a strict architectural separation of concerns designed for high-availability enterprise environments. By decoupling intent generation (planning) from side-effect application (execution), GovernOS safely introduces autonomous behavior into critical infrastructure.

## Component Topology

### 1. The Python Core Engine
- **Role:** Graph orchestration, dependency tracking, code parsing, and machine-queryable context generation.
- **Tech Stack:** Python 3.10+, FastAPI, NetworkX, AST, Pydantic.
- **Why Python?** Python provides unparalleled capabilities for AST traversal, code analysis, and machine learning ecosystem integration. It acts as the "brain" connecting natural language intents to physical code boundaries.

### 2. The Node.js API Service
- **Role:** Workflow orchestration, client communication, authentication, and state management.
- **Tech Stack:** Node.js 20+, Express.js, Better-SQLite3 (with Temporal capabilities).
- **Why Node.js?** Express handles highly concurrent I/O operations elegantly. It manages the long-polling, websockets, and asynchronous workflow polling needed for Human-in-the-Loop (HITL) scenarios.

### 3. The React Web Dashboard
- **Role:** Providing engineers and operators with a premium, transparent view of workflow graphs, intent plans, and approval queues.
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Design Philosophy:** Developer-first, high-information-density dark mode.

## The Action Contract

Every deterministic action executed within GovernOS must conform to our Action Contract. This is what guarantees safety.

1. **`preview()`**: Analyzes input parameters and returns a structured output describing what *will* happen. No state is mutated.
2. **`execute()`**: Mutates state. Must utilize an idempotency key to prevent double execution in the event of retries.
3. **`compensate()`**: The rollback mechanism. If step 4 of a workflow fails, steps 3, 2, and 1 have their `compensate()` methods invoked to restore the initial state.

## Memory and State
To prevent multi-tenant data leakage, GovernOS leverages Scoped Contexts. Memory is strictly partitioned into `Personal`, `Project`, and `Organization` silos. The Node.js API ensures that memory boundaries are strictly enforced during the retrieval-augmented generation (RAG) context assembly phase.
