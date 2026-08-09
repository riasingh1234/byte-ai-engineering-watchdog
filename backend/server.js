// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { pipelineStatus, decisions, memory } = require("./data/mockData");
const { discoverTopics } = require("./discovery/discoverTopics");
const { evaluateTopics } = require("./evaluation/evaluateTopic");
const { getStats, updateStatsFromEvaluation } = require("./state/statsStore");

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

// ---------- Pipeline / decisions / memory (still static placeholders) ----------

app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineStatus);
});

app.get("/api/decisions", (req, res) => {
  res.json(decisions);
});

app.get("/api/memory", (req, res) => {
  res.json(memory);
});

// ---------- Checkpoint 3 + 4: discovery -> evaluation ----------

app.get("/api/intelligence", async (req, res) => {
  try {
    const { items, warnings, fetchedAt } = await discoverTopics();
    const evaluatedItems = evaluateTopics(items);

    updateStatsFromEvaluation(evaluatedItems);

    res.json({
      items: evaluatedItems,
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