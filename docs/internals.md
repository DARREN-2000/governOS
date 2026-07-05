# Engine Internals

This document details the internal mechanisms of the Python Core Engine.

## Dependency Graph Compilation

When an intent is received, GovernOS must determine the blast radius and context required to execute the action safely.

1. **AST Parsing:** The engine uses Python's built-in `ast` module to scan the repository or plugin code. Unlike regex, AST provides loss-tolerant, semantically aware parsing. We extract classes, functions, and import dependencies.
2. **Graph Construction:** The dependencies are modeled as a Directed Acyclic Graph (DAG) using the `networkx` library. This allows us to perform fast, machine-queryable analysis (e.g., "What services are impacted if this AWS plugin is modified?").

## Data Serialization Optimizations

During graph generation, the engine may process thousands of nodes in milliseconds. We identified a significant performance bottleneck when utilizing Pydantic for serialization in tight loops.

**Anti-Pattern:**
```python
# Slow: Calling model_dump() repeatedly
for node in large_node_list:
    graph.add_node(node.id, **node.model_dump())
```

**Optimized Pattern:**
```python
# Fast: Utilizing __dict__ directly or manual dictionary mapping
for node in large_node_list:
    graph.add_node(node.id, **node.__dict__)
```
By bypassing Pydantic's recursive validation logic during read-heavy graph operations, we achieved a 70% reduction in context generation latency. Pydantic is still strictly utilized at the API boundaries (FastAPI endpoints) to ensure input validation.

## Workflow Execution Loop

The execution engine follows a strict state machine:
1. `DRAFTING`: The LLM is generating the workflow plan.
2. `PREVIEWING`: Dry-running the steps.
3. `POLICY_CHECK`: Verifying constraints.
4. `WAITING_APPROVAL`: Paused, awaiting human input.
5. `EXECUTING`: Running side-effects.
6. `COMPLETED` / `FAILED` / `ROLLED_BACK`.
