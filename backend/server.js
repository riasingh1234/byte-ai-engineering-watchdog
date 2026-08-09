// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { pipelineStatus, decisions, memory } = require("./data/mockData");
const { getMemory } = require("./memory/memoryStore");
const { discoverTopics } = require("./discovery/discoverTopics");
const { evaluateTopics } = require("./evaluation/evaluateTopic");
const { getStats, updateStatsFromEvaluation } = require("./state/statsStore");
const { initializeAgent } = require("./state/agentState");
const {
  searchBreethMemory,
  rememberInBreeth,
} = require("./memory/breethMemory");
const {
  hasRememberedTopic,
  rememberTopic,
} = require("./memory/memoryStore");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------- Core routes ----------

app.get("/", (req, res) => {
  res.send("BYTE backend is running.");
});

app.get("/api/status", (req, res) => {
  res.json({
    agent: "BYTE",
    status: "online",
    memory: "not_connected",
    mode: "development",
  });
});

app.get("/api/stats", (req, res) => {
  res.json(getStats());
});
// ---------- Agent initialization ----------

app.post("/api/agent/init", (req, res) => {
  const persona = req.body?.persona;

  if (!persona || typeof persona.name !== "string" || !persona.name.trim()) {
    return res.status(400).json({ error: "persona.name is required." });
  }

  if (typeof persona.domain !== "string" || !persona.domain.trim()) {
    return res.status(400).json({ error: "persona.domain is required." });
  }

  const state = initializeAgent({
    name: persona.name.trim(),
    domain: persona.domain.trim(),
  });

  res.json({ agentId: state.agentId });
});

// ---------- Pipeline / decisions / memory (still static placeholders) ----------

app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineStatus);
});

app.get("/api/decisions", (req, res) => {
  res.json(decisions);
});

app.get("/api/memory", (req, res) => {
  res.json(getMemory());
});

// ---------- Checkpoint 3 + 4: discovery -> evaluation ----------

app.get("/api/intelligence", async (req, res) => {
  try {
    const { items, warnings, fetchedAt } = await discoverTopics();
    const evaluatedItems = evaluateTopics(items);
    const memoryAwareItems = evaluatedItems.map((topic) => ({
  ...topic,
  previouslySeen: hasRememberedTopic(topic),
}));

    updateStatsFromEvaluation(memoryAwareItems);

    res.json({
      items: memoryAwareItems,
      fetchedAt,
      ...(warnings && warnings.length > 0 && { warnings }),
    });
  } catch (err) {
    console.error("[api/intelligence] Unexpected failure:", err.message);
    res.status(200).json({
      items: [],
      error: "Discovery/evaluation temporarily unavailable. Please try again shortly.",
    });
  }
});

// ---------- Start server ----------

app.listen(PORT, () => {
  console.log(`BYTE backend running on port ${PORT}`);
});