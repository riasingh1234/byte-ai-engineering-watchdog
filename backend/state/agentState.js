// backend/state/agentState.js
//
// Runtime state for the initialized agent. In-memory only — resets on
// server restart, which is expected at this checkpoint (no database yet).
//
// Shape is deliberately wider than what Checkpoint 6 needs, so later
// checkpoints (memory, generation, publishing) can fill in fields that
// already exist here rather than reshaping this module again.

const crypto = require("crypto");
const { BYTE_EDITORIAL_IDENTITY } = require("../persona/editorialIdentity");

let agentState = null;

function initializeAgent({ name, domain }) {
  const agentId = crypto.randomUUID();

  agentState = {
    agentId,
    persona: {
      name,
      domain,
      // BYTE's stable internal identity, merged in so every initialized
      // persona still writes/evaluates with the same underlying voice.
      editorialIdentity: BYTE_EDITORIAL_IDENTITY,
    },
    initializedAt: new Date().toISOString(),

    // Placeholders for future checkpoints — not populated yet.
    memory: [],            // Checkpoint: Remember
    publishedPosts: [],    // Checkpoint: Publish
    autonomous: {
      enabled: false,      // Checkpoint: autonomous scheduling
      lastRunAt: null,
    },
  };

  return agentState;
}

function getAgentState() {
  return agentState;
}

function isInitialized() {
  return agentState !== null;
}

module.exports = { initializeAgent, getAgentState, isInitialized };