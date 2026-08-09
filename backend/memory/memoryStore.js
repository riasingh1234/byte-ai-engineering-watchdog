const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "memory.json");

function readMemory() {
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      return [];
    }

    const data = fs.readFileSync(MEMORY_FILE, "utf-8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("[memory] Failed to read memory:", error.message);
    return [];
  }
}

function writeMemory(memory) {
  fs.writeFileSync(
    MEMORY_FILE,
    JSON.stringify(memory, null, 2),
    "utf-8"
  );
}

function rememberTopic(topic) {
  const memory = readMemory();

  const alreadyExists = memory.some(
    (item) => item.topicId === topic.id
  );

  if (alreadyExists) {
    return false;
  }

  memory.push({
    topicId: topic.id,
    title: topic.title,
    source: topic.source,
    url: topic.url,
    rememberedAt: new Date().toISOString(),
  });

  writeMemory(memory);

  return true;
}

function hasRememberedTopic(topic) {
  const memory = readMemory();

  return memory.some(
    (item) =>
      item.topicId === topic.id ||
      item.url === topic.url
  );
}

function getMemory() {
  return readMemory();
}

function clearMemory() {
  writeMemory([]);
}

module.exports = {
  rememberTopic,
  hasRememberedTopic,
  getMemory,
  clearMemory,
};