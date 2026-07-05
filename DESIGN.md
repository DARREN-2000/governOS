# System Design

This document details the core design decisions for GovernOS.

## The Problem
LLMs are exceptionally good at planning but cannot be trusted to execute deterministic, state-mutating actions (like dropping tables, modifying IAM rules, or sending funds) without guardrails.

## The Solution
GovernOS separates **Planning** from **Execution**.

### Design Philosophy
1. **Never let LLMs call APIs directly.** All outputs are transformed into statically typed Execution Plans.
2. **Preview before Execution.** The user (or policy engine) must always have visibility into exactly what an action will do before the side-effect occurs.
3. **Graceful Degradation.** If the primary Temporal cluster is unavailable, the system defaults to a robust `better-sqlite3` backing store for small-scale local execution.
4. **Performance by Default.** Data modeling uses Pydantic for validation at the boundaries, but falls back to native `__dict__` or manual dictionary unpacking in hot loops (e.g., NetworkX graph loading) to ensure latency remains sub-millisecond.

### Frontend Aesthetics
We employ a dark-mode, monochromatic visual aesthetic:
- **Font**: Inter
- **Theme**: Pure black (`#000000`), glassmorphism, alpha-transparent borders (`white/10`).
- **Frameworks**: Shadcn/ui and Tailwind. No generic Bootstrap or Material UI components to preserve the developer-focused brand identity.
