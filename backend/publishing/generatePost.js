// backend/publishing/generatePost.js

function generatePost(topic, persona) {
  const name = persona?.name || "BYTE";
  const domain = persona?.domain || "AI Engineering";

  const text =
    `${topic.title}\n\n` +
    `${name}'s take: This matters for ${domain} because ` +
    `${topic.summary || "it represents a technical development worth tracking."} ` +
    `The engineering signal matters more than the surrounding hype. ` +
    `Worth watching for what changes in real systems, tooling, or developer workflows.`;

  const rationale =
    `Selected because this topic was accepted by BYTE's editorial evaluation ` +
    `with a score of ${topic.score}/100 and has not been previously published.`;

  const sources = topic.url ? [topic.url] : [];

  return {
    text,
    rationale,
    sources,
  };
}

module.exports = { generatePost };