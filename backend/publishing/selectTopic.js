// backend/publishing/selectTopic.js

function selectTopicForPublishing(items) {
  return items.find(
    (topic) =>
      topic.decision === "accepted" &&
      topic.previouslySeen !== true
  );
}

module.exports = { selectTopicForPublishing };