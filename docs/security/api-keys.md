# API Keys & Secure Patterns

This document describes recommended patterns for securely connecting the exported static web UI to a live control plane.

Guiding principle: never commit or store long-lived secrets in the repository. Prefer short-lived tokens, server-side proxies, or OAuth flows.

Recommended options

- Short-lived API tokens (recommended)
  - Issue time-limited tokens from your control plane (TTL minutes-hours).
  - Tokens can be rotated and revoked quickly.
  - Use tokens with minimal scope (read-only vs write) depending on the UI operation.

- Server-side proxy (best for production)
  - Expose a small server-side endpoint (under your domain) that stores secrets securely (env or vault) and proxies requests to the control plane.
  - The static UI calls your proxy which enforces auth, rate-limiting, and CORS.
  - Keeps secrets off the client entirely.

- OAuth / OIDC (recommended for user-specific access)
  - Implement an OAuth dance with authorization code flow and PKCE to obtain short-lived tokens.
  - Store refresh tokens only on the server and exchange them for access tokens server-side.

- Browser-stored secrets (temporary/demo only)
  - If you must store secrets in the browser for demos, store them encrypted with a passphrase supplied by the user (see secure-config) and avoid plain localStorage.
  - Treat any client-side secret as public — never rely on it for strong authorization.

Practical guidance for this project

- For GitHub Pages demo: use short-lived demo tokens or configure a proxy endpoint that the static site can call.
- Prefer `x-api-key` header for simple API gateway setups; prefer OAuth for per-user scopes.
- Add CORS rules on the API side to allow the static site origin or proxy only.

Security tradeoffs

- Storing secrets in localStorage or as environment variables in an exported static site is insecure — assume the browser-stored secret can be exposed.
- Encrypted storage with a passphrase only raises the bar slightly; the passphrase still needs to be entered by the user and is the primary secret.

See `apps/web/src/lib/secureConfig.ts` for an example client-side encryption helper (Web Crypto) used by the UI for optional encrypted local configs.
