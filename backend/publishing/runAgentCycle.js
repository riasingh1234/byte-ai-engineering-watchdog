// backend/publishing/runAgentCycle.js

const crypto = require("crypto");

const { discoverTopics } = require("../discovery/discoverTopics");
const { evaluateTopics } = require("../evaluation/evaluateTopic");

const {
  hasRememberedTopic,
  rememberTopic,
} = require("../memory/memoryStore");

const { generatePost } = require("./generatePost");

// Prevent duplicate publishing during the current server session.
const publishedTopicIds = new Set();

async function runAgentCycle(state) {
  const { items } = await discoverTopics();

  const evaluatedItems = evaluateTopics(items);

  const memoryAwareItems = [];

  for (const topic of evaluatedItems) {
    const previouslySeen = await hasRememberedTopic(topic);

    memoryAwareItems.push({
      ...topic,
      previouslySeen,
    });
  }

  const eligibleItems = memoryAwareItems.filter(
    (topic) =>
      topic.decision === "accepted" &&
      topic.previouslySeen !== true &&
      !publishedTopicIds.has(topic.id)
  );

  const selectedTopic = eligibleItems[0];

  if (!selectedTopic) {
    console.log("[BYTE] No suitable new topic found.");
    return null;
  }

  console.log(
    `[BYTE] Selected topic: ${selectedTopic.title}`
  );

  const generated = generatePost(
    selectedTopic,
    state.persona
  );

  const post = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    text: generated.text,
    rationale: generated.rationale,
    sources: generated.sources,
  };

  // Mark this topic as published.
  publishedTopicIds.add(selectedTopic.id);

  state.publishedPosts.push(post);

  await rememberTopic(selectedTopic);

  state.autonomous.lastRunAt =
    new Date().toISOString();

  console.log(
    `[BYTE] Published: ${selectedTopic.title}`
  );

  return post;
}

module.exports = { runAgentCycle };