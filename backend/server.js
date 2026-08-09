// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  stats,
  pipelineStatus,
  intelligence,
  decisions,
  memory,
} = require("./data/mockData");

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
  res.json(stats);
});

// ---------- New foundation routes ----------

app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineStatus);
});

app.get("/api/intelligence", (req, res) => {
  res.json(intelligence);
});

app.get("/api/decisions", (req, res) => {
  res.json(decisions);
});

app.get("/api/memory", (req, res) => {
  res.json(memory);
});

// ---------- Start server ----------

app.listen(PORT, () => {
  console.log(`BYTE backend running on port ${PORT}`);
});