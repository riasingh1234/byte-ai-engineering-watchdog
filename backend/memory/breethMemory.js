const BREETH_API_URL = "https://api.thebreeth.com/v1";

async function searchBreethMemory(query, limit = 5) {
  if (!process.env.BREETH_API_KEY) {
    throw new Error("BREETH_API_KEY is not configured.");
  }

  const response = await fetch(`${BREETH_API_URL}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Breeth search failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

async function rememberInBreeth(messages) {
  if (!process.env.BREETH_API_KEY) {
    throw new Error("BREETH_API_KEY is not configured.");
  }

  const response = await fetch(`${BREETH_API_URL}/episodes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.BREETH_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Breeth memory write failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

module.exports = {
  searchBreethMemory,
  rememberInBreeth,
};