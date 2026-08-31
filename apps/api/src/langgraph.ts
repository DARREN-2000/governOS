import {
  Annotation,
  StateGraph,
  START,
  END,
  MemorySaver,
  interrupt,
  Command,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Define our state schema
export const GovernOSStateSchema = Annotation.Root({
  intent: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "",
  }),
  planSteps: Annotation<any[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  riskLevel: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "Unknown",
  }),
  status: Annotation<string>({
    reducer: (_, next) => next,
    default: () => "planning",
  }),
});

export type GovernOSState = typeof GovernOSStateSchema.State;

// Define Output Schema for structured parsing
const PlanSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string(),
      action: z.string(),
      description: z.string(),
    })
  ).max(10),
});

import { RunnableConfig } from "@langchain/core/runnables";

// Initialize LLM (Mistral API)
const getLLM = (overrideKey?: string) => {
  const key = overrideKey || process.env.MISTRAL_API_KEY;
  if (!key) return null;

  return new ChatOpenAI({
    modelName: "open-mistral-nemo",
    openAIApiKey: key,
    configuration: {
      baseURL: "https://api.mistral.ai/v1",
    },
    temperature: 0,
  });
};

// Node 1: Planner Agent
async function plannerAgent(state: GovernOSState, config?: RunnableConfig) {
  const overrideKey = config?.configurable?.mistral_api_key;
  const llm = getLLM(overrideKey);

  if (!llm) {
    return {
      planSteps: [
        { id: "step_1", action: "execute", description: `Fallback execution for: ${state.intent}` }
      ],
      status: "security_check",
    };
  }

  const structuredLlm = llm.withStructuredOutput(PlanSchema, { name: "execution_plan" });

  try {
    const response = await structuredLlm.invoke([
      {
        role: "system",
        content: `You are the GovernOS Planner Agent. Break down the user's intent into a safe execution graph.`,
      },
      { role: "user", content: state.intent },
    ]);

    return {
      planSteps: response.steps || [],
      status: "security_check",
    };
  } catch (error) {
    console.error("Planner failed", error);
    return {
      planSteps: [{ id: "step_1", action: "error", description: "Planning failed. Check LLM." }],
      status: "security_check",
    };
  }
}

// Node 2: Security Agent (Risk Assessor)
async function securityAgent(state: GovernOSState) {
  const allText = state.planSteps.map((s) => `${s.action} ${s.description}`).join(" ").toLowerCase();
  
  let risk = "Low";
  if (/delete|destroy|drop|terminate|remove|wipe/.test(allText)) risk = "Critical";
  else if (/write|create|provision|deploy|execute|update|modify/.test(allText)) risk = "High";
  else if (/api_call|fetch|send|post|push/.test(allText)) risk = "Medium";

  return {
    riskLevel: risk,
    status: "awaiting_approval",
  };
}

// Node 3: Human-in-the-Loop Gate
async function humanApprovalGate(state: GovernOSState) {
  // Pause graph and wait for external signal (the frontend clicking "Approve")
  const decision = interrupt<{ plan: any[]; riskLevel: string }, { approved: boolean }>({
    plan: state.planSteps,
    riskLevel: state.riskLevel,
  });

  return {
    status: decision.approved ? "approved" : "rejected",
  };
}

// Compile the Graph with a MemorySaver checkpointer
const memory = new MemorySaver();

export const orchestratorApp = new StateGraph(GovernOSStateSchema)
  .addNode("planner", plannerAgent)
  .addNode("security", securityAgent)
  .addNode("approval_gate", humanApprovalGate)
  .addEdge(START, "planner")
  .addEdge("planner", "security")
  .addEdge("security", "approval_gate")
  .addEdge("approval_gate", END)
  .compile({ checkpointer: memory });
