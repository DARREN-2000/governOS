# Troubleshooting

If you encounter issues during installation or execution, consider the following:

- **Build Errors on Node:** If you see binding errors from `better-sqlite3`, ensure you run `pnpm rebuild better-sqlite3`.
- **Python Missing Modules:** Ensure you are in the correct poetry shell or prefixing commands with `poetry run`.
- **Docker Port Conflicts:** If ports 80, 3001, or 8000 are in use, terminate those processes (`lsof -t -i:8000 | xargs kill`) or remap the ports in `docker-compose.yml`.
