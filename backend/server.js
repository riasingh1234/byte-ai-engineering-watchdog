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
const { generatePost } = require("./generation/generatePost");
const { selectTopicForPublishing } = require("./publishing/selectTopic");
const { getPosts } = require("./publishing/feedStore");
const { runAgentCycle } = require("./publishing/runAgentCycle");
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
  state.autonomous.enabled = true;
  setInterval(async () => {
  const currentState = getAgentState();

  if (!currentState || !currentState.autonomous.enabled) {
    return;
  }

  try {
    const post = await runAgentCycle(currentState);

    if (post) {
      console.log(
        `[BYTE] Autonomous post created: ${post.id}`
      );
    }
  } catch (err) {
    console.error(
      "[BYTE] Autonomous cycle failed:",
      err.message
    );
  }
}, 30 * 1000);

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

    const memoryAwareItems = [];

    for (const topic of evaluatedItems) {
      try {
        const previouslySeen = await hasRememberedTopic(topic);

        const updatedTopic = {
          ...topic,
          previouslySeen,
        };

        if (topic.decision === "accepted" && !previouslySeen) {
          await rememberTopic(topic);
          updatedTopic.rememberedNow = true;
        } else {
          updatedTopic.rememberedNow = false;
        }

        memoryAwareItems.push(updatedTopic);
      } catch (memoryError) {
        console.error(
          `[Breeth] Memory processing failed for "${topic.title}":`,
          memoryError.message
        );

        memoryAwareItems.push({
          ...topic,
          previouslySeen: false,
          rememberedNow: false,
          memoryError: "Memory unavailable",
        });
      }
    }

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
      error:
        "Discovery/evaluation temporarily unavailable. Please try again shortly.",
    });
  }
});
app.get("/api/agent/feed", (req, res) => {
  const { agentId } = req.query;
  const state = getAgentState();

  if (!state) {
    return res.status(400).json({
      error: "Agent has not been initialized.",
    });
  }

  if (agentId !== state.agentId) {
    return res.status(400).json({
      error: "Invalid agentId.",
    });
  }

  const posts = [...state.publishedPosts].sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json({
    posts,
  });
});
// ---------- Start server ----------

app.listen(PORT, () => {
  console.log(`BYTE backend running on port ${PORT}`);
});