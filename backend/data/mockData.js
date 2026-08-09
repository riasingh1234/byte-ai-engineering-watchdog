// backend/data/mockData.js
// Static placeholder data for BYTE's API foundation.
// Nothing here calls an AI model, a database, or does real discovery/eval yet.
// Swap these for real data sources as each subsystem is built.

const stats = {
  discovered: 0,
  accepted: 0,
  rejected: 0,
  memories: 0,
};

const pipelineStatus = {
  stages: [
    {
      key: "discover",
      label: "Discover",
      status: "pending",
      note: "Waiting for discovery",
    },
    {
      key: "retrieve",
      label: "Retrieve Memory",
      status: "pending",
      note: "Waiting for memory",
    },
    {
      key: "evaluate",
      label: "Evaluate",
      status: "pending",
      note: "Waiting for evaluation",
    },
    {
      key: "generate",
      label: "Generate",
      status: "pending",
      note: "Waiting for generation",
    },
    {
      key: "remember",
      label: "Remember",
      status: "pending",
      note: "Waiting for memory storage",
    },
  ],
};

const intelligence = {
  items: [],
};

const decisions = {
  items: [],
};

const memory = {
  items: [],
};

module.exports = {
  stats,
  pipelineStatus,
  intelligence,
  decisions,
  memory,
};
