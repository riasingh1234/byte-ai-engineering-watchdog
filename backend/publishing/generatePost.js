// backend/publishing/generatePost.js

function generatePost(topic, persona) {
  const name = persona?.name || "BYTE";
  const domain = persona?.domain || "AI Engineering";

  const text =
    `${topic.title}\n\n` +
    `BYTE's take: This matters for ${domain} because ` +
    `${topic.summary || "it represents a technical development worth tracking."} ` +
    `The engineering signal matters more than the surrounding hype. ` +
    `Worth watching for what changes in real systems, tooling, or developer workflows.`;

  return text;
}

module.exports = { generatePost };