## 2024-05-24 - DoS and Infinite Reads via File Operations
**Vulnerability:** The application was vulnerable to reading arbitrary file sizes and reading from device files directly into memory in `intentgraph/parser.py`.
**Learning:** File parsing operations must ensure they are dealing with a standard file (not a stream or device block, like `/dev/zero`) and impose an explicit size limit before performing a full `f.read()`. Memory limit exhaustion is a significant Denial of Service risk.
**Prevention:** Always use `os.path.isfile(filepath)` and check `os.path.getsize(filepath) <= MAX_FILE_SIZE` prior to reading file content into memory.
