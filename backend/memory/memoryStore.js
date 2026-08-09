const BREETH_API_URL = "https://api.thebreeth.com/v1";

async function breethRequest(endpoint, body) {
  if (!process.env.BREETH_API_KEY) {
    throw new Error("BREETH_API_KEY is not configured");
  }

  const response = await fetch(`${BREETH_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Breeth API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function searchMemory(query, limit = 5) {
  return breethRequest("/search", {
    query,
    limit,
  });
}

async function hasRememberedTopic(topic) {
  try {
    const result = await searchMemory(
      `BYTE topic: ${topic.title}`,
      5
    );

    return Array.isArray(result?.results) && result.results.length > 0;
  } catch (error) {
    console.error("[Breeth] Memory search failed:", error.message);
    return false;
  }
}

async function rememberTopic(topic) {
  return breethRequest("/episodes", {
    messages: [
      {
        role: "assistant",
        content: JSON.stringify({
          type: "BYTE_TOPIC_MEMORY",
          title: topic.title,
          summary: topic.summary,
          source: topic.source,
          url: topic.url,
          decision: topic.decision,
          score: topic.score,
          reason: topic.reason,
          rememberedAt: new Date().toISOString(),
        }),
      },
    ],
  });
}

module.exports = {
  hasRememberedTopic,
  rememberTopic,
  searchMemory,
};