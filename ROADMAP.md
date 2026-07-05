# GovernOS Roadmap

GovernOS is constantly evolving to handle larger, more complex agentic workflows for the enterprise.

## Completed Milestones ✅
- **Phase 1: Core Architecture**
  - Python core graph orchestration via NetworkX.
  - Deterministic Action Contract (`preview`, `execute`, `compensate`).
  - AST parsing for code dependency graphs.
- **Phase 2: Platform & API**
  - Node.js API with Express.
  - Fallback SQLite Workflow Engine.
  - Role-Based Access Control (RBAC).
- **Phase 3: Visual Interface**
  - Premium developer-first React 19 / Vite Frontend.
  - Interactive approval dashboard.

## Upcoming Milestones 🚀

### Q3: Enterprise Scale
- **Temporal Durability:** Full integration of Temporal.io for massively parallel, long-running workflow durability.
- **Advanced Connectors:** Add certified connectors for Snowflake, Datadog, and Kubernetes.
- **Cost Policy Engine:** Implement strict bounding constraints on cloud-spend estimation during the `preview()` phase.

### Q4: Deep Code Context
- **Cross-Language AST:** Expand the Python core engine's parsing capabilities to include TypeScript and Rust, providing LLMs with context-aware knowledge graphs across polyglot repositories.
- **Streaming Ingestion:** Replace batch graph generation with incremental graph updates on commit.

### Future Horizons
- Multi-region high-availability configurations.
- Custom LLM integration templates for local execution via vLLM.
