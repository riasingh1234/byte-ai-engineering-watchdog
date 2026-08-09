// backend/discovery/discoverTopics.js
//
// Checkpoint 3: Real Topic Discovery.
// Pulls current AI/engineering news from public RSS feeds — no API keys,
// no scraping, no third-party service. Each feed is fetched independently
// so one dead/slow feed never takes down the whole endpoint.

const Parser = require("rss-parser");
const crypto = require("crypto");

const parser = new Parser({
  timeout: 8000, // ms — don't let one slow feed hang the request
  headers: {
    "User-Agent": "BYTE-Watchdog/1.0 (hackathon project)",
  },
});

// Public RSS feeds. All are freely accessible, no auth required.
const FEEDS = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch",
    tag: "Industry",
  },
  {
    url: "https://venturebeat.com/category/ai/feed/",
    source: "VentureBeat",
    tag: "Industry",
  },
  {
    url: "https://www.technologyreview.com/feed/",
    source: "MIT Technology Review",
    tag: "Research",
  },
  {
    url: "https://hnrss.org/newest?q=AI+OR+LLM+OR+%22machine+learning%22",
    source: "Hacker News",
    tag: "Community",
  },
];

// Stable id derived from the article URL (falls back to title).
// Same article fetched twice always gets the same id.
function makeId(link, title) {
  return crypto
    .createHash("sha1")
    .update(link || title || "")
    .digest("hex")
    .slice(0, 12);
}

// Strip HTML tags and collapse whitespace from RSS descriptions,
// then cap length so the feed stays skimmable.
function cleanSummary(raw) {
  if (!raw) return "";
  const text = raw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > 280 ? text.slice(0, 277) + "..." : text;
}

// Fetch + parse a single feed. Never throws — returns either an array of
// items or an { error } marker, so Promise.all can't be short-circuited
// by one bad feed.
async function fetchFeed(feed) {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items || []).map((item) => ({
      id: makeId(item.link, item.title),
      title: item.title || "Untitled",
      summary: cleanSummary(item.contentSnippet || item.summary || item.content),
      source: feed.source,
      url: item.link || "",
      publishedAt: item.isoDate || item.pubDate || null,
      tag: feed.tag,
    }));
  } catch (err) {
    console.error(`[discovery] ${feed.source} failed: ${err.message}`);
    return { error: true, source: feed.source, message: err.message };
  }
}

// Fetch all feeds, merge, dedupe, sort newest-first, cap to `limit`.
async function discoverTopics({ limit = 20 } = {}) {
  const results = await Promise.all(FEEDS.map(fetchFeed));

  const items = [];
  const warnings = [];

  for (const result of results) {
    if (Array.isArray(result)) {
      items.push(...result);
    } else {
      warnings.push(`${result.source}: ${result.message}`);
    }
  }

  const seen = new Set();
  const deduped = items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  deduped.sort(
    (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  );

  return {
    items: deduped.slice(0, limit),
    warnings, // list of feeds that failed, if any — empty array when all succeed
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = { discoverTopics };