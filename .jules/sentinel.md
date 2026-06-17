## 2026-06-17 - Replacing Math.random with Secure ID Generation
**Vulnerability:** The application was using `Math.random().toString(36).slice(2, 8)` to generate IDs across multiple files and services.
**Learning:** Using `Math.random()` to generate security-sensitive identifiers or IDs is insecure because it is not a cryptographically secure pseudo-random number generator (CSPRNG), exposing the application to collision risks and predictability.
**Prevention:** Always use `randomUUID()` from the Node.js `crypto` module (or `crypto.randomUUID()` in the browser) when generating sensitive identifiers.
