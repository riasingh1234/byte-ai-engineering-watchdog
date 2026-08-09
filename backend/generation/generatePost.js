// backend/generation/generatePost.js

function generatePost(topic, persona) {
  const name = persona?.name || "BYTE";
  const domain = persona?.domain || "AI Engineering";

  const text =
    `${topic.title}\n\n` +
    `${topic.summary}\n\n` +
    `Why it matters: This is relevant to ${domain} because it has a direct ` +
    `engineering or technical implication worth tracking.\n\n` +
    `BYTE's take: Focus on the implementation, evidence, and practical impact ` +
    `rather than the surrounding hype.`;

  const rationale =
    `Selected because the topic scored ${topic.score}/100 in BYTE's editorial ` +
    `evaluation and showed sufficient technical relevance for an engineering-focused ` +
    `audience. It is relevant now because it is a current development discovered ` +
    `from a live information source. BYTE prioritizes evidence-backed AI and ` +
    `technology developments over speculation or promotional content.`;

  return {
    text,
    rationale,
    sources: topic.url ? [topic.url] : [],
    generatedBy: name,
  };
}

module.exports = { generatePost };