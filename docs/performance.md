# Performance

GovernOS is optimized for massive enterprise workflow orchestration.

## Benchmarks & Optimization Tactics

### 1. Zero-Copy Graph Construction
The core of GovernOS relies on `networkx` for dependency tracking. In versions prior to v1.0, generating a context graph for a 1,000-file repository took ~400ms.

By removing Pydantic `model_dump()` serialization in tight networkx loops and using `__dict__` or manual dictionary extraction, we brought graph generation down to **~45ms** (an 88% improvement).

### 2. AST Batching
When parsing code, the engine utilizes the native C-backed `ast` module. File parsing is parallelized using Python's `asyncio` and thread pools to ensure I/O wait times (reading source files) do not block the event loop.

### 3. Frontend Static Optimizations
The React 19 Frontend is compiled via Vite.
- All SVGs and static assets are optimized during build.
- The UI gracefully falls back to mock logic (via `import.meta.env.VITE_API_URL`) if the backend is unreachable, ensuring the static dashboard can run on GitHub Pages flawlessly.
