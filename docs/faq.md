# FAQ

**How is GovernOS different from LangChain or AutoGPT?**
GovernOS is an orchestration and governance engine, not an agent framework. It provides the infrastructure to deploy agents safely in enterprise environments by enforcing typed plans, human approvals, and cryptographic audit trails before execution.

**Does my existing agent framework need to be rewritten?**
No. GovernOS acts as a middleware API. Your existing agents simply need to output their intended actions as JSON matching our workflow specification, rather than executing API calls directly.
