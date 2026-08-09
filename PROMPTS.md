# BYTE — AI Development Prompts

## 1. Initial Project Architecture

### Prompt
Design an architecture for BYTE, an autonomous AI engineering watchdog
for a hackathon. The system should discover current AI and technology
topics, apply editorial filtering, maintain a consistent AI persona,
use persistent memory through Breeth, generate content, and expose
the required backend API endpoints. The architecture should support
a React frontend and Node.js/Express backend.

### Purpose
Establish the initial system architecture and technology boundaries.

### AI Tool
ChatGPT

### Outcome
The project was planned as a React frontend with a Node.js/Express
backend, an autonomous agent layer, topic discovery, editorial
decision-making, content generation, and Breeth-based persistent
memory.

## 2. Initial Frontend Dashboard

### Prompt
Build a modern, polished React dashboard UI for a project called BYTE
(AI Engineering Watchdog).

BYTE is an autonomous AI agent that discovers AI/technology news,
evaluates topics using an editorial decision system, generates
engineering-focused content, and maintains persistent memory.

Create ONLY the frontend UI. Do not create a backend, database,
authentication, API calls, or fake functionality.

The dashboard should include:

1. A professional BYTE header with:
   - BYTE logo/name
   - "AI Engineering Watchdog"
   - Agent status indicator

2. Overview/stat cards:
   - Topics Discovered
   - Topics Accepted
   - Topics Rejected
   - Memories Stored

3. An "Agent Activity" section showing the stages:
   Discover → Retrieve Memory → Evaluate → Generate → Remember

4. A "Latest Intelligence" feed with cards containing:
   - Topic title
   - Short summary
   - Editorial decision
   - Reason
   - Timestamp

5. A sidebar/navigation with:
   - Dashboard
   - Intelligence
   - Memory
   - Decisions
   - Settings

6. A clean dark developer/AI aesthetic.
7. Responsive design.
8. Use React components and clean CSS.
9. Keep the code modular and easy to connect to our Express API later.
10. Do not hard-code the backend URL.
11. Do not add API keys or secrets.

The existing project uses React + Vite.
### Purpose
Generate the initial polished frontend dashboard for BYTE.

### AI Tool
Claude

### Outcome
Generated the initial React dashboard structure and UI. The UI will
later be connected to the BYTE backend APIs.

## 3. Backend API Foundation

### Prompt

Extend the existing BYTE AI Engineering Watchdog Node.js/Express backend
to provide the API foundation required by the React frontend.

Create a new file:

backend/data/mockData.js

Keep static placeholder data separate from routing logic.

The mock data should expose:
- stats
- pipelineStatus
- intelligence
- decisions
- memory

Add the following backend endpoints:

GET /api/status
GET /api/stats
GET /api/pipeline/status
GET /api/intelligence
GET /api/decisions
GET /api/memory

The endpoints should return static JSON only.

Do not add:
- AI model calls
- database connections
- real topic discovery
- authentication
- API keys
- external network calls

Keep the existing Express, CORS, dotenv, and nodemon setup intact.

The backend should continue running on port 5000.

Keep the implementation modular so the mock data can later be replaced
with real discovery, evaluation, generation, and persistent memory systems.

### Purpose

Create a stable API contract between the BYTE React frontend and
future backend intelligence systems.

### AI Tool

Claude

### Outcome

Added the backend API foundation with mock data and endpoints for
pipeline status, intelligence, decisions, and memory. No real AI,
database, or discovery logic has been added yet.

## 4. Real Topic Discovery

### Prompt

We are building BYTE, an AI Engineering Watchdog for a hackathon.

The existing project is a React + Vite frontend and Node.js + Express backend.

Implement Checkpoint 3: Real Topic Discovery.

BYTE should fetch current AI/technology topics from a real public source and expose them through:

GET /api/intelligence

Use a reliable public source that does not require an API key if possible. Prefer RSS feeds or another simple public HTTP source rather than introducing a complicated third-party service.

Create a separate discovery module instead of putting discovery logic directly inside server.js.

Each discovered topic should have a stable structure containing:

* id
* title
* summary
* source
* url
* publishedAt
* tag

Keep the existing backend endpoints working.

Do not implement:

* AI/LLM evaluation
* content generation
* database persistence
* memory
* authentication
* API keys or secrets

Handle external-source failures gracefully so the server does not crash.

Do not modify the frontend during this checkpoint.

Avoid unnecessary dependencies.

### Purpose

Replace the empty intelligence API foundation with real current AI/technology topic discovery while keeping the architecture modular for the later evaluation, generation, and memory stages.

### AI Tool

Claude

### Outcome

Implemented the first real BYTE agent capability: discovering current AI/technology topics from a public source and exposing normalized topics through the backend intelligence API.

## 5. Editorial Evaluation

### Prompt

We are now implementing CHECKPOINT 4 of BYTE — AI Engineering Watchdog.

Checkpoint 3 is complete and verified.

Current architecture:

* React + Vite frontend
* Node.js + Express backend
* `backend/discovery/discoverTopics.js` fetches real RSS topics
* `GET /api/intelligence` returns discovered topics containing:

  * `id`
  * `title`
  * `summary`
  * `source`
  * `url`
  * `publishedAt`
  * `tag`

Now implement ONLY CHECKPOINT 4: Editorial Evaluation.

Goal:

Take the discovered topics from `discoverTopics()` and evaluate them using a deterministic editorial scoring system first. Do NOT add an LLM/API key yet.

BYTE should score each topic using:

1. Technical relevance
2. Engineering impact
3. Source credibility
4. Novelty
5. Reproducibility / evidence

Each discovered topic should receive:

* `score`
* `decision`: `"accepted"` or `"rejected"`
* `reason`
* `evaluation breakdown`

Use sensible keyword/source-based heuristics so the system is actually functional without an AI API.

The evaluation should reject obvious low-signal content such as:

* rumors
* promotional spam
* unrelated products
* low-quality speculation
* non-engineering entertainment content

It should prefer:

* AI research
* LLMs
* model releases
* inference
* agents
* AI infrastructure
* benchmarks
* developer tools
* ML engineering
* technical papers
* reproducible engineering work

Update `GET /api/intelligence` so it:

1. discovers topics
2. evaluates every topic
3. returns the evaluated topics

Also update the stats so accepted/rejected counts reflect the current evaluation result.

Keep the implementation modular.

Do NOT implement:

* persistent memory
* Breeth
* content generation
* frontend redesign
* authentication
* database
* LLM API calls

Do not break the existing endpoints.

After implementation, provide:

1. files created/modified
2. complete code for each changed file
3. npm commands required
4. curl commands to test
5. explanation of how discovery → evaluation works

Do not modify unrelated files.

### Purpose

Add BYTE's first real editorial decision-making layer so discovered topics can be intelligently filtered into accepted and rejected engineering intelligence.

### AI Tool

Claude

### Outcome

Implemented BYTE's deterministic editorial evaluation layer. Discovered topics are now scored across technical relevance, engineering impact, source credibility, novelty, and reproducibility. Each topic receives an acceptance/rejection decision, explanation, and evaluation breakdown. The `/api/intelligence` endpoint now performs discovery → evaluation, and `/api/stats` reflects the latest accepted/rejected results.

## 6. Agent Initialization and Persona

### Prompt

We are building BYTE — an Autonomous AI Creator for a hackathon.

The hackathon evaluator will initialize the agent exactly once and then interact only with the feed endpoint.

Current implementation:

* React + Vite frontend
* Node.js + Express backend
* `backend/discovery/discoverTopics.js` discovers real AI/technology topics
* `backend/evaluation/evaluateTopic.js` evaluates discovered topics
* `backend/state/statsStore.js` maintains runtime evaluation statistics
* `GET /api/intelligence` currently performs discovery → evaluation
* Checkpoints 3 and 4 are complete and committed

Now implement ONLY the next checkpoint: **Agent Initialization and Persona**.

### Required API

Add:

```text
POST /api/agent/init
```

Request:

```json
{
  "persona": {
    "name": "Ada",
    "domain": "AI Security"
  }
}
```

Response:

```json
{
  "agentId": "abc-123"
}
```

The `agentId` must be generated by the backend and must identify the initialized agent during the current runtime.

### Persona Requirements

When the agent is initialized, store its persona configuration in the backend runtime state.

The persona should contain at minimum:

* name
* domain

BYTE should also have a stable internal editorial identity so future content generation can maintain a consistent voice.

For example, the internal persona configuration may define:

* technical and engineering focus
* preference for evidence-backed developments
* interest in AI systems, infrastructure, agents, models, developer tools, and research
* concise engineering-focused communication
* avoidance of hype and unsupported claims

Do not hard-code the example name "Ada" as the only possible persona. The initialization request should determine the persona.

### Agent State

Create a separate agent state module rather than putting agent state directly inside `server.js`.

The state should be structured so future checkpoints can add:

* persona
* agentId
* initialization time
* memory
* published posts
* autonomous publishing state

Do NOT implement persistent database storage yet unless it is already required by the existing project architecture.

Runtime state is acceptable for this checkpoint.

### Important Constraints

Do NOT implement yet:

* LLM content generation
* Breeth integration
* autonomous scheduling
* publishing
* social media APIs
* database persistence
* frontend changes
* authentication

Do not modify the existing discovery or evaluation algorithms unless necessary for clean integration.

Keep all existing endpoints working.

The implementation must prepare the architecture for the next checkpoints:

```text
Initialize
    ↓
Persona
    ↓
Discover
    ↓
Evaluate
    ↓
Generate
    ↓
Remember
    ↓
Publish
```

After implementation, provide:

1. Files created/modified
2. Complete code for changed files
3. Minimal test commands
4. Explanation of the initialization flow
5. How the state will support future autonomous publishing

### Purpose

Create the agent initialization foundation required by the hackathon evaluator and establish BYTE's persistent-in-runtime persona identity before implementing generation, memory, and autonomous publishing.

### AI Tool

Claude

### Outcome

Pending — implementation in progress.
