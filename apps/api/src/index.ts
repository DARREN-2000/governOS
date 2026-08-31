import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { initDb, run, get, db } from "./db.js";
import { Connection, Client } from "@temporalio/client";
import { intentExecutionWorkflow } from "./temporal/workflows.js";
import { authenticate, generateToken } from "./auth.js";
import { runFallbackWorker } from "./workers/fallback-worker.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

// Simple in-memory rate limiter to protect the demo LLM API key
const requestCounts = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 50;

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  
  if (!requestCounts.has(ip) || requestCounts.get(ip)!.resetTime < now) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }
  
  const record = requestCounts.get(ip)!;
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }
  
  record.count++;
  next();
});

const port = process.env.PORT || 3001;

let temporalClient: Client | null = null;

async function initTemporal() {
  const connection = await Connection.connect({ address: "localhost:7233" });
  temporalClient = new Client({ connection });
}

app.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  try {
    const user: any = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (isValid) {
      const token = generateToken(user);
      res.json({ token, user: { email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/v1/intents", authenticate, async (req, res) => {
  const { description, openRouterApiKey } = req.body;
  const user = (req as any).user;

  if (!description) {
    res.status(400).json({ error: "Description is required" });
    return;
  }

  try {
    const thread_id = `thread_${Math.random().toString(36).substr(2, 9)}`;
    const config = { configurable: { thread_id, openrouter_api_key: openRouterApiKey } };

    // This will start the LangGraph workflow. It runs Planner -> Security -> stops at Interrupt
    await import("./langgraph.js").then(m => m.orchestratorApp.invoke({ intent: description }, config));
    
    // Get the paused state
    const currentState = await import("./langgraph.js").then(m => m.orchestratorApp.getState(config));
    
    const planSteps = currentState.values.planSteps || [];
    const riskLevel = currentState.values.riskLevel || "Unknown";

    const createWorkflowTx = db.transaction(() => {
      const intentRes = db
        .prepare("INSERT INTO intents (user_id, description) VALUES (?, ?)")
        .run(user.id, description);
      const intentId = intentRes.lastInsertRowid;

      const workflowRes = db
        .prepare("INSERT INTO workflows (intent_id, plan_data) VALUES (?, ?)")
        .run(intentId, JSON.stringify(planSteps));
      return workflowRes.lastInsertRowid;
    });

    const wfId = createWorkflowTx();
    const wfIdStr = wfId.toString();

    // Start Temporal Workflow in waiting state (optional, or just do it on approve)
    if (temporalClient) {
      await temporalClient.workflow.start(intentExecutionWorkflow, {
        args: [wfIdStr, description],
        taskQueue: "intent-execution",
        workflowId: `intent-workflow-${wfIdStr}`,
      });
    }

    res.json({
      message: "Workflow planned via LangGraph",
      plan: {
        id: `wf_${thread_id}`, // Store thread_id to resume later
        db_id: wfIdStr,
        steps: planSteps,
        riskLevel: riskLevel, // Now coming natively from our Security Agent
        status: "planned",
      },
      thread_id: thread_id, // Pass to frontend for resumption
    });
  } catch (e) {
    console.error("Workflow planning via LangGraph failed", e);
    res.status(500).json({ error: "Failed to plan workflow via LangGraph" });
  }
});

app.post("/api/v1/intents/:id/approve", authenticate, async (req, res) => {
  const { id } = req.params;
  const { thread_id } = req.body; // Expect the frontend to pass back the thread_id

  try {
    if (thread_id) {
      const config = { configurable: { thread_id } };
      const { Command } = await import("@langchain/langgraph");
      const { orchestratorApp } = await import("./langgraph.js");
      
      // Resume the LangGraph thread to trigger the executor node logic
      await orchestratorApp.invoke(
        new Command({ resume: { approved: true } }),
        config
      );
    }

    if (temporalClient) {
      const handle = temporalClient.workflow.getHandle(`intent-workflow-${id}`);
      await handle.signal("approve");
      res.json({
        message: "Workflow approved and executing",
        id,
        status: "approved",
      });
      return;
    } else {
      await run("UPDATE workflows SET status = ? WHERE id = ?", [
        "approved",
        id,
      ]);
      res.json({
        message: "Workflow approved and queued for fallback execution",
        id,
        status: "approved",
      });
    }
  } catch (e) {
    console.error("Workflow approval failed", e);
    res.status(500).json({ error: "Failed to approve workflow" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "GovernOS API" });
});

app.listen(port, async () => {
  initDb();
  try {
    await initTemporal();
    console.log("Temporal connected successfully.");
  } catch (e) {
    console.error(
      "Temporal connection failed. Real execution requires temporal. (Will use fallback DB execution)",
      (e as any).message,
    );
    runFallbackWorker().catch((err) =>
      console.error("Fallback worker crashed", err),
    );
  }
  console.log(`GovernOS API listening at http://localhost:${port}`);
});
