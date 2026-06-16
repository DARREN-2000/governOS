# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* turbo.json tsconfig.json ./

# Copy workspace package.json files
COPY packages/workflow-spec/package.json packages/workflow-spec/
COPY packages/action-sdk/package.json packages/action-sdk/
COPY packages/policy/package.json packages/policy/
COPY packages/shared/package.json packages/shared/
COPY packages/connectors/package.json packages/connectors/
COPY services/approvals/package.json services/approvals/
COPY services/audit/package.json services/audit/
COPY services/executor/package.json services/executor/
COPY services/memory/package.json services/memory/
COPY services/planner/package.json services/planner/
COPY apps/api/package.json apps/api/

# Install dependencies
RUN npm install --ignore-scripts

# Copy source code
COPY packages/workflow-spec/ packages/workflow-spec/
COPY packages/action-sdk/ packages/action-sdk/
COPY packages/policy/ packages/policy/
COPY packages/shared/ packages/shared/
COPY packages/connectors/ packages/connectors/
COPY services/approvals/ services/approvals/
COPY services/audit/ services/audit/
COPY services/executor/ services/executor/
COPY services/memory/ services/memory/
COPY services/planner/ services/planner/
COPY apps/api/ apps/api/

# Build packages in dependency order
RUN npx turbo run build --filter=@intentgraph/api

# ---- Production Stage ----
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S intentgraph && \
    adduser -S intentgraph -u 1001

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/workflow-spec/dist packages/workflow-spec/dist
COPY --from=builder /app/packages/workflow-spec/package.json packages/workflow-spec/
COPY --from=builder /app/packages/action-sdk/dist packages/action-sdk/dist
COPY --from=builder /app/packages/action-sdk/package.json packages/action-sdk/
COPY --from=builder /app/packages/policy/dist packages/policy/dist
COPY --from=builder /app/packages/policy/package.json packages/policy/
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/shared/package.json packages/shared/
COPY --from=builder /app/services/approvals/dist services/approvals/dist
COPY --from=builder /app/services/approvals/package.json services/approvals/
COPY --from=builder /app/services/audit/dist services/audit/dist
COPY --from=builder /app/services/audit/package.json services/audit/
COPY --from=builder /app/services/executor/dist services/executor/dist
COPY --from=builder /app/services/executor/package.json services/executor/
COPY --from=builder /app/services/memory/dist services/memory/dist
COPY --from=builder /app/services/memory/package.json services/memory/
COPY --from=builder /app/services/planner/dist services/planner/dist
COPY --from=builder /app/services/planner/package.json services/planner/
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/apps/api/package.json apps/api/

USER intentgraph

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/healthz || exit 1

CMD ["node", "apps/api/dist/index.js"]
