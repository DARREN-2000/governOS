## 2025-06-20 - [Memory Exhaustion / DoS via Unbounded File Reading]
**Vulnerability:** Code reading files entirely into memory (e.g. `f.read()`) without file size limits, risking memory exhaustion (DoS), and missing validation for regular files, potentially leading to issues with reading device files or pipes (e.g., `/dev/zero`).
**Learning:** Found in the AST-parsing architecture (`intentgraph/parser.py`), which is critical for the application. Any input path passed to a parser should first be validated to be a regular file and of a reasonable size.
**Prevention:** Always validate `os.path.isfile(filepath)` and check `os.path.getsize(filepath)` against a safe maximum (e.g., 10MB) before loading file contents into memory, returning safely logged fallback values if checks fail.
