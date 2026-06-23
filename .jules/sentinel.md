## 2025-02-14 - Prevent DoS via file size limits and validation
**Vulnerability:** The code directly calls `open()` and `read()` on file paths during file parsing, lacking both size limits and verification that the path points to a regular file. This allows attackers to cause a Denial of Service (DoS) by pointing the parser at infinitely blocking device files or excessively large files that exhaust system memory.
**Learning:** File parsing operations that read entire file contents into memory are a vector for DoS if unconstrained.
**Prevention:** Always use `os.path.isfile()` to ensure the target is a regular file and enforce maximum file size limits (e.g., via `os.path.getsize()`) prior to opening and reading file contents into memory.
