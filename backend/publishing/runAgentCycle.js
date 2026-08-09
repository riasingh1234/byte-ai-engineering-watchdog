const crypto = require("crypto");

const { discoverTopics } = require("../discovery/discoverTopics");
const { evaluateTopics } = require("../evaluation/evaluateTopic");
const { hasRememberedTopic, rememberTopic } = require("../memory/memoryStore");
const { selectTopicForPublishing } = require("./selectTopic");
const { generatePost } = require("./generatePost");

async function runAgentCycle(state) {
  const { items } = await discoverTopics();

  const evaluatedItems = evaluateTopics(items);

  const memoryAwareItems = evaluatedItems.map((topic) => ({
    ...topic,
    previouslySeen: hasRememberedTopic(topic),
  }));

  const selectedTopic = selectTopicForPublishing(memoryAwareItems);

  if (!selectedTopic) {
    return null;
  }

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

  state.publishedPosts.push(post);

  await rememberTopic(selectedTopic);

  state.autonomous.lastRunAt = new Date().toISOString();

  return post;
}

module.exports = { runAgentCycle };