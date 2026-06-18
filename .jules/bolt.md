## 2026-06-18 - Python AST Visitor Optimization
**Learning:** Defining classes dynamically inside functions (like an AST `NodeVisitor` inside a `parse` method) introduces a measurable performance overhead in Python, as the class is re-compiled on every function call. For high-throughput parsers, this adds up significantly.
**Action:** Always extract inner classes to the module level and pass necessary scope variables through the `__init__` constructor instead.
