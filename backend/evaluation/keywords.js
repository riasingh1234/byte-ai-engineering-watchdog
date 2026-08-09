// backend/evaluation/keywords.js
//
// Reference data for the deterministic editorial evaluator.
// Pure data, no logic — keeps evaluateTopic.js readable and makes it easy
// to tune BYTE's editorial taste without touching scoring code.

// Terms that signal real technical / AI-engineering substance.
const POSITIVE_TECHNICAL = [
  "llm", "large language model", "transformer", "model weights", "open-weights",
  "open weights", "fine-tun", "pretrain", "inference", "quantiz", "embedding",
  "vector database", "rag", "retrieval augmented", "agent", "multi-agent",
  "reasoning", "benchmark", "dataset", "arxiv", "paper", "research",
  "neural network", "gpu", "cuda", "distillation", "mixture of experts", "moe",
  "tokenizer", "context window", "attention", "diffusion model",
];

// Terms that signal engineering / infrastructure impact rather than
// just research novelty.
const POSITIVE_ENGINEERING = [
  "latency", "throughput", "scal", "deploy", "production", "optimiz",
  "efficient", "infrastructure", "pipeline", "framework", "sdk", "api",
  "developer tool", "devtools", "mlops", "kubernetes", "docker", "compiler",
  "runtime", "open source", "open-source", "github",
];

// Terms that signal freshness / a genuine new development.
const NOVELTY_SIGNALS = [
  "new", "release", "launch", "introduc", "unveil", "announce", "first",
  "breakthrough", "update", "version",
];

// Terms that signal there's actual evidence behind the claim.
const EVIDENCE_SIGNALS = [
  "paper", "arxiv", "github", "code", "open source", "open-source",
  "benchmark", "reproduc", "dataset", "results show", "evaluation",
  "study", "report",
];

// Terms that immediately mark content as low-signal / off-topic.
// Any match here forces a rejection regardless of other scores.
const NEGATIVE_SIGNALS = [
  "rumor", "rumour", "leaked", "leak:", "gossip", "celebrity", "dating app",
  "box office", "movie review", "tv show", "sports score", "recipe",
  "horoscope", "giveaway", "% off", "coupon", "discount code", "sponsored",
  "advertisement", "click here", "you won't believe", "shocking",
  "unconfirmed", "speculat", "sources close to", "buy now", "limited time offer",
];

// Baseline trust score per known source (0-20). Unknown sources fall back
// to DEFAULT_CREDIBILITY.
const SOURCE_CREDIBILITY = {
  "MIT Technology Review": 20,
  "TechCrunch": 15,
  "VentureBeat": 14,
  "Hacker News": 16,
};
const DEFAULT_CREDIBILITY = 8;

module.exports = {
  POSITIVE_TECHNICAL,
  POSITIVE_ENGINEERING,
  NOVELTY_SIGNALS,
  EVIDENCE_SIGNALS,
  NEGATIVE_SIGNALS,
  SOURCE_CREDIBILITY,
  DEFAULT_CREDIBILITY,
};