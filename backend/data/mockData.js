// backend/data/mockData.js
// Static placeholder data for endpoints not yet implemented for real.
// `stats` moved to state/statsStore.js (now derived from live evaluation).
// `intelligence` moved to discovery/discoverTopics.js (Checkpoint 3).

const pipelineStatus = {
  stages: [
    { key: "discover", label: "Discover", status: "pending", note: "Waiting for discovery" },
    { key: "retrieve", label: "Retrieve Memory", status: "pending", note: "Waiting for memory" },
    { key: "evaluate", label: "Evaluate", status: "pending", note: "Waiting for evaluation" },
    { key: "generate", label: "Generate", status: "pending", note: "Waiting for generation" },
    { key: "remember", label: "Remember", status: "pending", note: "Waiting for memory storage" },
  ],
};

const decisions = {
  items: [],
};

const memory = {
  items: [],
};

module.exports = {
  pipelineStatus,
  decisions,
  memory,
};