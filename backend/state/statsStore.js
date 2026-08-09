// backend/state/statsStore.js
//
// Simple in-memory counters — NOT a database, just runtime state.
// Updated whenever /api/intelligence runs a fresh discover+evaluate cycle.
// Resets to zero on server restart, which is expected at this checkpoint.

let stats = {
  discovered: 0,
  accepted: 0,
  rejected: 0,
  memories: 0, // untouched until the memory checkpoint is implemented
};

function getStats() {
  return { ...stats };
}

function updateStatsFromEvaluation(evaluatedItems) {
  const accepted = evaluatedItems.filter((i) => i.decision === "accepted").length;
  const rejected = evaluatedItems.filter((i) => i.decision === "rejected").length;

  stats = {
    ...stats,
    discovered: evaluatedItems.length,
    accepted,
    rejected,
  };

  return getStats();
}

module.exports = { getStats, updateStatsFromEvaluation };