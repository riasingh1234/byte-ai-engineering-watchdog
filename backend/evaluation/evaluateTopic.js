// backend/evaluation/evaluateTopic.js
//
// Checkpoint 4: deterministic editorial evaluation.
// No LLM, no external API — pure keyword/source heuristics over the
// discovered topic's title/summary/source/url/publishedAt.
//
// Scoring (0-100 total):
//   technicalRelevance   0-25
//   engineeringImpact    0-20
//   sourceCredibility    0-20
//   novelty              0-15
//   reproducibility      0-20
// Any negative-signal keyword match forces an automatic rejection.

const {
  POSITIVE_TECHNICAL,
  POSITIVE_ENGINEERING,
  NOVELTY_SIGNALS,
  EVIDENCE_SIGNALS,
  NEGATIVE_SIGNALS,
  SOURCE_CREDIBILITY,
  DEFAULT_CREDIBILITY,
} = require("./keywords");

const ACCEPT_THRESHOLD = 55;

function countMatches(text, terms) {
  return terms.filter((term) => text.includes(term));
}

function scoreTechnicalRelevance(text) {
  const matches = countMatches(text, POSITIVE_TECHNICAL);
  return { score: Math.min(25, matches.length * 5), matches };
}

function scoreEngineeringImpact(text) {
  const matches = countMatches(text, POSITIVE_ENGINEERING);
  return { score: Math.min(20, matches.length * 4), matches };
}

function scoreSourceCredibility(source) {
  const score = SOURCE_CREDIBILITY[source] ?? DEFAULT_CREDIBILITY;
  return { score, matched: source };
}

function scoreNovelty(text, publishedAt) {
  const matches = countMatches(text, NOVELTY_SIGNALS);
  let score = Math.min(9, matches.length * 3);

  if (publishedAt) {
    const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 36e5;
    if (ageHours <= 48) score += 6;
    else if (ageHours <= 24 * 7) score += 3;
  }

  return { score: Math.min(15, score), matches };
}

function scoreReproducibility(text, url) {
  const matches = countMatches(text, EVIDENCE_SIGNALS);
  let score = Math.min(14, matches.length * 4);

  if (url && (url.includes("arxiv.org") || url.includes("github.com"))) {
    score += 6;
  }

  return { score: Math.min(20, score), matches };
}

function scoreNegativeSignals(text) {
  return countMatches(text, NEGATIVE_SIGNALS);
}

function buildReason({ decision, negativeMatches, score, breakdown, source }) {
  if (negativeMatches.length > 0) {
    return `Rejected: low-signal content detected (matched "${negativeMatches[0]}").`;
  }

  if (decision === "accepted") {
    const strongest = Object.entries(breakdown)
      .sort((a, b) => b[1].score - a[1].score)[0][0];
    return `Accepted: strong ${strongest.replace(/([A-Z])/g, " $1").toLowerCase()} from ${source} (score: ${score}/100).`;
  }

  return `Rejected: insufficient technical/engineering signal for an engineering-focused brief (score: ${score}/100).`;
}

function evaluateTopic(topic) {
  const title = (topic.title || "").toLowerCase();
  const summary = (topic.summary || "").toLowerCase();
  const text = `${title} ${summary}`;

  const negativeMatches = scoreNegativeSignals(text);

  const technicalRelevance = scoreTechnicalRelevance(text);
  const engineeringImpact = scoreEngineeringImpact(text);
  const sourceCredibility = scoreSourceCredibility(topic.source);
  const novelty = scoreNovelty(text, topic.publishedAt);
  const reproducibility = scoreReproducibility(text, topic.url);

  const breakdown = {
    technicalRelevance,
    engineeringImpact,
    sourceCredibility,
    novelty,
    reproducibility,
  };

  let score =
    technicalRelevance.score +
    engineeringImpact.score +
    sourceCredibility.score +
    novelty.score +
    reproducibility.score;

  // Negative signals override everything else.
  if (negativeMatches.length > 0) {
    score = Math.max(0, score - 60);
  }

  const decision =
    negativeMatches.length === 0 && score >= ACCEPT_THRESHOLD
      ? "accepted"
      : "rejected";

  const reason = buildReason({
    decision,
    negativeMatches,
    score,
    breakdown,
    source: topic.source,
  });

  return {
    ...topic,
    score,
    decision,
    reason,
    evaluation: {
      technicalRelevance: technicalRelevance.score,
      engineeringImpact: engineeringImpact.score,
      sourceCredibility: sourceCredibility.score,
      novelty: novelty.score,
      reproducibility: reproducibility.score,
      matchedNegativeSignals: negativeMatches,
    },
  };
}

function evaluateTopics(topics) {
  return topics.map(evaluateTopic);
}

module.exports = { evaluateTopic, evaluateTopics };