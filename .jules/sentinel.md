## 2024-05-15 - [DoS via Unbounded File Reading in Parser]
**Vulnerability:** `CodeParser.parse_file` read files directly into memory without checking if they were regular files or enforcing size limits. This could allow reading device files or exhaust memory (DoS).
**Learning:** File parsers in orchestration engines are vulnerable targets since they automatically act on provided paths.
**Prevention:** All file loading utilities must use `os.path.isfile()` to ensure standard file type, and implement a maximum file size check before reading to memory.
